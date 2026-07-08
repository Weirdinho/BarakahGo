// controllers/webhookController.js
const crypto = require('crypto');
const Voucher = require('../models/Voucher');

exports.paystackWebhook = async (req, res) => {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.sendStatus(401); // reject anything not actually from Paystack
  }

  const event = req.body;

  if (event.event === 'transfer.success') {
    await Voucher.findOneAndUpdate(
      { transferCode: event.data.transfer_code },
      { payoutStatus: 'paid' }
    );
  } else if (event.event === 'transfer.failed' || event.event === 'transfer.reversed') {
    await Voucher.findOneAndUpdate(
      { transferCode: event.data.transfer_code },
      { payoutStatus: 'failed' }
    );
  }

  res.sendStatus(200);
};