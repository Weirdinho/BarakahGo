const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

// Gmail SMTP transporter (same pattern as authController.js / adminController.js)
let transporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });
  console.log('✅ Gmail SMTP configured');
} else {
  console.log('⚠️ Gmail SMTP credentials not found - emails will be logged only');
}

const EMAIL_FROM = process.env.EMAIL_FROM || process.env.EMAIL_USER;
const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || EMAIL_FROM;

exports.sendContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, subject, message } = req.body;

    console.log('📨 Contact form received:', { name, email, subject, time: new Date().toISOString() });

    if (!transporter) {
      return res.json({
        success: true,
        message: 'Message received! We will contact you soon.'
      });
    }

    const html = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    await transporter.sendMail({
      from: `"Amanah and Ikhlas Charitable Initiative" <${EMAIL_FROM}>`,
      to: RECEIVER_EMAIL,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html
    });
    console.log('✅ Contact email sent via Gmail SMTP');

    res.json({ success: true, message: 'Email sent successfully' });

  } catch (error) {
    console.error('❌ Gmail SMTP error:', error.message);

    res.json({
      success: true,
      message: 'Message received! We will contact you soon.'
    });
  }
};