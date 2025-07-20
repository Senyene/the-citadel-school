const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const gmailEmail = functions.config().gmail.email;
const gmailPass = functions.config().gmail.password;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPass
  }
});

exports.notifyAdminOnNewMessage = functions.firestore
  .document("messages/{messageId}")
  .onCreate(async (snap) => {
    const data = snap.data();

    const mailOptions = {
      from: `"Citadel Website" <${gmailEmail}>`,
      to: "admin@citadelschool.edu.ng", // Or multiple recipients
      subject: `📬 New Contact Message: ${data.subject}`,
      text: `
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Subject: ${data.subject}
Message: ${data.message}

Sent: ${data.timestamp}
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Admin notified via email.");
    } catch (err) {
      console.error("Email failed:", err);
    }
  });
