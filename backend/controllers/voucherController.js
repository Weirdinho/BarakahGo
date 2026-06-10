const Voucher = require('../models/Voucher');
const User = require('../models/User');

// @desc    Get beneficiary's vouchers
// @route   GET /api/vouchers
exports.getMyVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find({ beneficiary: req.user.id })
      .populate('application', 'category reason')
      .sort({ createdAt: -1 });
    res.json(vouchers);
  } catch (error) {
    console.error('GET MY VOUCHERS ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Auto-redeem voucher by beneficiary sending to vendor
// @route   POST /api/vouchers/auto-redeem
exports.autoRedeem = async (req, res) => {
  try {
    const { voucherCode, vendorEmail, amount } = req.body;

    if (!voucherCode || !vendorEmail || !amount) {
      return res.status(400).json({ message: 'Voucher code, vendor email, and amount are required' });
    }

    // Find vendor by email
    const vendor = await User.findOne({ email: vendorEmail.toLowerCase().trim(), role: 'vendor' });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found with that email' });
    }

    // Find voucher
    const voucher = await Voucher.findOne({ code: voucherCode.toUpperCase() });
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    // Verify beneficiary owns this voucher
    if (voucher.beneficiary.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not own this voucher' });
    }

    if (voucher.status === 'redeemed') {
      return res.status(400).json({ message: 'Voucher has been fully redeemed' });
    }

    const redeemAmount = parseFloat(amount);
    const remaining = voucher.amount - (voucher.redeemedAmount || 0);

    if (redeemAmount > remaining) {
      return res.status(400).json({ 
        message: `Only ₦${remaining.toLocaleString()} remaining on this voucher` 
      });
    }

    // Process redemption
    voucher.redeemedAmount = (voucher.redeemedAmount || 0) + redeemAmount;
    voucher.vendor = vendor._id;

    if (voucher.redeemedAmount >= voucher.amount) {
      voucher.status = 'redeemed';
      voucher.redeemedAt = new Date();
    }

    await voucher.save();

    res.json({ 
      success: true,
      message: `Voucher redeemed successfully! ₦${redeemAmount.toLocaleString()} sent to ${vendor.name || vendorEmail}`,
      remaining: voucher.amount - voucher.redeemedAmount
    });
  } catch (error) {
    console.error('AUTO REDEEM ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Lookup voucher by code (for vendor)
// @route   GET /api/vouchers/:code
exports.lookupVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findOne({ code: req.params.code.toUpperCase() })
      .populate('beneficiary', 'name email phone')
      .populate('application', 'category');

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    if (voucher.status === 'redeemed') {
      return res.status(400).json({ message: 'Voucher has been fully redeemed' });
    }

    if (voucher.status === 'expired') {
      return res.status(400).json({ message: 'Voucher has expired' });
    }

    res.json(voucher);
  } catch (error) {
    console.error('LOOKUP VOUCHER ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Redeem voucher (vendor only)
// @route   POST /api/vouchers/:code/redeem
exports.redeemVoucher = async (req, res) => {
  try {
    const { amount } = req.body;
    const voucher = await Voucher.findOne({ code: req.params.code.toUpperCase() });

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    if (voucher.status === 'redeemed') {
      return res.status(400).json({ message: 'Voucher already fully redeemed' });
    }

    const remaining = voucher.amount - (voucher.redeemedAmount || 0);
    if (amount > remaining) {
      return res.status(400).json({ 
        message: `Only ₦${remaining.toLocaleString()} remaining on this voucher` 
      });
    }

    voucher.redeemedAmount = (voucher.redeemedAmount || 0) + parseFloat(amount);
    voucher.vendor = req.user.id;

    if (voucher.redeemedAmount >= voucher.amount) {
      voucher.status = 'redeemed';
      voucher.redeemedAt = new Date();
    }

    await voucher.save();

    res.json({ 
      message: 'Voucher redeemed successfully',
      remaining: voucher.amount - voucher.redeemedAmount
    });
  } catch (error) {
    console.error('REDEEM VOUCHER ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get vendor's redemptions
// @route   GET /api/vendors/redemptions
exports.getVendorRedemptions = async (req, res) => {
  try {
    const redemptions = await Voucher.find({ 
      vendor: req.user.id,
      status: 'redeemed'
    })
    .populate('beneficiary', 'name')
    .sort({ redeemedAt: -1 });

    res.json(redemptions);
  } catch (error) {
    console.error('GET VENDOR REDEMPTIONS ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Debug log
console.log('Voucher Controller exports:', Object.keys(exports));