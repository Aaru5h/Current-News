require('dotenv').config();
const express = require('express');
const cors = require('cors');
const marketRoutes = require('./routes/market.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/market', marketRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Financial News Backend API is Running');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
