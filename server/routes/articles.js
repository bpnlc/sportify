const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const jwt = require("jsonwebtoken"); // ✅ Must be at the top!

function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// POST /api/articles - create new article
router.post("/", authMiddleware, async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    const saved = await newArticle.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/articles - get all articles with optional category filter
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const category = req.query.category;
  const skip = (page - 1) * limit;

  const filter = category ? { category } : {};

  try {
    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Article.countDocuments(filter);
    res.json({
      articles,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching paginated articles:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/articles/:id - get single article
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    res.json(article);
  } catch (err) {
    res.status(404).json({ error: "Article not found" });
  }
});
// GET /api/articles/trending
router.get("/trending/top5", async (req, res) => {
  try {
    const trending = await Article.find().sort({ views: -1 }).limit(5);
    res.json(trending);
  } catch (err) {
    res.status(500).json({ error: "Error loading trending" });
  }
});

module.exports = router;
