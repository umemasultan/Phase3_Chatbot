from sqlmodel import create_engine, Session, SQLModel
from sqlalchemy import event
from sqlalchemy.engine import Engine
import sqlite3
import os
try:
    # Try relative imports first (when run as a module)
    from ..models.task import Task
    from ..models.user import User
except ImportError:
    # Fall back to absolute imports (when run directly)
    from models.task import Task
    from models.user import User

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./taskmanager.db")

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
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