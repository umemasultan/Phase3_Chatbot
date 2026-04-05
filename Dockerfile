FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Create directory for database
RUN mkdir -p /app/data

# Expose port 7860 (Hugging Face Spaces default)
EXPOSE 7860

# Run the application
CMD ["uvicorn", "backend.src.main:app", "--host", "0.0.0.0", "--port", "7860"]
