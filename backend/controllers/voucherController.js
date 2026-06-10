const Voucher = require('../models/Voucher');

// @desc    Get beneficiary's vouchers
// @route   GET /api/vouchers
exports.getMyVouchers = async (req, res) => {
  try {
    const vouchers = await Voucher.find({ beneficiary: req.user.id })
      .populate('application', 'category reason')
      .sort({ createdAt: -1 });
    res.json(vouchers);
  } catch (error) {
    console.error('GET MY VOUCHERS ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Lookup voucher by code (for vendor)
// @route   GET /api/vouchers/:code
exports.lookupVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.findOne({ code: req.params.code.toUpperCase() })
      .populate('beneficiary', 'name email phone')
      .populate('application', 'category');

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    if (voucher.status === 'redeemed') {
      return res.status(400).json({ message: 'Voucher has been fully redeemed' });
    }

    if (voucher.status === 'expired') {
      return res.status(400).json({ message: 'Voucher has expired' });
    }

    res.json(voucher);
  } catch (error) {
    console.error('LOOKUP VOUCHER ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Redeem voucher (vendor only)
// @route   POST /api/vouchers/:code/redeem
exports.redeemVoucher = async (req, res) => {
  try {
    const { amount } = req.body;
    const voucher = await Voucher.findOne({ code: req.params.code.toUpperCase() });

    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    if (voucher.status === 'redeemed') {
      return res.status(400).json({ message: 'Voucher already fully redeemed' });
    }

    const remaining = voucher.amount - voucher.redeemedAmount;
    if (amount > remaining) {
      return res.status(400).json({ 
        message: `Only ₦${remaining.toLocaleString()} remaining on this voucher` 
      });
    }

    voucher.redeemedAmount += parseFloat(amount);
    voucher.vendor = req.user.id;

    if (voucher.redeemedAmount >= voucher.amount) {
      voucher.status = 'redeemed';
      voucher.redeemedAt = new Date();
    }

    await voucher.save();

    res.json({ 
      message: 'Voucher redeemed successfully',
      remaining: voucher.amount - voucher.redeemedAmount
    });
  } catch (error) {
    console.error('REDEEM VOUCHER ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get vendor's redemptions
// @route   GET /api/vendors/redemptions
exports.getVendorRedemptions = async (req, res) => {
  try {
    const redemptions = await Voucher.find({ 
      vendor: req.user.id,
      status: 'redeemed'
    })
    .populate('beneficiary', 'name')
    .sort({ redeemedAt: -1 });

    res.json(redemptions);
  } catch (error) {
    console.error('GET VENDOR REDEMPTIONS ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
// @desc    Auto-redeem voucher by beneficiary sending to vendor
// @route   POST /api/vouchers/auto-redeem
exports.autoRedeem = async (req, res) => {
  try {
    const { voucherCode, vendorEmail, amount } = req.body;

    // Find vendor by email
    const vendor = await User.findOne({ email: vendorEmail, role: 'vendor', isApproved: true });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found or not approved' });
    }

    // Find voucher
    const voucher = await Voucher.findOne({ code: voucherCode.toUpperCase() });
    if (!voucher) {
      return res.status(404).json({ message: 'Voucher not found' });
    }

    // Verify beneficiary owns this voucher
    if (voucher.beneficiary.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You do not own this voucher' });
    }

    if (voucher.status === 'redeemed') {
      return res.status(400).json({ message: 'Voucher has been fully redeemed' });
    }

    const redeemAmount = parseFloat(amount);
    const remaining = voucher.amount - voucher.redeemedAmount;

    if (redeemAmount > remaining) {
      return res.status(400).json({ 
        message: `Only ₦${remaining.toLocaleString()} remaining on this voucher` 
      });
    }

    // Process redemption
    voucher.redeemedAmount += redeemAmount;
    voucher.vendor = vendor._id;

    if (voucher.redeemedAmount >= voucher.amount) {
      voucher.status = 'redeemed';
      voucher.redeemedAt = new Date();
    }

    await voucher.save();

    // Send email to vendor
    if (process.env.SENDGRID_API_KEY) {
      try {
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        
        const msg = {
          to: vendor.email,
          from: process.env.EMAIL_FROM || 'hello@AmanahCharityFoundation.com',
          subject: 'Voucher Redemption - Amanah Charity Foundation',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #1a5f2a; padding: 20px; text-align: center;">
                <h1 style="color: #fff; margin: 0;">Amanah Charity Foundation</h1>
              </div>
              <div style="padding: 30px; background: #f9f9f9;">
                <h2 style="color: #2d3436;">New Voucher Redemption</h2>
                <p style="color: #636e72; line-height: 1.6;">
                  Hello ${vendor.name || 'there'},
                </p>
                <p style="color: #636e72; line-height: 1.6;">
                  A beneficiary has sent you a voucher for redemption:
                </p>
                <div style="background: #e8f5e9; border: 2px dashed #1a5f2a; padding: 20px; text-align: center; margin: 25px 0; border-radius: 10px;">
                  <p style="margin: 0 0 8px 0; color: #636e72; font-size: 0.9rem;">Voucher Code</p>
                  <p style="font-size: 1.6rem; font-weight: 800; color: #1a5f2a; margin: 0; letter-spacing: 3px; font-family: monospace;">
                    ${voucher.code}
                  </p>
                  <p style="margin: 8px 0 0 0; color: #1a5f2a; font-weight: 600;">
                    Redeemed Amount: ₦${redeemAmount.toLocaleString()}
                  </p>
                </div>
                <p style="color: #636e72; line-height: 1.6;">
                  Please log in to your vendor portal to confirm and process this redemption.
                </p>
                <hr style="border: none; border-top: 1px solid #dfe6e9; margin: 30px 0;">
                <p style="color: #b2bec3; font-size: 0.85rem; text-align: center;">
                  Amanah Charity Foundation
                </p>
              </div>
            </div>
          `
        };
        await sgMail.send(msg);
      } catch (emailErr) {
        console.error('Failed to send vendor email:', emailErr.message);
      }
    }

    res.json({ 
      success: true,
      message: `Voucher redeemed successfully! ₦${redeemAmount.toLocaleString()} sent to ${vendor.name || vendorEmail}`,
      remaining: voucher.amount - voucher.redeemedAmount
    });
  } catch (error) {
    console.error('AUTO REDEEM ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};