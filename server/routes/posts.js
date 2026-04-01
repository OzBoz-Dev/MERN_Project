const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/Post");

router.get("/", async(req, res));
{
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//unsure if necessary
router.get("/post_id", async(req, res));
{
  try {
    const posts = await Post.find({ post_id });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

router.get("/title", async(req, res));
{
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

router.get("/body", async(req, res));
{
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
