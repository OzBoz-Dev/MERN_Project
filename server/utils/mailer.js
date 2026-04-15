const { Resend } = require('resend')

const resend = new Resend(process.env.RESEND_API_KEY)

// sends verification email
const sendVerificationEmail = async (toEmail, token) => {
  const link = `${process.env.API_ENTRYPOINT}/auth/verify/${token}`;

  await resend.emails.send({
    from: "ChipIn <noreply@contact.poosd.lol>",
    to: toEmail,
    subject: "Verify your email to begin Chipping In!",
    html: `<p>Click the link to verify your email:</p><a href="${link}">${link}</a>`,
  });
};

// sends password reset email
const sendResetEmail = async (toEmail, token) => {
    const link = `${process.env.FRONTEND_URL}/auth/reset/${token}`
 
    await resend.emails.send({
        from: "ChipIn <noreply@contact.poosd.lol>",
        to: toEmail,
        subject: 'Reset your password',
        html: `
            <p><a href="${link}">Click here to reset your password</a></p>
            <p>This link expires in 1 hour</p>
        `,
    })
}

module.exports = { sendVerificationEmail , sendResetEmail } 
