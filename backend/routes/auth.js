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

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email is required')
], authController.forgotPassword);

// @route   POST /api/auth/verify-reset-token
router.post('/verify-reset-token', [
  body('token').notEmpty().withMessage('Token is required'),
  body('email').isEmail().withMessage('Valid email is required')
], authController.verifyResetToken);

// @route   POST /api/auth/reset-password
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Token is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], authController.resetPassword);

// @route   GET /api/auth/me
router.get('/me', auth, authController.getMe);

module.exports = router;