"use client";
import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Brain,
  ShieldAlert,
  Sparkles,
  BarChart3,
  Activity,
} from "lucide-react";

const WATCHLIST = [
  { ticker: "AAPL", name: "Apple Inc.", price: "$175.10", change: "-0.45%", negative: true },
  { ticker: "TSLA", name: "Tesla Motors", price: "$171.05", change: "+1.12%", negative: false },
  { ticker: "MSFT", name: "Microsoft", price: "$415.50", change: "+0.88%", negative: false },
  { ticker: "AMZN", name: "Amazon", price: "$178.25", change: "+0.34%", negative: false },
];

const INDICATORS = [
  { label: "RSI (14)", value: "62.4", status: "Neutral" },
  { label: "MACD", value: "Bullish", status: "Crossover" },
  { label: "Bollinger", value: "Upper", status: "Overbought" },
  { label: "EMA 50/200", value: "Golden", status: "Bullish" },
];

export default function DashboardPage() {
  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 className="page-title">NVDA</h1>
          <p className="page-subtitle">NVIDIA Corporation • NASDAQ</p>
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

      {/* Stats Row */}
      <div className="stats-row" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="stat-card">
          <div className="stat-label">Market Cap</div>
          <div className="stat-value">$2.19T</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">P/E Ratio</div>
          <div className="stat-value">74.24</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Vol (Avg)</div>
          <div className="stat-value">48.2M</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Dividend</div>
          <div className="stat-value">0.02%</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid-main-side">
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Chart Area */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <TrendingUp size={18} className="section-title-icon" />
                Price Chart
              </h2>
              <div style={{ display: "flex", gap: "6px" }}>
                {["1D", "1W", "1M", "3M", "1Y", "ALL"].map((t) => (
                  <button
                    key={t}
                    className="indicator-pill"
                    style={t === "1M" ? { background: "rgba(59,130,246,0.15)", color: "var(--accent-blue)", borderColor: "rgba(59,130,246,0.3)" } : {}}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="chart-area">
              <div className="chart-line">
                <svg viewBox="0 0 800 250" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(59,130,246,0.3)" />
                      <stop offset="100%" stopColor="rgba(59,130,246,0)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,200 C50,180 100,190 150,150 C200,110 250,140 300,100 C350,80 400,120 450,70 C500,90 550,50 600,60 C650,40 700,80 750,30 L800,45 L800,250 L0,250 Z"
                    fill="url(#chartGrad)"
                  />
                  <path
                    d="M0,200 C50,180 100,190 150,150 C200,110 250,140 300,100 C350,80 400,120 450,70 C500,90 550,50 600,60 C650,40 700,80 750,30 L800,45"
                    fill="none"
                    stroke="var(--accent-blue)"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Technical Indicators */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <BarChart3 size={18} className="section-title-icon" />
                Technical Indicators
              </h2>
            </div>
            <div className="grid-4">
              {INDICATORS.map((ind) => (
                <div key={ind.label} className="indicator-pill" style={{ flexDirection: "column", alignItems: "flex-start", padding: "14px", gap: "4px" }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>{ind.label}</span>
                  <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-main)" }}>{ind.value}</span>
                  <span style={{ fontSize: "0.68rem", color: "var(--accent-green)" }}>{ind.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Reasoning */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <Brain size={18} style={{ color: "var(--accent-purple)" }} />
                Reasoning & AI Analysis
              </h2>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "20px" }}>
              Our neural model has processed over <strong style={{ color: "var(--text-main)" }}>14.2M data points</strong> including
              real-time order books, sentiment from 50+ financial news sources, and historical volatility cycles.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              {[
                "Earnings momentum shows a 12% alpha relative to sector peers.",
                "Institutional inflow increased by 4.5B in the last session.",
                "Low correlation with macroeconomic drag in current cycle.",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-blue)", marginTop: "7px", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Risk Box */}
            <div className="risk-box">
              <div className="risk-box-title">
                <ShieldAlert size={14} /> Risk Assessment
              </div>
              <p className="risk-box-text">
                &ldquo;The primary risk vector is currently geopolitical supply chain disruption.
                However, inventory levels suggest a 3-month buffer.&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Watchlist */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <Sparkles size={18} style={{ color: "var(--accent-amber)" }} />
                Watchlist
              </h2>
              <span className="section-badge badge-blue">4 Assets</span>
            </div>
            <div>
              {WATCHLIST.map((stock) => (
                <div key={stock.ticker} className="watchlist-item">
                  <div className="watchlist-item-left">
                    <div
                      className="watchlist-ticker-icon"
                      style={
                        stock.negative
                          ? { background: "rgba(239,68,68,0.1)", color: "var(--accent-red)" }
                          : {}
                      }
                    >
                      {stock.ticker.slice(0, 2)}
                    </div>
                    <div>
                      <div className="watchlist-ticker-name">{stock.ticker}</div>
                      <div className="watchlist-ticker-company">{stock.name}</div>
                    </div>
                  </div>
                  <div className="watchlist-item-right">
                    <div className="watchlist-price">{stock.price}</div>
                    <div className={`watchlist-change ${stock.negative ? "negative" : "positive"}`}>
                      {stock.negative ? <TrendingDown size={10} /> : <TrendingUp size={10} />}{" "}
                      {stock.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">Market Summary</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { label: "S&P 500", value: "5,234.18", change: "+0.52%", up: true },
                { label: "NASDAQ", value: "16,428.82", change: "+0.87%", up: true },
                { label: "DOW", value: "39,512.40", change: "-0.12%", up: false },
                { label: "VIX", value: "14.32", change: "-2.1%", up: false },
              ].map((m) => (
                <div key={m.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{m.label}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-main)", fontVariantNumeric: "tabular-nums" }}>{m.value}</span>
                    <span style={{ fontSize: "0.72rem", fontWeight: 600, color: m.up ? "var(--accent-green)" : "var(--accent-red)", fontVariantNumeric: "tabular-nums" }}>
                      {m.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
