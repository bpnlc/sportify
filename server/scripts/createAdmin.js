const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("../models/User");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const hashedPassword = await bcrypt.hash("admin123", 10); // 🔑 set your own
    const newUser = new User({ username: "admin", password: hashedPassword });
    await newUser.save();
    console.log("Admin user created");
    process.exit();
  })
  .catch((err) => console.error(err));
