// routes/payout.js

const express = require('express');
const router = express.Router();

const { auth, adminOnly } = require('../middleware/auth');
const payoutController = require('../controllers/payoutController');

// Vendor routes
router.get('/banks', auth, payoutController.listBanks);

router.post('/verify-account', auth, payoutController.resolveAccount);

router.post('/setup-recipient', auth, payoutController.setupRecipient);

// Admin routes
router.post(
  '/vouchers/:voucherId',
  auth,
  adminOnly,
  payoutController.payoutVoucher
);

module.exports = router;