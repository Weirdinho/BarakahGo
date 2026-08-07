const { validationResult } = require('express-validator');
const axios = require('axios');

// ---- Brevo (Sendinblue) transactional email via HTTP API ----
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const EMAIL_FROM = process.env.EMAIL_FROM; // must be a verified sender in Brevo
const EMAIL_FROM_NAME = process.env.EMAIL_FROM_NAME || 'Amanah and Ikhlas Charitable Initiative';
const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || EMAIL_FROM;

console.log('🔧 [contact] BREVO_API_KEY present:', !!BREVO_API_KEY);
console.log('🔧 [contact] RECEIVER_EMAIL resolved to:', RECEIVER_EMAIL);

if (!BREVO_API_KEY) {
  console.log('⚠️ [contact] BREVO_API_KEY not found - emails will be logged only');
}

// Shared helper: send an email through Brevo's HTTP API
const sendBrevoEmail = async ({ to, toName, subject, html, replyTo }) => {
  console.log('📤 [contact] sendBrevoEmail called - to:', to, 'subject:', subject, 'replyTo:', replyTo);

  if (!BREVO_API_KEY) {
    console.log('⚠️ [contact] No BREVO_API_KEY, skipping actual send');
    return { skipped: true };
  }

  const payload = {
    sender: { name: EMAIL_FROM_NAME, email: EMAIL_FROM },
    to: [{ email: to, name: toName || undefined }],
    subject,
    htmlContent: html,
    ...(replyTo && { replyTo: { email: replyTo } })
  };

  const response = await axios.post(BREVO_API_URL, payload, {
    headers: {
      'accept': 'application/json',
      'api-key': BREVO_API_KEY,
      'content-type': 'application/json'
    },
    timeout: 15000
  }).catch(axiosErr => {
    if (axiosErr.response) {
      console.error('❌ [contact] Brevo API error - status:', axiosErr.response.status);
      console.error('❌ [contact] Brevo API response body:', axiosErr.response.data);
      const err = new Error(axiosErr.response.data?.message || `Brevo API returned ${axiosErr.response.status}`);
      err.brevoResponse = axiosErr.response.data;
      err.status = axiosErr.response.status;
      throw err;
    } else if (axiosErr.request) {
      console.error('❌ [contact] Brevo API - no response received:', axiosErr.code, axiosErr.message);
      throw new Error(`No response from Brevo API: ${axiosErr.code || axiosErr.message}`);
    }
    throw axiosErr;
  });

  console.log('✅ [contact] Brevo accepted the email - messageId:', response.data.messageId);
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
    console.log('📤 [contact] BREVO_API_KEY configured:', !!BREVO_API_KEY);

    if (!BREVO_API_KEY) {
      console.log('⚠️ [contact] No BREVO_API_KEY - skipping send, returning fallback success message');
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

    await sendBrevoEmail({
      to: RECEIVER_EMAIL,
      subject: `Contact Form: ${subject}`,
      html,
      replyTo: email
    });
    console.log('✅ Contact email sent via Brevo');

    res.json({ success: true, message: 'Email sent successfully' });

  } catch (error) {
    console.error('❌ Brevo error:', error.message);
    console.error('❌ [contact] Brevo response:', error.brevoResponse);

    res.json({
      success: true,
      message: 'Message received! We will contact you soon.'
    });
  }
};