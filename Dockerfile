FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend
COPY backend ./backend

# Expose port
EXPOSE 7860

# Run
CMD ["python", "-m", "uvicorn", "backend.src.main:app", "--host", "0.0.0.0", "--port", "7860"]
