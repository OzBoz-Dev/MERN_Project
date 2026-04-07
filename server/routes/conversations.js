const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// to get all conversations
router.get('/', async (req, res) => {
    try {
        const conversations = await Conversation.find().populate('member_users').populate('messages');
        res.json(conversations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get conversations by id
router.get('/:_id', async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params._id).populate('member_users').populate('messages');

        if (!conversation) return res.status(404).json({ error: 'Not found' });

        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// create conversation with empty message - you can add messages later with the /:_id/messages route
router.post('/', async (req, res) => {
    try {
        const conversation = await Conversation.create(req.body);
        res.status(201).json(conversation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// create messages in a conversation
router.post('/:_id/messages', async (req, res) => {
    try {
        const message = await Message.create(req.body);

        const conversation = await Conversation.findByIdAndUpdate(
            req.params._id,
            { $push: { messages: message._id } },
            { new: true }
        ).populate('member_users').populate('messages');

        if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

      res.status(200).json(message);
    } catch (err) {
    res.status(500).json({ error: err.message });
    }
});

// edit a conversation (you can add and remove member_users)
router.put("/:_id", async (req, res) => {
  try {
    const updatedConversation = await Conversation.findByIdAndUpdate(
      req.params._id,
      req.body,
      { new: true }
    );

    if (!updatedConversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    res.status(200).json(updatedConversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// delete a conversation
router.delete("/:_id", async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndDelete(req.params._id);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.status(200).json({ message: "Conversation deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
