const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const User = require('../models/User')
const { sendResetEmail } = require('../utils/mailer')

const TOKEN_EXPIRY_MS = 1000 * 60 * 60 // 1 hour

router.post('/', async (req, res) => {
    const { email } = req.body

    if (!email) {
        return res.status(400).json({message: 'Email is required.'})
    }

    try {
        const user = await User.findOne({email})

        if (!user) {
            return res.status(200).json({message: 'If this account exists, a reset link has been sent.'})
        }

        const token = crypto.randomBytes(32).toString('hex')

        user.passwordResetToken = token
        user.passwordResetExpiry = new Date(Date.now() + TOKEN_EXPIRY_MS)
        await user.save()

        await sendResetEmail(user.email, token)

        return res.status(200).json({ message: 'If this email exists, a reset link has been sent.' })
    } catch (err) {
        console.error('Recovery request error:', err)
        return res.status(500).json({ message: 'Internal server error.' })
    }
})

// body should be {password:'newpassword'}
router.post('/:token', async (req, res) => 
{
    const { token } = req.params
    const { password } = req.body

    if (!password) {
        return res.status(400).json({message: 'New password is required.'})
    }

    if (password.length < 6) {
        return res.status(400).json({message: 'Password must be at least 6 characters.'})
    }

    try {
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpiry: { $gt: new Date() },
        }).select('+password +passwordResetToken +passwordResetExpiry')

        if (!user) {
            return res.status(400).json({ message: 'Reset token is invalid or has expired.'})
        }

        user.password = password
        user.passwordResetToken = undefined
        user.passwordResetExpiry = undefined
        await user.save()

        return res.status(200).json({ message: 'Password updated successfully.' })
    } catch (err) {
        console.error('Password reset error:', err)
        return res.status(500).json({ message: 'Internal server error.' })
    }
})

module.exports = router