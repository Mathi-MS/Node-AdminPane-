const express = require("express");
const router = express.Router();
const { register, login,verifyOtp, changePassword } = require("../controllers/userController");
const auth = require("../middleware/auth");
const User = require("../models/User");

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOtp);
router.post("/user/change-password", changePassword);

// Protected routes
router.get("/users", auth, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get("/user/:id", auth, async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

router.put("/user/:id", auth, async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/user/:id", auth, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "User deleted" });
});

module.exports = router;
