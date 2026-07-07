const sgMail = require('@sendgrid/mail');
const { validationResult } = require('express-validator');

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ SendGrid API key configured');
} else {
  console.log('⚠️ SendGrid API key not found - emails will be logged only');
}

exports.sendContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, subject, message } = req.body;

    console.log('📨 Contact form received:', { name, email, subject, time: new Date().toISOString() });

    if (!process.env.SENDGRID_API_KEY) {
      return res.json({
        success: true,
        message: 'Message received! We will contact you soon.'
      });
    }

    const msg = {
      to: process.env.RECEIVER_EMAIL || 'hello@AmanahCharityFoundation.com',
      from: process.env.EMAIL_FROM || 'hello@AmanahCharityFoundation.com',
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

    await sgMail.send(msg);
    console.log('✅ Email sent via SendGrid');

    res.json({ success: true, message: 'Email sent successfully' });

  } catch (error) {
    console.error('❌ SendGrid error:', error.message);
    if (error.response) {
      console.error('❌ SendGrid response:', error.response.body);
    }

    res.json({
      success: true,
      message: 'Message received! We will contact you soon.'
    });
  }
};