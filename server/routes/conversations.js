const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const auth = require('../middleware/auth')

// to get all conversations
router.get('/', async (req, res) => {
    try {
        const conversations = await Conversation.find().populate('messages');
        res.json(conversations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get conversations by id
router.get('/:_id', async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params._id).populate('messages');

        if (!conversation) return res.status(404).json({ error: 'Not found' });

        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// create conversation with empty message - you can add messages later with the /:_id/messages route
router.post('/', auth, async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.user);
        console.log(req);
        const { member_usernames } = req.body;

        if (!member_usernames || !member_usernames.includes(req.user.username)) {
            return res.status(400).json({ error: 'member_usernames must include the creating user' })
        }

        const conversation = await Conversation.create({ member_usernames });
        res.status(201).json(conversation);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
});

// create messages in a conversation
router.post('/:_id/messages', auth, async (req, res) => {
    try {
        const io  = req.app.get('io');
        const conversation = await Conversation.findById(req.params._id);

        if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

        /*
        if (!conversation.member_usernames.includes(req.user.username)) {
            return res.status(403).json({ error: 'Not a member of this conversation' });
        }
        */
        const message = await Message.create({
            ...req.body,
            author_username: req.user.username,
        });

        conversation.messages.push(message._id);
        await conversation.save();

        // emit to published clients
        io.to(conversation._id.toString()).emit("newMessage", message);

        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// edit a conversation (you can add and remove member_users)
router.put('/:_id', auth, async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params._id);
        if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

        if (!conversation.member_usernames.includes(req.user.username)) {
            return res.status(403).json({ error: 'Not a member of this conversation' });
        }

        const allowedUpdates = ['member_usernames'];
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                conversation[field] = req.body[field];
            }
        });

        await conversation.save();
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// delete a conversation
router.delete('/:_id', auth, async (req, res) => {
    try {
        const conversation = await Conversation.findById(req.params._id);
        if (!conversation) return res.status(404).json({ error: 'Conversation not found' });

        if (!conversation.member_usernames.includes(req.user.username)) {
            return res.status(403).json({ error: 'Not a member of this conversation' });
        }

        await conversation.deleteOne();
        res.status(200).json({ message: 'Conversation deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
