const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const Tag = require("../models/Tag");
const User = require("../models/User");

const { sendCommentNotif } = require("../utils/mailer");

//add a get by tag value

//reads by username (from most recent to less recent)
router.get("/:author_username", async (req, res) => {
  try {
    const { author_username } = req.params;
    const postsByUser = await Post.find({ author_username }).sort({
      createdAt: -1,
    });
    res.json(postsByUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
    const query = (req.query.q || "").trim();
    if (!query) return res.json([]);

    const posts = await Post.find({
      title: { $regex: query, $options: "i" },
    });
    res.json(posts);
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

//reads by body of the post
router.get("/body", async (req, res) => {
  try {
    const query = (req.query.q || "").trim();
    if (!query) return res.json([]);

    const posts = await Post.find({
      body: { $regex: query, $options: "i" },
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get by tag value
router.get("/tag/:value", async (req, res) => {
  try {
    const tagValues = req.params.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    // debug
    // console.log("tagValues:", tagValues);
    // console.log("tagValues type:", typeof tagValues);

    // find posts that have at least one of the tags in the array
    const posts = await Post.find();

    const sorted = posts
      .map((post) => ({
        post,
        matchCount: post.array_tags.filter((tag) => tagValues.includes(tag))
          .length, // counts how many tags match the query
      }))

      // sorts by number of matches first, and then by most recent
      .sort(
        (a, b) =>
          b.matchCount - a.matchCount ||
          new Date(b.post.createdAt) - new Date(a.post.createdAt),
      )
      .map(({ post }) => post);

    // if no posts are found with the given tags, return a 404
    if (!posts || posts.length == 0) {
      return res.status(404).json({ message: "No posts found under this tag" });
    }

    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//get for a user
router.get("/for-you/:username", async (req, res) => {
  try {
    console.log(req.params.username);
    const user = await User.findOne({ username: req.params.username });

    const tagValues = user ? user.tags : [];

    console.log(tagValues);

    // find posts that have at least one of the tags in the array
    const posts = await Post.find(); 

    const sorted = posts
    .map(post => ({
      post,
      matchCount: post.array_tags.filter(tag => tagValues.includes(tag)).length // counts how many tags match the query
      }))
  
    // sorts by number of matches first, and then by most recent
    .sort((a, b) =>
      b.matchCount - a.matchCount || new Date(b.post.createdAt) - new Date(a.post.createdAt)
    )
    .map(({ post }) => post);

    // if no posts are found with the given tags, return a 404
    if (!posts || posts.length == 0) {
      return res.status(404).json({ message: "No posts found under this tag" });
    }
    
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//create a post
router.post("/", auth, async (req, res) => {
  try {
    const { array_tags, ...rest } = req.body;

    let tags = [];

    //checks if user added tags and finds them by name in the database
    if (array_tags && array_tags.length > 0) {
      //finds tags that already exist
      const existingTags = await Tag.find({ value: { $in: array_tags } });
      const existingValues = existingTags.map((tag) => tag.value);

      //checks if what the user typed does not exist
      const newTagValues = array_tags.filter(
        (value) => !existingValues.includes(value),
      );

      //if it's a new tag it gets added to the array and it gets created
      const newTags = [];
      for (const value of newTagValues) {
        const tag = await Tag.create({ value });
        newTags.push(tag);
      }

      //Returns the value
      tags = [...existingTags, ...newTags].map((tag) => tag.value); //adds the object id
    }

    const post = await Post.create({
      ...rest,
      author_username: req.user.username,
      post_id: req.user._id,
      array_tags: tags,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//sends email to og poster whenever a comment is added
router.post("/:_id/comments", auth, async (req, res) => {
  try {
    //find by id
    const post = await Post.findById(req.params._id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    //extracts body
    const { body } = req.body;

    //Pushes comment to the database
    post.comments.push({ username: req.user.username, body });
    await post.save();

    //finds email of og poster
    const ogPoster = await User.findOne({ username: post.author_username });

    //if email is found, notification is sent
    if (poster?.email) {
      await sendCommentNotification({
        toEmail: poster.email,
        posterUsername: post.autor_username,
        commenterUsername: req.user.username,
        postTitle: post.title,
      });
    }

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

//updates a post
router.put("/:_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params._id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    /* will fix later
    if (!post.post_id || post.post_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "User not authorized to update post",
      });
    }*/

    const allowedUpdates = ["title", "body", "likes", "array_tags"];

    allowedUpdates.forEach((field) => {
      if (req.body[field] != undefined) {
        post[field] = req.body[field];
      }
    });

    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//delete post by id
router.delete("/:_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params._id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author_username !== req.user.username) {
      return res.status(403).json({
        message: "User not authorized to delete post",
      });
    }

    await Post.findByIdAndDelete(req.params._id);

    res.status(200).json({ message: "Post was successfully deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//reads post by id
router.get("/:_id", async (req, res) => {
  try {
    const posts = await Post.findById(req.params._id);

    if (!posts) {
      res.status(404).json({ message: "No posts available" });
    } else {
      res.json(posts);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
