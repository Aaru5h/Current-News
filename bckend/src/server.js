import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import marketRoutes from './routes/market.routes.js';
import newsRoutes from './routes/news.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/market', marketRoutes);
app.use('/api/news', newsRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Financial News Backend API is Running');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
