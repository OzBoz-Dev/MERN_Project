const express = require('express')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const User = require('../models/User')
const auth = require('../middleware/auth')
const {sendVerificationEmail} = require('../utils/mailer')
const router = express.Router()

// generate a signed jwt, set to expire in 7 days
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    })
}

router.get('/verify/:token', async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token }).select('+verificationToken')

        if (!user) {
            return res.status(404).json({ error: 'invalid token' })
        }

        user.verified = true
        user.verificationToken = undefined 
        await user.save()

        res.status(200).json({ message: 'Email verified. log in now' })
    } catch (err) {
        console.error('Verification error:', err)
        res.status(500).json({ error: 'Server error' })
    }
})


// auth signup 
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body

        // check for any missing fields
        if (!username || !email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'Please provide username, email, first name, last name and password' })
        }

        // check if user exists
        const existingUser = await User
            .findOne({ $or: [{ email }, { username }] })
            .collation({ locale: 'en', strength: 2 })
        if (existingUser) {
            const field = existingUser.email === email ? 'Email' : 'Username'
            return res.status(409).json({ error: `${field} is already taken` })
        }

        const verificationToken = crypto.randomBytes(32).toString('hex')
        
        // create user
        const user = await User.create({ username, email, password, verificationToken, firstName, lastName })

        // should get token after email verification
        // const token = generateToken(user._id)

        try {
            await sendVerificationEmail(email, verificationToken)
        } catch (emailErr) {
            await User.findByIdAndDelete(user._id)
            return res.status(500).json({ error: 'failed to send verification email. try again.' })
        }

        res.status(201).json({
            // token,
            // user: {
            //     id: user._id,    
            //     username: user.username,
            //     email: user.email,
            // },
            message: 'signed up. check email to verify your account.',
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

router.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ error: 'Please provide an email' })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ error: 'No account found with that email' })
        }

        if (user.verified) {
            return res.status(400).json({ error: 'This account is already verified' })
        }

        user.verificationToken = crypto.randomBytes(32).toString('hex')
        await user.save()

        try {
            await sendVerificationEmail(email, user.verificationToken)
        } catch (emailErr) {
            return res.status(500).json({ error: 'Failed to send verification email. Try again.' })
        }

        res.status(200).json({ message: 'Verification email resent. Check your inbox.' })
    } catch (err) {
        console.error('Resend verification error:', err)
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

        if (!user.verified) {
            return res.status(403).json({ error: 'Please verify your email before logging in' })
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
                firstName: user.firstName,
                lastName: user.lastName
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
                firstName: user.firstName,
                lastName: user.lastName
            },
        })
    } catch (err) {
        console.error('err:', err)
        res.status(500).json({ error: 'Server error' })
    }
})

module.exports = router
