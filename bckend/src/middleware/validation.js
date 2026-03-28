const mongoose = require('mongoose');

/**
 * Validate that a route param is a valid MongoDB ObjectId.
 * @param {string} paramName - The route parameter name to validate
 * @returns {import('express').RequestHandler} Express middleware
 */
const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const value = req.params[paramName];
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID',
        details: `"${paramName}" must be a valid MongoDB ObjectId`,
      });
    }
    next();
  };
};

/**
 * Alias for validateObjectId('userId') — validates userId route param.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const validateUserId = (req, res, next) => {
  return validateObjectId('userId')(req, res, next);
};

/**
 * Validate that a route param is a non-empty string (for symbol params).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const validateSymbol = (req, res, next) => {
  const { symbol } = req.params;
  if (!symbol || typeof symbol !== 'string' || symbol.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid symbol',
      details: 'Symbol must be a non-empty string',
    });
  }
  // Normalize symbol to uppercase
  req.params.symbol = symbol.trim().toUpperCase();
  next();
};

/**
 * Validate portfolio holding data in request body.
 * Requires: symbol (string), quantity (positive number).
 * Optional: averagePrice (non-negative number).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const validatePortfolioHolding = (req, res, next) => {
  const { symbol, quantity, averagePrice } = req.body;
  const errors = [];

  if (!symbol || typeof symbol !== 'string' || symbol.trim().length === 0) {
    errors.push('symbol is required and must be a non-empty string');
  }

  if (quantity === undefined || quantity === null || typeof quantity !== 'number' || quantity <= 0) {
    errors.push('quantity is required and must be a positive number');
  }

  if (averagePrice !== undefined && (typeof averagePrice !== 'number' || averagePrice < 0)) {
    errors.push('averagePrice must be a non-negative number');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errors.join('; '),
    });
  }

  // Normalize symbol
  req.body.symbol = symbol.trim().toUpperCase();
  next();
};

module.exports = {
  validateObjectId,
  validateUserId,
  validateSymbol,
  validatePortfolioHolding,
};
