import express from "express"; 
import {
  getUSMacroData,
  getStockQuote,
  getSECFilings
} from "../controllers/market.controller.js";

const router = express.Router();

router.get("/us-macro", getUSMacroData);
router.get("/stock/:symbol", getStockQuote);
router.get("/sec/:cik", getSECFilings); 

export default router; 
