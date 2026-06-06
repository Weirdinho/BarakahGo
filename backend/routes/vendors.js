const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const vendorController = require('../controllers/vendorController');

// @route   GET /api/vendors
// @desc    Get all approved vendors
router.get('/', vendorController.getVendors);

// @route   POST /api/vendors
// @desc    Register as vendor
router.post('/', auth, vendorController.registerVendor);

// @route   PUT /api/vendors/:id/approve
// @desc    Approve vendor (admin only)
router.put('/:id/approve', auth, adminOnly, vendorController.approveVendor);

module.exports = router; 