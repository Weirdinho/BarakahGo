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

// @desc    Send password to user's email
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
      console.log(`⚠️ Password request for non-existent email: ${email}`);
      return res.json({ 
        message: 'If an account exists with this email, your password will be sent shortly.' 
      });
    }

    // Log for development
    console.log('📨 Password requested for:', { 
      email, 
      time: new Date().toISOString() 
    });

    // If no SendGrid key, just log and return
    if (!process.env.SENDGRID_API_KEY) {
      console.log('🔑 User password:', user.password);
      return res.json({ 
        message: 'If an account exists with this email, your password will be sent shortly.',
        ...(process.env.NODE_ENV === 'development' && {
          password: user.password
        })
      });
    }

    // Send email with password via SendGrid
    const msg = {
      to: email,
      from: process.env.EMAIL_FROM || 'hello@AmanahCharityFoundation.com',
      subject: 'Your Password - Amanah Charity Foundation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a5f2a; padding: 20px; text-align: center;">
            <h1 style="color: #fff; margin: 0;">Amanah Charity Foundation</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #2d3436;">Your Account Password</h2>
            <p style="color: #636e72; line-height: 1.6;">
              Hello ${user.name || 'there'},
            </p>
            <p style="color: #636e72; line-height: 1.6;">
              You recently requested your account password. Here it is:
            </p>
            <div style="background: #e8f5e9; border: 2px dashed #1a5f2a; padding: 20px; text-align: center; margin: 25px 0; border-radius: 10px;">
              <p style="font-size: 1.4rem; font-weight: 700; color: #1a5f2a; margin: 0; letter-spacing: 2px;">
                ${user.password}
              </p>
            </div>
            <p style="color: #636e72; line-height: 1.6;">
              For security reasons, we recommend keeping this password safe and not sharing it with anyone.
            </p>
            <p style="color: #e74c3c; font-weight: 600; font-size: 0.9rem;">
              ⚠️ If you didn't request this, please contact us immediately.
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
    console.log('✅ Password email sent via SendGrid to:', email);

    res.json({ 
      message: 'If an account exists with this email, your password will be sent shortly.'
    });

  } catch (error) {
    console.error('❌ FORGOT PASSWORD ERROR:', error.message);
    if (error.response) {
      console.error('❌ SendGrid response:', error.response.body);
    }
    
    res.json({ 
      message: 'If an account exists with this email, your password will be sent shortly.'
    });
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