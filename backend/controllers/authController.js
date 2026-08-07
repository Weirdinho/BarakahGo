const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const User = require('../models/User');

// Gmail SMTP transporter
let transporter = null;

console.log('🔧 EMAIL_USER present:', !!process.env.EMAIL_USER);
console.log('🔧 EMAIL_APP_PASSWORD present:', !!process.env.EMAIL_APP_PASSWORD, '(length:', process.env.EMAIL_APP_PASSWORD ? process.env.EMAIL_APP_PASSWORD.length : 0, ')');

if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD
    }
  });
  console.log('✅ Gmail SMTP configured for user:', process.env.EMAIL_USER);

  // Verify the connection/credentials on startup so bad creds show up immediately in logs
  transporter.verify((err, success) => {
    if (err) {
      console.error('❌ Gmail SMTP verify FAILED:', err.message);
      console.error('❌ Full verify error:', err);
    } else {
      console.log('✅ Gmail SMTP verify OK - ready to send');
    }
  });
} else {
  console.log('⚠️ Gmail SMTP credentials not found - emails will be logged only');
}

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// We never store the raw token in the DB — only its hash.
// That way, even if the database is leaked, no one can use it to reset/verify accounts.
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.EMAIL_USER;

// Shared helper to actually send (or log, in dev) the verification email
const sendVerificationEmail = async ({ email, name, rawToken }) => {
  const verifyUrl = `${CLIENT_URL}/verify-email?token=${rawToken}&email=${encodeURIComponent(email)}`;

  console.log('📤 sendVerificationEmail called for:', email);
  console.log('📤 transporter configured:', !!transporter);

  if (!transporter) {
    console.log('🔗 Verification link (dev only, no Gmail SMTP configured):', verifyUrl);
    return { devUrl: verifyUrl };
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a5f2a; padding: 20px; text-align: center;">
        <h1 style="color: #fff; margin: 0;">Amanah and Ikhlas Charitable Initiative</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #2d3436;">Verify Your Email</h2>
        <p style="color: #636e72; line-height: 1.6;">
          Hello ${name || 'there'},
        </p>
        <p style="color: #636e72; line-height: 1.6;">
          Thanks for signing up! Please confirm this is your email address by clicking the button below. This link expires in 24 hours.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background: #1a5f2a; color: #fff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p style="color: #636e72; font-size: 0.85rem; line-height: 1.6;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="${verifyUrl}" style="color: #1a5f2a; word-break: break-all;">${verifyUrl}</a>
        </p>
        <p style="color: #b2bec3; font-size: 0.85rem;">
          If you didn't create an account with us, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #dfe6e9; margin: 30px 0;">
        <p style="color: #b2bec3; font-size: 0.85rem; text-align: center;">
          Amanah and Ikhlas Charitable Initiative<br>
          Making a difference, one donation at a time.
        </p>
      </div>
    </div>
  `;

  try {
    console.log('📤 Attempting transporter.sendMail() to:', email, 'from:', EMAIL_FROM);
    const info = await transporter.sendMail({
      from: `"Amanah and Ikhlas Charitable Initiative" <${EMAIL_FROM}>`,
      to: email,
      subject: 'Verify Your Email - Amanah and Ikhlas Charitable Initiative',
      html
    });
    console.log('✅ Verification email sent via Gmail SMTP to:', email);
    console.log('✅ SMTP response:', info.response);
    console.log('✅ Message ID:', info.messageId);
    console.log('✅ Accepted:', info.accepted, 'Rejected:', info.rejected);
    return {};
  } catch (sendErr) {
    console.error('❌ transporter.sendMail() THREW for:', email);
    console.error('❌ Error message:', sendErr.message);
    console.error('❌ Error code:', sendErr.code);
    console.error('❌ Full error:', sendErr);
    throw sendErr;
  }
};

// @desc    Register a new user (creates an UNVERIFIED account and emails a verify link)
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password, phone, role, companyName } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    let user = await User.findOne({ email: normalizedEmail });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');

    user = new User({
      name,
      email: normalizedEmail,
      password,
      phone,
      role: role || 'donor',
      companyName,
      isVerified: false,
      verificationToken: hashToken(rawToken),
      verificationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    await user.save();
    console.log('👤 User saved, attempting to send verification email to:', normalizedEmail);

    let devUrl;
    try {
      const result = await sendVerificationEmail({ email: normalizedEmail, name: user.name, rawToken });
      devUrl = result.devUrl;
    } catch (emailErr) {
      console.error('❌ Failed to send verification email:', emailErr.message);
      // The account still exists — the user can use "resend verification" later.
      // We don't fail registration just because the email send hiccuped.
    }

    // No JWT here — the user can't log in until they verify.
    res.status(201).json({
      message: 'Account created! Please check your email to verify your account before signing in.',
      email: normalizedEmail,
      ...(process.env.NODE_ENV === 'development' && devUrl && { verifyUrl: devUrl })
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Verify a user's email using the token from the emailed link
// @route   POST /api/auth/verify-email
exports.verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.body;
    if (!token || !email) {
      return res.status(400).json({ message: 'Invalid verification link.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
      verificationToken: hashToken(token),
      verificationTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      // Could be wrong, expired, or already used. Check if there's an already-verified
      // account with this email so we can give a friendlier message in that case.
      const alreadyVerified = await User.findOne({ email: normalizedEmail, isVerified: true });
      if (alreadyVerified) {
        return res.json({ message: 'This email is already verified. You can sign in.', alreadyVerified: true });
      }
      return res.status(400).json({ message: 'This verification link is invalid or has expired.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    const jwtToken = generateToken(user._id);

    res.json({
      message: 'Your email has been verified! You can now sign in.',
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('VERIFY EMAIL ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Resend the verification email (in case the original didn't arrive / expired)
// @route   POST /api/auth/resend-verification
exports.resendVerification = async (req, res) => {
  // Same "don't leak which emails exist" approach as forgot-password
  const genericMessage = 'If an unverified account exists with this email, a new verification link has been sent.';

  try {
    const email = req.body.email.toLowerCase().trim();
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: genericMessage });
    }

    if (user.isVerified) {
      return res.json({ message: 'This account is already verified. You can sign in.' });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = hashToken(rawToken);
    user.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    let devUrl;
    try {
      const result = await sendVerificationEmail({ email, name: user.name, rawToken });
      devUrl = result.devUrl;
    } catch (emailErr) {
      console.error('❌ Failed to resend verification email:', emailErr.message);
    }

    res.json({
      message: genericMessage,
      ...(process.env.NODE_ENV === 'development' && devUrl && { verifyUrl: devUrl })
    });
  } catch (error) {
    console.error('RESEND VERIFICATION ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Please verify your email before signing in. Check your inbox for the verification link.',
        needsVerification: true,
        email: user.email
      });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        totalDonated: user.totalDonated
      }
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Request a password reset link (sends an email with a one-time token)
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Always return this exact message whether or not the account exists,
  // so requests can't be used to discover which emails are registered.
  const genericMessage = 'If an account exists with this email, a password reset link has been sent.';

  try {
    const email = req.body.email.toLowerCase().trim();
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`⚠️ Password reset requested for non-existent email: ${email}`);
      return res.json({ message: genericMessage });
    }

    // Generate a random token. Keep the raw version only for the email link;
    // store just its hash on the user document.
    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = hashToken(rawToken);
    user.resetPasswordExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `${CLIENT_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

    console.log('📨 Password reset requested for:', { email, time: new Date().toISOString() });
    console.log('📤 transporter configured:', !!transporter);

    // If no Gmail SMTP configured, just log the link so you can still test locally
    if (!transporter) {
      console.log('🔗 Reset link (dev only, no Gmail SMTP configured):', resetUrl);
      return res.json({
        message: genericMessage,
        ...(process.env.NODE_ENV === 'development' && { resetUrl })
      });
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a5f2a; padding: 20px; text-align: center;">
          <h1 style="color: #fff; margin: 0;">Amanah and Ikhlas Charitable Initiative</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #2d3436;">Reset Your Password</h2>
          <p style="color: #636e72; line-height: 1.6;">
            Hello ${user.name || 'there'},
          </p>
          <p style="color: #636e72; line-height: 1.6;">
            We received a request to reset your password. Click the button below to choose a new one. This link expires in 1 hour.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #1a5f2a; color: #fff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 600; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #636e72; font-size: 0.85rem; line-height: 1.6;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #1a5f2a; word-break: break-all;">${resetUrl}</a>
          </p>
          <p style="color: #e74c3c; font-weight: 600; font-size: 0.9rem;">
            ⚠️ If you didn't request this, you can safely ignore this email — your password will remain unchanged.
          </p>
          <hr style="border: none; border-top: 1px solid #dfe6e9; margin: 30px 0;">
          <p style="color: #b2bec3; font-size: 0.85rem; text-align: center;">
            Amanah and Ikhlas Charitable Initiative<br>
            Making a difference, one donation at a time.
          </p>
        </div>
      </div>
    `;

    try {
      console.log('📤 Attempting transporter.sendMail() (reset) to:', email, 'from:', EMAIL_FROM);
      const info = await transporter.sendMail({
        from: `"Amanah and Ikhlas Charitable Initiative" <${EMAIL_FROM}>`,
        to: email,
        subject: 'Reset Your Password - Amanah and Ikhlas Charitable Initiative',
        html
      });
      console.log('✅ Password reset email sent via Gmail SMTP to:', email);
      console.log('✅ SMTP response:', info.response);
      console.log('✅ Message ID:', info.messageId);
      console.log('✅ Accepted:', info.accepted, 'Rejected:', info.rejected);
    } catch (emailErr) {
      console.error('❌ Failed to send reset email:', emailErr.message);
      console.error('❌ Error code:', emailErr.code);
      console.error('❌ Full error:', emailErr);
    }

    res.json({ message: genericMessage });

  } catch (error) {
    console.error('❌ FORGOT PASSWORD ERROR:', error.message);
    // Still respond with the generic message so we don't leak info or break the UX
    res.json({ message: genericMessage });
  }
};

// @desc    Verify a reset token is valid and unexpired (used by the reset page on load)
// @route   POST /api/auth/verify-reset-token
exports.verifyResetToken = async (req, res) => {
  try {
    const { token, email } = req.body;
    if (!token || !email) {
      return res.status(400).json({ message: 'Invalid reset link.' });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetPasswordToken: hashToken(token),
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'This reset link is invalid or has expired.' });
    }

    res.json({ valid: true });
  } catch (error) {
    console.error('VERIFY RESET TOKEN ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Set a new password using a valid reset token
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { token, email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetPasswordToken: hashToken(token),
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'This reset link is invalid or has expired. Please request a new one.' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({ message: 'Your password has been reset successfully. You can now sign in.' });
  } catch (error) {
    console.error('RESET PASSWORD ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    res.json(req.user);
  } catch (error) {
    console.error('GET ME ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update the logged-in user's own profile (name, email, phone, company)
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user._id || req.user.id;
    const { name, email, phone, companyName } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If the email is changing, make sure no other account already uses it
    if (email !== undefined) {
      const normalizedEmail = email.toLowerCase().trim();
      if (normalizedEmail !== user.email) {
        const emailTaken = await User.findOne({ email: normalizedEmail, _id: { $ne: userId } });
        if (emailTaken) {
          return res.status(400).json({ message: 'That email is already in use by another account' });
        }
        user.email = normalizedEmail;
      }
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (companyName !== undefined) user.companyName = companyName;

    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('UPDATE PROFILE ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Permanently delete the logged-in user's own account
// @route   DELETE /api/auth/profile
exports.deleteAccount = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user._id || req.user.id;
    const { password } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password. Account was not deleted.' });
    }

    await User.findByIdAndDelete(userId);
    console.log(`🗑️ Account deleted: ${user.email} (${userId})`);

    res.json({ message: 'Your account has been permanently deleted.' });
  } catch (error) {
    console.error('DELETE ACCOUNT ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Change password for logged-in user
// @route   PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id || req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('CHANGE PASSWORD ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};