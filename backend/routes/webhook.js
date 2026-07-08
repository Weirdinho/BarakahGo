// routes/webhookRoutes.js
const express = require('express');
const router = express.Router();
const { paystackWebhook } = require('../controllers/webhookController');

// Paystack calls this directly — no auth middleware, verification happens
// via the signature check inside paystackWebhook itself.
// express.json() here is fine since Paystack signs the JSON body, not raw bytes.
router.post('/paystack', express.json(), paystackWebhook);

module.exports = router;