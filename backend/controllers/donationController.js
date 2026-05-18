const axios = require('axios');
const { validationResult } = require('express-validator');
const Donation = require('../models/Donation');
const Voucher = require('../models/Voucher');
const User = require('../models/User');
const Application = require('../models/Application');

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

const generateVouchers = async (donation) => {
  const voucherCount = donation.beneficiariesCount;
  const voucherAmount = Math.floor(donation.amount / voucherCount);
  const vouchers = [];

  for (let i = 0; i < voucherCount; i++) {
    const code = `GBK-${donation.category.toUpperCase().substr(0, 3)}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    const voucher = new Voucher({
      code,
      donation: donation._id,
      amount: voucherAmount,
      category: donation.category
    });

    await voucher.save();
    vouchers.push(voucher);
  }

  return vouchers;
};

exports.initializePayment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { amount, category, message, isAnonymous, beneficiariesCount } = req.body;
    const user = req.user;

    const reference = `GBK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email: user.email,
        amount: amount * 100,
        reference,
        callback_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/donate/verify`,
        metadata: {
          custom_fields: [
            { display_name: "Donor Name", variable_name: "donor_name", value: user.name },
            { display_name: "Category", variable_name: "category", value: category },
            { display_name: "Beneficiaries", variable_name: "beneficiaries", value: beneficiariesCount || 1 }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const donation = new Donation({
      donor: user._id,
      amount: parseFloat(amount),
      category,
      paystackReference: reference,
      status: 'pending',
      message,
      isAnonymous: isAnonymous || false,
      beneficiariesCount: beneficiariesCount || 1,
      metadata: response.data.data
    });

    await donation.save();

    res.json({
      authorization_url: response.data.data.authorization_url,
      reference,
      donation: donation._id
    });
  } catch (error) {
    console.error('Paystack initialization error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Payment initialization failed', error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const { status, data } = response.data;

    if (status && data.status === 'success') {
      const donation = await Donation.findOneAndUpdate(
        { paystackReference: reference },
        {
          status: 'success',
          paystackTransactionId: data.id.toString(),
          metadata: data
        },
        { new: true }
      );

      await User.findByIdAndUpdate(donation.donor, {
        $inc: { totalDonated: donation.amount }
      });

      const vouchers = await generateVouchers(donation);

      res.json({
        success: true,
        donation,
        vouchers
      });
    } else {
      await Donation.findOneAndUpdate(
        { paystackReference: reference },
        { status: 'failed' }
      );
      res.json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Verification error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Verification failed' });
  }
};

exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .sort({ createdAt: -1 })
      .populate('donor', 'name email');
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    const donations = await Donation.find()
      .sort({ createdAt: -1 })
      .populate('donor', 'name email');
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Submit aid application (beneficiary)
// @route   POST /api/donations/apply
exports.applyForAid = async (req, res) => {
  try {
    const { category, amount, reason } = req.body;
    
    const application = new Application({
      applicant: req.user.id,
      category,
      amount,
      reason
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get my applications (beneficiary)
// @route   GET /api/donations/applications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};