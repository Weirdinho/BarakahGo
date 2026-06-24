const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const authController = require('../controllers/authController');

// @route   POST /api/auth/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['donor', 'beneficiary', 'vendor', 'corporate'])
], authController.register);

// @route   POST /api/auth/login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').exists().withMessage('Password is required')
], authController.login);

// @route   POST /api/auth/forgot-password (sends a reset link to the user's email)
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required')
], authController.forgotPassword);

// @route   POST /api/auth/verify-reset-token (checks a reset link is valid before showing the form)
router.post('/verify-reset-token', authController.verifyResetToken);

// @route   POST /api/auth/reset-password (sets a new password using a valid token)
router.post('/reset-password', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], authController.resetPassword);

// @route   GET /api/auth/me
router.get('/me', auth, authController.getMe);

// @route   PUT /api/auth/profile (update your own name/email/phone/company)
router.put('/profile', auth, [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional({ checkFalsy: true }).matches(/^\+?[\d\s-]{8,}$/).withMessage('Please enter a valid phone number')
], authController.updateProfile);

// @route   DELETE /api/auth/profile (permanently delete your own account)
router.delete('/profile', auth, [
  body('password').notEmpty().withMessage('Password is required to delete your account')
], authController.deleteAccount);

// @route   PUT /api/auth/change-password
router.put('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], authController.changePassword);

module.exports = router;