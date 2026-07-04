const nodemailer = require('nodemailer');

const createTransporter = () => {
  // Try to use environment variables for SMTP if they exist
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback to a testing transporter (this won't actually send emails without config)
  console.log('No SMTP config found in .env, email notifications will only be logged.');
  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'windows'
  });
};

const sendDownloadNotification = async (ownerEmail, fileName, ipAddress) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.SMTP_FROM || '"CloakBox" <noreply@cloakbox.app>',
    to: ownerEmail,
    subject: `Your file "${fileName}" was downloaded`,
    text: `Hello,\n\nYour file "${fileName}" was recently downloaded.\nIP Address: ${ipAddress}\nTime: ${new Date().toLocaleString()}\n\nBest,\nCloakBox Team`,
    html: `
      <h2>File Downloaded</h2>
      <p>Hello,</p>
      <p>Your file <strong>"${fileName}"</strong> was recently downloaded.</p>
      <ul>
        <li><strong>IP Address:</strong> ${ipAddress}</li>
        <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
      </ul>
      <p>Best,<br>CloakBox Team</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    if (info.message) {
      // Stream transport log
      console.log('Email Notification generated (Not Sent, configure SMTP to send):', info.message.toString());
    } else {
      console.log('Email Notification sent to', ownerEmail);
    }
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
};

module.exports = {
  sendDownloadNotification
};
