const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/Post");
const auth = require("../middleware/auth");

// returns posts that the user has liked
router.get("/liked/:username", auth, async (req, res) => {
  try {
    const { username } = req.params;

    if (username !== req.user.username) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const liked = await Post.find({ likes: username }).sort({ createdAt: -1 }).lean();

    res.json(liked);

    } catch (err) {
    console.error("GET /liked/:username error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;