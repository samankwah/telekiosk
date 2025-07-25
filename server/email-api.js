/**
 * Sample Backend Email API for TeleKiosk
 * This is a Node.js/Express example for sending emails
 * 
 * Installation required:
 * npm install express nodemailer cors dotenv
 */

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Email transporter configuration
const createTransporter = () => {
  // Option 1: Gmail SMTP
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your-email@gmail.com
      pass: process.env.EMAIL_PASS  // your-app-password
    }
  });

  // Option 2: SendGrid
  // return nodemailer.createTransporter({
  //   host: 'smtp.sendgrid.net',
  //   port: 587,
  //   auth: {
  //     user: 'apikey',
  //     pass: process.env.SENDGRID_API_KEY
  //   }
  // });

  // Option 3: Mailgun
  // return nodemailer.createTransporter({
  //   host: 'smtp.mailgun.org',
  //   port: 587,
  //   auth: {
  //     user: process.env.MAILGUN_USER,
  //     pass: process.env.MAILGUN_PASS
  //   }
  // });
};

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    // Validate required fields
    if (!to || !subject || !html) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: to, subject, html'
      });
    }

    // Create transporter
    const transporter = createTransporter();

    // Email options
    const mailOptions = {
      from: {
        name: 'TeleKiosk Hospital',
        address: process.env.EMAIL_USER || 'noreply@telekiosk.com'
      },
      to: to,
      subject: subject,
      html: html,
      // Optional: Add text version
      text: 'Your video consultation has been confirmed. Please check your email for HTML content.'
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);

    res.json({
      success: true,
      message: 'Email sent successfully!',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Error sending email:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', service: 'TeleKiosk Email API' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Email API server running on port ${PORT}`);
});

module.exports = app;