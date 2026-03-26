const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('../models/Comment');

router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/author_id', async (req, res) => {
  try {
    const { author_id } = req.query;
    const comments = await Comment.find({ author_id });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/post_id_belong', async (req, res) => {
  try {
    const { post_id_belong } = req.query;
    const comments = await Comment.find({ post_id_belong });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/likes', async (req, res) => {
  try {
    const { likes } = req.query;
    const comments = await Comment.find({ likes });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/body', async (req, res) => {
  try {
    const { body } = req.query;
    const comments = await Comment.find({ body });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:_id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params._id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
