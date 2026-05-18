const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 100
  },
  currency: {
    type: String,
    default: 'NGN'
  },
  category: {
    type: String,
    enum: ['food', 'education', 'healthcare', 'financial', 'general'],
    default: 'general'
  },
  paystackReference: {
    type: String,
    required: true
  },
  paystackTransactionId: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'pending'
  },
  voucherValue: {
    type: Number
  },
  beneficiariesCount: {
    type: Number,
    default: 1
  },
  message: {
    type: String,
    trim: true
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: Object
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Donation', donationSchema);