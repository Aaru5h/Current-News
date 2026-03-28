"use client";
import React, { useState } from "react";
import {
  TrendingUp,
  BarChart3,
  AlertTriangle,
  Globe,
  Cpu,
  Users,
  ArrowRight,
  Sparkles,
  Flame,
  ShoppingCart,
} from "lucide-react";

const ANALYSES = [
  {
    id: 1,
    title: "Middle East Tensions: Energy Market Outlook",
    tag: "Geopolitics",
    tagColor: "var(--accent-red)",
    desc: "Risk premium rising on major indices...",
    icon: Flame,
  },
  {
    id: 2,
    title: "Consumer Price Index (CPI) Quarterly Report",
    tag: "Economy",
    tagColor: "var(--accent-amber)",
    desc: "Inflation cooling slower than projected...",
    icon: BarChart3,
  },
  {
    id: 3,
    title: "AI Infrastructure Spending Forecasts",
    tag: "Technology",
    tagColor: "var(--accent-blue)",
    desc: "NVIDIA supply chain remains resilient...",
    icon: Cpu,
  },
  {
    id: 4,
    title: "Unemployment Trends in Tech Hubs",
    tag: "Labor",
    tagColor: "var(--accent-purple)",
    desc: "Shift towards specialized roles increases...",
    icon: Users,
  },
];

const CHAIN_EFFECTS = [
  {
    title: "War/Conflict",
    subtitle: "Originating Factor",
    items: ["→ Rising Prices", "→ Livelihood Crisis", "• unemployment", "• death toll impact", "• other factors..."],
    color: "var(--accent-red)",
  },
  {
    title: "Prices",
    subtitle: "Secondary Effect",
    items: ["Chain impact on consumer behavior"],
    color: "var(--accent-amber)",
  },
  {
    title: "Livelihood",
    subtitle: "Consumer Reality",
    items: ["Affected by work stress & localized economic shocks", "Multiple layers of social impact requiring long-term structural analysis."],
    color: "var(--accent-blue)",
  },
];

export default function MarketsPage() {
  const [selectedAnalysis, setSelectedAnalysis] = useState(ANALYSES[0]);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Markets & Analysis</h1>
        <p className="page-subtitle">Deep-dive research and market chain effect analysis</p>
      </div>

      {/* Market Summary Stats */}
      <div className="stats-row" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[
          { label: "S&P 500", value: "5,234.18", change: "+0.52%", up: true },
          { label: "NASDAQ", value: "16,428.82", change: "+0.87%", up: true },
          { label: "DOW 30", value: "39,512.40", change: "-0.12%", up: false },
          { label: "VIX", value: "14.32", change: "-2.1%", up: false },
        ].map((m) => (
          <div key={m.label} className="stat-card">
            <div className="stat-label">{m.label}</div>
            <div className="stat-value">{m.value}</div>
            <div className={`stat-change ${m.up ? "positive" : "negative"}`}>
              {m.up ? <TrendingUp size={12} style={{ display: "inline", verticalAlign: "middle" }} /> : null} {m.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid-main-side">
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Analysis Feed */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <BarChart3 size={18} className="section-title-icon" />
                Latest Analysis
              </h2>
              <span className="section-badge badge-green">● Live Updates</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {ANALYSES.map((analysis) => {
                const Icon = analysis.icon;
                return (
                  <div
                    key={analysis.id}
                    className="analysis-card"
                    onClick={() => setSelectedAnalysis(analysis)}
                    style={
                      selectedAnalysis.id === analysis.id
                        ? { borderColor: "rgba(59,130,246,0.4)", background: "rgba(59,130,246,0.04)" }
                        : {}
                    }
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          background: `${analysis.tagColor}15`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          color: analysis.tagColor,
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="analysis-card-tag" style={{ color: analysis.tagColor }}>{analysis.tag}</div>
                        <div className="analysis-card-title">{analysis.title}</div>
                        <div className="analysis-card-desc">{analysis.desc}</div>
                      </div>
                      <ArrowRight size={16} style={{ color: "var(--text-dim)", marginTop: "4px", flexShrink: 0 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <Sparkles size={18} style={{ color: "var(--accent-purple)" }} />
                Analysis: {selectedAnalysis.title}
              </h2>
            </div>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "20px" }}>
              AI Analysis predicts immediate impact on shipping lanes in the Strait of Hormuz.
              Supply chain disruptions expected across semiconductor and energy verticals with
              cascading effects on consumer pricing and labor markets.
            </p>

            {/* Market Chain Effects */}
            <div className="section-header" style={{ marginTop: "24px" }}>
              <h3 className="section-title" style={{ fontSize: "0.95rem" }}>
                <Globe size={16} style={{ color: "var(--accent-blue)" }} />
                Market Chain Effects
              </h3>
            </div>
            <div className="grid-3">
              {CHAIN_EFFECTS.map((effect, i) => (
                <div key={i} className="chain-effect">
                  <div className="chain-effect-header" style={{ color: effect.color }}>
                    {effect.title}
                  </div>
                  <div className="chain-effect-subtitle">{effect.subtitle}</div>
                  <div className="chain-effect-items">
                    {effect.items.map((item, j) => (
                      <div key={j} className="chain-effect-item">
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Sector Performance */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">Sector Performance</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { sector: "Technology", change: "+1.24%", up: true },
                { sector: "Energy", change: "+2.18%", up: true },
                { sector: "Healthcare", change: "+0.45%", up: true },
                { sector: "Financials", change: "-0.32%", up: false },
                { sector: "Consumer", change: "-0.87%", up: false },
                { sector: "Real Estate", change: "-1.15%", up: false },
              ].map((s) => (
                <div key={s.sector} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--text-main)" }}>{s.sector}</span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 600, color: s.up ? "var(--accent-green)" : "var(--accent-red)", fontVariantNumeric: "tabular-nums" }}>
                    {s.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Fear & Greed */}
          <div className="card" style={{ textAlign: "center", padding: "28px" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: "12px" }}>
              Fear & Greed Index
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--accent-amber)", marginBottom: "4px" }}>58</div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--accent-amber)" }}>Neutral</div>
            <div style={{ width: "100%", height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.06)", marginTop: "16px", overflow: "hidden" }}>
              <div style={{ width: "58%", height: "100%", borderRadius: "3px", background: "linear-gradient(90deg, var(--accent-red), var(--accent-amber), var(--accent-green))" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
              <span style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>Extreme Fear</span>
              <span style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>Extreme Greed</span>
            </div>
          </div>

          {/* Key Events */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <AlertTriangle size={18} style={{ color: "var(--accent-amber)" }} />
                Key Events
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { event: "FOMC Meeting", date: "Mar 28", impact: "High" },
                { event: "CPI Data Release", date: "Apr 2", impact: "High" },
                { event: "NVDA Earnings", date: "Apr 15", impact: "Medium" },
                { event: "Jobs Report", date: "Apr 5", impact: "High" },
              ].map((e, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-main)" }}>{e.event}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{e.date}</div>
                  </div>
                  <span className={`section-badge ${e.impact === "High" ? "badge-red" : "badge-amber"}`}>{e.impact}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
