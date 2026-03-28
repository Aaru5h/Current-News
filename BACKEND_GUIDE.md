# Backend Developer Guide: AI Trading Integration

This document outlines how to integrate the newly wrapped **Agent 1: AI Stock Analyser** into the Express (`bckend/`) gateway.

## The Strategy: Zero-Touch Proxying
The core proprietary trading logic lives in the `/agent/` directory, which is **strictly hands-off**. We do not run it directly via Node `exec` or rewrite it. Instead, the Python `rag-service` bridges this gap safely and asynchronously using `FastAPI`.

Your primary objective is to create an Express controller and route that proxies frontend requests to `http://localhost:8000/api/trading/analyze`.

---

## 🔧 What You Need to Do

### 1. Create a Proxied Route (`src/routes/agent.routes.js`)
Initialize a new Express router file targeting `/api/agent/`.

### 2. The Controller Logic (`src/controllers/agent.controller.js`)
When a client asks for analysis, forward that request to the Python RAG microservice. 

**Express Request Structure (from Frontend):**
```json
// POST /api/agent/analyze
{
  "symbol": "AAPL",
  "market": "US",
  "mode": "SAFE" 
}
```

**Axios Proxy Implementation (Internal):**
```javascript
// using axios
const response = await axios.post("http://localhost:8000/api/trading/analyze", {
  symbol: req.body.symbol,
  mode: req.body.mode || "SAFE",
  allow_network: true
});

return res.status(200).json(response.data); // data shape contains -> { report: { ... } }
```

### 3. Add to `server.js`
Don't forget to mount your route inside `server.js`:
```javascript
import agentRoutes from './routes/agent.routes.js';
app.use('/api/agent', agentRoutes);
```

---

## 📋 The Response Schema
The `rag-service` will return the data perfectly formatted for the `AnalysisReport.tsx` component in the frontend. It will look exactly like this:

```json
{
  "report": {
    "symbol": "AAPL",
    "action": "BUY",            // "BUY" | "SELL" | "HOLD"
    "confidence": 78.5,
    "entry_price": 180.20,
    "stop_loss": 175.50,
    "targets": [190.00],
    "market_regime": "TRENDING_H0.65",
    "indicators_used": ["EMA", "RSI", "MACD", "ATR"],
    "reasoning": "Detailed narrative block from the LLM explaining the breakout pattern and technical alignment.",
    "guardian_status": "APPROVED",
    "guardian_reason": "Risk checks passed: Reward-to-Risk ratio satisfies 2:1 criterion."
  }
}
```

### ⚠️ Important Notes
- **Timeout Restrictions:** The AI takes heavily variable time depending on API limits (1-5 seconds typically). Make sure your Express/Axios config does not harshly timeout requests before the background data is fully digested.
- **Failures:** If a ticker like "APPLE" is supplied instead of "AAPL", or if the `rag-service` is offline, return a `500` error wrapped cleanly. The frontend currently alerts users on unhandled server errors.
