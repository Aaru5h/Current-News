const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolio.controller');
const { validateUserId, validateSymbol, validatePortfolioHolding } = require('../middleware/validation');

// GET /api/portfolio/:userId — Full portfolio with current prices
router.get('/:userId', validateUserId, portfolioController.getPortfolio);

// GET /api/portfolio/:userId/value — Portfolio value + P/L breakdown
router.get('/:userId/value', validateUserId, portfolioController.getPortfolioValue);

// POST /api/portfolio/:userId/holdings — Add/update holding
router.post('/:userId/holdings', validateUserId, validatePortfolioHolding, portfolioController.addHolding);

// PUT /api/portfolio/:userId/holdings/:symbol — Update holding
router.put('/:userId/holdings/:symbol', validateUserId, validateSymbol, portfolioController.updateHolding);

// DELETE /api/portfolio/:userId/holdings/:symbol — Remove holding
router.delete('/:userId/holdings/:symbol', validateUserId, validateSymbol, portfolioController.removeHolding);

module.exports = router;
