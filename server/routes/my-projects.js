const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

// returns posts that the user has liked
router.get("/liked", auth, async (req, res) => {
  try {
    const liked = await Post.find({ likes: req.user.username }).sort({ createdAt: -1 }).lean();

    res.json(liked);

    } catch (err) {
    console.error("GET /liked error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;