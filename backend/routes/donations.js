const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const donationController = require('../controllers/donationController');
const applicationController = require('../controllers/applicationController');

// Donation routes (for donors)
router.post('/initialize', auth, donationController.initializePayment);
router.get('/verify/:reference', auth, donationController.verifyPayment);

// Application routes (for beneficiaries)
router.post('/apply', auth, applicationController.applyForAid);
router.get('/applications', auth, applicationController.getMyApplications);

module.exports = router;