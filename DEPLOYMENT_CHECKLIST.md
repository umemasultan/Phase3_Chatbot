# 📋 Hugging Face Deployment Checklist

## Pre-Deployment ✅

- [x] Backend code ready
- [x] Dockerfile created
- [x] requirements.txt created
- [x] README_HUGGINGFACE.md created
- [x] CORS configured in main.py
- [x] Database configuration updated
- [x] Health endpoint added

## Deployment Steps 🚀

### 1. Create Hugging Face Account
- [ ] Go to https://huggingface.co/join
- [ ] Sign up and verify email
- [ ] Login to your account

### 2. Create New Space
- [ ] Go to https://huggingface.co/spaces
- [ ] Click "Create new Space"
- [ ] Name: `task-manager-backend`
- [ ] SDK: Docker
- [ ] Hardware: CPU basic (free)
- [ ] Click "Create Space"

### 3. Upload Files
- [ ] Upload `Dockerfile`
- [ ] Upload `requirements.txt`
- [ ] Rename and upload `README_HUGGINGFACE.md` as `README.md`
- [ ] Upload entire `backend/` folder

### 4. Configure Secrets
- [ ] Go to Space Settings → Variables and secrets
- [ ] Add `JWT_SECRET_KEY` = `your-secret-key-here`
- [ ] Add `OPENAI_API_KEY` = `your-openai-key` (optional)

### 5. Wait for Build
- [ ] Monitor build logs
- [ ] Wait for "Running" status (2-5 minutes)
- [ ] Check for any errors

### 6. Test API
- [ ] Visit: `https://YOUR_USERNAME-task-manager-backend.hf.space/docs`
- [ ] Test health endpoint: `/health`
- [ ] Test signup: `POST /api/auth/signup`
- [ ] Test login: `POST /api/auth/login`
- [ ] Test tasks: `GET /api/tasks`

## Post-Deployment 🎯

### Update Frontend
- [ ] Update API URL in frontend code
- [ ] Test frontend with new backend URL
- [ ] Deploy frontend to Vercel/Netlify

### Testing
- [ ] Test user registration
- [ ] Test user login
- [ ] Test task creation
- [ ] Test task listing
- [ ] Test task update
- [ ] Test task deletion
- [ ] Test AI chatbot (if OpenAI key added)

### Documentation
- [ ] Note down your Space URL
- [ ] Update project README with deployment URL
- [ ] Share API documentation link

## Your Deployment Info 📝

Fill this after deployment:

```
Space URL: https://___________-task-manager-backend.hf.space
API Docs: https://___________-task-manager-backend.hf.space/docs
Health Check: https://___________-task-manager-backend.hf.space/health

Deployment Date: 2026-04-05
Status: [ ] Deployed [ ] Testing [ ] Live
```

## Troubleshooting 🔧

If build fails:
- [ ] Check Dockerfile syntax
- [ ] Verify all files uploaded correctly
- [ ] Check Space logs for errors
- [ ] Ensure requirements.txt has correct versions

If API not responding:
- [ ] Wait full 5 minutes for build
- [ ] Check Space status is "Running"
- [ ] Test health endpoint first
- [ ] Check CORS configuration

## Important Notes ⚠️

1. **SQLite Data Loss**: Data will be lost on Space restart. For production, use external PostgreSQL.
2. **Free Tier Limits**: Space may sleep after inactivity.
3. **Port**: Hugging Face Spaces use port 7860 (already configured in Dockerfile).
4. **CORS**: Already configured to allow frontend access.

## Quick Commands 💻

Test your API after deployment:

```bash
# Health check
curl https://YOUR_USERNAME-task-manager-backend.hf.space/health

# Signup
curl -X POST https://YOUR_USERNAME-task-manager-backend.hf.space/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'

# Login
curl -X POST https://YOUR_USERNAME-task-manager-backend.hf.space/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

**Ready to Deploy?** Follow DEPLOYMENT_STEPS.md for detailed instructions!

**Author**: Umema Sultan  
**Project**: Task Manager Backend API
