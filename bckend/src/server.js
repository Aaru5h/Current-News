require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Security & logging middleware
app.use(helmet());
app.use(morgan('combined'));

// Body parsing middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const marketRoutes = require('./routes/market.routes');
const newsRoutes = require('./routes/news.routes');
const portfolioRoutes = require('./routes/portfolio.routes');
const aiRoutes = require('./routes/ai.routes');

app.use('/api/market', marketRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'OK',
      database: 'Connected',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    message: 'Server is healthy',
  });
});

// 404 handler — must be after all routes
app.use(notFoundHandler);

// Centralized error handler — must be last middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;