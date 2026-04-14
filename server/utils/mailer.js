const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// sends verification email
const sendVerificationEmail = async (toEmail, token) => {
  const link = `${process.env.FRONTEND_URL}/auth/verify/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Verify your email lol",
    html: `<p>Click the link to verify your email:</p><a href="${link}">${link}</a>`,
  });
};

// sends password reset email
const sendResetEmail = async (toEmail, token) => {
    const link = `${process.env.FRONTEND_URL}/auth/reset/${token}`
 
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: 'Reset your password',
        html: `
            <p><a href="${link}">Click here to reset your password</a></p>
            <p>This link expires in 1 hour</p>
        `,
    })
}

module.exports = { sendVerificationEmail , sendResetEmail } 
