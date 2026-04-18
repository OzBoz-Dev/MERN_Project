const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require('../models/User');
const Tag = require('../models/Tag');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const Post = require("../models/Post");
const Message = require("../models/Message");
const Comment = require("../models/Comment");

router.get("/:username", async(req, res) => {
  try {
        const { username } = req.params;

        if (!username) {
            return res.status(400).json({ error: 'Please provide a username' })
        }

        // find user and select password field
        const user = await User.findOne({ username })
            .collation({ locale: 'en', strength: 2 })
            .select('-password -email -token')
        if (!user || user.username.startsWith('DELETED_USER_')) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio,
            tags: user.tags,
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
        const { firstName, lastName, bio, tags } = req.body.data;

        if (!username) {
            return res.status(400).json({ error: 'Please provide a username' })
        }

        // Ensure tags is an array and create any new tags in the database
        const tagArray = Array.isArray(tags) ? tags : [];
        const normalizedTags = tagArray.map(tag => tag.toLowerCase().trim());
        
        // // Create new tags in database if they don't exist
        // for (const tagValue of normalizedTags) {
        //   const existingTag = await Tag.findOne({ value: tagValue })
        //     .collation({ locale: 'en', strength: 2 });
        //   if (!existingTag) {
        //     await Tag.create({ value: tagValue });
        //   }
        // }

        normalizedTags.sort()

        // find user
        const user = await User.findOneAndUpdate(
            { username },
            {
                $set: {
                    firstName, 
                    lastName,
                    bio,
                    tags: normalizedTags
                }
            },
            { returnDocument: 'after', runValidators: true }
        )
        .collation({ locale: 'en', strength: 2 })
        .select('-password -token -email')
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.bio,
            tags: user.tags,
            profilePicture: user.profilePicture,
            createdAt: user._id.getTimestamp()
        })

    } catch (err) {
        console.error('Fetch profile error:', err)
        res.status(500).json({ error: 'Server error' })
    }
});

router.delete("/:username", auth, async(req, res) => {
  try {
        const { username } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ error: 'Password is required to delete account' })
        }

        const user = await User.findOne({ username })
            .collation({ locale: 'en', strength: 2 })
            .select('+password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        if (user._id.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to delete this account' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        await Post.deleteMany({ author_username: username });
        await Comment.deleteMany({ author_username: username });
        await Message.deleteMany({ author_username: username });
        
        await User.findByIdAndUpdate(user._id, {
            $set: {
                username: `DELETED_USER_${user._id}`,
                email: `DELETED_EMAIL_${user._id}`,
                firstName: 'DELETED',
                lastName: 'USER',
                bio: '',
                profilePicture: '',
                tags: [],
                verified: false
            }
        });

        res.json({ message: 'Account deactivated successfully' });

    } catch (err) {
        console.error('Fetch profile error:', err)
        res.status(500).json({ error: 'Server error' })
    }
});

module.exports = router;