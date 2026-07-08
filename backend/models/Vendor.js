const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: { type: String, default: 'Nigeria' },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  categories: [{
    type: String,
    enum: ['zakat', 'sadaqah', 'waqf', 'food-aid', 'education', 'healthcare', 'general-fund']
  }],
  isApproved: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRedemptions: {
    type: Number,
    default: 0
  },
  logo: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bankDetails: {
  accountNumber: String,
  bankCode: String,
  accountName: String,
  recipientCode: String // Paystack recipient_code, set once verified
}
});

module.exports = mongoose.model('Vendor', vendorSchema);