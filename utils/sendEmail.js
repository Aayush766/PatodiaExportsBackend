// utils/sendEmail.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const response = await resend.emails.send({
      from: "Patodia Exports <onboarding@resend.dev>", // default free email identity
      to,
      subject,
      html: html || `<p>${text}</p>`,
    });

    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

module.exports = sendEmail;
