import sys
import os

# Add the src directory to sys.path to handle imports properly
src_dir = os.path.dirname(os.path.abspath(__file__))
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import routers
from routers import task, task_v2, auth, chat

app = FastAPI(
    title="Task Manager API",
    description="FastAPI backend for Task Manager with AI chatbot",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include routers
app.include_router(task.router)
app.include_router(task_v2.router)
app.include_router(auth.router)
app.include_router(chat.router)

@app.get("/")
def read_root():
    return {
        "message": "Task Manager API",
        "version": "1.0.0",
        "author": "Umema Sultan",
        "docs": "/docs",
        "status": "running",
        "year": "2026"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": "2026-04-05"}

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    try:
        from db.init_db import create_db_and_tables
        create_db_and_tables()
    except Exception as e:
        print(f"Database initialization error: {e}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
