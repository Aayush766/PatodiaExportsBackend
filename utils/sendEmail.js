// utils/sendEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // app password (NOT normal password)
  },
});

const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: `"Patodia-Exports" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html: html || text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
