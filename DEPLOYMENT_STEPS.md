# 🚀 Hugging Face Deployment - Step by Step Guide

## Quick Start (Manual Deployment)

### Step 1: Create Hugging Face Account
1. Go to https://huggingface.co/join
2. Sign up for free account
3. Verify your email

### Step 2: Create New Space
1. Go to https://huggingface.co/spaces
2. Click "Create new Space"
3. Fill in details:
   - **Owner**: Your username
   - **Space name**: `task-manager-backend`
   - **License**: Apache 2.0
   - **Select SDK**: Docker
   - **Space hardware**: CPU basic (free)
4. Click "Create Space"

### Step 3: Upload Files via Web Interface

Upload these files to your Space:

1. **README.md** - Copy from `README_HUGGINGFACE.md`
2. **Dockerfile** - Already created
3. **requirements.txt** - Already created
4. **backend/** - Upload entire backend folder

### Step 4: Configure Environment Variables
1. Go to Space Settings
2. Click "Variables and secrets"
3. Add these secrets:
   - `JWT_SECRET_KEY` = `your-super-secret-key-change-this-in-production`
   - `OPENAI_API_KEY` = `your-openai-api-key` (optional)

### Step 5: Wait for Build
- Space will automatically build (2-5 minutes)
- Check logs for any errors
- Once running, you'll see "Running" status

### Step 6: Test Your API
Your API will be available at:
```
https://YOUR_USERNAME-task-manager-backend.hf.space
```

Test endpoints:
- https://YOUR_USERNAME-task-manager-backend.hf.space/docs (API documentation)
- https://YOUR_USERNAME-task-manager-backend.hf.space/health (Health check)

---

## Alternative: Deploy via Git (Advanced)

### Prerequisites
```bash
pip install huggingface_hub
```

### Steps
```bash
# 1. Login to Hugging Face
huggingface-cli login

# 2. Create Space
huggingface-cli repo create task-manager-backend --type space --space_sdk docker

# 3. Clone Space
git clone https://huggingface.co/spaces/YOUR_USERNAME/task-manager-backend
cd task-manager-backend

# 4. Copy files
cp -r ../backend .
cp ../Dockerfile .
cp ../requirements.txt .
cp ../README_HUGGINGFACE.md README.md

# 5. Commit and push
git add .
git commit -m "Initial deployment"
git push
```

---

## Files Checklist

✅ Files already created in your project:
- [x] `Dockerfile` - Docker configuration
- [x] `requirements.txt` - Python dependencies
- [x] `README_HUGGINGFACE.md` - Space README
- [x] `backend/` - Backend code

---

## Important Notes

### Database Persistence
⚠️ **SQLite data will be lost on Space restart!**

For production, consider:
1. **Hugging Face Datasets** - Store data as dataset
2. **External PostgreSQL** - Use Supabase, Neon, or Railway
3. **Persistent Storage** - Upgrade to paid Space with persistent storage

### Environment Variables
Required:
- `JWT_SECRET_KEY` - For JWT token generation

Optional:
- `OPENAI_API_KEY` - For AI chatbot features
- `DATABASE_URL` - For external database

### CORS Configuration
Already configured to allow:
- localhost (development)
- Vercel/Netlify (frontend hosting)
- Hugging Face Spaces

---

## Troubleshooting

### Build Fails
- Check Dockerfile syntax
- Verify requirements.txt has correct versions
- Check Space logs for errors

### API Not Responding
- Wait 2-5 minutes for build to complete
- Check Space status (should show "Running")
- Test health endpoint first: `/health`

### Database Errors
- Space restarted (data lost with SQLite)
- Consider using external database

---

## Update Your Frontend

After deployment, update frontend API URL:

```typescript
// frontend/src/lib/api.ts or similar
const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  'https://YOUR_USERNAME-task-manager-backend.hf.space';
```

---

## Cost
- **Free Tier**: CPU basic (sufficient for testing)
- **Limitations**: 
  - May sleep after inactivity
  - Limited CPU/RAM
  - No persistent storage

---

## Next Steps After Deployment

1. ✅ Test all API endpoints
2. ✅ Update frontend to use new API URL
3. ✅ Deploy frontend (Vercel/Netlify)
4. ✅ Test end-to-end functionality
5. ✅ Monitor Space logs for errors

---

**Author**: Umema Sultan  
**Date**: 2026-04-05  
**Project**: Task Manager with AI Chatbot
