import axios from "axios";
import * as cheerio from "cheerio";

// Scrape some recent tech/finance news links to send to the RAG service
const fetchNewsLinks = async () => {
  try {
    // Using a sample public tech news site (e.g., TechCrunch or similar RSS)
    // For simplicity and avoiding keys, we'll fetch a public RSS feed
    const response = await axios.get("https://techcrunch.com/feed/");
    const $ = cheerio.load(response.data, { xmlMode: true });
    
    const items = [];
    $("item").slice(0, 5).each((i, el) => {
      items.push({
        title: $(el).find("title").text(),
        link: $(el).find("link").text(),
      });
    });
    return items;
  } catch (err) {
    console.error("Error fetching news links:", err.message);
    return [];
  }
};

export const getLatestNews = async (req, res) => {
  try {
    // 1. Fetch latest news links
    const newsItems = await fetchNewsLinks();
    if (newsItems.length === 0) {
      return res.status(500).json({ error: "Failed to fetch source news links." });
    }

    const urls = newsItems.map(item => item.link);

    // 2. Ingest into RAG service
    console.log("Ingesting URLs to RAG service...", urls);
    await axios.post("http://127.0.0.1:8000/api/ingest", { urls });

    // 3. Generate summaries for each category/topic
    const queries = [
      { category: "Crypto", query: "What is the latest news regarding cryptocurrency and digital assets?" },
      { category: "Regulation", query: "Are there any new regulatory or legal actions regarding tech or finance?" },
      { category: "Markets", query: "What is the latest news on stock markets, funding, or corporate earnings?" },
      { category: "AI & Tech", query: "What are the latest advancements or news in Artificial Intelligence and tech startups?" }
    ];

    const summarizedNews = [];
    let delay = 0.1;

    for (const q of queries) {
      const summaryRes = await axios.post("http://127.0.0.1:8000/api/summarize", { query: q.query });
      summarizedNews.push({
        category: q.category,
        title: `Latest in ${q.category}`, // We don't have titles from RAG output easily, so generic
        summary: summaryRes.data.summary,
        delay: delay
      });
      delay += 0.1;
    }

    res.json(summarizedNews);
  } catch (error) {
    console.error("News aggregation error:", error.message);
    res.status(500).json({ error: "Failed to aggregate news." });
  }
};
