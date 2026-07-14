const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/auth');
const donationRoutes = require('./routes/donations');
const voucherRoutes = require('./routes/vouchers');
const adminRoutes = require('./routes/admin');
const contactRoutes = require('./routes/contact');
const paymentRoutes = require('./routes/payments');
const payoutRoutes = require('./routes/payout');
const webhookRoutes = require('./routes/webhook');


connectDB();

const app = express();

// CORS
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.options('*', cors());

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/webhooks', webhookRoutes);

// Root check
app.get('/', (req, res) => {
  res.json({ status: 'Amanah and Ikhlas Initiative API', message: 'Backend is running' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API 404 handler
app.use('/api', (req, res) => {
  res.status(404).json({ message: `API route ${req.method} ${req.url} not found` });
});

// Catch-all 404 for any other non-API route
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));