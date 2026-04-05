import sys
import os

# Add the src directory to sys.path to handle imports properly
src_dir = os.path.dirname(os.path.abspath(__file__))
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)

# Import modules early to register models with SQLModel once
# This ensures that table definitions are only registered once
from db.init_db import create_db_and_tables

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import modules using absolute paths within the same package
from routers import task, task_v2, auth, chat

app = FastAPI(
    title="Task Manager API",
    description="FastAPI backend for Task Manager with AI chatbot",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Initialize database tables
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Configure CORS - Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://*.vercel.app",
        "https://*.netlify.app",
        "https://*.hf.space",
        "*"  # Allow all for development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers
app.include_router(task.router)  # Keep old router for compatibility
app.include_router(task_v2.router)  # New spec-compliant router
app.include_router(auth.router)
app.include_router(chat.router)   # AI Chatbot router

@app.get("/")
def read_root():
    return {
        "message": "Task Manager API",
        "version": "1.0.0",
        "author": "Umema Sultan",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": "2026-04-05"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)