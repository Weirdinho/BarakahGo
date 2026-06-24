const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Use SendGrid SDK
const sgMail = require('@sendgrid/mail');

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ SendGrid API key configured');
} else {
  console.log('⚠️ SendGrid API key not found - emails will be logged only');
}

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// We never store the raw reset token in the DB — only its hash.
// That way, even if the database is leaked, no one can use it to reset accounts.
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

// @desc    Register a new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password, phone, role, companyName } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      phone,
      role: role || 'donor',
      companyName
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error);
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

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
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

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetUrl = `${clientUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

    console.log('📨 Password reset requested for:', { email, time: new Date().toISOString() });

    // If no SendGrid key, just log the link so you can still test locally
    if (!process.env.SENDGRID_API_KEY) {
      console.log('🔗 Reset link (dev only, no SENDGRID_API_KEY set):', resetUrl);
      return res.json({
        message: genericMessage,
        ...(process.env.NODE_ENV === 'development' && { resetUrl })
      });
    }

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM || 'hello@AmanahCharityFoundation.com',
      subject: 'Reset Your Password - Amanah Charity Foundation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a5f2a; padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0;">Amanah Charity Foundation</h1>
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
              Amanah Charity Foundation<br>
              Making a difference, one donation at a time.
            </p>
          </div>
        </div>
      `
    };

    await sgMail.send(msg);
    console.log('✅ Password reset email sent via SendGrid to:', email);

    res.json({ message: genericMessage });

  } catch (error) {
    console.error('❌ FORGOT PASSWORD ERROR:', error.message);
    if (error.response) {
      console.error('❌ SendGrid response:', error.response.body);
    }
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