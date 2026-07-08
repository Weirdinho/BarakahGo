// controllers/payoutController.js
const axios = require('axios');
const User = require('../models/User');
const Voucher = require('../models/Voucher');

const paystack = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
});

// GET /api/payouts/banks
exports.listBanks = async (req, res) => {
  const { data } = await paystack.get('/bank?country=nigeria');
  res.json(data.data); // [{ name, code }, ...] — feed this to your dropdown
};

// POST /api/payouts/verify-account  { accountNumber, bankCode }
exports.resolveAccount = async (req, res) => {
  try {
    const { accountNumber, bankCode } = req.body;
    const { data } = await paystack.get('/bank/resolve', {
      params: { account_number: accountNumber, bank_code: bankCode }
    });
    res.json({ accountName: data.data.account_name });
  } catch (err) {
    res.status(400).json({ message: err.response?.data?.message || 'Could not resolve account' });
  }
};

// POST /api/payouts/setup-recipient  { accountNumber, bankCode, accountName }
exports.setupRecipient = async (req, res) => {
  try {
    const { accountNumber, bankCode, accountName } = req.body;

    const { data } = await paystack.post('/transferrecipient', {
      type: 'nuban',
      name: accountName,
      account_number: accountNumber,
      bank_code: bankCode,
      currency: 'NGN'
    });

    await User.findByIdAndUpdate(req.user.id, {
      bankDetails: {
        accountNumber, bankCode, accountName,
        recipientCode: data.data.recipient_code
      }
    });

    res.json({ success: true, recipientCode: data.data.recipient_code });
  } catch (err) {
    res.status(400).json({ message: err.response?.data?.message || 'Could not save bank details' });
  }
};

// POST /api/payouts/vouchers/:voucherId  (admin-triggered payout for a redeemed voucher)
exports.payoutVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findById(req.params.voucherId).populate('vendor');
    if (!voucher || !voucher.vendor) {
      return res.status(404).json({ message: 'Voucher or vendor not found' });
    }
    if (voucher.payoutStatus === 'paid') {
      return res.status(400).json({ message: 'Already paid out' });
    }
    if (!voucher.vendor.bankDetails?.recipientCode) {
      return res.status(400).json({ message: 'Vendor has not set up bank details' });
    }

    const amountKobo = Math.round(voucher.redeemedAmount * 100);

    const { data } = await paystack.post('/transfer', {
      source: 'balance',
      amount: amountKobo,
      recipient: voucher.vendor.bankDetails.recipientCode,
      reason: `Redemption payout for voucher ${voucher.code}`,
      reference: `payout-${voucher._id}-${Date.now()}`
    });

    voucher.payoutStatus = 'pending'; // webhook flips this to 'paid'
    voucher.transferCode = data.data.transfer_code;
    await voucher.save();

    res.json({ success: true, message: 'Payout initiated', data: data.data });
  } catch (err) {
    console.error('PAYOUT ERROR:', err.response?.data || err.message);
    res.status(400).json({ message: err.response?.data?.message || 'Payout failed' });
  }
};