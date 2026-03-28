const User = require('../models/User');
const MarketData = require('../models/MarketData');

/**
 * Get a user's complete portfolio with current prices populated.
 *
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {Promise<Object>} Portfolio object with holdings and total value
 * @throws {Error} If user is not found
 */
const getPortfolio = async (userId) => {
  const user = await User.findById(userId).lean();
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const holdings = user.portfolio?.holdings || [];

  // Enrich holdings with latest prices from MarketData
  const enrichedHoldings = await Promise.all(
    holdings.map(async (holding) => {
      const marketData = await MarketData.findOne({ symbol: holding.symbol })
        .sort({ lastUpdated: -1 })
        .lean();

      const currentPrice = marketData?.price || holding.currentPrice || 0;
      const totalValue = currentPrice * (holding.quantity || 0);
      const costBasis = (holding.averagePrice || 0) * (holding.quantity || 0);
      const profitLoss = totalValue - costBasis;
      const profitLossPercent = costBasis > 0 ? ((profitLoss / costBasis) * 100) : 0;

      return {
        ...holding,
        currentPrice,
        totalValue,
        costBasis,
        profitLoss,
        profitLossPercent: Math.round(profitLossPercent * 100) / 100,
      };
    })
  );

  const totalValue = enrichedHoldings.reduce((sum, h) => sum + h.totalValue, 0);

  return {
    userId,
    holdings: enrichedHoldings,
    totalValue: Math.round(totalValue * 100) / 100,
    lastCalculated: new Date(),
  };
};

/**
 * Add a new holding or update an existing one in the user's portfolio.
 * If the symbol already exists, updates quantity and recalculates average price.
 *
 * @param {string} userId - MongoDB ObjectId of the user
 * @param {Object} holdingData - The holding to add
 * @param {string} holdingData.symbol - Stock/crypto symbol
 * @param {number} holdingData.quantity - Quantity to add
 * @param {number} [holdingData.averagePrice] - Purchase price per unit
 * @returns {Promise<Object>} Updated user document
 * @throws {Error} If user is not found
 */
const addHolding = async (userId, holdingData) => {
  const { symbol, quantity, averagePrice } = holdingData;

  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  // Initialize portfolio if it doesn't exist
  if (!user.portfolio) {
    user.portfolio = { holdings: [], totalValue: 0 };
  }
  if (!user.portfolio.holdings) {
    user.portfolio.holdings = [];
  }

  // Check if holding already exists
  const existingIndex = user.portfolio.holdings.findIndex(
    (h) => h.symbol === symbol.toUpperCase()
  );

  if (existingIndex >= 0) {
    // Update existing holding — recalculate weighted average price
    const existing = user.portfolio.holdings[existingIndex];
    const totalQty = (existing.quantity || 0) + quantity;
    const totalCost =
      (existing.quantity || 0) * (existing.averagePrice || 0) +
      quantity * (averagePrice || 0);

    existing.quantity = totalQty;
    existing.averagePrice = totalQty > 0 ? Math.round((totalCost / totalQty) * 100) / 100 : 0;
    existing.lastUpdated = new Date();
  } else {
    // Add new holding
    user.portfolio.holdings.push({
      symbol: symbol.toUpperCase(),
      quantity,
      averagePrice: averagePrice || 0,
      currentPrice: 0,
      lastUpdated: new Date(),
    });
  }

  // Recalculate total value
  user.portfolio.totalValue = user.portfolio.holdings.reduce(
    (sum, h) => sum + (h.currentPrice || h.averagePrice || 0) * (h.quantity || 0),
    0
  );
  user.portfolio.lastCalculated = new Date();

  await user.save();
  return user.toObject();
};

/**
 * Update a specific holding's quantity or average price.
 *
 * @param {string} userId - MongoDB ObjectId of the user
 * @param {string} symbol - Symbol of the holding to update
 * @param {Object} updateData - Fields to update
 * @param {number} [updateData.quantity] - New quantity
 * @param {number} [updateData.averagePrice] - New average price
 * @returns {Promise<Object>} Updated user document
 * @throws {Error} If user or holding is not found
 */
const updateHolding = async (userId, symbol, updateData) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const holding = user.portfolio?.holdings?.find(
    (h) => h.symbol === symbol.toUpperCase()
  );

  if (!holding) {
    const err = new Error(`Holding for symbol ${symbol} not found`);
    err.statusCode = 404;
    throw err;
  }

  if (updateData.quantity !== undefined) holding.quantity = updateData.quantity;
  if (updateData.averagePrice !== undefined) holding.averagePrice = updateData.averagePrice;
  holding.lastUpdated = new Date();

  // Recalculate total value
  user.portfolio.totalValue = user.portfolio.holdings.reduce(
    (sum, h) => sum + (h.currentPrice || h.averagePrice || 0) * (h.quantity || 0),
    0
  );
  user.portfolio.lastCalculated = new Date();

  await user.save();
  return user.toObject();
};

/**
 * Remove a holding from the user's portfolio.
 *
 * @param {string} userId - MongoDB ObjectId of the user
 * @param {string} symbol - Symbol of the holding to remove
 * @returns {Promise<Object>} Updated user document
 * @throws {Error} If user or holding is not found
 */
const removeHolding = async (userId, symbol) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const index = user.portfolio?.holdings?.findIndex(
    (h) => h.symbol === symbol.toUpperCase()
  );

  if (index === undefined || index < 0) {
    const err = new Error(`Holding for symbol ${symbol} not found`);
    err.statusCode = 404;
    throw err;
  }

  user.portfolio.holdings.splice(index, 1);

  // Recalculate total value
  user.portfolio.totalValue = user.portfolio.holdings.reduce(
    (sum, h) => sum + (h.currentPrice || h.averagePrice || 0) * (h.quantity || 0),
    0
  );
  user.portfolio.lastCalculated = new Date();

  await user.save();
  return user.toObject();
};

/**
 * Calculate current portfolio value with profit/loss breakdown per asset.
 *
 * @param {string} userId - MongoDB ObjectId of the user
 * @returns {Promise<Object>} Value breakdown with per-asset P/L
 * @throws {Error} If user is not found
 */
const calculatePortfolioValue = async (userId) => {
  const portfolio = await getPortfolio(userId);

  const totalCostBasis = portfolio.holdings.reduce((sum, h) => sum + (h.costBasis || 0), 0);
  const totalProfitLoss = portfolio.totalValue - totalCostBasis;
  const totalProfitLossPercent = totalCostBasis > 0
    ? Math.round(((totalProfitLoss / totalCostBasis) * 100) * 100) / 100
    : 0;

  return {
    userId,
    totalValue: portfolio.totalValue,
    totalCostBasis: Math.round(totalCostBasis * 100) / 100,
    totalProfitLoss: Math.round(totalProfitLoss * 100) / 100,
    totalProfitLossPercent,
    holdings: portfolio.holdings,
    lastCalculated: new Date(),
  };
};

module.exports = {
  getPortfolio,
  addHolding,
  updateHolding,
  removeHolding,
  calculatePortfolioValue,
};
