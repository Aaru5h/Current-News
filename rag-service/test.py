import requests
import time
import subprocess
import os

print("Starting server...")
process = subprocess.Popen(["./venv/bin/uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

time.sleep(5)  # Wait for server to start

try:
    print("Testing Ingest...")
    res = requests.post("http://127.0.0.1:8000/api/ingest", json={"urls": ["https://en.wikipedia.org/wiki/Artificial_intelligence"]})
    print("Ingest Response:", res.status_code, res.json())

    print("Testing Summarize...")
    res = requests.post("http://127.0.0.1:8000/api/summarize", json={"query": "What is AI?"})
    print("Summarize Response:", res.status_code, res.json())
finally:
    print("Shutting down server...")
    process.terminate()
