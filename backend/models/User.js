const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['donor', 'beneficiary', 'corporate', 'admin'],
    default: 'donor'
  },
  companyName: {
    type: String,
    trim: true
  },
  totalDonated: {
    type: Number,
    default: 0
  },
  // Email verification fields
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  },
  verificationTokenExpiry: {
    type: Date
  },
  // Password reset fields
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpiry: {
    type: Date
  }
}, {
  timestamps: true
});

// Compare password method — plain text comparison
userSchema.methods.comparePassword = async function(candidatePassword) {
  return this.password === candidatePassword;
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.verificationToken;
  delete user.verificationTokenExpiry;
  delete user.resetPasswordToken;
  delete user.resetPasswordExpiry;
  return user;
};

module.exports = mongoose.model('User', userSchema);