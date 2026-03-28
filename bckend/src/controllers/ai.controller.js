const aiService = require('../services/ai.service');

/**
 * Analyze market data using the RAG service and save results.
 * @route POST /api/ai/analyze
 */
const analyzeMarket = async (req, res, next) => {
  try {
    const { token, price, volume, indicators, confidence } = req.body;

    // Strict input validation
    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: 'token is required and must be a non-empty string',
      });
    }

    const errors = [];
    if (price !== undefined && (typeof price !== 'number' || isNaN(price))) {
      errors.push('price must be a valid number');
    }
    if (volume !== undefined && (typeof volume !== 'number' || isNaN(volume))) {
      errors.push('volume must be a valid number');
    }
    if (confidence !== undefined && (typeof confidence !== 'number' || confidence < 0 || confidence > 1)) {
      errors.push('confidence must be a number between 0 and 1');
    }
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: errors.join('; '),
      });
    }

    const result = await aiService.analyzeMarket({
      token: token.trim().toUpperCase(),
      price,
      volume,
      indicators,
      confidence,
    });

    res.status(201).json({
      success: true,
      data: result,
      message: 'Market analysis completed and saved',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get paginated AI signals with optional recommendation filter.
 * @route GET /api/ai/signals
 */
const getSignals = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, recommendation } = req.query;
    const result = await aiService.getSignals({ page, limit, recommendation });

    res.status(200).json({
      success: true,
      data: result.signals,
      message: 'AI signals retrieved successfully',
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all AI signals for a specific token.
 * @route GET /api/ai/signals/:token
 */
const getSignalsByToken = async (req, res, next) => {
  try {
    const signals = await aiService.getSignalsByToken(req.params.token);

    res.status(200).json({
      success: true,
      data: signals,
      message: `Signals for ${req.params.token} retrieved successfully`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Analyze news sentiment using the RAG service.
 * @route POST /api/ai/news-sentiment
 */
const analyzeNewsSentiment = async (req, res, next) => {
  try {
    const { articleIds } = req.body;
    const result = await aiService.analyzeNewsSentiment({ articleIds });

    res.status(200).json({
      success: true,
      data: result,
      message: 'News sentiment analysis completed',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeMarket,
  getSignals,
  getSignalsByToken,
  analyzeNewsSentiment,
};
