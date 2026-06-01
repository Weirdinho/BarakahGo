const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

// Verify environment variables
console.log('📧 EMAIL_USER set:', !!process.env.EMAIL_USER);
console.log('📧 EMAIL_PASS set:', !!process.env.EMAIL_PASS);
console.log('📧 RECEIVER_EMAIL:', process.env.RECEIVER_EMAIL || 'hello@AmanahCharityFoundation.com');


const transporter = nodemailer.createTransport({
host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { 
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls:{
    rejectUnauthorized: false
  }
});

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Transporter verification failed:', error.message);
  } else {
    console.log('✅ Email transporter ready');
  }
});

// @route   POST /api/contact
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

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Missing email credentials');
      return res.status(500).json({ 
        message: 'Server email configuration error' 
      });
    }

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: email,
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

    console.log('📤 Sending email to:', mailOptions.to);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    res.status(500).json({ 
      message: 'Failed to send email. Please try again later.' 
    });
  }
});

module.exports = router;