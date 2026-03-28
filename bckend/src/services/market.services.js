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
 * Refresh market data by fetching from RAG service GET /fetch/market-data.
 * Upserts each item into the MarketData collection and pushes a snapshot
 * to the historicalData array for tracking.
 *
 * @returns {Promise<Object>} Refresh result with updated count and symbols
 */
const refreshMarketData = async () => {
  // Call the correct RAG endpoint
  const response = await axios.get(`${RAG_SERVICE_URL}/fetch/market-data`);

  // Validate response — expect an array of market objects
  const items = response.data.data || response.data.items || response.data;

  if (!Array.isArray(items) || items.length === 0) {
    return { updated: 0, symbols: [], message: 'No market data returned from RAG service' };
  }

  const now = new Date();
  const updatedSymbols = [];

  // Build bulk upsert operations
  const bulkOps = items.map((item) => {
    const symbol = (item.symbol || item.ticker || '').toUpperCase();
    if (!symbol) return null;

    updatedSymbols.push(symbol);

    const price = typeof item.price === 'number' ? item.price : null;
    const volume = typeof item.volume === 'number' ? item.volume : null;
    const change = typeof item.change === 'number' ? item.change : null;
    const changePercent = typeof item.changePercent === 'number' ? item.changePercent : null;
    const marketCap = typeof item.marketCap === 'number' ? item.marketCap : null;

    // Build the historical snapshot to push
    const historyEntry = {
      date: now,
      open: item.open || null,
      high: item.high || null,
      low: item.low || null,
      close: price,
      volume,
    };

    return {
      updateOne: {
        filter: { symbol },
        update: {
          $set: {
            symbol,
            price,
            volume,
            change,
            changePercent,
            marketCap,
            lastUpdated: now,
          },
          $push: {
            historicalData: {
              $each: [historyEntry],
              $slice: -365, // Keep last 365 entries max
            },
          },
        },
        upsert: true,
      },
    };
  }).filter(Boolean);

  if (bulkOps.length === 0) {
    return { updated: 0, symbols: [], message: 'No valid market data items to process' };
  }

  const result = await MarketData.bulkWrite(bulkOps, { ordered: false });

  return {
    updated: (result.modifiedCount || 0) + (result.upsertedCount || 0),
    inserted: result.upsertedCount || 0,
    modified: result.modifiedCount || 0,
    symbols: updatedSymbols,
    timestamp: now,
  };
};

module.exports = {
  getFredData,
  getSecFilings,
  getMarketDataBySymbol,
  getHistoricalData,
  refreshMarketData,
};
