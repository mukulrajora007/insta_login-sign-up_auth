const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const { isConfigured } = require('./config/supabase');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for development
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Instagram Auth API',
    supabaseConnected: isConfigured,
    time: new Date().toISOString(),
    demoAccount: !isConfigured ? { username: 'demo_user', password: 'Password123' } : null,
  });
});

// API Routes
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Instagram Auth Server running on http://localhost:${PORT}`);
    console.log(`📡 Healthcheck available at: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Supabase Database Status: ${isConfigured ? '🟢 Connected' : '🟡 Dev Fallback Mode'}\n`);
  });
}

// Export for Vercel / serverless deployment
module.exports = app;
