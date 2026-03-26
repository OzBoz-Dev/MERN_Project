const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

// generate a signed jwt, set to expire in 7 days
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    })
}

// auth signup 
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body

        // check for any missing fields
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Please provide username, email, and password' })
        }

        // check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] })
        if (existingUser) {
            const field = existingUser.email === email ? 'Email' : 'Username'
            return res.status(409).json({ error: `${field} is already taken` })
        }

        // create user
        const user = await User.create({ username, email, password })
        const token = generateToken(user._id)

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        })
    } catch (err) {
        // err handling
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((e) => e.message)
            return res.status(400).json({ error: messages.join(', ') })
        }
        console.error('Signup error:', err)
        res.status(500).json({ error: 'Server error' })
    }
})

// auth login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' })
        }

        // find user and select password field
        const user = await User.findOne({ email }).select('+password')
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const token = generateToken(user._id)

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        })
    } catch (err) {
        console.error('Login error:', err)
        res.status(500).json({ error: 'Server error' })
    }
})

// gets currently authed user
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        })
    } catch (err) {
        console.error('err:', err)
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router
