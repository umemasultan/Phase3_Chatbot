# Hugging Face Deployment Guide

## Prerequisites
1. Hugging Face account (free)
2. Git installed
3. Hugging Face CLI (optional but recommended)

## Step 1: Create Required Files

### 1.1 Create `requirements.txt`
```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlmodel==0.0.14
passlib[bcrypt]==1.7.4
python-jose[cryptography]==3.3.0
python-multipart==0.0.6
openai==1.3.0
python-dotenv==1.0.0
```

### 1.2 Create `Dockerfile` (for Spaces)
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Expose port
EXPOSE 7860

# Run the application
CMD ["uvicorn", "backend.src.main:app", "--host", "0.0.0.0", "--port", "7860"]
```

### 1.3 Create `README.md` for Hugging Face Space
```markdown
---
title: Task Manager Backend
emoji: 📋
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
---

# Task Manager Backend API

FastAPI backend for Task Manager application.

## API Endpoints
- POST /api/auth/signup - Register
- POST /api/auth/login - Login
- GET /api/tasks - Get tasks
- POST /api/tasks - Create task
- And more...

## Author
Umema Sultan
```

## Step 2: Prepare Backend for Deployment

### 2.1 Update `backend/src/main.py` for CORS
Add proper CORS configuration for frontend access.

### 2.2 Update Database Configuration
Use environment variables for production settings.

## Step 3: Deploy to Hugging Face

### Option A: Using Hugging Face Web Interface
1. Go to https://huggingface.co/spaces
2. Click "Create new Space"
3. Choose:
   - Space name: `task-manager-backend`
   - License: Apache 2.0
   - SDK: Docker
   - Hardware: CPU basic (free)
4. Upload files:
   - Dockerfile
   - requirements.txt
   - README.md
   - backend/ folder
5. Add secrets in Settings:
   - JWT_SECRET_KEY
   - OPENAI_API_KEY (optional)

### Option B: Using Git (Recommended)
```bash
# Install Hugging Face CLI
pip install huggingface_hub

# Login to Hugging Face
huggingface-cli login

# Create a new Space
huggingface-cli repo create task-manager-backend --type space --space_sdk docker

# Clone the Space repository
git clone https://huggingface.co/spaces/YOUR_USERNAME/task-manager-backend
cd task-manager-backend

# Copy your files
cp -r ../backend .
cp ../requirements.txt .
cp ../Dockerfile .
cp ../README.md .

# Commit and push
git add .
git commit -m "Initial deployment"
git push
```

## Step 4: Configure Environment Variables
In Hugging Face Space Settings, add:
- `JWT_SECRET_KEY`: Your secret key
- `DATABASE_URL`: sqlite:///./taskmanager.db (or use PostgreSQL)
- `OPENAI_API_KEY`: Your OpenAI key (optional)

## Step 5: Update Frontend
Update frontend API URL to point to your Hugging Face Space:
```
https://YOUR_USERNAME-task-manager-backend.hf.space
```

## Important Notes
1. Hugging Face Spaces use port 7860 by default
2. Free tier has limitations (CPU, memory)
3. SQLite data will be lost on restart (use PostgreSQL for production)
4. Consider using Hugging Face Datasets for persistent storage

## Alternative: Use Railway or Render
If you need better database persistence, consider:
- Railway.app (free tier with PostgreSQL)
- Render.com (free tier with PostgreSQL)
- Fly.io (free tier)

---
**Author**: Umema Sultan
**Date**: 2026-04-05
