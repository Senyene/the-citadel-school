const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Fetch Gmail credentials from environment config
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

// Configure the email transport using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword
  }
});

// Cloud Function triggered on new Firestore document
exports.notifyAdmin = functions.firestore
  .document('messages/{messageId}')
  .onCreate((snap, context) => {
    const data = snap.data();
    const messageId = context.params.messageId;

    const mailOptions = {
      from: `The Citadel School <${gmailEmail}>`,
      to: gmailEmail,
      subject: `New Message Received [ID: ${messageId}]`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong><br>${data.message}</p>
        <hr>
        <p><em>Submitted on:</em> ${new Date(data.timestamp).toLocaleString()}</p>
      `
    };

    return transporter.sendMail(mailOptions)
      .then(() => {
        console.log('✅ Email sent to admin.');
      })
      .catch(error => {
        console.error('❌ Failed to send email:', error);
      });
  });
