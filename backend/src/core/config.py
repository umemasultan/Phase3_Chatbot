from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:password@localhost/dbname"
    SECRET_KEY: str = "your-secret-key-here"
    BETTER_AUTH_SECRET: str = "your-better-auth-secret-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_DAYS: int = 7  # 7 days as per spec
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days in minutes (7*24*60)

    class Config:
        env_file = ".env"


settings = Settings()