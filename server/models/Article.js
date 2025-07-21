const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true }, // e.g., 'NBA', 'F1'
  author: { type: String, default: "Admin" },
  image: { type: String }, // URL to image
  tags: [String], // ['NBA', 'LeBron']
  createdAt: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
  viewLogs: [
    {
      date: { type: Date, default: Date.now },
      count: { type: Number, default: 1 },
    },
  ],
});

module.exports = mongoose.model("Article", ArticleSchema);
