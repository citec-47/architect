# Netlify Deployment Guide

This guide will help you deploy your Architect Portfolio to Netlify (frontend) and Render (backend).

## 📋 Prerequisites

- GitHub account (your code is already pushed)
- Netlify account (sign up at https://netlify.com)
- Render account (sign up at https://render.com) - for backend API

---

## 🚀 Part 1: Deploy Backend to Render

### 1. Create Render Account
- Go to https://render.com
- Sign up with GitHub

### 2. Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `architect`
3. Configure:
   - **Name**: `architect-portfolio-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

4. Add Environment Variables:
   ```
   JWT_SECRET=your-super-secret-key-change-this-in-production
   PORT=5000
   NODE_ENV=production
   ```

5. Click **"Create Web Service"**
6. Wait 3-5 minutes for deployment
7. **Copy your backend URL** (e.g., `https://architect-portfolio-backend.onrender.com`)

### 3. Test Backend
Visit: `https://your-backend-url.onrender.com/api/projects`
You should see an empty array `[]`

---

## 🎨 Part 2: Deploy Frontend to Netlify

### 1. Update Frontend Environment Variable

**IMPORTANT**: Before deploying, update the backend URL:

1. Edit `frontend/.env.production`:
   ```env
   REACT_APP_API_ORIGIN=https://your-actual-backend-url.onrender.com
   ```
   Replace with your actual Render backend URL (from Part 1, Step 7)

2. Commit and push:
   ```bash
   git add .
   git commit -m "Configure production API URL"
   git push
   ```

### 2. Deploy to Netlify

#### Option A: Netlify UI (Easiest)

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Select your `architect` repository
5. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
6. Click **"Deploy site"**

#### Option B: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy from project root
netlify deploy --prod
```

### 3. Configure Environment Variables in Netlify (Alternative)

Instead of `.env.production`, you can set in Netlify UI:

1. Go to **Site settings** → **Environment variables**
2. Add:
   ```
   REACT_APP_API_ORIGIN = https://your-backend-url.onrender.com
   ```
3. Trigger a new deploy

---

## 🔧 Part 3: Configure Backend CORS

Update `backend/src/server.js` to allow your Netlify domain:

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-site-name.netlify.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

Commit and push to trigger Render re-deployment.

---

## ✅ Verification Steps

### 1. Check Frontend
- Visit your Netlify URL: `https://your-site-name.netlify.app`
- All pages should load correctly

### 2. Check Backend Connection
- Open browser DevTools (F12) → Network tab
- Navigate to Projects section
- Verify API calls to your Render backend URL

### 3. Test Admin Dashboard
- Go to `/admin`
- Login with: `admin@architectsilas.com` / `Admin@123456`
- Create a test project

---

## 🔑 Important Notes

### Free Tier Limitations

**Render Free Tier**:
- Backend spins down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free

**Netlify Free Tier**:
- 100GB bandwidth/month
- Unlimited sites
- HTTPS included

### Custom Domain

**Netlify**:
1. Go to **Domain settings**
2. Click **"Add custom domain"**
3. Follow DNS configuration instructions

---

## 🐛 Troubleshooting

### Issue: API calls fail (CORS errors)
**Solution**: Update CORS settings in backend (see Part 3)

### Issue: 404 on page refresh
**Solution**: Already configured in `netlify.toml` redirects

### Issue: Environment variables not working
**Solution**: Variables must start with `REACT_APP_` and rebuild after changes

### Issue: Backend sleeps (Render free tier)
**Solution**: 
- Upgrade to paid plan ($7/month), or
- Use a service like UptimeRobot to ping your backend every 5 minutes

---

## 📚 Alternative Backend Hosting Options

If Render doesn't work, try:

1. **Railway** (https://railway.app) - Similar to Render, $5/month
2. **Heroku** (https://heroku.com) - Classic option, paid plans only now
3. **Fly.io** (https://fly.io) - Great performance, free tier available
4. **DigitalOcean App Platform** - $5/month

---

## 🔄 Continuous Deployment

Both Netlify and Render support auto-deployment:
- Push to `main` branch → Auto-deploy to production
- Push to other branches → Preview deployments (Netlify)

---

## 📞 Need Help?

- **Netlify Docs**: https://docs.netlify.com
- **Render Docs**: https://render.com/docs
- **Your project structure**: Check `PROJECT_ARCHITECTURE.md`

---

## Next Steps After Deployment

1. ✅ Test all features (projects, gallery, contact form, admin)
2. ✅ Set up custom domain
3. ✅ Configure email service for contact form (if needed)
4. ✅ Set up analytics (Google Analytics, Plausible, etc.)
5. ✅ Add monitoring (UptimeRobot for backend health)
6. ✅ Update social media links in Footer
7. ✅ Add real project content

---

**🎉 Your site is live!**
