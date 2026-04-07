const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

// sends verification email
const sendVerificationEmail = async (toEmail, token) => {
    const link = `http://localhost:5000/auth/verify/${token}`

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Verify your email lol',
        html: `<p>Click the link to verify your email:</p><a href="${link}">${link}</a>`,
    })
}

module.exports = { sendVerificationEmail }