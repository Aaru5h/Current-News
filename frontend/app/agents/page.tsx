"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  Zap,
  Clock,
  Target,
  ShieldCheck,
  Plus,
  Lightbulb,
  Loader2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AgentsPage() {
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const res = await fetch(`${API_URL}/api/ai/signals`);
        if (res.ok) {
          const data = await res.json();
          setSignals(data.data || []);
        }
      } catch (err) {
        console.error("Error fetching AI signals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSignals();
  }, []);

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

      {/* Stats — from API signals */}
      <div className="stats-row" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        <div className="stat-card">
          <div className="stat-label">AI Signals</div>
          <div className="stat-value blue">{signals.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Status</div>
          <div className="stat-value green">{loading ? "Loading..." : "Ready"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Uptime</div>
          <div className="stat-value purple">—</div>
        </div>
      </div>

      {/* Section Title */}
      <div className="section-header">
        <h2 className="section-title">
          <Bot size={18} className="section-title-icon" />
          AI Agents
        </h2>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid-3" style={{ marginBottom: "24px" }}>
        {/* Create Card (always shown) */}
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

      {/* Bottom Section: Signals Feed + Tip */}
      <div className="grid-2">
        {/* Execution Feed from AI Signals */}
        <div className="card">
          <div className="section-header">
            <h2 className="section-title">
              <Zap size={18} style={{ color: "var(--accent-amber)" }} />
              AI Signal Feed
            </h2>
            <span className="section-badge badge-blue">{signals.length} signals</span>
          </div>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "180px", gap: "10px" }}>
              <Loader2 size={18} className="spin" style={{ color: "var(--accent-blue)" }} />
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading signals...</span>
            </div>
          ) : signals.length > 0 ? (
            <div>
              {signals.slice(0, 5).map((signal, i) => (
                <div key={i} className="execution-feed-item">
                  <div className={`execution-dot ${signal.recommendation === "BUY" ? "buy" : signal.recommendation === "SELL" ? "sell" : "info"}`} />
                  <div>
                    <div className="execution-feed-title">
                      {signal.token} — {signal.recommendation}
                    </div>
                    <div className="execution-feed-detail">
                      Confidence: {(signal.confidence * 100).toFixed(1)}%
                    </div>
                    <div className="execution-feed-time">
                      {signal.createdAt ? new Date(signal.createdAt).toLocaleString() : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "180px", gap: "12px" }}>
              <Zap size={28} style={{ color: "var(--text-dim)" }} />
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                No AI signals yet
              </span>
              <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                Analyze markets via POST /api/ai/analyze
              </span>
            </div>
          )}
        </div>

        {/* Optimization Tip */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div className="tip-box">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", fontWeight: 700, color: "var(--accent-cyan)", fontSize: "0.85rem" }}>
              <Lightbulb size={16} /> Getting Started
            </div>
            Use POST /api/ai/analyze with a token symbol to generate your first AI trading signal. The RAG service will process market data and news sentiment to produce actionable insights.
          </div>

          {/* Agent Performance Overview */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <Target size={18} className="section-title-icon" />
                Agent Performance
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "120px", gap: "12px" }}>
              <Target size={28} style={{ color: "var(--text-dim)" }} />
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Performance data available after agents run
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
