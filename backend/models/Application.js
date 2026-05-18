const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['food', 'education', 'healthcare', 'financial', 'general'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 100
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  documents: [{
    type: String // URLs to uploaded documents
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'fulfilled'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  },
  voucher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voucher'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Application', applicationSchema);