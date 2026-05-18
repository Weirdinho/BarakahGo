const User = require('../models/User');
const Donation = require('../models/Donation');
const Voucher = require('../models/Voucher');
const Vendor = require('../models/Vendor');
const Application = require('../models/Application');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDonations,
      totalVouchers,
      totalVendors,
      totalApplications,
      pendingApplications,
      totalAmount
    ] = await Promise.all([
      User.countDocuments(),
      Donation.countDocuments(),
      Voucher.countDocuments(),
      Vendor.countDocuments(),
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Donation.aggregate([{ $match: { status: 'success' } }, { $group: { _id: null, total: { $sum: '$amount' } } }])
    ]);

    res.json({
      totalUsers,
      totalDonations,
      totalVouchers,
      totalVendors,
      totalApplications,
      pendingApplications,
      totalAmount: totalAmount[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all donations with donor info
// @route   GET /api/admin/donations
exports.getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name email role')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all applications
// @route   GET /api/admin/applications
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('applicant', 'name email phone')
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve/reject application
// @route   PUT /api/admin/applications/:id
exports.updateApplication = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, approvedBy: req.user.id, approvedAt: new Date() },
      { new: true }
    );
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all vouchers
// @route   GET /api/admin/vouchers
exports.getAllVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find()
      .populate('donation')
      .populate('beneficiary', 'name email')
      .populate('vendor', 'name')
      .sort({ createdAt: -1 });
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get pending vendors
// @route   GET /api/admin/vendors/pending
exports.getPendingVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ isApproved: false }).sort({ createdAt: -1 });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};