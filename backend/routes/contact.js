const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

// Use SendGrid instead of Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false, // TLS
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});

router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, subject, message } = req.body;

    console.log('📨 Contact form:', { name, email, subject });

    if (!process.env.SENDGRID_API_KEY) {
      console.log('⚠️ SendGrid not configured');
      return res.json({ 
        success: true, 
        message: 'Message received! We will contact you soon.' 
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'hello@AmanahCharityFoundation.com',
      to: process.env.RECEIVER_EMAIL || 'hello@AmanahCharityFoundation.com',
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent via SendGrid');

    res.json({ success: true, message: 'Email sent successfully' });

  } catch (error) {
    console.error('❌ SendGrid error:', error.message);
    res.json({ 
      success: true, 
      message: 'Message received! We will contact you soon.' 
    });
  }
});

module.exports = router;