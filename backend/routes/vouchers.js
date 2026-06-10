const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const voucherController = require('../controllers/voucherController');

// ============================================
// SPECIFIC routes MUST come BEFORE parameterized routes
// ============================================

// Get my vouchers (beneficiary)
router.get('/', auth, voucherController.getMyVouchers);

// Auto-redeem - MUST be before /:code
router.post('/auto-redeem', auth, voucherController.autoRedeem);

// Get vendor redemptions - MUST be before /:code
router.get('/vendor/redemptions', auth, voucherController.getVendorRedemptions);

// ============================================
// PARAMETERIZED routes come LAST
// ============================================

// Lookup voucher by code (vendor)
router.get('/:code', auth, voucherController.lookupVoucher);

// Redeem voucher (vendor)
router.post('/:code/redeem', auth, voucherController.redeemVoucher);

module.exports = router;