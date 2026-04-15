"use client";
import React, { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import AnalysisReport from "../../components/AnalysisReport";
import {
  ArrowLeft,
  Activity,
  Clock,
  Settings,
  Zap,
  TrendingUp,
  ShieldAlert,
  Target,
  Bot,
  Loader2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [symbol, setSymbol] = useState("AAPL");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [signals, setSignals] = useState<any[]>([]);
  const [loadingSignals, setLoadingSignals] = useState(true);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const res = await fetch(`${API_URL}/api/ai/signals`);
        if (res.ok) {
          const data = await res.json();
          setSignals(data.data || []);
        }
      } catch (err) {
        console.error("Error fetching signals:", err);
      } finally {
        setLoadingSignals(false);
      }
    };
    fetchSignals();
  }, []);

  const handleRunAnalysis = async () => {
    if (!symbol) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const res = await fetch("http://localhost:8000/api/trading/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, mode: "SAFE" }) 
      });
      if (!res.ok) throw new Error("Analysis failed");
      const data = await res.json();
      setAnalysisResult(data.report);
    } catch (err) {
      console.error(err);
      alert("Failed to run analysis. Ensure RAG service is running on port 8000.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div>
      {/* Back Button */}
      <Link href="/agents" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", fontSize: "0.85rem", textDecoration: "none", marginBottom: "20px", fontWeight: 500 }}>
        <ArrowLeft size={16} /> Back to Agents
      </Link>

      {/* Header */}
      <div className="page-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Bot size={32} style={{ color: "var(--accent-blue)" }} />
          <div>
            <h1 className="page-title">Agent: {id}</h1>
            <p className="page-subtitle">AI Trading Agent Workspace</p>
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

      {/* Stats from real signals */}
      <div className="stats-row" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        <div className="stat-card">
          <div className="stat-label">Total Signals</div>
          <div className="stat-value blue">{signals.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Status</div>
          <div className="stat-value green">{loadingSignals ? "..." : "Ready"}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Agent ID</div>
          <div className="stat-value" style={{ fontSize: "1rem" }}>{id}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Mode</div>
          <div className="stat-value">SAFE</div>
        </div>
      </div>

      <div className="grid-main-side">
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Signal History */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <Clock size={18} className="section-title-icon" />
                Signal History
              </h2>
              <span className="section-badge badge-blue">{signals.length} signals</span>
            </div>
            {loadingSignals ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px", gap: "10px" }}>
                <Loader2 size={18} className="spin" style={{ color: "var(--accent-blue)" }} />
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading signal history...</span>
              </div>
            ) : signals.length > 0 ? (
              <div className="timeline">
                {signals.slice(0, 8).map((signal, i) => (
                  <div key={i} className="timeline-item">
                    <div className={`timeline-dot ${signal.recommendation === "BUY" ? "green" : signal.recommendation === "SELL" ? "red" : "amber"}`} />
                    <div className="timeline-title">
                      {signal.token} — {signal.recommendation}
                    </div>
                    <div className="timeline-detail">
                      Confidence: {((signal.confidence || 0) * 100).toFixed(1)}% • {signal.ragSummary?.substring(0, 100) || "No summary"}
                    </div>
                    <div className="timeline-time">
                      {signal.createdAt ? new Date(signal.createdAt).toLocaleString() : ""}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "200px", gap: "12px" }}>
                <Clock size={28} style={{ color: "var(--text-dim)" }} />
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No signal history yet</span>
                <span style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
                  Run an analysis below to generate signals
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Performance */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">
                <TrendingUp size={18} className="section-title-icon" />
                Performance
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "160px", gap: "12px" }}>
              <TrendingUp size={28} style={{ color: "var(--text-dim)" }} />
              <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                Performance metrics build from signal history
              </span>
            </div>
          </div>

          {/* Quick Actions - Analysis Trigger */}
          <div className="card">
            <div className="section-header">
              <h2 className="section-title">Quick Actions</h2>
            </div>
            
            {/* Run Analysis Trigger Integration */}
            <div style={{ padding: "12px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", marginBottom: "12px" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "8px", fontWeight: 500 }}>
                Test Sandbox (Live RAG Service)
              </div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <input 
                  type="text" 
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  placeholder="Ticker (e.g. AAPL)"
                  style={{ 
                    background: "rgba(255,255,255,0.05)", 
                    border: "1px solid rgba(255,255,255,0.1)", 
                    borderRadius: "6px", 
                    padding: "8px 12px", 
                    color: "white", 
                    width: "100%",
                    outline: "none"
                  }} 
                />
                <button 
                  className="btn btn-primary" 
                  onClick={handleRunAnalysis} 
                  disabled={isAnalyzing}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {isAnalyzing ? "..." : <><Zap size={14} /> Analyze</>}
                </button>
              </div>
              {isAnalyzing && (
                <div style={{ fontSize: "0.8rem", color: "var(--accent-cyan)", animation: "pulse 1.5s infinite" }}>
                  Initializing Agent engine...
                </div>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
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
      
      {/* Dynamic AI Report Output */}
      {analysisResult && (
        <AnalysisReport 
          report={analysisResult} 
          onClose={() => setAnalysisResult(null)} 
        />
      )}
    </div>
  );
}
