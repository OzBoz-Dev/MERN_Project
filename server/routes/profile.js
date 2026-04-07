const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require('../models/User')

router.get("/:username", async(req, res) => {
  try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({ error: 'Please provide a username' })
        }

        // find user and select password field
        const user = await User.findOne({ username }).select('-password -email -token')
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio,
            profilePicture: user.profilePicture,
            createdAt: user._id.getTimestamp()
        })

    } catch (err) {
        console.error('Fetch profile error:', err)
        res.status(500).json({ error: 'Server error' })
    }
});

router.put("/:username", async(req, res) => {
  try {
        const { username } = req.params;
        const { firstName, lastName, bio } = req.body;

        if (!username) {
            return res.status(400).json({ error: 'Please provide a username' })
        }

        // find user
        const user = await User.findOneAndUpdate(
            { username },
            {
                $set: {
                    firstName, 
                    lastName, 
                    bio
                }
            },
            { new: true, runValidators: true }
        ).select('-password -token -email')
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio,
            profilePicture: user.profilePicture,
            createdAt: user._id.getTimestamp()
        })

    } catch (err) {
        console.error('Fetch profile error:', err)
        res.status(500).json({ error: 'Server error' })
    }
});

module.exports = router;