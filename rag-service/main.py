from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from rag import ingest_urls, summarize_query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="News Summarizer RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IngestRequest(BaseModel):
    urls: List[str]

class SummarizeRequest(BaseModel):
    query: str

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/ingest")
def ingest(request: IngestRequest):
    try:
        result = ingest_urls(request.urls)
        return {"message": "Ingestion complete", "details": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/summarize")
def summarize(request: SummarizeRequest):
    try:
        summary = summarize_query(request.query)
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Entry point for local testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
