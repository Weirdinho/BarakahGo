const axios = require('axios');

const paystack = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
  }
});

// @desc    Initialize Paystack transaction
// @route   POST /api/payments/initialize
// @access  Public
const initializePayment = async (req, res) => {
  try {
    const { email, amount, metadata, callback_url } = req.body;

    // Validation
    if (!email || !amount) {
      return res.status(400).json({
        status: false,
        message: 'Email and amount are required'
      });
    }

    if (amount < 100) {
      return res.status(400).json({
        status: false,
        message: 'Minimum donation amount is ₦1 (100 kobo)'
      });
    }

    const response = await paystack.post('/transaction/initialize', {
      email,
      amount: Math.round(amount),
      metadata: {
        ...metadata,
        custom_fields: [
          ...(metadata?.custom_fields || []),
          {
            display_name: "Platform",
            variable_name: "platform",
            value: "Amanah and Ikhlas Charitable Initiative"
          }
        ]
      },
      callback_url: callback_url || `${process.env.FRONTEND_URL}/donate/verify`
    });

    res.status(200).json({
      status: true,
      message: 'Payment initialized successfully',
      data: response.data.data
    });

  } catch (error) {
    console.error('Initialize Payment Error:', error.response?.data || error.message);
    res.status(500).json({
      status: false,
      message: error.response?.data?.message || 'Failed to initialize payment'
    });
  }
};

// @desc    Verify Paystack transaction
// @route   GET /api/payments/verify/:reference
// @access  Public
const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await paystack.get(`/transaction/verify/${reference}`);
    const { data } = response.data;

    if (data.status === 'success') {
      // TODO: Save to your database here
      const donationRecord = {
        reference: data.reference,
        amount: data.amount / 100,
        email: data.customer.email,
        status: data.status,
        paidAt: data.paid_at,
        channel: data.channel,
        metadata: data.metadata
      };
      console.log('Donation successful:', donationRecord);

      return res.status(200).json({
        status: true,
        message: 'Payment verified successfully',
        data: {
          reference: data.reference,
          amount: data.amount / 100,
          currency: data.currency,
          status: data.status,
          paidAt: data.paid_at,
          channel: data.channel,
          receiptUrl: data.receipt_url
        }
      });
    }

    res.status(400).json({
      status: false,
      message: 'Payment not successful',
      data: { status: data.status }
    });

  } catch (error) {
    console.error('Verify Payment Error:', error.response?.data || error.message);
    res.status(500).json({
      status: false,
      message: error.response?.data?.message || 'Failed to verify payment'
    });
  }
};

module.exports = {
  initializePayment,
  verifyPayment
};