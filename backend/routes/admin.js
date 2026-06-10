const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.get('/stats', auth, adminOnly, adminController.getStats);
router.get('/users', auth, adminOnly, adminController.getUsers);
router.get('/donations', auth, adminOnly, adminController.getDonations);
router.get('/applications', auth, adminOnly, adminController.getApplications);
router.put('/applications/:id', auth, adminOnly, adminController.updateApplication);
router.get('/vouchers', auth, adminOnly, adminController.getVouchers);
router.get('/vendors/pending', auth, adminOnly, adminController.getPendingVendors);
router.put('/vendors/:id/approve', auth, adminOnly, adminController.approveVendor);

module.exports = router;