from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from rag import ingest_urls, summarize_query, summarize_articles
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

class ArticleInput(BaseModel):
    url: str
    title: str
    description: Optional[str] = ""

class SummarizeArticlesRequest(BaseModel):
    articles: List[ArticleInput]

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

@app.post("/api/summarize-articles")
def summarize_articles_endpoint(request: SummarizeArticlesRequest):
    """
    Batch-summarize a list of news articles using AI.
    
    Request body:
        { "articles": [{ "url": "...", "title": "...", "description": "..." }] }
    
    Response:
        { "summaries": { "url": "AI-generated summary" } }
    """
    try:
        articles_data = [
            {
                "url": article.url,
                "title": article.title,
                "description": article.description or "",
            }
            for article in request.articles
        ]
        summaries = summarize_articles(articles_data)
        return {"summaries": summaries}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Entry point for local testing
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
