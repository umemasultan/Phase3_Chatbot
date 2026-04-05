from sqlmodel import create_engine, Session, SQLModel
from sqlalchemy import event
from sqlalchemy.engine import Engine
import sqlite3
import os

# Use environment variable for database URL, with fallback to local SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/taskmanager.db")

# Create data directory if it doesn't exist
if DATABASE_URL.startswith("sqlite"):
    db_path = DATABASE_URL.replace("sqlite:///", "")
    db_dir = os.path.dirname(db_path)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    # Import models here to register them with the metadata
    # Use absolute imports to handle the package structure
    try:
        # Try relative imports first (when run as a module)
        from ..models.task import Task
        from ..models.user import User
        from ..models.conversation import Conversation
        from ..models.message import Message
    except (ImportError, ValueError):
        # Fall back to absolute imports (when run directly)
        # We'll import these inside the function to avoid import-time issues
        import sys
        import os
        src_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        if src_dir not in sys.path:
            sys.path.insert(0, src_dir)
        from models.task import Task
        from models.user import User
        from models.conversation import Conversation
        from models.message import Message
    SQLModel.metadata.create_all(engine)

@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    if isinstance(dbapi_connection, sqlite3.Connection):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

def get_session():
    with Session(engine) as session:
        yield session