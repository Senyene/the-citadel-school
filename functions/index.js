// Cloud Function triggered on new Firestore document in 'applications' collection
exports.notifyAdminApplication = functions
  .region('us-central1')
  .firestore
  .document('applications/{applicationId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const applicationId = context.params.applicationId;

    // Format uploaded documents as links
    let documentsHtml = '';
    if (Array.isArray(data.documents) && data.documents.length > 0) {
      documentsHtml = '<ul>' + data.documents.map(doc => `<li><a href="${doc.url}">${doc.name}</a></li>`).join('') + '</ul>';
    } else {
      documentsHtml = '<em>No documents uploaded</em>';
    }

    const mailOptions = {
      from: `The Citadel School <${gmailEmail}>`,
      to: gmailEmail,
      subject: `New Application Received [ID: ${applicationId}]`,
      html: `
        <h3>New Admission Application</h3>
        <p><strong>Applicant Name:</strong> ${data.applicantName}</p>
        <p><strong>Date of Birth:</strong> ${data.dob}</p>
        <p><strong>Applying For:</strong> ${data.applyingFor}</p>
        <p><strong>Parent/Guardian:</strong> ${data.parentName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Previous School:</strong> ${data.previousSchool || ''}</p>
        <p><strong>Additional Info:</strong> ${data.additionalInfo || ''}</p>
        <p><strong>Agreed to Terms:</strong> ${data.agreeTerms ? 'Yes' : 'No'}</p>
        <p><strong>Newsletter:</strong> ${data.newsletter ? 'Yes' : 'No'}</p>
        <p><strong>Documents:</strong> ${documentsHtml}</p>
        <hr>
        <p><em>Submitted on:</em> ${data.timestamp ? new Date(data.timestamp).toLocaleString() : 'Unknown'}</p>
      `
    };

    return transporter.sendMail(mailOptions)
      .then(() => {
        console.log('✅ Application email sent to admin.');
      })
      .catch(error => {
        console.error('❌ Failed to send application email:', error);
      });
  });
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

// Cloud Function triggered on new Firestore document (in nam5 region)
exports.notifyAdmin = functions
  .region('us-central1') // ✅ Set correct region for Firestore
  .firestore
  .document('messages/{messageId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    const messageId = context.params.messageId;

    // Handle Firestore Timestamp or JS timestamp
    let submittedDate = '';
    if (data.timestamp) {
      if (typeof data.timestamp === 'object' && data.timestamp._seconds) {
        // Firestore Timestamp object
        submittedDate = new Date(data.timestamp._seconds * 1000).toLocaleString();
      } else if (typeof data.timestamp === 'number') {
        // JS timestamp (ms)
        submittedDate = new Date(data.timestamp).toLocaleString();
      } else {
        submittedDate = String(data.timestamp);
      }
    } else {
      submittedDate = 'Unknown';
    }

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
        <p><em>Submitted on:</em> ${submittedDate}</p>
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
