const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const { startReminderJobs } = require('./services/reminderService');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ==================== MIDDLEWARE ====================

// Enable CORS for all routes
app.use(cors({
  origin: '*', // In production, replace with your frontend URL
  credentials: true
}));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Request logging middleware (for development)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// ==================== ROUTES ====================

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎓 CampusConnect Event Management API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile (requires token)'
      },
      events: {
        create: 'POST /api/events (requires token)',
        getAll: 'GET /api/events (requires token)',
        getById: 'GET /api/events/:id (requires token)',
        update: 'PUT /api/events/:id (requires token)',
        delete: 'DELETE /api/events/:id (requires token)',
        rsvp: 'POST /api/events/:id/rsvp (requires token)',
        cancelRsvp: 'DELETE /api/events/:id/rsvp (requires token)'
      },
      notifications: {
        getAll: 'GET /api/notifications (requires token)',
        markRead: 'PUT /api/notifications/:id/read (requires token)',
        markAllRead: 'PUT /api/notifications/read-all (requires token)',
        delete: 'DELETE /api/notifications/:id (requires token)'
      }
    }
  });
});

// Health check endpoint for frontend warmup
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// 404 Handler - Route not found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, HOST, () => {
    console.log('🚀 ==========================================');
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`🚀 Server started on port ${PORT}`);
    console.log(`🚀 API URL: http://localhost:${PORT}`);
    console.log(`🚀 Network URL: http://192.168.29.217:${PORT}`);
    console.log('🚀 ==========================================');
    
    // Start automated reminder cron jobs
    startReminderJobs();
  });
}).catch((error) => {
  console.error('Failed to connect to MongoDB:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  console.error(err.stack);
  // Don't exit in development
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  // Don't exit in development
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
});
