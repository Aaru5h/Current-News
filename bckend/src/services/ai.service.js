const axios = require('axios');
const AIData = require('../models/AIData');
const NewsArticle = require('../models/NewsArticle');

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8000';

/**
 * Analyze market data for a token using the RAG service.
 * Sends a summarization query to the RAG service and saves the result
 * as an AIData document with the provided market context.
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

  // Build a query for the RAG service with market context
  const query = `Analyze the market data for ${token}. Current price: ${price || 'N/A'}, Volume: ${volume || 'N/A'}. ${
    indicators ? `Technical indicators: RSI=${indicators.rsi || 'N/A'}, MACD=${JSON.stringify(indicators.macd || {})}` : ''
  }. Provide a trading recommendation (BUY, SELL, or HOLD) with confidence level and explanation.`;

  const response = await axios.post(`${RAG_SERVICE_URL}/api/summarize`, {
    query,
  });

  const summary = response.data.summary || '';

  // Parse recommendation from RAG response (default to HOLD)
  let recommendation = 'HOLD';
  const upperSummary = summary.toUpperCase();
  if (upperSummary.includes('BUY') && !upperSummary.includes('SELL')) {
    recommendation = 'BUY';
  } else if (upperSummary.includes('SELL') && !upperSummary.includes('BUY')) {
    recommendation = 'SELL';
  }

  // Save analysis result to database
  const aiData = new AIData({
    token: token.toUpperCase(),
    price,
    volume,
    confidence: data.confidence || 0.5,
    indicators: indicators || {},
    recommendation,
    explanation: summary,
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
 * @param {number} [options.limit=10] - Results per page
 * @param {string} [options.recommendation] - Filter by BUY/SELL/HOLD
 * @returns {Promise<Object>} Paginated signals with metadata
 */
const getSignals = async ({ page = 1, limit = 10, recommendation }) => {
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (recommendation) {
    filter.recommendation = recommendation.toUpperCase();
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
 * Get all AI signals for a specific token.
 *
 * @param {string} token - Token/symbol to query
 * @returns {Promise<Array>} Array of AIData documents for the token
 */
const getSignalsByToken = async (token) => {
  return AIData.find({ token: token.toUpperCase() })
    .sort({ analyzedAt: -1 })
    .lean();
};

/**
 * Analyze news sentiment using the RAG service.
 * Sends article titles/summaries to the RAG service for sentiment analysis
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
    return { analyzed: 0, message: 'No articles found to analyze' };
  }

  let updatedCount = 0;

  for (const article of articles) {
    try {
      const query = `Analyze the sentiment of this news article. Title: "${article.title}". Summary: "${article.summary || article.content || ''}". Respond with: sentiment (positive, negative, or neutral) and a confidence score between 0 and 1.`;

      const response = await axios.post(`${RAG_SERVICE_URL}/api/summarize`, {
        query,
      });

      const summary = (response.data.summary || '').toLowerCase();

      // Parse sentiment from response
      let label = 'neutral';
      if (summary.includes('positive')) label = 'positive';
      else if (summary.includes('negative')) label = 'negative';

      // Extract score — look for a decimal number, default to 0.5
      const scoreMatch = summary.match(/(\d+\.?\d*)/);
      const score = scoreMatch ? Math.min(1, Math.max(0, parseFloat(scoreMatch[1]))) : 0.5;

      await NewsArticle.findByIdAndUpdate(article._id, {
        sentiment: { score, label },
      });

      updatedCount++;
    } catch (err) {
      console.error(`Failed to analyze sentiment for article ${article._id}:`, err.message);
    }
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
