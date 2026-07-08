// routes/payoutRoutes.js
const express = require('express');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth');
const payoutController = require('../controllers/payoutController');

// ============================================
// Vendor-facing routes (any authenticated vendor)
// ============================================

// Get list of banks for the dropdown
router.get('/banks', auth, payoutController.listBanks);

// Resolve/verify an account number before saving it
router.post('/verify-account', auth, payoutController.resolveAccount);

// Vendor saves their bank details + creates a Paystack transfer recipient
router.post('/setup-recipient', auth, payoutController.setupRecipient);

// ============================================
// Admin-only routes
// ============================================

// Trigger payout for a specific redeemed voucher
router.post('/vouchers/:voucherId', auth, isAdmin, payoutController.payoutVoucher);

module.exports = router; 