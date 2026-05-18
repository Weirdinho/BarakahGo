const Voucher = require('../models/Voucher');

// @desc    Get user's vouchers
// @route   GET /api/vouchers
exports.getVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find({ 
      $or: [
        { beneficiary: req.user.id },
        { 'donation.donor': req.user.id }
      ]
    })
    .populate('donation')
    .populate('vendor', 'name address')
    .sort({ createdAt: -1 });
    
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get voucher by code
// @route   GET /api/vouchers/:code
exports.getVoucherByCode = async (req, res) => {
  try {
    const voucher = await Voucher.findOne({ code: req.params.code.toUpperCase() })
      .populate('donation')
      .populate('vendor', 'name address phone');
    
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    res.json(voucher);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Redeem voucher at vendor
// @route   POST /api/vouchers/:code/redeem
exports.redeemVoucher = async (req, res) => {
  try {
    const { amount } = req.body;
    const voucher = await Voucher.findOne({ code: req.params.code.toUpperCase() });

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    if (voucher.status !== 'active') {
      return res.status(400).json({ message: 'Voucher is not active' });
    }

    if (new Date() > voucher.expiryDate) {
      voucher.status = 'expired';
      await voucher.save();
      return res.status(400).json({ message: 'Voucher has expired' });
    }

    if (amount > voucher.amount - voucher.redeemedAmount) {
      return res.status(400).json({ message: 'Insufficient voucher balance' });
    }

    voucher.redeemedAmount += amount;
    voucher.vendor = req.user.id;
    
    if (voucher.redeemedAmount >= voucher.amount) {
      voucher.status = 'redeemed';
      voucher.redeemedAt = new Date();
    }

    await voucher.save();
    res.json({ success: true, voucher });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};