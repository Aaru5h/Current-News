const marketService = require('../services/market.services');
const portfolioController = require('./portfolio.controller');

/**
 * Get US macroeconomic data from FRED.
 * @route GET /api/market/macro
 */
const getUSMacro = async (req, res, next) => {
  try {
    const data = await marketService.getFredData('UNRATE');
    res.status(200).json({
      success: true,
      data,
      message: 'US macroeconomic data retrieved',
      source: 'FRED',
      indicator: 'Unemployment Rate',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get SEC company filings by CIK number.
 * @route GET /api/market/company/:cik
 */
const getCompanyData = async (req, res, next) => {
  try {
    const { cik } = req.params;
    const data = await marketService.getSecFilings(cik);
    res.status(200).json({
      success: true,
      data,
      message: 'SEC company data retrieved',
      source: 'SEC',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current market data for a symbol from the database.
 * @route GET /api/market/data/:symbol
 */
const getMarketData = async (req, res, next) => {
  try {
    const data = await marketService.getMarketDataBySymbol(req.params.symbol);
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Market data not found',
        details: `No data found for symbol ${req.params.symbol}`,
      });
    }
    res.status(200).json({
      success: true,
      data,
      message: `Market data for ${req.params.symbol} retrieved`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get historical market data for a symbol with optional date range.
 * @route GET /api/market/data/:symbol/historical
 */
const getHistoricalData = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await marketService.getHistoricalData(
      req.params.symbol,
      startDate,
      endDate
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Historical data not found',
        details: `No historical data found for symbol ${req.params.symbol}`,
      });
    }
    res.status(200).json({
      success: true,
      data,
      message: `Historical data for ${req.params.symbol} retrieved`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh market data from the RAG service.
 * @route POST /api/market/data/refresh
 */
const refreshMarketData = async (req, res, next) => {
  try {
    const result = await marketService.refreshMarketData();
    res.status(200).json({
      success: true,
      data: result,
      message: 'Market data refresh triggered',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUSMacro,
  getCompanyData,
  getMarketData,
  getHistoricalData,
  refreshMarketData,
  // Re-export portfolio controller methods for delegation from market routes
  getPortfolio: portfolioController.getPortfolio,
  addPortfolioHolding: portfolioController.addHolding,
  removePortfolioHolding: portfolioController.removeHolding,
  getPortfolioValue: portfolioController.getPortfolioValue,
};
