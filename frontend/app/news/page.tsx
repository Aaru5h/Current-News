"use client";
import React, { useState, useEffect } from "react";
import {
  Newspaper,
  Brain,
  Link2,
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Globe,
  ShoppingCart,
  BarChart3,
  Loader2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${API_URL}/api/news`);
        if (!response.ok) throw new Error("Failed to fetch news");
        const data = await response.json();
        setNewsItems(data.data || data.articles || []);
      } catch (err: any) {
        console.error("Error fetching news:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">News &amp; Sentiment</h1>
        <p className="page-subtitle">AI-powered market intelligence and news analysis</p>
      </div>

      <div className="grid-main-side">
        {/* Main Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Live News Feed */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <Newspaper size={18} className="section-title-icon" />
                News Feed
              </h2>
              <span className="section-badge badge-blue">
                {newsItems.length} articles
              </span>
            </div>

            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "250px", gap: "10px" }}>
                <Loader2 size={18} className="spin" style={{ color: "var(--accent-blue)" }} />
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading intelligence feed...</span>
              </div>
            ) : error ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "250px", gap: "12px" }}>
                <AlertTriangle size={32} style={{ color: "var(--accent-amber)" }} />
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Could not load news feed</span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>{error}</span>
              </div>
            ) : newsItems.length > 0 ? (
              <div>
                {newsItems.map((article, i) => (
                  <a
                    key={i}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="feed-item"
                    style={{ display: "block", textDecoration: "none" }}
                  >
                    <div className="feed-item-tag" style={{ color: "var(--accent-cyan)" }}>
                      {article.category || article.source || "News"}
                    </div>
                    <div className="feed-item-title">{article.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.6, marginTop: "6px" }}>
                      {(article.summary || article.description || article.content || "").substring(0, 200)}...
                    </div>
                    <div className="feed-item-meta" style={{ marginTop: "8px", display: "flex", gap: "12px" }}>
                      <span>{article.source}</span>
                      {article.publishedAt && (
                        <span style={{ color: "var(--text-dim)" }}>
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                      )}
                      {article.symbols && article.symbols.length > 0 && (
                        <span style={{ color: "var(--accent-purple)" }}>
                          {article.symbols.join(", ")}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "250px", gap: "12px" }}>
                <Newspaper size={32} style={{ color: "var(--text-dim)" }} />
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No news articles available</span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
                  Trigger a fetch via POST /api/news/fetch to populate the feed
                </span>
              </div>
            )}
          </div>

          {/* Causal Intelligence Chain — structural UI, not synthetic data */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <Link2 size={18} style={{ color: "var(--accent-purple)" }} />
                Causal Intelligence Chain
              </h2>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "20px" }}>
              Impact tracing is activated when AI sentiment analysis detects trigger events
            </p>
            <div className="causal-chain">
              <div className="causal-node">
                <div className="causal-node-dot trigger">
                  <AlertTriangle size={18} />
                </div>
                <div className="causal-node-label">Trigger Event</div>
                <div className="causal-node-sublabel">Detected via AI</div>
              </div>
              <div className="causal-arrow" />
              <div className="causal-node">
                <div className="causal-node-dot primary">
                  <Globe size={18} />
                </div>
                <div className="causal-node-label">Supply Chains</div>
                <div className="causal-node-sublabel">Primary Impact</div>
              </div>
              <div className="causal-arrow" />
              <div className="causal-node">
                <div className="causal-node-dot economic">
                  <ShoppingCart size={18} />
                </div>
                <div className="causal-node-label">Consumer Prices</div>
                <div className="causal-node-sublabel">Economic Result</div>
              </div>
              <div className="causal-arrow" />
              <div className="causal-node">
                <div className="causal-node-dot outcome">
                  <BarChart3 size={18} />
                </div>
                <div className="causal-node-label">Stock Sentiment</div>
                <div className="causal-node-sublabel">Market Outcome</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* AI Market Mood — needs backend sentiment data */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <Brain size={18} style={{ color: "var(--accent-purple)" }} />
                AI Market Mood
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "120px", gap: "12px" }}>
              <Brain size={28} style={{ color: "var(--text-dim)" }} />
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Sentiment analysis pending
              </span>
              <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                Requires POST /api/ai/news-sentiment
              </span>
            </div>
          </div>

          {/* AI Summary */}
          <div className="ai-summary">
            <div className="ai-summary-title">
              <Sparkles size={14} /> AI Summary
            </div>
            <p className="ai-summary-text">
              AI summaries will be generated when news articles are analyzed through the sentiment pipeline.
              Use the RAG service at <strong>/api/summarize</strong> to generate insights.
            </p>
          </div>

          {/* Trending Topics — needs backend data */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <TrendingUp size={18} className="section-title-icon" />
                Trending
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "120px", gap: "12px" }}>
              <TrendingUp size={28} style={{ color: "var(--text-dim)" }} />
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Trending topics will populate from news analysis
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
