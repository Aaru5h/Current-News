"use client";
import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Brain,
  ShieldAlert,
  Sparkles,
  BarChart3,
  Activity,
  Loader2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DashboardPage() {
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const newsRes = await fetch(`${API_URL}/api/news/latest`);
        if (newsRes.ok) {
          const newsData = await newsRes.json();
          setLatestNews(newsData.data || []);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Real-time market intelligence overview</p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn btn-ghost">
            <BarChart3 size={16} /> Compare
          </button>
          <button className="btn btn-primary">
            <Activity size={16} /> Trade
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="card" style={{ marginBottom: "24px", padding: "20px", borderLeft: "3px solid var(--accent-blue)" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
          Connect your backend APIs to populate the dashboard with live market data, portfolio stats, and AI signals.
          Real-time data flows through <strong style={{ color: "var(--text-main)" }}>/api/market</strong>, <strong style={{ color: "var(--text-main)" }}>/api/news</strong>, and <strong style={{ color: "var(--text-main)" }}>/api/ai</strong> endpoints.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid-main-side">
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Latest News */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <TrendingUp size={18} className="section-title-icon" />
                Latest News
              </h2>
              <span className="section-badge badge-blue">
                {latestNews.length} articles
              </span>
            </div>
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px", gap: "10px" }}>
                <Loader2 size={18} className="spin" style={{ color: "var(--accent-blue)" }} />
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading news feed...</span>
              </div>
            ) : latestNews.length > 0 ? (
              <div>
                {latestNews.slice(0, 6).map((article, i) => (
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
                      {(article.summary || article.content || "").substring(0, 150)}...
                    </div>
                    <div className="feed-item-meta" style={{ marginTop: "8px" }}>
                      <span>{article.source}</span>
                      <span style={{ marginLeft: "12px", color: "var(--text-dim)" }}>
                        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ""}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "200px", gap: "12px" }}>
                <TrendingUp size={32} style={{ color: "var(--text-dim)" }} />
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No news articles yet</span>
                <span style={{ color: "var(--text-dim)", fontSize: "0.78rem" }}>
                  Trigger a fetch via POST /api/news/fetch
                </span>
              </div>
            )}
          </div>

          {/* AI Analysis Placeholder */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <Brain size={18} style={{ color: "var(--accent-purple)" }} />
                AI Analysis
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "180px", gap: "12px" }}>
              <Brain size={32} style={{ color: "var(--text-dim)" }} />
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                AI analysis will appear here when signals are generated
              </span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
                Use POST /api/ai/analyze to trigger analysis
              </span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Market Data */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <Sparkles size={18} style={{ color: "var(--accent-amber)" }} />
                Market Data
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "200px", gap: "12px" }}>
              <BarChart3 size={32} style={{ color: "var(--text-dim)" }} />
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                No market data loaded
              </span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
                Refresh via POST /api/market/data/refresh
              </span>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <ShieldAlert size={18} style={{ color: "var(--accent-amber)" }} />
                Risk Assessment
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "120px", gap: "12px" }}>
              <ShieldAlert size={28} style={{ color: "var(--text-dim)" }} />
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Risk analysis available after AI signals are generated
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
