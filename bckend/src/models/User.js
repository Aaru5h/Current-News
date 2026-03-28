const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    portfolio: {
        holdings: [{
            symbol: String,
            quantity: Number,
            averagePrice: Number,
            currentPrice: Number,
            lastUpdated: Date,
        }],
        totalValue: Number,
        lastCalculated: Date,
    },
    preferences: {
        riskTolerance: String,
        investmentGoals: [String],
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);