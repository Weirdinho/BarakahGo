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

// @desc    Send password reset token to user's email
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    
    // Security: Always return same message whether user exists or not
    if (!user) {
      console.log(`⚠️ Password reset request for non-existent email: ${email}`);
      return res.json({ 
        message: 'If an account exists with this email, a password reset link will be sent shortly.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Save token to user (store hashed version for security)
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpiry = new Date(resetTokenExpiry);
    await user.save();

    // Build reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    console.log('📨 Password reset requested:', { 
      email, 
      resetUrl,
      time: new Date().toISOString() 
    });

    // If no SendGrid key, just log and return (development mode)
    if (!process.env.SENDGRID_API_KEY) {
      console.log('🔑 Reset token (raw):', resetToken);
      console.log('🔑 Reset token (hashed):', user.resetPasswordToken);
      return res.json({ 
        message: 'If an account exists with this email, a password reset link will be sent shortly.',
        ...(process.env.NODE_ENV === 'development' && {
          resetUrl,
          resetToken
        })
      });
    }

    // Send email with reset link via SendGrid
    const msg = {
      to: email,
      from: process.env.EMAIL_FROM || 'hello@barakahgo.com',
      subject: 'Password Reset - BarakahGo',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a5f2a; padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0;">BarakahGo</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #2d3436;">Password Reset Request</h2>
            <p style="color: #636e72; line-height: 1.6;">
              Hello ${user.name || 'there'},
            </p>
            <p style="color: #636e72; line-height: 1.6;">
              You recently requested to reset your password. Click the button below to set a new password:
            </p>
            <div style="text-align: center; margin: 25px 0;">
              <a href="${resetUrl}" 
                style="background: #1a5f2a; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; display: inline-block; font-size: 1rem;">
                Reset My Password
              </a>
            </div>
            <p style="color: #636e72; line-height: 1.6;">
              Or copy and paste this link into your browser:
            </p>
            <p style="background: #e8f5e9; padding: 12px; border-radius: 8px; word-break: break-all; font-size: 0.85rem; color: #1a5f2a;">
              ${resetUrl}
            </p>
            <p style="color: #636e72; line-height: 1.6; margin-top: 20px;">
              This link will expire in <strong>1 hour</strong> for security reasons.
            </p>
            <p style="color: #e74c3c; font-weight: 600; font-size: 0.9rem;">
              ⚠️ If you didn't request this, please ignore this email. Your password will remain unchanged.
            </p>
            <hr style="border: none; border-top: 1px solid #dfe6e9; margin: 30px 0;">
            <p style="color: #b2bec3; font-size: 0.85rem; text-align: center;">
              BarakahGo<br>
              Making a difference, one donation at a time.
            </p>
          </div>
        </div>
      `
    };

    await sgMail.send(msg);
    console.log('✅ Reset email sent via SendGrid to:', email);

    res.json({ 
      message: 'If an account exists with this email, a password reset link will be sent shortly.'
    });

  } catch (error) {
    console.error('❌ FORGOT PASSWORD ERROR:', error.message);
    if (error.response) {
      console.error('❌ SendGrid response:', error.response.body);
    }
    
    res.json({ 
      message: 'If an account exists with this email, a password reset link will be sent shortly.'
    });
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Hash the token from URL to match stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password and clear reset fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    console.log('✅ Password reset successful for:', user.email);

    res.json({ 
      message: 'Password reset successful. You can now log in with your new password.' 
    });

  } catch (error) {
    console.error('❌ RESET PASSWORD ERROR:', error);
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