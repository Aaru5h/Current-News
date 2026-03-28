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
} from "lucide-react";

const FEED_ITEMS = [
  {
    title: "OPEC+ Considers Further Output Cuts Amid Geopolitical Uncertainty",
    tag: "Energy",
    time: "12 mins ago",
    color: "var(--accent-amber)",
  },
  {
    title: "Semiconductor Lead Times Surge as Port Congestion Worsens in East Asia",
    tag: "Supply Chain",
    time: "34 mins ago",
    color: "var(--accent-red)",
  },
  {
    title: "Federal Reserve Hints at 'Higher for Longer' Strategy to Combat Core Inflation",
    tag: "Policy",
    time: "1 hour ago",
    color: "var(--accent-purple)",
  },
  {
    title: "Consumer Spending Trends Shift as Fuel Prices Hit 6-Month Highs",
    tag: "Economy",
    time: "2 hours ago",
    color: "var(--accent-blue)",
  },
];

const IMPACTED_ASSETS = [
  { ticker: "TSM", risk: "Supply Chain Risk: High", color: "var(--accent-red)" },
  { ticker: "AAPL", risk: "Consumer Pricing: Mod", color: "var(--accent-amber)" },
  { ticker: "XOM", risk: "Energy Tailwind: High", color: "var(--accent-green)" },
];

export default function NewsPage() {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${API_URL}/api/news`);
        if (!response.ok) throw new Error("Failed to fetch news");
        const data = await response.json();
        setNewsItems(data.articles || []);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">News & Sentiment</h1>
        <p className="page-subtitle">AI-powered market intelligence and news analysis</p>
      </div>

      <div className="grid-main-side">
        {/* Main Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Real-time Feed */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <Newspaper size={18} className="section-title-icon" />
                Real-time Feed
              </h2>
              <span className="section-badge badge-green">● Live</span>
            </div>
            <div>
              {FEED_ITEMS.map((item, i) => (
                <div key={i} className="feed-item">
                  <div className="feed-item-tag" style={{ color: item.color }}>{item.tag}</div>
                  <div className="feed-item-title">{item.title}</div>
                  <div className="feed-item-meta">
                    <span>{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live API News */}
          {newsItems.length > 0 && (
            <div className="card">
              <div className="section-header">
                <h2 className="section-title">
                  <Globe size={18} className="section-title-icon" />
                  Latest from Sources
                </h2>
                <span className="section-badge badge-blue">{newsItems.length} articles</span>
              </div>
              <div>
                {newsItems.slice(0, 8).map((article, i) => (
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
                      {article.summary?.substring(0, 150)}...
                    </div>
                    <div className="feed-item-meta" style={{ marginTop: "8px" }}>
                      <span>{article.source}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px" }}>
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading intelligence feed...</span>
            </div>
          )}

          {/* Causal Intelligence Chain */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <Link2 size={18} style={{ color: "var(--accent-purple)" }} />
                Causal Intelligence Chain
              </h2>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "20px" }}>
              Tracing the impact of &apos;Geopolitical Tensions&apos; across market nodes
            </p>
            <div className="causal-chain">
              <div className="causal-node">
                <div className="causal-node-dot trigger">
                  <AlertTriangle size={18} />
                </div>
                <div className="causal-node-label">Geopolitical Event</div>
                <div className="causal-node-sublabel">Trigger</div>
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

          {/* Impacted Assets */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <Link2 size={18} className="section-title-icon" />
                Highly Impacted Assets
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {IMPACTED_ASSETS.map((asset) => (
                <div key={asset.ticker} className="impacted-asset">
                  <div className="impacted-asset-ticker">{asset.ticker}</div>
                  <div className="impacted-asset-risk" style={{ color: asset.color }}>{asset.risk}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* AI Market Mood */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <Brain size={18} style={{ color: "var(--accent-purple)" }} />
                AI Market Mood
              </h2>
            </div>
            <div className="mood-gauge">
              <div className="mood-gauge-ring" style={{ background: "conic-gradient(var(--accent-amber) 0% 62%, rgba(255,255,255,0.06) 62% 100%)" }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "var(--bg-surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="mood-gauge-value">62</span>
                </div>
              </div>
              <div>
                <div className="mood-gauge-label">Cautiously Bullish</div>
                <div className="mood-gauge-desc">
                  Mixed signals from macro data but strong institutional support in tech sector.
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
              <span className="section-badge badge-green">Tech: Bullish</span>
              <span className="section-badge badge-amber">Energy: Neutral</span>
              <span className="section-badge badge-red">Bonds: Bearish</span>
            </div>
          </div>

          {/* AI Summary */}
          <div className="ai-summary">
            <div className="ai-summary-title">
              <Sparkles size={14} /> AI Summary
            </div>
            <p className="ai-summary-text">
              Based on current geopolitical shifts, StockPulse AI predicts a volatility spike
              in the tech sector within 48 hours. Long-term positions in energy remain favored
              as supply constraints solidify.
            </p>
          </div>

          {/* Trending Topics */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <TrendingUp size={18} className="section-title-icon" />
                Trending
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { topic: "AI Chip Demand", mentions: "2.4k mentions", change: "+340%" },
                { topic: "Oil Futures", mentions: "1.8k mentions", change: "+128%" },
                { topic: "Fed Rate Decision", mentions: "3.1k mentions", change: "+89%" },
                { topic: "Crypto ETF Inflows", mentions: "1.2k mentions", change: "+215%" },
              ].map((t, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>{t.topic}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{t.mentions}</div>
                  </div>
                  <span className="section-badge badge-green">{t.change}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
