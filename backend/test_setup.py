import sys
import os

# Add the src directory to sys.path to handle imports properly
src_dir = os.path.dirname(os.path.abspath(__file__))
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)

# Import all necessary modules first
print("Testing imports...")
try:
    from fastapi import FastAPI
    print("Checkmark FastAPI imported")

    from fastapi.middleware.cors import CORSMiddleware
    print("Checkmark CORSMiddleware imported")

    from src.routers import task, task_v2, auth, chat
    print("Checkmark Routers imported")

    from src.db.init_db import create_db_and_tables
    print("Checkmark Database init imported")

    from src.models.conversation import Conversation
    from src.models.message import Message
    print("Checkmark Models imported")

    print("All imports successful!")

    # Create the app without starting it
    app = FastAPI(title="Task Manager API")
    print("Checkmark App created")

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3005", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:3005"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    print("Checkmark CORS configured")

    # Include routers
    app.include_router(task.router)
    app.include_router(task_v2.router)
    app.include_router(auth.router)
    app.include_router(chat.router)
    print("Checkmark Routers included")

    @app.get("/")
    def read_root():
        return {"message": "Task Manager API"}

    print("Checkmark App configured successfully")

    # Test startup event
    print("Testing startup event...")
    create_db_and_tables()
    print("Checkmark Database tables created successfully")

except Exception as e:
    print(f"X Error during setup: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

print("All tests passed - server is ready!")