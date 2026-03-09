import axios from "axios";
import { fetchAllNews } from "../services/news.service.js";

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || "http://localhost:8000";

/**
 * Call the RAG service to get AI-generated summaries for articles.
 * Falls back gracefully if the RAG service is unavailable.
 */
const getAISummaries = async (articles) => {
  try {
    const payload = articles.map((a) => ({
      url: a.url,
      title: a.title,
      description: a.description,
    }));

    const response = await axios.post(
      `${RAG_SERVICE_URL}/api/summarize-articles`,
      { articles: payload },
      { timeout: 30000 }
    );

    return response.data.summaries || {};
  } catch (err) {
    console.warn(
      "RAG service unavailable, falling back to API descriptions:",
      err.message
    );
    return null;
  }
};

/**
 * GET /api/news
 * Fetches financial news from multiple APIs, enriches with AI summaries,
 * and returns the results.
 */
export const getLatestNews = async (req, res) => {
  try {
    // 1. Fetch articles from all configured APIs
    const articles = await fetchAllNews();

    if (articles.length === 0) {
      return res.status(200).json({
        message: "No articles found. Check your API keys are configured.",
        articles: [],
      });
    }

    // 2. Request AI summaries from RAG service
    const summaries = await getAISummaries(articles);

    // 3. Merge summaries into articles
    const enrichedArticles = articles.map((article, i) => ({
      ...article,
      summary: summaries
        ? summaries[article.url] || article.description || "No summary available."
        : article.description || "No summary available.",
      delay: i * 0.1,
    }));

    res.json({
      count: enrichedArticles.length,
      articles: enrichedArticles,
    });
  } catch (error) {
    console.error("News aggregation error:", error.message);
    res.status(500).json({ error: "Failed to aggregate news." });
  }
};
