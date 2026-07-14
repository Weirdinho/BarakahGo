const axios = require('axios');
const Voucher = require('../models/Voucher');

const paystack = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
});

// GET /api/payouts/banks
exports.listBanks = async (req, res) => {
  try {
    const { data } = await paystack.get('/bank?country=nigeria');
    res.json(data.data);
  } catch (error) {
    res.status(500).json({ message: 'Could not load banks' });
  }
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

// GET /api/payouts  (admin — monitoring only, no action)
exports.listPayouts = async (req, res) => {
  try {
    const vouchers = await Voucher.find({ redeemedAmount: { $gt: 0 } })
      .populate('beneficiary', 'name email')
      .sort({ redeemedAt: -1, createdAt: -1 });
    res.json(vouchers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};