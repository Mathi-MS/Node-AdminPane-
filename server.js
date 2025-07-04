// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const userRoutes = require("./routes/userRoutes");
// const User = require("./models/User"); // ✅ import User model
// const bcrypt = require("bcryptjs");    // ✅ import bcrypt for password hashing

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use("/api", userRoutes);

// const PORT = process.env.PORT || 5000;

// // ✅ Dummy user creation function
// const createDummyUsers = async () => {
//   const count = await User.countDocuments();
//   if (count === 0) {
//     const users = [];

//     for (let i = 1; i <= 10; i++) {
//       users.push({
//         name: `User ${i}`,
//         email: `user${i}@example.com`,
//         password: await bcrypt.hash("Password123!", 10),
//       });
//     }

//     await User.insertMany(users);
//     console.log("✅ Inserted 10 dummy users");
//   } else {
//     console.log("✅ Dummy users already exist");
//   }
// };

// connectDB().then(() => {
//   createDummyUsers().then(() => {
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   });
// });




// ------- Main 


const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const offerRoutes = require("./routes/offerRoutes");
const careersRoutes = require("./routes/careersRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", offerRoutes);
app.use("/api", careersRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
