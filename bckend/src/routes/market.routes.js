const express = require('express');
const router = express.Router();
const marketController = require('../controllers/market.controller');
const { validateSymbol, validateUserId, validatePortfolioHolding } = require('../middleware/validation');

// --- Market Data Endpoints ---

// GET /api/market/macro — US macroeconomic data (FRED)
router.get('/macro', marketController.getUSMacro);

// GET /api/market/company/:cik — SEC company filings
router.get('/company/:cik', marketController.getCompanyData);

// POST /api/market/data/refresh — Refresh market data from RAG service
router.post('/data/refresh', marketController.refreshMarketData);

// GET /api/market/data/:symbol — Current market data
router.get('/data/:symbol', validateSymbol, marketController.getMarketData);

// GET /api/market/data/:symbol/historical — Historical data with date range
router.get('/data/:symbol/historical', validateSymbol, marketController.getHistoricalData);

// --- Portfolio Endpoints (delegated to portfolio controller) ---

// GET /api/market/portfolio/:userId — User's portfolio
router.get('/portfolio/:userId', validateUserId, marketController.getPortfolio);

// POST /api/market/portfolio/:userId/holdings — Add holding
router.post('/portfolio/:userId/holdings', validateUserId, validatePortfolioHolding, marketController.addPortfolioHolding);

// DELETE /api/market/portfolio/:userId/holdings/:symbol — Remove holding
router.delete('/portfolio/:userId/holdings/:symbol', validateUserId, validateSymbol, marketController.removePortfolioHolding);

// GET /api/market/portfolio/:userId/value — Portfolio value
router.get('/portfolio/:userId/value', validateUserId, marketController.getPortfolioValue);

module.exports = router;
