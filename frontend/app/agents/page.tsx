"use client";
import React from "react";
import Link from "next/link";
import {
  Bot,
  Zap,
  Clock,
  Target,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  AlertTriangle,
  FileText,
  Lightbulb,
} from "lucide-react";

const AGENTS = [
  {
    id: "sentiment-sentinel",
    name: "Sentiment Sentinel",
    status: "Running",
    statusColor: "var(--accent-green)",
    desc: "Monitors global news cycles and social media mentions for trend shifts in tech sectors.",
    lastActivity: "Recent Activity",
    icon: "🛡️",
  },
  {
    id: "alpha-hunter",
    name: "Alpha Hunter",
    status: "Running",
    statusColor: "var(--accent-green)",
    desc: "Scans 500+ tickers for technical breakout patterns and high-probability momentum entries.",
    lastActivity: "Recent Activity",
    icon: "🎯",
  },
  {
    id: "risk-warden",
    name: "Risk Warden",
    status: "Paused",
    statusColor: "var(--accent-amber)",
    desc: "Automatically adjusts stop-losses and position sizing based on real-time volatility index (VIX).",
    lastActivity: "Last Activity",
    icon: "🔒",
  },
];

const FEED = [
  {
    title: "Alpha Hunter: Buy Executed",
    detail: "100 shares $AMD @ $164.20",
    time: "2 mins ago",
    type: "buy" as const,
  },
  {
    title: "Sentinel: Sentiment Alert",
    detail: 'Massive spike in "AI Chip" mentions',
    time: "15 mins ago",
    type: "alert" as const,
  },
  {
    title: "Report Bot: Data Synced",
    detail: "Weekly portfolio CSV generated",
    time: "1 hour ago",
    type: "info" as const,
  },
];

export default function AgentsPage() {
  return (
    <div>
      <div className="page-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 className="page-title">AI Agents Manager</h1>
          <p className="page-subtitle">Oversee your automated analytical workforce</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} /> New Agent
        </button>
      </div>

      {/* Stats */}
      <div className="stats-row" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="stat-card">
          <div className="stat-label">Tasks Completed</div>
          <div className="stat-value blue">1,284</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Hours Saved</div>
          <div className="stat-value green">42.5h</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg. Accuracy</div>
          <div className="stat-value purple">99.2%</div>
        </div>
      </div>

      {/* Section Title */}
      <div className="section-header">
        <h2 className="section-title">
          <Bot size={18} className="section-title-icon" />
          Active Agents
        </h2>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid-3" style={{ marginBottom: "24px" }}>
        {AGENTS.map((agent) => (
          <Link key={agent.id} href={`/agents/${agent.id}`} style={{ textDecoration: "none" }}>
            <div className="agent-card" style={{ height: "100%" }}>
              <div className="agent-card-header">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "1.3rem" }}>{agent.icon}</span>
                  <div className="agent-card-title">{agent.name}</div>
                </div>
                <span
                  className="section-badge"
                  style={{
                    background: `${agent.statusColor}15`,
                    color: agent.statusColor,
                    border: `1px solid ${agent.statusColor}30`,
                  }}
                >
                  {agent.status}
                </span>
              </div>
              <div className="agent-card-desc">{agent.desc}</div>
              <div className="agent-card-footer">
                <Clock size={12} /> {agent.lastActivity}
              </div>
            </div>
          </Link>
        ))}

        {/* Create Card */}
        <div className="agent-create-card">
          <Plus size={28} style={{ color: "var(--text-dim)", marginBottom: "12px" }} />
          <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "6px" }}>
            Create New Agent
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            Use a template or build custom logic to automate your trading strategy.
          </div>
        </div>
      </div>

      {/* Bottom Section: Execution Feed + Tip */}
      <div className="grid-2">
        {/* Execution Feed */}
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">
              <Zap size={18} style={{ color: "var(--accent-amber)" }} />
              Live Execution Feed
            </h2>
            <span className="section-badge badge-green">● Live</span>
          </div>
          <div>
            {FEED.map((item, i) => (
              <div key={i} className="execution-feed-item">
                <div className={`execution-dot ${item.type}`} />
                <div>
                  <div className="execution-feed-title">{item.title}</div>
                  <div className="execution-feed-detail">{item.detail}</div>
                  <div className="execution-feed-time">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Optimization Tip */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="tip-box">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", fontWeight: 700, color: "var(--accent-cyan)", fontSize: "0.85rem" }}>
              <Lightbulb size={16} /> Optimization Tip
            </div>
            Deploy &apos;Correlation Scout&apos; to automatically find hedging opportunities when volatility rises above 20%.
          </div>

          {/* Agent Performance Overview */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <Target size={18} className="section-title-icon" />
                Agent Performance
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {AGENTS.map((agent) => (
                <div key={agent.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.9rem" }}>{agent.icon}</span>
                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-main)" }}>{agent.name}</span>
                  </div>
                  <div style={{ width: "100px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.06)" }}>
                    <div
                      style={{
                        height: "4px",
                        borderRadius: "2px",
                        background: agent.statusColor,
                        width: agent.status === "Running" ? "85%" : "45%",
                      }}
                    />
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
