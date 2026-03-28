const mongoose = require('mongoose');

const aiDataSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        index: true,
    },
    price: Number,
    volume: Number,
    confidence: Number,
    indicators: {
        rsi: Number,
        macd: {
            value: Number,
            signal: Number,
            histogram: Number,
        },
        movingAverages: {
            sma20: Number,
            sma50: Number,
            sma200: Number,
            ema12: Number,
            ema26: Number,
        },
    },
    recommendation: {
        type: String,
        enum: ['BUY', 'SELL', 'HOLD'],
    },
    explanation: String,
    source: {
        type: String,
        default: 'rag-service',
    },
    analyzedAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('AIData', aiDataSchema);
