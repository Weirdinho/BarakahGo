const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

// Gmail SMTP transporter (same pattern as authController.js / adminController.js)
let transporter = null;

console.log('🔧 [contact] EMAIL_USER present:', !!process.env.EMAIL_USER);
console.log('🔧 [contact] EMAIL_APP_PASSWORD present:', !!process.env.EMAIL_APP_PASSWORD);

if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });
  console.log('✅ [contact] Gmail SMTP configured for user:', process.env.EMAIL_USER);

  transporter.verify((err, success) => {
    if (err) {
      console.error('❌ [contact] Gmail SMTP verify FAILED:', err.message);
      console.error('❌ [contact] Full verify error:', err);
    } else {
      console.log('✅ [contact] Gmail SMTP verify OK - ready to send');
    }
  });
} else {
  console.log('⚠️ [contact] Gmail SMTP credentials not found - emails will be logged only');
}

const EMAIL_FROM = process.env.EMAIL_FROM || process.env.EMAIL_USER;
const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || EMAIL_FROM;

console.log('🔧 [contact] RECEIVER_EMAIL resolved to:', RECEIVER_EMAIL);

exports.sendContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, subject, message } = req.body;

    console.log('📨 Contact form received:', { name, email, subject, time: new Date().toISOString() });
    console.log('📤 [contact] transporter configured:', !!transporter);

    if (!transporter) {
      console.log('⚠️ [contact] No transporter - skipping send, returning fallback success message');
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

    console.log('📤 [contact] Attempting transporter.sendMail() to:', RECEIVER_EMAIL, 'from:', EMAIL_FROM, 'replyTo:', email);
    const info = await transporter.sendMail({
      from: `"Amanah and Ikhlas Charitable Initiative" <${EMAIL_FROM}>`,
      to: RECEIVER_EMAIL,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html
    });
    console.log('✅ Contact email sent via Gmail SMTP');
    console.log('✅ [contact] SMTP response:', info.response);
    console.log('✅ [contact] Message ID:', info.messageId);
    console.log('✅ [contact] Accepted:', info.accepted, 'Rejected:', info.rejected);

    res.json({ success: true, message: 'Email sent successfully' });

  } catch (error) {
    console.error('❌ Gmail SMTP error:', error.message);
    console.error('❌ [contact] Error code:', error.code);
    console.error('❌ [contact] Full error:', error);

    res.json({
      success: true,
      message: 'Message received! We will contact you soon.'
    });
  }
};