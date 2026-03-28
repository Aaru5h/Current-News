"use client";
import React from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Award,
  PieChart,
} from "lucide-react";

const HOLDINGS = [
  { ticker: "AAPL", name: "Apple Inc.", sector: "Technology", value: "$38,430", pnl: "+12.4%", up: true, color: "var(--accent-blue)" },
  { ticker: "TSLA", name: "Tesla Motors", sector: "Automotive", value: "$34,210", pnl: "+8.7%", up: true, color: "var(--accent-green)" },
  { ticker: "NVDA", name: "NVIDIA Corp", sector: "Semiconductors", value: "$51,952", pnl: "+24.2%up", up: true, color: "var(--accent-purple)" },
];

const ACTIVITY = [
  { title: "Bought AAPL", detail: "10 shares @ $192.15", time: "Today, 2:14 PM", type: "buy" },
  { title: "Dividend Payout", detail: "KO - Coca Cola Company", time: "Yesterday", type: "dividend" },
  { title: "Sold SPY", detail: "5 shares @ $482.10", time: "Feb 12, 11:05 AM", type: "sell" },
];

export default function PortfolioPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Portfolio</h1>
        <p className="page-subtitle">Your investment portfolio overview & analytics</p>
      </div>

      {/* Portfolio Value Banner */}
      <div className="card" style={{ marginBottom: "24px", padding: "32px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
              Total Portfolio Value
            </div>
            <div className="portfolio-value">$124,592.00</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
              <span className="section-badge badge-green" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <TrendingUp size={12} /> +$8,432.50 (7.25%)
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>All time</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div className="stat-card" style={{ padding: "14px 20px", minWidth: "120px" }}>
              <div className="stat-label">Buying Power</div>
              <div className="stat-value" style={{ fontSize: "1.1rem" }}>$12,400</div>
            </div>
            <div className="stat-card" style={{ padding: "14px 20px", minWidth: "120px" }}>
              <div className="stat-label">Cash</div>
              <div className="stat-value" style={{ fontSize: "1.1rem" }}>$3,150</div>
            </div>
            <div className="stat-card" style={{ padding: "14px 20px", minWidth: "120px" }}>
              <div className="stat-label">Margin</div>
              <div className="stat-value" style={{ fontSize: "1.1rem" }}>$0.00</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid-main-side">
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Portfolio Chart Placeholder */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <PieChart size={18} className="section-title-icon" />
                Portfolio Performance
              </h2>
              <div style={{ display: "flex", gap: "6px" }}>
                {["1W", "1M", "3M", "YTD", "1Y"].map((t) => (
                  <button
                    key={t}
                    className="indicator-pill"
                    style={t === "YTD" ? { background: "rgba(59,130,246,0.15)", color: "var(--accent-blue)", borderColor: "rgba(59,130,246,0.3)" } : {}}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="chart-area" style={{ height: "220px" }}>
              <svg viewBox="0 0 800 200" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
                <defs>
                  <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(16,185,129,0.25)" />
                    <stop offset="100%" stopColor="rgba(16,185,129,0)" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,160 C80,140 120,150 200,120 C280,100 320,130 400,80 C480,60 520,90 600,50 C680,70 720,40 800,30 L800,200 L0,200 Z"
                  fill="url(#portGrad)"
                />
                <path
                  d="M0,160 C80,140 120,150 200,120 C280,100 320,130 400,80 C480,60 520,90 600,50 C680,70 720,40 800,30"
                  fill="none"
                  stroke="var(--accent-green)"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>

          {/* Holdings */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <Wallet size={18} className="section-title-icon" />
                My Holdings
              </h2>
              <span className="section-badge badge-blue">{HOLDINGS.length} positions</span>
            </div>
            <div>
              {HOLDINGS.map((h) => (
                <div key={h.ticker} className="holdings-row">
                  <div className="holdings-left">
                    <div className="holdings-icon" style={{ background: `${h.color}15`, color: h.color }}>
                      {h.ticker.slice(0, 2)}
                    </div>
                    <div>
                      <div className="holdings-name">{h.name}</div>
                      <div className="holdings-sector">{h.sector}</div>
                    </div>
                  </div>
                  <div className="holdings-right">
                    <div className="holdings-value">{h.value}</div>
                    <div className="holdings-pnl" style={{ color: h.up ? "var(--accent-green)" : "var(--accent-red)" }}>
                      {h.up ? <ArrowUpRight size={12} style={{ display: "inline" }} /> : <ArrowDownRight size={12} style={{ display: "inline" }} />}{" "}
                      {h.pnl}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Risk Profile */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <ShieldCheck size={18} style={{ color: "var(--accent-green)" }} />
                Portfolio Risk
              </h2>
            </div>
            <div style={{ padding: "12px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <span className="section-badge badge-green" style={{ fontSize: "0.75rem", padding: "5px 14px" }}>Moderate Low</span>
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                Diversified across 12 sectors with a focus on Tech & Energy.
              </p>
            </div>
            <div className="divider" />
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { label: "Equity Ratio", value: "92.4%" },
                { label: "Beta", value: "1.12" },
                { label: "Net Deposits", value: "$88,400" },
              ].map((m) => (
                <div key={m.label} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{m.label}</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-main)" }}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">Activity</h2>
            </div>
            <div>
              {ACTIVITY.map((a, i) => (
                <div key={i} className="activity-item">
                  <div
                    className="activity-icon"
                    style={{
                      background:
                        a.type === "buy"
                          ? "rgba(16,185,129,0.1)"
                          : a.type === "sell"
                            ? "rgba(239,68,68,0.1)"
                            : "rgba(59,130,246,0.1)",
                      color:
                        a.type === "buy"
                          ? "var(--accent-green)"
                          : a.type === "sell"
                            ? "var(--accent-red)"
                            : "var(--accent-blue)",
                    }}
                  >
                    {a.type === "buy" ? (
                      <ArrowUpRight size={16} />
                    ) : a.type === "sell" ? (
                      <ArrowDownRight size={16} />
                    ) : (
                      <DollarSign size={16} />
                    )}
                  </div>
                  <div>
                    <div className="activity-title">{a.title}</div>
                    <div className="activity-detail">{a.detail}</div>
                    <div className="activity-time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievement */}
          <div className="card" style={{ textAlign: "center", padding: "28px" }}>
            <Award size={28} style={{ color: "var(--accent-amber)", marginBottom: "12px" }} />
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "4px" }}>Achievement</div>
            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--accent-amber)" }}>Top 5%</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>of all platform investors</div>
          </div>
        </div>
      </div>
    </div>
  );
}
