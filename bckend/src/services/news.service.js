const axios = require('axios');
const NewsArticle = require('../models/NewsArticle');

const GNEWS_BASE = 'https://gnews.io/api/v4';
const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8000';

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
 * @returns {Promise<Object>} Result with counts of inserted/updated articles
 */
const fetchAndSaveNews = async () => {
  // Fetch crypto and markets news in parallel
  const [cryptoArticles, marketArticles] = await Promise.all([
    fetchGNews('crypto OR bitcoin OR blockchain OR ethereum', null, 5),
    fetchGNews('stock market OR finance OR trading', null, 5),
  ]);

  // Map raw GNews articles to our schema format
  const mapArticles = (articles, category) =>
    articles.map((article) => ({
      title: article.title,
      content: article.content || '',
      summary: article.description || 'No summary available.',
      source: article.source?.name || 'Unknown',
      url: article.url,
      publishedAt: article.publishedAt ? new Date(article.publishedAt) : new Date(),
      category,
      symbols: [],
    }));

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
 * @param {number} options.limit - Articles per page
 * @param {string} [options.category] - Filter by category
 * @param {string} [options.sentiment] - Filter by sentiment label
 * @returns {Promise<Object>} Paginated articles with metadata
 */
const getNews = async ({ page = 1, limit = 10, category, sentiment }) => {
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
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
  fetchGNews,
  fetchAndSaveNews,
  getNews,
  getNewsById,
  getNewsBySymbol,
  getLatestNews,
};
