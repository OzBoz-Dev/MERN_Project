const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth')

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
router.post('/', auth, async (req, res) => {
  try {
    const comment = new Comment({
            ...req.body,
            author_username: req.user.username
          });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get number of likes for a comment
router.get('/likes/:_id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params._id);
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    res.json({ likesCount: comment.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// view comments by author username
router.get('/author/:username', async (req, res) => {
    try {
        const comments = await Comment.find({ author_username: req.params.username });
        res.json(comments);
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

// edit a comment by id
router.put('/:_id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params._id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.author_username !== req.user.username) {
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
        const comment = await Comment.findById(req.params._id);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        if (comment.author_username !== req.user.username) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await comment.deleteOne();
        res.json({ message: 'Comment deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// like a comment by id
router.post('/likes/:_id', auth, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params._id);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        const username = req.user.username;

        if (comment.likes.includes(username)) {
            comment.likes = comment.likes.filter(u => u !== username);
        } else {
            comment.likes.push(username);
        }

        await comment.save();
        res.json(comment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
