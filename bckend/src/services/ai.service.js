const axios = require('axios');
const AIData = require('../models/AIData');
const NewsArticle = require('../models/NewsArticle');

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8000';

/**
 * Analyze market data for a token using the RAG service.
 * Calls POST /analyze/market with structured payload and saves the result.
 *
 * @param {Object} data - Market data to analyze
 * @param {string} data.token - Token/symbol to analyze (e.g., "BTC")
 * @param {number} [data.price] - Current price
 * @param {number} [data.volume] - Current volume
 * @param {Object} [data.indicators] - Technical indicators
 * @returns {Promise<Object>} Saved AIData document
 */
const analyzeMarket = async (data) => {
  const { token, price, volume, indicators } = data;

  if (!token || typeof token !== 'string') {
    const err = new Error('token is required and must be a string');
    err.statusCode = 400;
    throw err;
  }

  // Call the correct RAG endpoint with structured payload
  const response = await axios.post(`${RAG_SERVICE_URL}/api/trading/analyze`, {
    symbol: token.toUpperCase(),
    // We don't need to pass price/volume/indicators as the new agent handles fetching these if needed
  });

  // Validate response structure
  if (!response.data || typeof response.data !== 'object') {
    const err = new Error('Invalid response from RAG service /api/trading/analyze');
    err.statusCode = 502;
    throw err;
  }

  const result = response.data;

  // The new AI Agent response might have recommendation in the analysis text or a dedicated field
  let recommendation = 'HOLD';
  const reportText = (result.analysis || result.summary || '').toUpperCase();
  
  if (result.recommendation) {
    const rec = result.recommendation.toUpperCase();
    if (['BUY', 'SELL', 'HOLD'].includes(rec)) {
      recommendation = rec;
    }
  } else if (reportText) {
    if (reportText.includes('BUY') && !reportText.includes('SELL')) recommendation = 'BUY';
    else if (reportText.includes('SELL') && !reportText.includes('BUY')) recommendation = 'SELL';
  }

  // Save analysis result to database
  const aiData = new AIData({
    token: token.toUpperCase(),
    price: typeof price === 'number' ? price : result.current_price || null,
    volume: typeof volume === 'number' ? volume : result.volume || null,
    confidence: result.confidence || data.confidence || 0.5,
    indicators: result.indicators || indicators || {},
    recommendation,
    explanation: result.explanation || result.summary || '',
    source: 'rag-service',
    analyzedAt: new Date(),
  });

  await aiData.save();
  return aiData;
};

/**
 * Get paginated AI signals with optional recommendation filter.
 *
 * @param {Object} options - Query options
 * @param {number} [options.page=1] - Page number (1-based)
 * @param {number} [options.limit=10] - Results per page (max 100)
 * @param {string} [options.recommendation] - Filter by BUY/SELL/HOLD
 * @returns {Promise<Object>} Paginated signals with metadata
 */
const getSignals = async ({ page = 1, limit = 10, recommendation }) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (recommendation) {
    const rec = recommendation.toUpperCase();
    if (['BUY', 'SELL', 'HOLD'].includes(rec)) {
      filter.recommendation = rec;
    }
  }

  const [signals, total] = await Promise.all([
    AIData.find(filter)
      .sort({ analyzedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    AIData.countDocuments(filter),
  ]);

  return {
    signals,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

/**
 * Get all AI signals for a specific token, sorted by most recent.
 *
 * @param {string} token - Token/symbol to query
 * @returns {Promise<Array>} Array of AIData documents for the token
 */
const getSignalsByToken = async (token) => {
  if (!token || typeof token !== 'string') {
    const err = new Error('token is required and must be a string');
    err.statusCode = 400;
    throw err;
  }

  return AIData.find({ token: token.toUpperCase() })
    .sort({ analyzedAt: -1 })
    .lean();
};

/**
 * Analyze news sentiment using the RAG service.
 * Calls POST /analyze/news with an array of article objects
 * and updates the corresponding NewsArticle records.
 *
 * @param {Object} data - Request data
 * @param {Array<string>} [data.articleIds] - Specific article IDs to analyze (optional; defaults to latest 10)
 * @returns {Promise<Object>} Result with count of updated articles
 */
const analyzeNewsSentiment = async (data) => {
  // Fetch articles to analyze
  let articles;
  if (data.articleIds && data.articleIds.length > 0) {
    articles = await NewsArticle.find({ _id: { $in: data.articleIds } });
  } else {
    articles = await NewsArticle.find()
      .sort({ publishedAt: -1 })
      .limit(10);
  }

  if (articles.length === 0) {
    return { analyzed: 0, total: 0, message: 'No articles found to analyze' };
  }

  // Build payload for batch sentiment analysis
  const articlesPayload = articles.map((a) => ({
    id: a._id.toString(),
    title: a.title,
    summary: a.summary || a.content || '',
    source: a.source || '',
    publishedAt: a.publishedAt,
  }));

  // Call the correct RAG endpoint with batch payload
  const response = await axios.post(`${RAG_SERVICE_URL}/analyze/news`, {
    articles: articlesPayload,
  });

  // Validate response structure
  if (!response.data || typeof response.data !== 'object') {
    const err = new Error('Invalid response from RAG service /analyze/news');
    err.statusCode = 502;
    throw err;
  }

  const results = response.data.results || response.data.articles || [];
  let updatedCount = 0;

  // If RAG returns per-article results, use them
  if (Array.isArray(results) && results.length > 0) {
    const bulkOps = [];
    for (const item of results) {
      const articleId = item.id || item._id;
      if (!articleId) continue;

      const label = (item.sentiment || item.label || 'neutral').toLowerCase();
      const score = typeof item.score === 'number'
        ? Math.min(1, Math.max(0, item.score))
        : 0.5;

      bulkOps.push({
        updateOne: {
          filter: { _id: articleId },
          update: { $set: { sentiment: { score, label } } },
        },
      });
    }

    if (bulkOps.length > 0) {
      const bulkResult = await NewsArticle.bulkWrite(bulkOps, { ordered: false });
      updatedCount = bulkResult.modifiedCount || 0;
    }
  } else {
    // Fallback: single sentiment for all articles (or parse from summary)
    const overallSentiment = response.data.sentiment || 'neutral';
    const overallScore = typeof response.data.score === 'number'
      ? Math.min(1, Math.max(0, response.data.score))
      : 0.5;

    const ids = articles.map((a) => a._id);
    const result = await NewsArticle.updateMany(
      { _id: { $in: ids } },
      { $set: { sentiment: { score: overallScore, label: overallSentiment.toLowerCase() } } }
    );
    updatedCount = result.modifiedCount || 0;
  }

  return {
    analyzed: updatedCount,
    total: articles.length,
  };
};

module.exports = {
  analyzeMarket,
  getSignals,
  getSignalsByToken,
  analyzeNewsSentiment,
};
