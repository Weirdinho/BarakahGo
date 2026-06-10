const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const voucherController = require('../controllers/voucherController');

// Beneficiary routes
router.get('/', auth, voucherController.getMyVouchers);

// Vendor routes
router.get('/:code', auth, voucherController.lookupVoucher);
router.post('/:code/redeem', auth, voucherController.redeemVoucher);
router.get('/vendor/redemptions', auth, voucherController.getVendorRedemptions);

module.exports = router;