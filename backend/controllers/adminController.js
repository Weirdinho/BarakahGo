const Application = require('../models/Application');
const Voucher = require('../models/Voucher');
const User = require('../models/User');
const Donation = require('../models/Donation');
const crypto = require('crypto');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDonations = await Donation.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const totalVouchers = await Voucher.countDocuments();
    const activeVouchers = await Voucher.countDocuments({ status: 'active' });
    const redeemedVouchers = await Voucher.countDocuments({ status: 'redeemed' });

    res.json({
      totalUsers,
      totalAmount: totalDonations[0]?.total || 0,
      pendingApplications,
      totalVouchers,
      activeVouchers,
      redeemedVouchers
    });
  } catch (error) {
    console.error('GET STATS ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    console.log('🔍 req.user from auth middleware:', req.user);
    
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    console.log('👥 Users found:', users.length);
    
    res.json(users);
  } catch (error) {
    console.error('❌ GET USERS ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all donations
// @route   GET /api/admin/donations
exports.getDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'name email')
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error('GET DONATIONS ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all applications
// @route   GET /api/admin/applications
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('applicant', 'name email phone')
      .populate('voucher', 'code amount status')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error('GET APPLICATIONS ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve/reject application and generate voucher
// @route   PUT /api/admin/applications/:id
exports.updateApplication = async (req, res) => {
  try {
    const { status } = req.body;
    console.log('📋 Updating application:', req.params.id, 'to status:', status);

    const application = await Application.findById(req.params.id);

    if (!application) {
      console.log('❌ Application not found');
      return res.status(404).json({ message: 'Application not found' });
    }

    console.log('✅ Application found:', application._id);

    // If approving, generate voucher
    if (status === 'approved' && application.status !== 'approved') {
      console.log('🎫 Generating voucher for amount:', application.amount);

      try {
        const random = crypto.randomBytes(4).toString('hex').toUpperCase();
        const code = `AMN-${application.category.substring(0, 3).toUpperCase()}-${random}`;

        const voucher = new Voucher({
          code: code,
          amount: application.amount,
          category: application.category,
          beneficiary: application.applicant,
          application: application._id
        });

        console.log('📝 Voucher object created with code:', code);

        await voucher.save();
        console.log('✅ Voucher saved:', voucher.code);

        application.voucher = voucher._id;
      } catch (voucherError) {
        console.error('❌ VOUCHER CREATION ERROR:', voucherError.message);
        console.error(voucherError.stack);
        return res.status(500).json({ 
          message: 'Failed to create voucher', 
          error: voucherError.message 
        });
      }
    }

    application.status = status;
    await application.save();
    console.log('✅ Application updated to:', status);

    // Populate and return updated application
    const updatedApp = await Application.findById(application._id)
      .populate('applicant', 'name email phone')
      .populate('voucher', 'code amount status');

    // Send email notification if SendGrid is configured
    if (process.env.SENDGRID_API_KEY && status === 'approved' && updatedApp.voucher) {
      try {
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        const applicant = await User.findById(application.applicant);
        
        if (applicant && applicant.email) {
          const msg = {
            to: applicant.email,
            from: process.env.EMAIL_FROM || 'hello@AmanahCharityFoundation.com',
            subject: 'Aid Application Approved - Amanah and Ikhlas Initiative',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #1a5f2a; padding: 20px; text-align: center;">
                  <h1 style="color: #fff; margin: 0;">Amanah and Ikhlas Initiative</h1>
                </div>
                <div style="padding: 30px; background: #f9f9f9;">
                  <h2 style="color: #2d3436;">Application Approved! 🎉</h2>
                  <p style="color: #636e72; line-height: 1.6;">
                    Hello ${applicant.name || 'there'},
                  </p>
                  <p style="color: #636e72; line-height: 1.6;">
                    Your aid application has been <strong>approved</strong>. Your voucher details are below:
                  </p>
                  <div style="background: #e8f5e9; border: 2px dashed #1a5f2a; padding: 20px; text-align: center; margin: 25px 0; border-radius: 10px;">
                    <p style="margin: 0 0 8px 0; color: #636e72; font-size: 0.9rem;">Voucher Code</p>
                    <p style="font-size: 1.6rem; font-weight: 800; color: #1a5f2a; margin: 0; letter-spacing: 3px; font-family: monospace;">
                      ${updatedApp.voucher.code}
                    </p>
                    <p style="margin: 8px 0 0 0; color: #1a5f2a; font-weight: 600;">
                      Amount: ₦${updatedApp.voucher.amount.toLocaleString()}
                    </p>
                  </div>
                  <p style="color: #636e72; line-height: 1.6;">
                    Present this code to any authorized vendor to redeem your aid. The voucher is valid until fully redeemed.
                  </p>
                  <hr style="border: none; border-top: 1px solid #dfe6e9; margin: 30px 0;">
                  <p style="color: #b2bec3; font-size: 0.85rem; text-align: center;">
                    Amanah and Ikhlas Initiative<br>
                    Making a difference, one donation at a time.
                  </p>
                </div>
              </div>
            `
          };
          await sgMail.send(msg);
          console.log('✅ Approval email sent to:', applicant.email);
        }
      } catch (emailErr) {
        console.error('❌ Failed to send approval email:', emailErr.message);
        // Don't fail the request if email fails
      }
    }

    res.json(updatedApp);
  } catch (error) {
    console.error('❌ UPDATE APPLICATION ERROR:', error.message);
    console.error(error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all vouchers
// @route   GET /api/admin/vouchers
exports.getVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find()
      .populate('beneficiary', 'name email')
      .populate('application', 'category reason')
      .populate('vendor', 'name')
      .sort({ createdAt: -1 });
    res.json(vouchers);
  } catch (error) {
    console.error('GET VOUCHERS ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get pending vendor approvals
// @route   GET /api/admin/vendors/pending
exports.getPendingVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor', isApproved: false })
      .select('-password');
    res.json(vendors);
  } catch (error) {
    console.error('GET PENDING VENDORS ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve vendor
// @route   PUT /api/admin/vendors/:id/approve
exports.approveVendor = async (req, res) => {
  try {
    const vendor = await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).select('-password');

    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.json({ message: 'Vendor approved successfully', vendor });
  } catch (error) {
    console.error('APPROVE VENDOR ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('DELETE USER ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Role updated successfully', user });
  } catch (error) {
    console.error('UPDATE ROLE ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};