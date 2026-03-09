import axios from "axios";

/**
 * Normalize an article to a common schema.
 */
const normalize = ({ title, description, url, image, source, publishedAt, category }) => ({
  title: title || "Untitled",
  description: description || "",
  url: url || "",
  image: image || null,
  source: source || "Unknown",
  publishedAt: publishedAt || new Date().toISOString(),
  category: category || "General",
});

// ─────────────────────────────────────────────
// 1. TheNewsAPI  —  General / Business finance news
// Docs: https://www.thenewsapi.com/documentation
// ─────────────────────────────────────────────
export const fetchFromTheNewsAPI = async (search = "finance OR economy OR markets", limit = 5) => {
  try {
    const token = process.env.THENEWSAPI_KEY;
    if (!token) {
      console.warn("THENEWSAPI_KEY not configured, skipping TheNewsAPI.");
      return [];
    }

    const response = await axios.get("https://api.thenewsapi.com/v1/news/all", {
      params: {
        api_token: token,
        search,
        language: "en",
        categories: "business,tech",
        limit,
      },
    });

    return (response.data.data || []).map((a) =>
      normalize({
        title: a.title,
        description: a.description || a.snippet || "",
        url: a.url,
        image: a.image_url || null,
        source: a.source || "TheNewsAPI",
        publishedAt: a.published_at,
        category: "Finance",
      })
    );
  } catch (err) {
    console.error("TheNewsAPI fetch error:", err.message);
    return [];
  }
};

// ─────────────────────────────────────────────
// 2. StockData.org  —  Stock / market specific news
// Docs: https://www.stockdata.org/documentation
// ─────────────────────────────────────────────
export const fetchFromStockData = async (limit = 5) => {
  try {
    const token = process.env.STOCKDATA_API_KEY;
    if (!token) {
      console.warn("STOCKDATA_API_KEY not configured, skipping StockData.");
      return [];
    }

    const response = await axios.get("https://api.stockdata.org/v1/news/all", {
      params: {
        api_token: token,
        language: "en",
        limit,
      },
    });

    return (response.data.data || []).map((a) =>
      normalize({
        title: a.title,
        description: a.description || a.snippet || "",
        url: a.url,
        image: a.image_url || null,
        source: a.source || "StockData",
        publishedAt: a.published_at,
        category: "Markets",
      })
    );
  } catch (err) {
    console.error("StockData fetch error:", err.message);
    return [];
  }
};

// ─────────────────────────────────────────────
// 3. CryptoPanic  —  Crypto-specific news
// Docs: https://cryptopanic.com/developers/api/
// ─────────────────────────────────────────────
export const fetchFromCryptoPanic = async (limit = 5) => {
  try {
    const token = process.env.CRYPTOPANIC_API_KEY;
    if (!token) {
      console.warn("CRYPTOPANIC_API_KEY not configured, skipping CryptoPanic.");
      return [];
    }

    const response = await axios.get("https://cryptopanic.com/api/v1/posts/", {
      params: {
        auth_token: token,
        public: true,
        kind: "news",
        regions: "en",
      },
    });

    return (response.data.results || []).slice(0, limit).map((a) =>
      normalize({
        title: a.title,
        description: a.title, // CryptoPanic doesn't always have a body in free tier
        url: a.url || (a.source && a.source.url) || "",
        image: null, // CryptoPanic free tier doesn't provide images
        source: a.source?.title || "CryptoPanic",
        publishedAt: a.published_at || a.created_at,
        category: "Crypto",
      })
    );
  } catch (err) {
    console.error("CryptoPanic fetch error:", err.message);
    return [];
  }
};

// ─────────────────────────────────────────────
// Aggregation helpers
// ─────────────────────────────────────────────

/**
 * Deduplicate articles by normalizing and comparing titles.
 */
const deduplicateByTitle = (articles) => {
  const seen = new Set();
  return articles.filter((article) => {
    const key = article.title.toLowerCase().trim().slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

/**
 * Fetch and merge financial news from all three API sources.
 */
export const fetchAllNews = async () => {
  const [theNewsArticles, stockDataArticles, cryptoArticles] = await Promise.all([
    fetchFromTheNewsAPI("finance OR economy OR stock market", 5),
    fetchFromStockData(5),
    fetchFromCryptoPanic(5),
  ]);

  const combined = [...theNewsArticles, ...stockDataArticles, ...cryptoArticles];
  return deduplicateByTitle(combined);
};
