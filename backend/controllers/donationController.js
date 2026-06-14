const Donation = require('../models/Donation');
const axios = require('axios');


// @desc    Get logged-in user's donations
// @route   GET /api/donations
exports.getMyDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      status: true,
      data: donations
    });
  } catch (error) {
    console.error('GET DONATIONS ERROR:', error);
    res.status(500).json({ message: 'Failed to fetch donations' });
  }
};
// @desc    Initialize payment
// @route   POST /api/donations/initialize
exports.initializePayment = async (req, res) => {
  try {
    const { amount, category, message, isAnonymous, callback_url } = req.body;

    const donation = new Donation({
      donor: req.user.id,
      amount,
      category,
      message,
      isAnonymous
    });

    await donation.save();

    // Initialize Paystack transaction
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email: req.user.email,
        amount: amount * 100,
        callback_url: callback_url || `${process.env.FRONTEND_URL}/donate/verify`,
        metadata: {
          donation_id: donation._id.toString(),
          custom_fields: [
            { display_name: "Donation Category", variable_name: "category", value: category }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    donation.paystackReference = response.data.data.reference;
    await donation.save();

    res.json({
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference
    });
  } catch (error) {
    console.error('INITIALIZE PAYMENT ERROR:', error);
    res.status(500).json({ message: 'Failed to initialize payment' });
  }
};

// @desc    Verify payment
// @route   GET /api/donations/verify/:reference
exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const { status, metadata } = response.data.data;

    if (status === 'success') {
      const donation = await Donation.findOne({ paystackReference: reference });
      if (donation) {
        donation.status = 'success';
        await donation.save();

        // Update donor's total donated
        await User.findByIdAndUpdate(donation.donor, {
          $inc: { totalDonated: donation.amount }
        });
      }

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      await Donation.findOneAndUpdate(
        { paystackReference: reference },
        { status: 'failed' }
      );
      res.json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    console.error('VERIFY PAYMENT ERROR:', error);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
};