const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');

// get all tags
router.get('/', async (req, res) => {
    try {
        const tags = await Tag.find().sort({ value: 1 });
        res.json(tags);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// get a tag by id
router.get('/by-id/:id', async (req, res) => {
    try {
        const tag = await Tag.findById(req.params.id);
        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }
        res.json(tag);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Search tags by value
router.get('/:value', async (req, res) => {
    try {
        const { value } = req.params;
        const tags = await Tag.find({
              value: { $regex: value, $options: "i" },
        });
        res.json(tags);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add tags by value
router.post('/:value', async (req, res) => {
    try {
        const { value } = req.params;
        const tagExists = await Tag.exists( {value} );
        if (tagExists) return res.status(200).json({message: "Tag already exists"});
        const tag = await Tag.create({
            value: value
        });
        res.status(201).json(tag);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// create a new tag
router.post('/', async (req, res) => {
    try {
        const { value } = req.body;

        if (!value) {
            return res.status(400).json({ error: 'Tag value is required' });
        }

        // check if tag exists
        const existing = await Tag.findOne({ value: value.toLowerCase().trim() });
        if (existing) {
            return res.status(409).json({ error: 'Tag already exists', tag: existing });
        }

        const tag = await Tag.create({ value });
        res.status(201).json(tag);
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({ error: messages.join(', ') });
        }
        res.status(500).json({ error: err.message });
    }
});

// delete tag by id 
router.delete('/:id', async (req, res) => {
    try {
        const tag = await Tag.findByIdAndDelete(req.params.id);
        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }
        res.json({ message: 'Tag deleted', tag });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
