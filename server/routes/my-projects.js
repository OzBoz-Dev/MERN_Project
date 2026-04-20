const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

// returns posts that the user has liked
router.get("/liked", auth, async (req, res) => {
  const limit = parseInt(req.query.limit);
  const offset = parseInt(req.query.offset);

  try {
    const liked = await Post.find({ likes: req.user.username }).sort({ createdAt: -1 }).skip(offset || 0).limit(limit || 20).lean();

    res.json(liked);

    } catch (err) {
    console.error("GET /liked error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;