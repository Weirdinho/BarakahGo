const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { auth } = require('../middleware/auth');
const donationController = require('../controllers/donationController');

const validCategories = ['zakat', 'sadaqah', 'waqf', 'food-aid', 'education', 'healthcare', 'general-fund'];

// @route   POST /api/donations/initialize
router.post('/initialize', auth, [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('amount').custom(value => value >= 100).withMessage('Minimum donation is 100 NGN'),
  body('category').isIn(validCategories).withMessage('Invalid category')
], donationController.initializePayment);

// @route   GET /api/donations/verify/:reference
router.get('/verify/:reference', auth, donationController.verifyPayment);

// @route   GET /api/donations
router.get('/', auth, donationController.getDonations);

// @route   GET /api/donations/all
router.get('/all', auth, donationController.getAllDonations);

// @route   POST /api/donations/apply
router.post('/apply', auth, donationController.applyForAid);

// @route   GET /api/donations/applications
router.get('/applications', auth, donationController.getMyApplications);

module.exports = router;