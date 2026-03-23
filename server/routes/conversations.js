const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');


router.get('/', async (req, res) => {
    try {
        const conversations = await Conversation.find();
        res.json(conversations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/:_id', async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params._id);
        if (!conversation) return res.status(404).json({ error: 'Not found' });
        res.json(conversation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/member_users', async (req, res) => {
    try {
        const conversations = await Conversation.find().populate('member_users');
        res.json(conversations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/messages', async (req, res) => {
    try {
        const conversations = await Conversation.find().populate('messages');
        res.json(conversations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// cannot post a message until messages endpoint is done
router.post('/:_id/messages', async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params._id);
        if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

        conversation.messages.push({
            author_id: req.body.author_id,
            content:   req.body.content
        });

        await conversation.save();
        res.status(201).json(conversation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
