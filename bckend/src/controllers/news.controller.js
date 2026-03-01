import axios from "axios";

const GNEWS_BASE = "https://gnews.io/api/v4";

/**
 * Fetch news articles from GNews API by search query or topic.
 */
const fetchGNews = async (query, category = null, max = 4) => {
  try {
    const params = {
      apikey: process.env.GNEWS_API_KEY,
      lang: "en",
      max,
    };

    let url;
    if (query) {
      url = `${GNEWS_BASE}/search`;
      params.q = query;
    } else {
      url = `${GNEWS_BASE}/top-headlines`;
      if (category) params.topic = category;
    }

    const response = await axios.get(url, { params });
    return response.data.articles || [];
  } catch (err) {
    console.error("GNews fetch error:", err.message);
    return [];
  }
};

export const getLatestNews = async (req, res) => {
  try {
    if (!process.env.GNEWS_API_KEY) {
      return res.status(500).json({ error: "GNEWS_API_KEY is not configured." });
    }

    // Fetch crypto and markets news in parallel
    const [cryptoArticles, marketArticles] = await Promise.all([
      fetchGNews("crypto OR bitcoin OR blockchain OR ethereum", null, 3),
      fetchGNews("stock market OR finance OR trading", null, 3),
    ]);

    // Map to a clean response format with categories
    const mapArticles = (articles, category) =>
      articles.map((article, i) => ({
        category,
        title: article.title,
        summary: article.description || "No summary available.",
        url: article.url,
        image: article.image,
        source: article.source?.name || "Unknown",
        publishedAt: article.publishedAt,
        delay: i * 0.1,
      }));

    const results = [
      ...mapArticles(cryptoArticles, "Crypto"),
      ...mapArticles(marketArticles, "Markets"),
    ];

    res.json(results);
  } catch (error) {
    console.error("News aggregation error:", error.message);
    res.status(500).json({ error: "Failed to aggregate news." });
  }
};
