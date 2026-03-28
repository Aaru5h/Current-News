const axios = require('axios');
const MarketData = require('../models/MarketData');

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:8000';

// SEC requires a specific User-Agent header (Company Name/Contact Email)
const SEC_HEADERS = { 'User-Agent': process.env.SEC_USER_AGENT };

/**
 * Get FRED macroeconomic data for a given series.
 * @param {string} seriesId - FRED series identifier (e.g., 'UNRATE')
 * @returns {Promise<Array>} Array of FRED observation objects
 */
const getFredData = async (seriesId) => {
  const url = 'https://api.stlouisfed.org/fred/series/observations';
  const response = await axios.get(url, {
    params: {
      series_id: seriesId,
      api_key: process.env.FRED_API_KEY,
      file_type: 'json',
      sort_order: 'desc',
      limit: 10,
    },
  });
  return response.data.observations;
};

/**
 * Get SEC company facts/filings by CIK number.
 * @param {string} cik - Company CIK identifier
 * @returns {Promise<Object>} SEC company facts data
 */
const getSecFilings = async (cik) => {
  const url = `https://data.sec.gov/api/xbrl/companyfacts/CIK${cik.padStart(10, '0')}.json`;
  const response = await axios.get(url, { headers: SEC_HEADERS });
  return response.data;
};

/**
 * Get current market data for a symbol from the database.
 * @param {string} symbol - Stock/crypto symbol
 * @returns {Promise<Object|null>} MarketData document or null
 */
const getMarketDataBySymbol = async (symbol) => {
  return MarketData.findOne({ symbol: symbol.toUpperCase() })
    .sort({ lastUpdated: -1 })
    .lean();
};

/**
 * Get historical market data for a symbol within a date range.
 * @param {string} symbol - Stock/crypto symbol
 * @param {string} [startDate] - ISO date string for range start
 * @param {string} [endDate] - ISO date string for range end
 * @returns {Promise<Object|null>} MarketData with filtered historicalData
 */
const getHistoricalData = async (symbol, startDate, endDate) => {
  const marketData = await MarketData.findOne({ symbol: symbol.toUpperCase() }).lean();

  if (!marketData || !marketData.historicalData) {
    return null;
  }

  // Filter historical data by date range if provided
  let filtered = marketData.historicalData;

  if (startDate || endDate) {
    filtered = filtered.filter((entry) => {
      const entryDate = new Date(entry.date);
      if (startDate && entryDate < new Date(startDate)) return false;
      if (endDate && entryDate > new Date(endDate)) return false;
      return true;
    });
  }

  return {
    symbol: marketData.symbol,
    price: marketData.price,
    lastUpdated: marketData.lastUpdated,
    historicalData: filtered,
  };
};

/**
 * Refresh market data by fetching from the RAG service and updating the database.
 * Calls the RAG service's summarize endpoint for market data context,
 * then upserts into the MarketData collection.
 *
 * @returns {Promise<Object>} Refresh result with counts
 */
const refreshMarketData = async () => {
  try {
    // Call RAG service to get latest market context
    const response = await axios.post(`${RAG_SERVICE_URL}/api/summarize`, {
      query: 'Provide current market data and price information for major stocks and crypto assets.',
    });

    const summary = response.data.summary || '';

    return {
      refreshed: true,
      source: 'rag-service',
      summary,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Market data refresh failed:', error.message);
    throw error;
  }
};

module.exports = {
  getFredData,
  getSecFilings,
  getMarketDataBySymbol,
  getHistoricalData,
  refreshMarketData,
};
