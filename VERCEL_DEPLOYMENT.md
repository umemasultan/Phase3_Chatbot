# 🚀 Vercel Deployment Guide - Frontend

## Quick Deployment (Recommended)

### Option 1: Deploy via Vercel Dashboard (Easiest)

#### Step 1: Push to GitHub
```bash
cd /e/Hackathon_2/Phase_3
git add frontend/.env.production frontend/.env.local vercel.json
git commit -m "Add Vercel deployment configuration with Hugging Face API"
git push origin main
```

#### Step 2: Import to Vercel
1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Select: `umemasultan/Phase3_Chatbot`
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### Step 3: Add Environment Variables
In Vercel project settings, add:
```
NEXT_PUBLIC_API_URL = https://umemasultan11-task-manager-backend.hf.space
```

#### Step 4: Deploy
- Click "Deploy"
- Wait 2-3 minutes
- Your app will be live!

---

## Option 2: Deploy via Vercel CLI

### Prerequisites
```bash
npm install -g vercel
```

### Steps
```bash
# Login to Vercel
vercel login

# Deploy from frontend directory
cd frontend
vercel --prod

# Follow prompts:
# - Link to existing project? No
# - Project name: task-manager-frontend
# - Directory: ./
# - Override settings? No
```

---

## Option 3: One-Click Deploy Button

Add this to your GitHub README:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/umemasultan/Phase3_Chatbot&project-name=task-manager&root-directory=frontend&env=NEXT_PUBLIC_API_URL&envDescription=Backend%20API%20URL&envLink=https://huggingface.co/spaces/umemasultan11/task-manager-backend)
```

---

## Environment Variables

### Required
```
NEXT_PUBLIC_API_URL=https://umemasultan11-task-manager-backend.hf.space
```

### Optional
```
NEXT_PUBLIC_BETTER_AUTH_SECRET=your-secret-here
```

---

## Vercel Configuration

Already created in `vercel.json`:
```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/.next",
  "framework": "nextjs",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://umemasultan11-task-manager-backend.hf.space"
  }
}
```

---

## Testing After Deployment

Once deployed, your app will be at:
```
https://your-project-name.vercel.app
```

Test these features:
1. ✅ Homepage loads
2. ✅ Signup works
3. ✅ Login works
4. ✅ Tasks CRUD operations
5. ✅ AI Chatbot (if OpenAI key added to backend)

---

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all dependencies in package.json
- Check build logs in Vercel dashboard

### API Connection Issues
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS settings in backend
- Ensure Hugging Face Space is running

### Environment Variables Not Working
- Must start with `NEXT_PUBLIC_` for client-side access
- Redeploy after adding/changing env vars

---

## Update Deployment

### Auto-Deploy (Recommended)
- Push to GitHub main branch
- Vercel auto-deploys

### Manual Deploy
```bash
cd frontend
vercel --prod
```

---

## Custom Domain (Optional)

1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration steps

---

## Performance Optimization

Already configured:
- ✅ Next.js Image Optimization
- ✅ Automatic Code Splitting
- ✅ Static Generation where possible
- ✅ Edge Network (CDN)

---

## Monitoring

- **Analytics**: Enable in Vercel dashboard
- **Logs**: View in Vercel dashboard
- **Performance**: Web Vitals tracking

---

## Cost

- **Free Tier**: 
  - 100 GB bandwidth/month
  - Unlimited deployments
  - Automatic HTTPS
  - Perfect for this project!

---

## Next Steps After Deployment

1. ✅ Test all features
2. ✅ Share your live URL
3. ✅ Add custom domain (optional)
4. ✅ Enable analytics
5. ✅ Monitor performance

---

**Ready to Deploy?** Follow Option 1 (Vercel Dashboard) - it's the easiest!

**Author**: Umema Sultan  
**Date**: 2026-04-05  
**Backend**: https://umemasultan11-task-manager-backend.hf.space  
**GitHub**: https://github.com/umemasultan/Phase3_Chatbot
