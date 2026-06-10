const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const voucherController = require('../controllers/voucherController');

// Beneficiary routes - MUST come before /:code
router.get('/', auth, voucherController.getMyVouchers);
router.post('/auto-redeem', auth, voucherController.autoRedeem);  // BEFORE /:code
router.get('/vendor/redemptions', auth, voucherController.getVendorRedemptions);

// Vendor routes - MUST come after specific routes
router.get('/:code', auth, voucherController.lookupVoucher);
router.post('/:code/redeem', auth, voucherController.redeemVoucher);

module.exports = router;