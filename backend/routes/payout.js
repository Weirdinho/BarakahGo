const express = require('express');
const router = express.Router();
const { auth, AdminOnly } = require('../middleware/auth');
const payoutController = require('../controllers/payoutController');

router.get('/banks', auth, payoutController.listBanks);
router.post('/verify-account', auth, payoutController.resolveAccount);

// Admin monitoring only — money already moved automatically at redemption
router.get('/', auth, AdminOnly, payoutController.listPayouts);

module.exports = router;