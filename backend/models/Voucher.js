const mongoose = require('mongoose');
const crypto = require('crypto');

const voucherSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'redeemed', 'expired', 'cancelled'],
    default: 'active'
  },
  redeemedAmount: {
    type: Number,
    default: 0
  },
  redeemedAt: {
    type: Date
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate code BEFORE validation (using pre validate instead of pre save)
voucherSchema.pre('validate', function(next) {
  if (!this.code && this.category) {
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    this.code = `AMN-${this.category.substring(0, 3).toUpperCase()}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Voucher', voucherSchema);