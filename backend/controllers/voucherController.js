const Voucher = require('../models/Voucher');

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

    const remaining = voucher.amount - voucher.redeemedAmount;
    if (amount > remaining) {
      return res.status(400).json({ 
        message: `Only ₦${remaining.toLocaleString()} remaining on this voucher` 
      });
    }

    voucher.redeemedAmount += parseFloat(amount);
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