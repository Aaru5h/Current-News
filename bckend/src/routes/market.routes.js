const express = require('express');
const router = express.Router();
const marketController = require('../controllers/market.controller');

// GET /api/market/macro
router.get('/macro', marketController.getUSMacro);

// GET /api/market/company/0000320193 (Apple CIK)
router.get('/company/:cik', marketController.getCompanyData);

module.exports = router;
