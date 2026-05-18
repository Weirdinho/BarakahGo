const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

// 🔥 Crash handler (IMPORTANT)
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/auth');
const donationRoutes = require('./routes/donations');
const voucherRoutes = require('./routes/vouchers');
const vendorRoutes = require('./routes/vendors');
const adminRoutes = require('./routes/admin');

// Connect DB FIRST
connectDB();

const app = express();

// ======================
// Middleware
// ======================

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.options('*', cors());

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================
// Debug middleware
// ======================
app.use((req, res, next) => {
  console.log(`REQUEST: ${req.method} ${req.url}`);
  next();
});

// ======================
// Test route (FOR DEBUGGING)
// ======================
app.get('/test', (req, res) => {
  res.json({ message: 'server works' });
});

// ======================
// Routes
// ======================
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/admin', adminRoutes);

// ======================
// Health check
// ======================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// ======================
// 404 handler
// ======================
app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.method} ${req.url} not found`
  });
});

const allowedOrigins = [
  'http://localhost:3000',           // Local dev
  'https://barakahgo.onrender.com', // Backend itself (for health checks)
  process.env.FRONTEND_URL           // Will add frontend URL later
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
// ======================
// Error handler - MUST be last
// ======================
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);

  res.status(err.status || 500).json({
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ======================
// Start server
// ======================
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});