const Application = require('../models/Application');
const Voucher = require('../models/Voucher');
const User = require('../models/User');

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

// @desc    Approve application and generate voucher
// @route   PUT /api/admin/applications/:id
exports.updateApplication = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // If approving, generate voucher
    if (status === 'approved' && application.status !== 'approved') {
      const voucher = new Voucher({
        amount: application.amount,
        category: application.category,
        beneficiary: application.applicant,
        application: application._id
      });

      await voucher.save();
      application.voucher = voucher._id;
    }

    application.status = status;
    await application.save();

    // Populate and return updated application
    const updatedApp = await Application.findById(application._id)
      .populate('applicant', 'name email phone')
      .populate('voucher', 'code amount status');

    // Send email notification if SendGrid is configured
    if (process.env.SENDGRID_API_KEY && status === 'approved') {
      try {
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        const applicant = await User.findById(application.applicant);
        
        const msg = {
          to: applicant.email,
          from: process.env.EMAIL_FROM || 'hello@AmanahCharityFoundation.com',
          subject: 'Aid Application Approved - Amanah Charity Foundation',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #1a5f2a; padding: 20px; text-align: center;">
                <h1 style="color: #fff; margin: 0;">Amanah Charity Foundation</h1>
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
                  Amanah Charity Foundation<br>
                  Making a difference, one donation at a time.
                </p>
              </div>
            </div>
          `
        };
        await sgMail.send(msg);
        console.log('✅ Approval email sent to:', applicant.email);
      } catch (emailErr) {
        console.error('❌ Failed to send approval email:', emailErr.message);
      }
    }

    res.json(updatedApp);
  } catch (error) {
    console.error('UPDATE APPLICATION ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Reject application
// @route   PUT /api/admin/applications/:id/reject
exports.rejectApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = 'rejected';
    await application.save();

    res.json({ message: 'Application rejected' });
  } catch (error) {
    console.error('REJECT APPLICATION ERROR:', error);
    res.status(500).json({ message: 'Server error' });
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