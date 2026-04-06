const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')

// view all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// create a comment 
router.post('/', async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// view a comment by id
router.get('/:_id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params._id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// view comments by author id
router.get('/:author_id', async (req, res) => {
  try {
    const comments = await Comment.find({ author_id: req.params.author_id });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// edit a comment by id
router.put('/:_id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params._id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.author_id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const allowedUpdates = ['body'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        comment[field] = req.body[field];
      }
    });

    await comment.save();

    res.json(comment);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// delete a comment by id
router.delete('/:_id', auth, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params._id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// like a comment by id
router.post('/like/:_id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params._id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const userId = req.user.id;
    
    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter(id => id.toString() !== userId);
    } else {
      // add like
      comment.likes.push(userId);
    }

    await comment.save();
    res.json(comment);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
