const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

// POST /api/ai/analyze — Analyze market data via RAG service
router.post('/analyze', aiController.analyzeMarket);

// GET /api/ai/signals — Get paginated AI signals (?page, ?limit, ?recommendation)
router.get('/signals', aiController.getSignals);

// GET /api/ai/signals/:token — Get signals for a specific token
router.get('/signals/:token', aiController.getSignalsByToken);

// POST /api/ai/news-sentiment — Analyze news sentiment via RAG service
router.post('/news-sentiment', aiController.analyzeNewsSentiment);

module.exports = router;
