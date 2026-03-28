const portfolioService = require('../services/portfolio.service');

/**
 * Get a user's complete portfolio with current prices.
 * @route GET /api/portfolio/:userId
 */
const getPortfolio = async (req, res, next) => {
  try {
    const portfolio = await portfolioService.getPortfolio(req.params.userId);
    res.status(200).json({
      success: true,
      data: portfolio,
      message: 'Portfolio retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add or update a holding in the user's portfolio.
 * @route POST /api/portfolio/:userId/holdings
 */
const addHolding = async (req, res, next) => {
  try {
    const result = await portfolioService.addHolding(req.params.userId, req.body);
    res.status(201).json({
      success: true,
      data: result.portfolio,
      message: 'Holding added/updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a specific holding's quantity or average price.
 * @route PUT /api/portfolio/:userId/holdings/:symbol
 */
const updateHolding = async (req, res, next) => {
  try {
    const result = await portfolioService.updateHolding(
      req.params.userId,
      req.params.symbol,
      req.body
    );
    res.status(200).json({
      success: true,
      data: result.portfolio,
      message: 'Holding updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove a holding from the user's portfolio.
 * @route DELETE /api/portfolio/:userId/holdings/:symbol
 */
const removeHolding = async (req, res, next) => {
  try {
    const result = await portfolioService.removeHolding(
      req.params.userId,
      req.params.symbol
    );
    res.status(200).json({
      success: true,
      data: result.portfolio,
      message: 'Holding removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Calculate portfolio value with profit/loss breakdown.
 * @route GET /api/portfolio/:userId/value
 */
const getPortfolioValue = async (req, res, next) => {
  try {
    const value = await portfolioService.calculatePortfolioValue(req.params.userId);
    res.status(200).json({
      success: true,
      data: value,
      message: 'Portfolio value calculated successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPortfolio,
  addHolding,
  updateHolding,
  removeHolding,
  getPortfolioValue,
};
