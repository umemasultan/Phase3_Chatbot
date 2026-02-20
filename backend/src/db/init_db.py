from sqlmodel import SQLModel

# Add the src directory to sys.path to handle imports properly
import sys
import os
src_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)

# Import using absolute imports - from the db module
from db.database import engine, create_db_and_tables


def test_db_connection():
    # Test connection by trying to create tables
    try:
        create_db_and_tables()
        print("Database connected and tables verified successfully!")
        return True
    except Exception as e:
        print(f"Error with database connection: {e}")
        return False


if __name__ == "__main__":
    if test_db_connection():
        print("Database and tables created successfully!")