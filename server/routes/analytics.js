const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// GET /api/analytics/views-by-day
router.get("/views-by-day", async (req, res) => {
  const range = parseInt(req.query.range) || 7;

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - range);

  try {
    const result = await Article.aggregate([
      { $unwind: "$viewLogs" },
      {
        $match: {
          "viewLogs.date": { $gte: fromDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$viewLogs.date" },
          },
          totalViews: { $sum: "$viewLogs.count" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Error generating view data" });
  }
});

router.get("/views-by-day", async (req, res) => {
  const range = parseInt(req.query.range) || 7;

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - range);

  try {
    const result = await Article.aggregate([
      { $unwind: "$viewLogs" },
      {
        $match: {
          "viewLogs.date": { $gte: fromDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$viewLogs.date" },
          },
          totalViews: { $sum: "$viewLogs.count" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Error generating view data" });
  }
});

// GET /api/analytics/views-by-category
router.get("/views-by-category", async (req, res) => {
  try {
    const result = await Article.aggregate([
      {
        $group: {
          _id: "$category",
          totalViews: { $sum: "$views" },
        },
      },
      { $sort: { totalViews: -1 } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to aggregate views by category" });
  }
});

// GET /api/analytics/articles-by-day?range=7
router.get("/articles-by-day", async (req, res) => {
  const range = parseInt(req.query.range) || 7;
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - range);

  try {
    const result = await Article.aggregate([
      { $match: { createdAt: { $gte: fromDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to aggregate articles by day" });
  }
});

module.exports = router;
