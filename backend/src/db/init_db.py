from sqlmodel import SQLModel

# Add the src directory to sys.path to handle imports properly
import sys
import os
src_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)

# Import using absolute imports - from the db module
from db.database import engine
from models.user import User
from models.task import Task


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


if __name__ == "__main__":
    create_db_and_tables()
    print("Database and tables created successfully!")