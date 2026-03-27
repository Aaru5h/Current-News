import sys
import os
import asyncio
import traceback

# Resolve absolute path to agent folder to avoid modifying the agent directory
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AGENT_DIR = os.path.join(BASE_DIR, "agent", "trading-systems", "agents", "agent1_predictor")

# Inject the agent directory into sys.path so we can import its modules
if AGENT_DIR not in sys.path:
    sys.path.insert(0, AGENT_DIR)

async def analyze_stock_async(symbol: str, mode: str = "SAFE", allow_network: bool = True) -> dict:
    """
    Bridge function to execute the Agent 1 Stock Analyser without modifying its source code.
    Runs the synchronous agent in an asyncio thread pool to prevent blocking the FastAPI server.
    """
    def _run_agent():
        original_cwd = os.getcwd()
        try:
            # Change directory to the agent's folder so it can access its logs/ and config.json naturally if needed
            os.chdir(AGENT_DIR)
            
            # Import dynamically to ensure it uses the newly injected path
            import main as agent1_main
            import config as agent1_config # loads dotenv from .env in the agent folder
            
            # Execute the prediction cycle
            result = agent1_main.run(symbol=symbol, mode=mode, allow_network=allow_network)
            return result
        except Exception as e:
            print(f"Error in Trading Bridge: {e}")
            traceback.print_exc()
            raise e
        finally:
            # Restore the original working directory
            os.chdir(original_cwd)

    # Offload the blocking operations (data fetch, LLM calls) to a separate thread
    return await asyncio.to_thread(_run_agent)
