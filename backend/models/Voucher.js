const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation',
    required: true
  },
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['zakat', 'sadaqah', 'waqf', 'food-aid', 'education', 'healthcare', 'general-fund'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'redeemed', 'expired', 'cancelled'],
    default: 'active'
  },
  redeemedAt: {
    type: Date
  },
  redeemedAmount: {
    type: Number,
    default: 0
  },
  expiryDate: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days
    }
  },
  qrCode: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Voucher', voucherSchema);