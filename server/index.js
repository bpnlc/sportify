const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const articleRoutes = require("./routes/articles");
app.use("/api/articles", articleRoutes);
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
const analyticsRoutes = require("./routes/analytics");
app.use("/api/analytics", analyticsRoutes);

// DB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Test route
app.get("/", (req, res) => res.send("API Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
