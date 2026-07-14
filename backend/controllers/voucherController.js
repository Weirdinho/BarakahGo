const axios = require('axios');
const Voucher = require('../models/Voucher');

const paystack = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
  }
});

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

// @desc    Beneficiary redeems their own voucher — money is sent directly
//          to the bank account they provide, via Paystack Transfers
// @route   POST /api/vouchers/:code/redeem
exports.redeemVoucher = async (req, res) => {
  try {
    const { bankCode, accountNumber, accountName, amount } = req.body;

    if (!bankCode || !accountNumber || !accountName || !amount) {
      return res.status(400).json({ message: 'Bank details and amount are required' });
    }

    const voucher = await Voucher.findOne({ code: req.params.code.toUpperCase() });
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

    // Create (or reuse) a Paystack transfer recipient for this bank account
    let recipientCode;
    try {
      const recipientRes = await paystack.post('/transferrecipient', {
        type: 'nuban',
        name: accountName,
        account_number: accountNumber,
        bank_code: bankCode,
        currency: 'NGN'
      });
      recipientCode = recipientRes.data.data.recipient_code;
    } catch (err) {
      console.error('CREATE RECIPIENT ERROR:', err.response?.data || err.message);
      return res.status(400).json({
        message: err.response?.data?.message || 'Could not verify your bank account'
      });
    }

    // Initiate the transfer
    let transferData;
    try {
      const transferRes = await paystack.post('/transfer', {
        source: 'balance',
        amount: Math.round(redeemAmount * 100), // Paystack expects kobo
        recipient: recipientCode,
        reason: `Voucher redemption ${voucher.code}`,
        reference: `redeem-${voucher._id}-${Date.now()}`
      });
      transferData = transferRes.data.data;
    } catch (err) {
      console.error('TRANSFER ERROR:', err.response?.data || err.message);
      return res.status(400).json({
        message: err.response?.data?.message || 'Failed to send payout'
      });
    }

    // Record the redemption — payoutStatus starts 'pending' until the
    // transfer.success webhook confirms the money actually landed
    voucher.redeemedAmount = (voucher.redeemedAmount || 0) + redeemAmount;
    voucher.payoutStatus = 'pending';
    voucher.transferCode = transferData.transfer_code;
    voucher.bankDetails = { bankCode, accountNumber, accountName };

    if (voucher.redeemedAmount >= voucher.amount) {
      voucher.status = 'redeemed';
      voucher.redeemedAt = new Date();
    }

    await voucher.save();

    res.json({
      success: true,
      message: `₦${redeemAmount.toLocaleString()} is on its way to ${accountName}`,
      remaining: voucher.amount - voucher.redeemedAmount
    });
  } catch (error) {
    console.error('REDEEM VOUCHER ERROR:', error.response?.data || error.message);
    res.status(500).json({
      message: error.response?.data?.message || 'Server error'
    });
  }
};