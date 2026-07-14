const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const voucherController = require('../controllers/voucherController');

// Get my vouchers (beneficiary)
router.get('/', auth, voucherController.getMyVouchers);

// Beneficiary redeems their own voucher, paid to their own bank account
router.post('/:code/redeem', auth, voucherController.redeemVoucher);

module.exports = router;