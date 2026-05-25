const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

// Crash handler
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
const contactRoutes = require('./routes/contact');

// Connect DB
connectDB();

const app = express();

// ======================
// CORS - ALLOW ALL ORIGINS FOR NOW (FIX FOR RENDER)
// ======================
app.use(cors({
  origin: true, // Reflects the request origin - allows all
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight for ALL routes
app.options('*', cors());

// ======================
// Middleware
// ======================
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`REQUEST: ${req.method} ${req.url} from ${req.headers.origin}`);
  next();
});

// ======================
// Test route
// ======================
app.get('/test', (req, res) => {
  res.json({ message: 'server works' });
});

// ======================
// API Routes
// ======================
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/vouchers', voucherRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

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

// ======================
// Error handler
// ======================
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Server Error'
  });
});

// Use Render's PORT
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});