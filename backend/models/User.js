const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['donor', 'beneficiary', 'vendor', 'admin', 'corporate'],
    default: 'donor'
  },
  companyName: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: ''
  },
  totalDonated: {
    type: Number,
    default: 0
  },
  vouchersReceived: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voucher'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compare password method - plain text comparison (NOT for production)
userSchema.methods.comparePassword = async function(candidatePassword) {
  return this.password === candidatePassword;
};

module.exports = mongoose.model('User', userSchema);