const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

// Check if email credentials exist
const hasEmailCredentials = !!process.env.EMAIL_USER && !!process.env.EMAIL_PASS;
console.log('📧 Email credentials present:', hasEmailCredentials);

let transporter;
if (hasEmailCredentials) {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { 
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: { rejectUnauthorized: false }
  });
}

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

    // Always log the contact form data
    console.log('📨 New Contact Form:', { name, email, subject, message, time: new Date().toISOString() });

    // If no email credentials, just save the message and return success
    if (!hasEmailCredentials || !transporter) {
      console.log('⚠️ Email not configured - message logged only');
      return res.json({ 
        success: true, 
        message: 'Message received! We will contact you soon.' 
      });
    }

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
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
    console.log('✅ Email sent successfully');
    
    res.json({ success: true, message: 'Email sent successfully' });

  } catch (error) {
    console.error('❌ Email error code:', error.code);
    console.error('❌ Email error message:', error.message);
    console.error('❌ Full error:', error);

    // Always return success to user - don't expose backend failures
    res.json({ 
      success: true, 
      message: 'Message received! We will contact you soon.' 
    });
  }
});

module.exports = router;