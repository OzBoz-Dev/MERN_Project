const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/Post");
const auth = require('../middleware/auth')

//reads all the posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// like a post by id
router.post('/likes/:_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params._id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const username = req.user.username;

        if (post.likes.includes(username)) {
            post.likes = post.likes.filter(u => u !== username);
        } else {
            post.likes.push(username);
        }

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get likes count for a post
router.get('/likes/:_id', async (req, res) => {
    try {
        const post = await Post.findById(req.params._id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json({ likesCount: post.likes.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//reads by post id
router.get("/post_id", async (req, res) => {
  try {
    const posts = await Post.find({ post_id });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//reads by title of the post
router.get("/title", async (req, res) => {
  try {
    const query = (req.query.q || "").trim();
    if(!query) return res.json([]);

    const posts = await Post.find({
      title: { $regex: query, $options: "i" }
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//reads by body of the post
router.get("/body", async (req, res) => {
  try {
    const query = (req.query.q || "").trim();
    if(!query) return res.json([]);
    
    const posts = await Post.find({
      body: { $regex: query, $options: "i" }
    });    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//create a post
router.post("/", async (req, res) => {
  try {
    const post = await Post.create(req.body);

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
