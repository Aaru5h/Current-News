const mongoose = require('mongoose');

const newsArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: String,
    summary: String,
    source: String,
    url: {
        type: String,
        unique: true,
    },
    publishedAt: {
        type: Date,
        index: true,
    },
    scrapedAt: {
        type: Date,
        default: Date.now,
    },
    symbols: {
        type: [String],
        index: true,
    },
    sentiment: {
        score: Number,
        label: String, // positive, negative, neutral
    },
    category: String,
}, {
    timestamps: true,
});

module.exports = mongoose.model('NewsArticle', newsArticleSchema);