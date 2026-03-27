import React from "react";
import {
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldCheck,
  ShieldAlert,
  ActivitySquare
} from "lucide-react";

interface AnalysisReportProps {
  report: any;
  onClose?: () => void;
}

export default function AnalysisReport({ report, onClose }: AnalysisReportProps) {
  if (!report) return null;

  const isBuy = report.action === "BUY";
  const isSell = report.action === "SELL";
  const isHold = report.action === "HOLD";

  const actionColor = isBuy 
    ? "var(--accent-green)" 
    : isSell 
      ? "var(--accent-red)" 
      : "var(--accent-amber)";

  const ActionIcon = isBuy 
    ? TrendingUp 
    : isSell 
      ? TrendingDown 
      : Minus;

  const guardianApproved = report.guardian_status === "APPROVED";

  return (
    <div className="card" style={{ marginTop: "24px", animation: "slideUp 0.4s ease-out" }}>
      <div className="section-header" style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 className="section-title">
          <BrainCircuit size={18} style={{ color: "var(--accent-cyan)" }} />
          AI Analysis Report: {report.symbol}
        </h2>
        {onClose && (
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: "4px 8px" }}>
            Close
          </button>
        )}
      </div>

      {/* Hero Metric: Action & Confidence */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "24px", 
        padding: "20px",
        background: "rgba(255,255,255,0.02)",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.05)",
        marginBottom: "20px"
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
            Recommendation
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: actionColor, fontSize: "2rem", fontWeight: 800 }}>
            <ActionIcon size={32} />
            {report.action}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
            AI Confidence
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)" }}>
            {report.confidence.toFixed(1)}%
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px" }}>
            Entry Price
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text-main)" }}>
            ${report.entry_price?.toFixed(2) || "---"}
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: "20px", marginBottom: "24px" }}>
        {/* Market Context */}
        <div style={{ padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "var(--text-main)", fontWeight: 600 }}>
            <ActivitySquare size={16} /> Market Context
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Regime:</span>
              <span style={{ color: "var(--accent-purple)", fontWeight: 500 }}>{report.market_regime}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Target:</span>
              <span style={{ color: "var(--text-main)", fontWeight: 500 }}>
                {report.targets?.length > 0 ? `$${report.targets[0].toFixed(2)}` : "None"}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Stop Loss:</span>
              <span style={{ color: "var(--accent-red)", fontWeight: 500 }}>
                ${report.stop_loss?.toFixed(2) || "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Guardian Status */}
        <div style={{ padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", color: "var(--text-main)", fontWeight: 600 }}>
            {guardianApproved ? <ShieldCheck size={16} color="var(--accent-green)" /> : <ShieldAlert size={16} color="var(--accent-red)" />}
            Guardian Protocol
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--text-muted)" }}>Status:</span>
              <span className={`section-badge badge-${guardianApproved ? 'green' : 'red'}`} style={{ padding: "2px 8px" }}>
                {report.guardian_status}
              </span>
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "4px", lineHeight: "1.4" }}>
              {report.guardian_reason}
            </div>
          </div>
        </div>
      </div>

      {/* AI Reasoning Text */}
      <div>
        <div style={{ marginBottom: "12px", color: "var(--text-main)", fontWeight: 600, fontSize: "0.95rem" }}>
          LLM Reasoning & Strategy Narrative
        </div>
        <div style={{ 
          background: "rgba(0,0,0,0.3)", 
          padding: "16px", 
          borderRadius: "8px", 
          borderLeft: "3px solid var(--accent-magenta)",
          color: "rgba(255,255,255,0.85)",
          fontSize: "0.95rem",
          lineHeight: "1.6",
          whiteSpace: "pre-wrap"
        }}>
          {report.reasoning}
        </div>
      </div>
      
      {/* Indicators Tags */}
      <div style={{ marginTop: "20px", display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {report.indicators_used?.map((ind: string, i: number) => (
          <span key={i} style={{ 
            fontSize: "0.75rem", 
            padding: "4px 10px", 
            background: "rgba(255,255,255,0.05)", 
            borderRadius: "4px",
            color: "var(--text-muted)"
          }}>
            {ind}
          </span>
        ))}
      </div>
    </div>
  );
}
