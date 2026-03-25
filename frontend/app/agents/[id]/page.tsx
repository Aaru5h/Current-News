"use client";
import React from "react";
import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Activity,
  Clock,
  Settings,
  Zap,
  TrendingUp,
  ShieldAlert,
  Target,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";

const AGENT_DATA: Record<string, {
  name: string;
  desc: string;
  icon: string;
  winRate: string;
  uptime: string;
  roi: string;
  totalTrades: string;
  configs: { label: string; desc: string; value: string }[];
  scheduled: { label: string; detail: string }[];
  history: { title: string; detail: string; time: string; dotColor: string }[];
}> = {
  "alpha-hunter": {
    name: "Alpha Hunter",
    desc: "High-frequency momentum scalper • Active since Oct 2023",
    icon: "🎯",
    winRate: "68.5%",
    uptime: "99.9%",
    roi: "+12.4%",
    totalTrades: "1,240",
    configs: [
      { label: "RSI Overbought/Oversold", desc: "Trigger at 30/70 thresholds on 15m candle", value: "30/70" },
      { label: "Volume Spikes", desc: "Detect 200% increase in 1m volume", value: "200%" },
      { label: "Max Drawdown", desc: "Maximum drawdown allowed per 24-hour cycle", value: "12%" },
    ],
    scheduled: [
      { label: "Hourly Health Scan", detail: "Next execution in 24 mins" },
      { label: "Daily Report Generation", detail: "Scheduled: 00:00 UTC" },
    ],
    history: [
      { title: "Order Executed: BUY", detail: "Asset: BTC/USDT | Amount: 0.25 | Price: $64,231", time: "2 mins ago", dotColor: "green" },
      { title: "Pattern Detected", detail: "Bullish divergence on 1h BTC timeframe.", time: "18 mins ago", dotColor: "blue" },
      { title: "Volatility Alert", detail: "Market volatility exceeded 5% threshold.", time: "1 hour ago", dotColor: "amber" },
      { title: "Take Profit: SELL", detail: "Asset: ETH/USDT | Profit: +3.2% ($452)", time: "3 hours ago", dotColor: "green" },
    ],
  },
  "sentiment-sentinel": {
    name: "Sentiment Sentinel",
    desc: "Global sentiment monitor • Active since Sep 2023",
    icon: "🛡️",
    winRate: "72.3%",
    uptime: "99.8%",
    roi: "+8.2%",
    totalTrades: "892",
    configs: [
      { label: "Sentiment Threshold", desc: "Alert when sentiment score drops below threshold", value: "-0.3" },
      { label: "Source Coverage", desc: "Number of news sources monitored", value: "50+" },
      { label: "Social Media Scan", desc: "Frequency of social media analysis", value: "5 min" },
    ],
    scheduled: [
      { label: "Sentiment Report", detail: "Every 30 minutes" },
      { label: "Weekly Digest", detail: "Scheduled: Monday 09:00 UTC" },
    ],
    history: [
      { title: "Sentiment Alert", detail: "AI chip mentions spiked 340% in 1 hour", time: "15 mins ago", dotColor: "amber" },
      { title: "Report Generated", detail: "Daily sentiment analysis for tech sector", time: "2 hours ago", dotColor: "blue" },
      { title: "Trend Detected", detail: "Emerging positive sentiment in renewable energy", time: "5 hours ago", dotColor: "green" },
    ],
  },
  "risk-warden": {
    name: "Risk Warden",
    desc: "Automated risk management • Active since Nov 2023",
    icon: "🔒",
    winRate: "N/A",
    uptime: "95.2%",
    roi: "N/A",
    totalTrades: "347",
    configs: [
      { label: "VIX Threshold", desc: "Trigger risk reduction when VIX exceeds threshold", value: "25" },
      { label: "Position Sizing", desc: "Maximum position size relative to portfolio", value: "5%" },
      { label: "Stop-Loss Range", desc: "Dynamic stop-loss based on ATR", value: "2x ATR" },
    ],
    scheduled: [
      { label: "Risk Assessment", detail: "Every 15 minutes" },
      { label: "Portfolio Rebalance Check", detail: "Daily at 16:00 UTC" },
    ],
    history: [
      { title: "Stop-Loss Adjusted", detail: "NVDA position stop-loss moved to $720", time: "45 mins ago", dotColor: "amber" },
      { title: "Risk Alert Cleared", detail: "VIX dropped below threshold", time: "3 hours ago", dotColor: "green" },
      { title: "Position Reduced", detail: "TSLA position reduced by 20%", time: "Yesterday", dotColor: "red" },
    ],
  },
};

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const agent = AGENT_DATA[id] || AGENT_DATA["alpha-hunter"];

  return (
    <div>
      {/* Back Button */}
      <Link href="/agents" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.85rem", textDecoration: "none", marginBottom: "20px", fontWeight: 500 }}>
        <ArrowLeft size={16} /> Back to Agents
      </Link>

      {/* Header */}
      <div className="page-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "2rem" }}>{agent.icon}</span>
          <div>
            <h1 className="page-title">{agent.name}</h1>
            <p className="page-subtitle">{agent.desc}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="btn btn-ghost">
            <Settings size={16} /> Configure
          </button>
          <button className="btn btn-primary">
            <Activity size={16} /> Live View
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="stat-card">
          <div className="stat-label">Win Rate</div>
          <div className="stat-value green">{agent.winRate}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Uptime</div>
          <div className="stat-value blue">{agent.uptime}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Monthly ROI</div>
          <div className="stat-value green">{agent.roi}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Trades</div>
          <div className="stat-value">{agent.totalTrades}</div>
        </div>
      </div>

      <div className="grid-main-side">
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Behavior & Logic Settings */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <Settings size={18} className="section-title-icon" />
                Behavior & Logic Settings
              </h2>
            </div>
            <div>
              {agent.configs.map((config, i) => (
                <div key={i} className="config-row">
                  <div>
                    <div className="config-label">{config.label}</div>
                    <div className="config-desc">{config.desc}</div>
                  </div>
                  <div className="config-value">{config.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Action History */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <Clock size={18} className="section-title-icon" />
                Action History
              </h2>
            </div>
            <div className="timeline">
              {agent.history.map((item, i) => (
                <div key={i} className="timeline-item">
                  <div className={`timeline-dot ${item.dotColor}`} />
                  <div className="timeline-title">{item.title}</div>
                  <div className="timeline-detail">{item.detail}</div>
                  <div className="timeline-time">{item.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Scheduled Actions */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <Clock size={18} style={{ color: "var(--accent-amber)" }} />
                Scheduled Actions
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {agent.scheduled.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-amber)", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-main)" }}>{s.label}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Chart Placeholder */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <TrendingUp size={18} className="section-title-icon" />
                Performance
              </h2>
            </div>
            <div className="chart-area" style={{ height: "180px" }}>
              <svg viewBox="0 0 400 160" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
                <defs>
                  <linearGradient id="agentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(139,92,246,0.2)" />
                    <stop offset="100%" stopColor="rgba(139,92,246,0)" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,120 C40,100 80,110 120,80 C160,60 200,90 240,50 C280,70 320,30 360,40 L400,25 L400,160 L0,160 Z"
                  fill="url(#agentGrad)"
                />
                <path
                  d="M0,120 C40,100 80,110 120,80 C160,60 200,90 240,50 C280,70 320,30 360,40 L400,25"
                  fill="none"
                  stroke="var(--accent-purple)"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">Quick Actions</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }}>
                <Zap size={14} /> Force Execute Now
              </button>
              <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }}>
                <ShieldAlert size={14} /> Reset Risk Parameters
              </button>
              <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }}>
                <Target size={14} /> Backtest Strategy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
