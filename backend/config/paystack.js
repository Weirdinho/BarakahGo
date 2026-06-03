// config/paystack.js
const axios = require('axios');

const paystack = axios.create({
  baseURL: 'https://api.paystack.co',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
  }
});

module.exports = paystack;