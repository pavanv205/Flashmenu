const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();

// Middleware to ensure DB connection on serverless cold starts
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    // Continue even if DB connection fails (fallback handlers handle getIsConnected)
  }
  next();
});

// Security middleware
app.use(helmet({ crossOriginResourcePolicy: false }));

// Enable CORS for frontend Vite app
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting for auth and public APIs
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'FlashMenu API', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[FlashMenu Server Error]', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
