const functions = require("firebase-functions");
const logger = require("firebase-functions/logger");
const nodemailer = require("nodemailer");

// Replace with your SMTP credentials
const transporter = nodemailer.createTransport({
  host: "mail.morsnow.ma", // e.g., smtp.gmail.com
  port: 465, // or 465 for SSL
  secure: true, // true for 465
  auth: {
    user: "_mainaccount@morsnow.ma",
    pass: "sama99sam99",
  },
});

exports.sendEmail = functions.https.onRequest(async (req, res) => {
  const {to, subject, text} = req.body;

  if (!to || !subject || !text) {
    return res.status(400).send("Missing required fields: to, subject, text");
  }

  try {
    await transporter.sendMail({
      from: "CRSA GeoSruvey application <_mainaccount@morsnow.ma>",
      to,
      subject,
      text,
    });
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    logger.error("Error sending email:", error);
    res.status(500).send("Failed to send email");
  }
});
