import sys
import os

# Add the src directory to sys.path to handle imports properly
src_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'src')
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)

try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from routers import task, task_v2, auth, chat
    from db.init_db import create_db_and_tables
    import logging
    logging.basicConfig(level=logging.INFO)

    app = FastAPI(title="Task Manager API")

    # Initialize database tables
    @app.on_event("startup")
    def on_startup():
        print("Running startup event...")
        create_db_and_tables()
        print("Database tables created")

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
        print("Starting server on 0.0.0.0:8000...")
        uvicorn.run(app, host="0.0.0.0", port=8000)
except Exception as e:
    print(f"Error occurred: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)