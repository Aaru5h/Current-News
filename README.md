# AI Trading Platform

A modern, full-stack financial intelligence application powered by an Agentic AI decision engine. 

## 🏗️ Architecture Ecosystem

- **`frontend/`** (Next.js): The premium user interface for tracking markets, news, and managing automated trading agents.
- **`bckend/`** (Express/Node.js): The core API gateway handling authentication, portfolios, and routing requests to specialized microservices.
- **`rag-service/`** (FastAPI/Python): A dual-purpose AI microservice. It handles unstructured data summarization (News RAG) and hosts the `trading_bridge` to execute rigorous trading analyses.
- **`agent/`** (Python): The core, standalone proprietary logic for **Agent 1: AI Stock Analyser**. (Treated as an immutable source of truth).

---

## 🚀 The AI Trading Integration
This repository integrates the standalone **Agent 1 Analyzer** into a fully-fledged web application. 

**How it works (Zero-Touch Policy):**
Instead of polluting the agent's core code, the `rag-service` hosts a live "bridge" (`trading_bridge.py`) that securely accesses the `agent` folder's functionality in a background thread, exposing it as an interactive API on `port 8000`.

### 1. Setup the RAG / Trading Service (Python)
1. Open a terminal in the `rag-service/` directory.
2. Ensure you have Python 3.10+ installed.
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure your `.env` file (requires `GOOGLE_API_KEY` and optionally `FYERS_*` keys for Indian markets).
5. Start the engine:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### 2. Setup the Frontend (Next.js)
1. Open a terminal in the `frontend/` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the UI:
   ```bash
   npm run dev
   ```
4. Navigate to **Agents Manager** to access the "Test Sandbox" and watch the AI reasoning live.

---

> **Note to Backend Developers:**
> Please review the [BACKEND_GUIDE.md](./BACKEND_GUIDE.md) for precise instructions on wiring up the Express gateway to the AI Agent service.
