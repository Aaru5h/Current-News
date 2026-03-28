const newsService = require('../services/news.service');

/**
 * Get paginated news articles with optional filters.
 * @route GET /api/news
 */
const getNews = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, sentiment } = req.query;
    const result = await newsService.getNews({ page, limit, category, sentiment });
    res.status(200).json({
      success: true,
      data: result.articles,
      message: 'News articles retrieved successfully',
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific news article by its MongoDB _id.
 * @route GET /api/news/:id
 */
const getNewsById = async (req, res, next) => {
  try {
    const article = await newsService.getNewsById(req.params.id);
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found',
      });
    }
    res.status(200).json({
      success: true,
      data: article,
      message: 'Article retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get news articles filtered by stock symbol.
 * @route GET /api/news/symbol/:symbol
 */
const getNewsBySymbol = async (req, res, next) => {
  try {
    const articles = await newsService.getNewsBySymbol(req.params.symbol);
    res.status(200).json({
      success: true,
      data: articles,
      message: `News for symbol ${req.params.symbol} retrieved successfully`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get the latest 10 news articles.
 * @route GET /api/news/latest
 */
const getLatestNews = async (req, res, next) => {
  try {
    const articles = await newsService.getLatestNews(10);
    res.status(200).json({
      success: true,
      data: articles,
      message: 'Latest news retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Trigger news fetch from GNews API and save to database.
 * @route POST /api/news/fetch
 */
const fetchNews = async (req, res, next) => {
  try {
    const result = await newsService.fetchAndSaveNews();
    res.status(200).json({
      success: true,
      data: result,
      message: 'News fetched and saved successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNews,
  getNewsById,
  getNewsBySymbol,
  getLatestNews,
  fetchNews,
};
