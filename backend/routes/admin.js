const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// @route   GET /api/admin/stats
router.get('/stats', auth, adminOnly, adminController.getStats);

// @route   GET /api/admin/users
router.get('/users', auth, adminOnly, adminController.getUsers);

// @route   PUT /api/admin/users/:id/role
router.put('/users/:id/role', auth, adminOnly, adminController.updateUserRole);

// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', auth, adminOnly, adminController.deleteUser);

// @route   GET /api/admin/donations
router.get('/donations', auth, adminOnly, adminController.getAllDonations);

// @route   GET /api/admin/applications
router.get('/applications', auth, adminOnly, adminController.getApplications);

// @route   PUT /api/admin/applications/:id
router.put('/applications/:id', auth, adminOnly, adminController.updateApplication);
 
// @route   GET /api/admin/vouchers
router.get('/vouchers', auth, adminOnly, adminController.getAllVouchers);

// @route   GET /api/admin/vendors/pending
router.get('/vendors/pending', auth, adminOnly, adminController.getPendingVendors);

module.exports = router;