import os
from dotenv import load_dotenv
from langchain_community.document_loaders import WebBaseLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

load_dotenv()

# Define the local directory for the Chroma database
CHROMA_DB_DIR = "./chroma_db"

def get_embeddings():
    """Initialize local HuggingFace embeddings."""
    return HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

def get_vectorstore():
    """Get the Chroma vector store instance."""
    return Chroma(
        embedding_function=get_embeddings(),
        persist_directory=CHROMA_DB_DIR
    )

def ingest_urls(urls: list[str]):
    """Ingest context from URLs into the local vector store."""
    if not urls:
        return "No URLs provided."
    
    # 1. Load documents
    loader = WebBaseLoader(urls)
    docs = loader.load()
    
    # 2. Split documents into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    splits = text_splitter.split_documents(docs)
    
    # 3. Store in VectorDB
    vectorstore = get_vectorstore()
    vectorstore.add_documents(splits)
    
    return f"Successfully ingested {len(docs)} documents into {len(splits)} chunks."

def summarize_query(query: str):
    """Summarize the query based on relevant ingested context."""
    vectorstore = get_vectorstore()
    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
    
    # Check if we have anything in the vector store
    try:
        if vectorstore._collection.count() == 0:
             return "Warning: The vector database is empty. Please ingest some articles first."
    except Exception:
         pass
         
    llm = ChatGroq(model_name="llama-3.3-70b-versatile", temperature=0.2)
    
    template = """Use the following pieces of retrieved context to answer the question, focusing on summarising the news related to the query. 
If you don't find the answer in the context, just say "I don't have enough information about this in the ingested news sources." Do not try to make up an answer.
Keep the summary concise and professional.

Context: {context}

Question: {question}

Summary:"""
    custom_rag_prompt = PromptTemplate.from_template(template)
    
    def format_docs(docs):
        return "\n\n".join(doc.page_content for doc in docs)

    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | custom_rag_prompt
        | llm
        | StrOutputParser()
    )
    
    result = rag_chain.invoke(query)
    return result


def summarize_articles(articles: list[dict]) -> dict:
    """
    Generate concise AI summaries for a batch of news articles.
    
    Args:
        articles: List of dicts with 'url', 'title', 'description' keys.
    
    Returns:
        Dict mapping url -> AI-generated summary string.
    """
    if not articles:
        return {}

    llm = ChatGroq(model_name="llama-3.3-70b-versatile", temperature=0.3)
    
    template = """You are a professional financial news analyst. Summarize the following news article in 2-3 concise sentences.
Focus on the key financial impact, market implications, and relevant data points.
Be factual and professional. Do not add opinions.

Title: {title}
Description: {description}

Summary:"""
    prompt = PromptTemplate.from_template(template)
    chain = prompt | llm | StrOutputParser()
    
    summaries = {}
    for article in articles:
        url = article.get("url", "")
        title = article.get("title", "Untitled")
        description = article.get("description", "No description available.")
        
        try:
            summary = chain.invoke({"title": title, "description": description})
            summaries[url] = summary.strip()
        except Exception as e:
            print(f"Error summarizing article '{title}': {e}")
            summaries[url] = description  # Fallback to original description
    
    return summaries
