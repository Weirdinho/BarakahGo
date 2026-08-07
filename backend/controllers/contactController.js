const { validationResult } = require('express-validator');
const axios = require('axios');

// ---- Resend transactional email via HTTP API ----
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_API_URL = 'https://api.resend.com/emails';

const EMAIL_FROM = process.env.EMAIL_FROM; // must be a verified sender/domain in Resend
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'Amanah and Ikhlas Charitable Initiative';
const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || EMAIL_FROM;

console.log('🔧 [contact] RESEND_API_KEY present:', !!RESEND_API_KEY);
console.log('🔧 [contact] RECEIVER_EMAIL resolved to:', RECEIVER_EMAIL);

if (!RESEND_API_KEY) {
  console.log('⚠️ [contact] RESEND_API_KEY not found - emails will be logged only');
}

// Shared helper: send an email through Resend's HTTP API
const sendResendEmail = async ({ to, subject, html, replyTo }) => {
  console.log('📤 [contact] sendResendEmail called - to:', to, 'subject:', subject, 'replyTo:', replyTo);

  if (!RESEND_API_KEY) {
    console.log('⚠️ [contact] No RESEND_API_KEY, skipping actual send');
    return { skipped: true };
  }

  const payload = {
    from: `${EMAIL_FROM_NAME} <${EMAIL_FROM}>`,
    to: [to],
    subject,
    html,
    ...(replyTo && { reply_to: replyTo })
  };

  const response = await axios.post(RESEND_API_URL, payload, {
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    timeout: 15000
  }).catch(axiosErr => {
    if (axiosErr.response) {
      console.error('❌ [contact] Resend API error - status:', axiosErr.response.status);
      console.error('❌ [contact] Resend API response body:', axiosErr.response.data);
      const err = new Error(axiosErr.response.data?.message || `Resend API returned ${axiosErr.response.status}`);
      err.resendResponse = axiosErr.response.data;
      err.status = axiosErr.response.status;
      throw err;
    } else if (axiosErr.request) {
      console.error('❌ [contact] Resend API - no response received:', axiosErr.code, axiosErr.message);
      throw new Error(`No response from Resend API: ${axiosErr.code || axiosErr.message}`);
    }
    throw axiosErr;
  });

  console.log('✅ [contact] Resend accepted the email - id:', response.data.id);
  return response.data;
};

exports.sendContact = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, subject, message } = req.body;

    console.log('📨 Contact form received:', { name, email, subject, time: new Date().toISOString() });
    console.log('📤 [contact] RESEND_API_KEY configured:', !!RESEND_API_KEY);

    if (!RESEND_API_KEY) {
      console.log('⚠️ [contact] No RESEND_API_KEY - skipping send, returning fallback success message');
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

    await sendResendEmail({
      to: RECEIVER_EMAIL,
      subject: `Contact Form: ${subject}`,
      html,
      replyTo: email
    });
    console.log('✅ Contact email sent via Resend');

    res.json({ success: true, message: 'Email sent successfully' });

  } catch (error) {
    console.error('❌ Resend error:', error.message);
    console.error('❌ [contact] Resend response:', error.resendResponse);

    res.json({
      success: true,
      message: 'Message received! We will contact you soon.'
    });
  }
};