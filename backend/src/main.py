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

app = FastAPI(title="Task Manager API")

# Initialize database tables
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3005", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:3005"],  # Allow frontend origins including 3001
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(task.router)  # Keep old router for compatibility
app.include_router(task_v2.router)  # New spec-compliant router
app.include_router(auth.router)
app.include_router(chat.router)   # AI Chatbot router

@app.get("/")
def read_root():
    return {"message": "Task Manager API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)