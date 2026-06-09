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

// @desc    Forgot password - send reset token via email
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
      console.log(`⚠️ Password reset requested for non-existent email: ${email}`);
      return res.json({ 
        message: 'If an account exists with this email, you will receive a password reset link shortly.' 
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    // Build reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // Always log the reset request
    console.log('📨 Password reset requested:', { 
      email, 
      time: new Date().toISOString(),
      resetUrl 
    });

    // If no SendGrid key, just log and return
    if (!process.env.SENDGRID_API_KEY) {
      return res.json({ 
        message: 'If an account exists with this email, you will receive a password reset link shortly.',
        ...(process.env.NODE_ENV === 'development' && {
          resetToken,
          resetUrl
        })
      });
    }

    // Send email via SendGrid
    const msg = {
      to: email,
      from: process.env.EMAIL_FROM || 'hello@AmanahCharityFoundation.com',
      subject: 'Password Reset - Amanah Charity Foundation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a5f2a; padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0;">Amanah Charity Foundation</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #2d3436;">Password Reset Request</h2>
            <p style="color: #636e72; line-height: 1.6;">
              Hello ${user.name || 'there'},
            </p>
            <p style="color: #636e72; line-height: 1.6;">
              We received a request to reset your password. Click the button below to set a new password:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #1a5f2a; color: #fff; padding: 14px 28px; 
                        text-decoration: none; border-radius: 8px; font-weight: 600; 
                        display: inline-block;">
                Reset My Password
              </a>
            </div>
            <p style="color: #636e72; line-height: 1.6;">
              Or copy and paste this link into your browser:
            </p>
            <p style="background: #e8f5e9; padding: 12px; border-radius: 6px; word-break: break-all;">
              <a href="${resetUrl}" style="color: #1a5f2a; text-decoration: none;">${resetUrl}</a>
            </p>
            <p style="color: #636e72; line-height: 1.6; margin-top: 20px;">
              <strong>This link expires in 1 hour.</strong> If you didn't request this reset, you can safely ignore this email.
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

    res.json({ 
      message: 'If an account exists with this email, you will receive a password reset link shortly.'
    });

  } catch (error) {
    console.error('❌ FORGOT PASSWORD ERROR:', error.message);
    if (error.response) {
      console.error('❌ SendGrid response:', error.response.body);
    }
    
    res.json({ 
      message: 'If an account exists with this email, you will receive a password reset link shortly.'
    });
  }
};

// @desc    Verify reset token is valid
// @route   POST /api/auth/verify-reset-token
exports.verifyResetToken = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { token, email } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    res.json({ valid: true, message: 'Token is valid' });
  } catch (error) {
    console.error('VERIFY TOKEN ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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
    const { token, email, password } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password and clear reset fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    // Send confirmation email if SendGrid is configured
    if (process.env.SENDGRID_API_KEY) {
      try {
        const confirmMsg = {
          to: email,
          from: process.env.EMAIL_FROM || 'hello@AmanahCharityFoundation.com',
          subject: 'Password Changed - Amanah Charity Foundation',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #1a5f2a; padding: 20px; text-align: center;">
                <h1 style="color: #fff; margin: 0;">Amanah Charity Foundation</h1>
              </div>
              <div style="padding: 30px; background: #f9f9f9;">
                <h2 style="color: #2d3436;">Password Changed Successfully</h2>
                <p style="color: #636e72; line-height: 1.6;">
                  Hello ${user.name || 'there'},
                </p>
                <p style="color: #636e72; line-height: 1.6;">
                  Your password has been successfully reset. You can now log in with your new password.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
                     style="background: #1a5f2a; color: #fff; padding: 14px 28px; 
                            text-decoration: none; border-radius: 8px; font-weight: 600; 
                            display: inline-block;">
                    Sign In
                  </a>
                </div>
                <p style="color: #636e72; line-height: 1.6;">
                  If you didn't make this change, please contact us immediately.
                </p>
              </div>
            </div>
          `
        };
        await sgMail.send(confirmMsg);
        console.log('✅ Password change confirmation email sent to:', email);
      } catch (emailError) {
        console.error('❌ Failed to send confirmation email:', emailError.message);
      }
    }

    res.json({ message: 'Password reset successful. You can now log in with your new password.' });
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