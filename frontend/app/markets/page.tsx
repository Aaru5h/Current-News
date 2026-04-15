"use client";
import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Globe,
  Sparkles,
  Loader2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function MarketsPage() {
  const [macroData, setMacroData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const macroRes = await fetch(`${API_URL}/api/market/macro`);
        if (macroRes.ok) {
          const data = await macroRes.json();
          setMacroData(data);
        }
      } catch (err: any) {
        console.error("Error fetching market data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketData();
  }, []);

  // Extract latest FRED observations if available
  const fredObservations = macroData?.data?.slice(0, 6) || [];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Markets &amp; Analysis</h1>
        <p className="page-subtitle">Deep-dive research and market analysis</p>
      </div>

      {/* Macro Data Summary */}
      {fredObservations.length > 0 && (
        <div className="card" style={{ marginBottom: "24px" }}>
          <div className="section-header">
            <h2 className="section-title">
              <Globe size={18} className="section-title-icon" />
              US Macroeconomic Data — {macroData?.indicator || "FRED"}
            </h2>
            <span className="section-badge badge-blue">{macroData?.source || "FRED"}</span>
          </div>
          <div className="stats-row" style={{ gridTemplateColumns: `repeat(${Math.min(fredObservations.length, 4)}, 1fr)` }}>
            {fredObservations.slice(0, 4).map((obs: any, i: number) => (
              <div key={i} className="stat-card">
                <div className="stat-label">{obs.date}</div>
                <div className="stat-value">{obs.value}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid-main-side">
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Market Data */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <BarChart3 size={18} className="section-title-icon" />
                Market Data
              </h2>
            </div>
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "250px", gap: "10px" }}>
                <Loader2 size={18} className="spin" style={{ color: "var(--accent-blue)" }} />
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading market data...</span>
              </div>
            ) : error ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "250px", gap: "12px" }}>
                <AlertTriangle size={32} style={{ color: "var(--accent-amber)" }} />
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Could not load market data</span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>{error}</span>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "250px", gap: "12px" }}>
                <BarChart3 size={36} style={{ color: "var(--text-dim)" }} />
                <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)" }}>
                  Market data available via API
                </span>
                <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", textAlign: "center", maxWidth: "400px" }}>
                  Query individual symbols via GET /api/market/data/:symbol or refresh all data via POST /api/market/data/refresh
                </span>
              </div>
            )}
          </div>

          {/* Analysis Section */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <Sparkles size={18} style={{ color: "var(--accent-purple)" }} />
                AI Analysis
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "200px", gap: "12px" }}>
              <Sparkles size={32} style={{ color: "var(--text-dim)" }} />
              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                AI market analysis will populate here
              </span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
                Run POST /api/ai/analyze to generate AI-powered insights
              </span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Sector & Index tracking */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">Sector Performance</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "180px", gap: "12px" }}>
              <TrendingUp size={28} style={{ color: "var(--text-dim)" }} />
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Sector data will load from market feeds
              </span>
            </div>
          </div>

          {/* Macro Indicators */}
          {fredObservations.length > 0 && (
            <div className="card">
              <div className="section-header">
                <h2 className="section-title">
                  <Globe size={18} className="section-title-icon" />
                  FRED History
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {fredObservations.map((obs: any, i: number) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{obs.date}</span>
                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-main)", fontVariantNumeric: "tabular-nums" }}>
                      {obs.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Events */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <AlertTriangle size={18} style={{ color: "var(--accent-amber)" }} />
                Key Events
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "120px", gap: "12px" }}>
              <AlertTriangle size={28} style={{ color: "var(--text-dim)" }} />
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Event tracking coming soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
