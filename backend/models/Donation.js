const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  message: {
    type: String
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'success'
  },
  paystackReference: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Donation', donationSchema);