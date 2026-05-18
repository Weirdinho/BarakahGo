const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const voucherController = require('../controllers/voucherController');

// @route   GET /api/vouchers
// @desc    Get user's vouchers
router.get('/', auth, voucherController.getVouchers);

// @route   GET /api/vouchers/:code
// @desc    Get voucher by code
router.get('/:code', auth, voucherController.getVoucherByCode);

// @route   POST /api/vouchers/:code/redeem
// @desc    Redeem voucher at vendor
router.post('/:code/redeem', auth, voucherController.redeemVoucher);

module.exports = router;