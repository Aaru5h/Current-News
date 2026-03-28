const mongoose = require('mongoose');

const marketDataSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        index: true,
    },
    price: Number,
    change: Number,
    changePercent: Number,
    volume: Number,
    marketCap: Number,
    lastUpdated: {
        type: Date,
        default: Date.now,
        index: true,
    },
    historicalData: [{
        date: Date,
        open: Number,
        high: Number,
        low: Number,
        close: Number,
        volume: Number,
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('MarketData', marketDataSchema);