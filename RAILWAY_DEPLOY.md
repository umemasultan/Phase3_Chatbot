# Railway Deployment Guide

## Why Railway?
- More stable than Hugging Face Spaces
- Free PostgreSQL database
- Better for production
- Auto-deploy from GitHub

## Quick Deploy to Railway:

### Step 1: Create Railway Account
1. Go to: https://railway.app
2. Sign up with GitHub
3. Verify email

### Step 2: New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose: `umemasultan/Phase3_Chatbot`

### Step 3: Configure
1. Root Directory: `backend`
2. Start Command: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`

### Step 4: Add Environment Variables
```
JWT_SECRET_KEY=umemasultan2026taskmanager
DATABASE_URL=postgresql://... (Railway provides this automatically)
```

### Step 5: Deploy
- Click "Deploy"
- Wait 2-3 minutes
- Get your Railway URL

---

## Alternative: Use Render.com

Even easier than Railway:

1. Go to: https://render.com
2. Sign up with GitHub
3. New Web Service
4. Connect: `umemasultan/Phase3_Chatbot`
5. Root Directory: `backend`
6. Build Command: `pip install -r requirements.txt`
7. Start Command: `uvicorn src.main:app --host 0.0.0.0 --port $PORT`
8. Add env vars
9. Deploy!

---

Kaunsa platform use karna chahenge?
- Railway (recommended)
- Render
- Ya Hugging Face fix karein?
