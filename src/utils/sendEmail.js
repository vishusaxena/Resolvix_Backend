const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Grievance System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text: message,
  });
};

module.exports = sendEmail;
