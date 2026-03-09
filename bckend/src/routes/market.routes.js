import express from 'express';
import { getUSMacro, getCompanyData } from '../controllers/market.controller.js';

const router = express.Router();

// GET /api/market/macro
router.get('/macro', getUSMacro);

// GET /api/market/company/0000320193 (Apple CIK)
router.get('/company/:cik', getCompanyData);

export default router;
