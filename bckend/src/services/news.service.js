const axios = require('axios');
const NewsArticle = require('../models/NewsArticle');

const GNEWS_BASE = 'https://gnews.io/api/v4';

/**
 * Known stock/crypto symbols to match in text.
 * Covers major crypto and US stocks. Add more as needed.
 */
const KNOWN_SYMBOLS = new Set([
  // Crypto
  'BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'DOGE', 'DOT', 'AVAX', 'MATIC', 'LINK',
  'UNI', 'ATOM', 'LTC', 'BCH', 'ALGO', 'FIL', 'NEAR', 'APT', 'ARB', 'OP',
  'SHIB', 'PEPE', 'BNB', 'TRX', 'USDT', 'USDC',
  // Major US stocks
  'AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'NVDA', 'META', 'TSLA', 'JPM',
  'JNJ', 'V', 'PG', 'UNH', 'HD', 'MA', 'DIS', 'BAC', 'XOM', 'PFE', 'KO',
  'NFLX', 'INTC', 'AMD', 'CRM', 'ORCL', 'CSCO', 'ADBE', 'PYPL', 'QCOM',
  'BA', 'GS', 'MS', 'WMT', 'COST', 'MCD', 'NKE', 'SBUX', 'UBER', 'SQ',
  'COIN', 'SNAP', 'PLTR', 'RIVN', 'LCID', 'GME', 'AMC', 'SPY', 'QQQ',
]);

/**
 * Extract stock/crypto symbols from text.
 * Matches uppercase words (2-5 chars) against the known symbol set.
 *
 * @param {string} text - Text to extract symbols from
 * @returns {string[]} Array of unique uppercase symbols found
 */
const extractSymbols = (text) => {
  if (!text || typeof text !== 'string') return [];

  // Match uppercase words of 2-5 characters that could be symbols
  const matches = text.match(/\b[A-Z]{2,5}\b/g) || [];

  // Filter against known symbols to avoid false positives (e.g., "THE", "AND")
  const found = new Set();
  for (const match of matches) {
    if (KNOWN_SYMBOLS.has(match)) {
      found.add(match);
    }
  }

  // Also match common full-name patterns → symbol
  const nameMap = {
    bitcoin: 'BTC', ethereum: 'ETH', solana: 'SOL', ripple: 'XRP', cardano: 'ADA',
    dogecoin: 'DOGE', polkadot: 'DOT', avalanche: 'AVAX', polygon: 'MATIC', chainlink: 'LINK',
    litecoin: 'LTC', apple: 'AAPL', microsoft: 'MSFT', google: 'GOOGL', amazon: 'AMZN',
    nvidia: 'NVDA', tesla: 'TSLA', netflix: 'NFLX', meta: 'META',
  };

  const lower = text.toLowerCase();
  for (const [name, symbol] of Object.entries(nameMap)) {
    if (lower.includes(name)) {
      found.add(symbol);
    }
  }

  return [...found];
};

/**
 * Fetch news articles from GNews API by search query or topic.
 * @param {string|null} query - Search query string
 * @param {string|null} category - GNews topic category
 * @param {number} max - Maximum number of articles to fetch
 * @returns {Promise<Array>} Array of article objects
 */
const fetchGNews = async (query, category = null, max = 4) => {
  try {
    const params = {
      apikey: process.env.GNEWS_API_KEY,
      lang: 'en',
      max,
    };

    let url;
    if (query) {
      url = `${GNEWS_BASE}/search`;
      params.q = query;
    } else {
      url = `${GNEWS_BASE}/top-headlines`;
      if (category) params.topic = category;
    }

    const response = await axios.get(url, { params });
    return response.data.articles || [];
  } catch (err) {
    console.error('GNews fetch error:', err.message);
    return [];
  }
};

/**
 * Fetch news from GNews API and save/upsert to MongoDB.
 * Prevents duplicates using the unique `url` field via bulkWrite upserts.
 * Automatically extracts symbols from title and summary.
 *
 * @returns {Promise<Object>} Result with counts of inserted/updated articles
 */
const fetchAndSaveNews = async () => {
  // Fetch crypto and markets news in parallel
  const [cryptoArticles, marketArticles] = await Promise.all([
    fetchGNews('crypto OR bitcoin OR blockchain OR ethereum', null, 5),
    fetchGNews('stock market OR finance OR trading', null, 5),
  ]);

  // Map raw GNews articles to our schema format with symbol extraction
  const mapArticles = (articles, category) =>
    articles.map((article) => {
      const title = article.title || '';
      const summary = article.description || 'No summary available.';
      const symbols = extractSymbols(`${title} ${summary}`);

      return {
        title,
        content: article.content || '',
        summary,
        source: article.source?.name || 'Unknown',
        url: article.url,
        publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
        category,
        symbols,
      };
    });

  const allArticles = [
    ...mapArticles(cryptoArticles, 'Crypto'),
    ...mapArticles(marketArticles, 'Markets'),
  ];

  if (allArticles.length === 0) {
    return { inserted: 0, updated: 0, total: 0 };
  }

  // Bulk upsert — update if URL exists, insert if not
  const bulkOps = allArticles.map((article) => ({
    updateOne: {
      filter: { url: article.url },
      update: { $set: article },
      upsert: true,
    },
  }));

  const result = await NewsArticle.bulkWrite(bulkOps, { ordered: false });

  return {
    inserted: result.upsertedCount || 0,
    updated: result.modifiedCount || 0,
    total: allArticles.length,
  };
};

/**
 * Get paginated news articles with optional filters.
 * @param {Object} options - Filter/pagination options
 * @param {number} options.page - Page number (1-based)
 * @param {number} options.limit - Articles per page (max 100)
 * @param {string} [options.category] - Filter by category
 * @param {string} [options.sentiment] - Filter by sentiment label
 * @returns {Promise<Object>} Paginated articles with metadata
 */
const getNews = async ({ page = 1, limit = 10, category, sentiment }) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (pageNum - 1) * limitNum;

  const filter = {};
  if (category) filter.category = category;
  if (sentiment) filter['sentiment.label'] = sentiment;

  const [articles, total] = await Promise.all([
    NewsArticle.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    NewsArticle.countDocuments(filter),
  ]);

  return {
    articles,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
  };
};

/**
 * Get a single news article by its MongoDB _id.
 * @param {string} id - MongoDB ObjectId string
 * @returns {Promise<Object|null>} Article document or null
 */
const getNewsById = async (id) => {
  return NewsArticle.findById(id).lean();
};

/**
 * Get news articles related to a specific stock symbol.
 * @param {string} symbol - Stock/crypto symbol (e.g., "BTC", "AAPL")
 * @returns {Promise<Array>} Array of matching articles
 */
const getNewsBySymbol = async (symbol) => {
  return NewsArticle.find({
    symbols: { $in: [symbol.toUpperCase()] },
  })
    .sort({ publishedAt: -1 })
    .limit(50)
    .lean();
};

/**
 * Get the latest N news articles.
 * @param {number} limit - Number of articles to return
 * @returns {Promise<Array>} Array of latest articles
 */
const getLatestNews = async (limit = 10) => {
  return NewsArticle.find()
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();
};

module.exports = {
  extractSymbols,
  fetchGNews,
  fetchAndSaveNews,
  getNews,
  getNewsById,
  getNewsBySymbol,
  getLatestNews,
};
