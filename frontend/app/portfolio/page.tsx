"use client";
import React, { useState, useEffect } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  PieChart,
  Loader2,
  Plus,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [portfolioValue, setPortfolioValue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        // Attempt to fetch portfolio — userId would come from auth in a real app
        const portfolioRes = await fetch(`${API_URL}/api/portfolio/default`);
        if (portfolioRes.ok) {
          const data = await portfolioRes.json();
          setPortfolio(data.data || null);
        }

        const valueRes = await fetch(`${API_URL}/api/portfolio/default/value`);
        if (valueRes.ok) {
          const data = await valueRes.json();
          setPortfolioValue(data.data || null);
        }
      } catch (err: any) {
        console.error("Error fetching portfolio:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const holdings = portfolio?.holdings || [];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Portfolio</h1>
        <p className="page-subtitle">Your investment portfolio overview &amp; analytics</p>
      </div>

      {/* Portfolio Value Banner */}
      <div className="card" style={{ marginBottom: "24px", padding: "32px" }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80px", gap: "10px" }}>
            <Loader2 size={18} className="spin" style={{ color: "var(--accent-blue)" }} />
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading portfolio...</span>
          </div>
        ) : portfolioValue ? (
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                Total Portfolio Value
              </div>
              <div className="portfolio-value">
                ${portfolioValue.totalValue?.toLocaleString() || "0.00"}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80px", gap: "12px" }}>
            <Wallet size={32} style={{ color: "var(--text-dim)" }} />
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              No portfolio data available
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
              Add holdings via POST /api/portfolio/:userId/holdings
            </span>
          </div>
        )}
      </div>

      <div className="grid-main-side">
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Portfolio Chart Area */}
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
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "220px", gap: "12px" }}>
              <PieChart size={36} style={{ color: "var(--text-dim)" }} />
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Performance chart will render with historical data
              </span>
            </div>
          </div>

          {/* Holdings */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <Wallet size={18} className="section-title-icon" />
                My Holdings
              </h2>
              <span className="section-badge badge-blue">{holdings.length} positions</span>
            </div>
            {holdings.length > 0 ? (
              <div>
                {holdings.map((h: any) => (
                  <div key={h.symbol} className="holdings-row">
                    <div className="holdings-left">
                      <div className="holdings-icon" style={{ background: "rgba(59,130,246,0.1)", color: "var(--accent-blue)" }}>
                        {h.symbol?.slice(0, 2)}
                      </div>
                      <div>
                        <div className="holdings-name">{h.symbol}</div>
                        <div className="holdings-sector">{h.quantity} shares @ ${h.avgCost?.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="holdings-right">
                      <div className="holdings-value">
                        ${((h.quantity || 0) * (h.avgCost || 0)).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "180px", gap: "12px" }}>
                <Plus size={28} style={{ color: "var(--text-dim)" }} />
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  No holdings yet
                </span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
                  Add your first holding via the portfolio API
                </span>
              </div>
            )}
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
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "140px", gap: "12px" }}>
              <ShieldCheck size={28} style={{ color: "var(--text-dim)" }} />
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Risk profile calculates from your holdings
              </span>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">Activity</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "140px", gap: "12px" }}>
              <DollarSign size={28} style={{ color: "var(--text-dim)" }} />
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                No recent activity
              </span>
              <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                Transactions will appear here as you trade
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
