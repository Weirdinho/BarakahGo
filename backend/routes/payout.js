const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const payoutController = require('../controllers/payoutController');

router.get('/banks', auth, payoutController.listBanks);
router.post('/verify-account', auth, payoutController.resolveAccount);

router.get('/', auth, adminOnly, payoutController.listPayouts);

module.exports = router;