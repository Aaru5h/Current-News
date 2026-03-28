const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');
const { validateObjectId } = require('../middleware/validation');

// GET /api/news — Paginated news with filters
router.get('/', newsController.getNews);

// GET /api/news/latest — Latest 10 articles (must be before /:id)
router.get('/latest', newsController.getLatestNews);

// GET /api/news/symbol/:symbol — News by stock symbol
router.get('/symbol/:symbol', newsController.getNewsBySymbol);

// GET /api/news/:id — Single article by _id
router.get('/:id', validateObjectId('id'), newsController.getNewsById);

// POST /api/news/fetch — Trigger scraping and save to DB
router.post('/fetch', newsController.fetchNews);

module.exports = router;
