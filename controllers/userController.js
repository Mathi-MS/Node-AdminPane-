const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendOtpEmail = require("../utils/sendOtpMail");
const sendPasswordMail = require("../utils/sendPasswordMail");

const otpStore = new Map(); 

exports.register = async (req, res) => {
  const { name, email, mobile } = req.body;

  if (!name || !email || !mobile) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  if (name.length < 3) {
    return res.status(400).json({ message: "Name must be at least 3 characters long" });
  }

  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return res.status(400).json({ message: "Invalid Email Address" });
  }

  if (!/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ message: "Mobile number must be exactly 10 digits" });
  }

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + 60 * 1000; // 1 minute expiry

    otpStore.set(email, { name, email, mobile, otp, expiresAt });

    console.log("Generated OTP:", otp);
    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ---- 
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore.get(email);

  if (!record) return res.status(400).json({ message: "OTP not found" });
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ message: "OTP expired" });
  }
  if (parseInt(otp) !== record.otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const randomPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(randomPassword, 10);

  const user = await User.create({
    name: record.name,
    email: record.email,
    mobile: record.mobile,
    password: hashedPassword,
    status: "Active",
  });
  await sendPasswordMail(email, record.name, randomPassword);
  otpStore.delete(email);
  res.status(201).json({ message: "User registered and password sent to email" });
};
// ---- 

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ email: user.email, name: user.name,id:user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
      
    });
    res.json({ token:token, user:{name:user.name,email:user.email,role:"user"} });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
