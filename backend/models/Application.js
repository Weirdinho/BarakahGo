const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['zakat', 'sadaqah', 'sadaqah-jariyah', 'waqf', 'food', 'education', 'healthcare', 'general-fund']
  },
  amount: {
    type: Number,
    required: true,
    min: 100
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'fulfilled'],
    default: 'pending'
  },
  // Voucher generated when approved
  voucher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voucher',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);