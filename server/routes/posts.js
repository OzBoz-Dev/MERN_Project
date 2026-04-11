const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const Tag = require("../models/Tag");

//reads all the posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();

    if (!posts) {
      res.status(404).json({ message: "No posts available" });
    } else {
      res.json(posts);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//reads by username
router.get("/username", async (req, res) => {
  try {
    const posts = await Post.find({ post_id });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// like a post by id
router.post("/likes/:_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params._id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const username = req.user.username;

    if (post.likes.includes(username)) {
      post.likes = post.likes.filter((u) => u !== username);
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
router.get("/likes/:_id", async (req, res) => {
  try {
    const post = await Post.findById(req.params._id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json({ likesCount: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//reads by title of the post
router.get("/title", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//reads by title and body of the post
router.get("/title/body", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//reads by body of the post
router.get("/body", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//create a post
router.post("/", auth, async (req, res) => {
  try {
    //const post = await Post.create(req.body);
    const { array_tags_id, ...rest } = req.body;

    let tags = [];

    //checks if user added tags and finds them by name in the database
    if (array_tags_id && array_tags_id.length > 0) {
      //finds tags that already exist
      const existingTags = await Tag.find({ value: { $in: array_tags_id } });
      const existingValues = existingTags.map((tag) => tag.value);

      //checks if what the user typed does not exist
      const newTagValues = array_tags_id.filter(
        (value) => !existingValues.includes(value),
      );

      //if it's a new tag it gets added to the array and it gets created
      const newTags = [];
      for (const value of newTagValues) {
        const tag = await Tag.create({ value });
        newTags.push(tag);
      }

      //Returns the objectId
      tags = [...existingTags, ...newTags].map((tag) => tag._id); //adds the object id
      //tags = [...existingTags, ...newTags].map((tag) => tag.value);
    }

    const post = await Post.create({
      ...rest,
      username: req.user.username,
      array_tags_id: tags,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const allowedUpdates = ["title", "content", "likes"];

    allowedUpdates.forEach((field) => {
      if (req.body[field] != undefined) {
        post[field] = req.body[field];
      }
    });

    if (req.body.array_tags_id) {
      const tags = await Tag.find({ name: { $in: req.body.array_tags_id } });
      post.array_tags_id = tags.map((tag) => tag.value);
    }

    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

module.exports = router;
