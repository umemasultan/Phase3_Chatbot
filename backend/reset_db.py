"""
Reset and initialize the database with proper schema
"""
import os
import sys

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from sqlmodel import SQLModel
from src.db.database import engine
from src.models import User, Task, Conversation, Message
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def reset_database():
    """Drop all tables and recreate them"""
    print("Dropping all tables...")
    SQLModel.metadata.drop_all(engine)

    print("Creating all tables...")
    SQLModel.metadata.create_all(engine)

    print("Database reset complete!")

def create_test_user():
    """Create a test user for development"""
    from sqlmodel import Session

    with Session(engine) as session:
        # Check if user already exists
        from sqlmodel import select
        existing_user = session.exec(select(User).where(User.email == "test@example.com")).first()

        if not existing_user:
            test_user = User(
                email="test@example.com",
                name="Test User",
                hashed_password=pwd_context.hash("password123")
            )
            session.add(test_user)
            session.commit()
            session.refresh(test_user)
            print(f"Created test user: {test_user.email} (ID: {test_user.id})")
            return test_user.id
        else:
            print(f"Test user already exists: {existing_user.email} (ID: {existing_user.id})")
            return existing_user.id

if __name__ == "__main__":
    reset_database()
    user_id = create_test_user()
    print(f"\nDatabase is ready! Test user ID: {user_id}")
    print("You can login with: test@example.com / password123")
