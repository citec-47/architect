# Quick Deployment Checklist

Follow this checklist to deploy your architect portfolio:

## ⚡ Quick Steps

### 1️⃣ Deploy Backend (5 minutes)
- [ ] Go to https://render.com and sign up
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Set Root Directory: `backend`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `npm start`
- [ ] Add environment variable: `JWT_SECRET=your-secret-key`
- [ ] Click "Create Web Service"
- [ ] **Copy the backend URL** (e.g., `https://architect-xxx.onrender.com`)

### 2️⃣ Update Frontend Config (2 minutes)
- [ ] Edit `frontend/.env.production`
- [ ] Replace `REACT_APP_API_ORIGIN=https://your-backend-url.onrender.com` with your actual URL
- [ ] Edit `backend/src/server.js` 
- [ ] Add your Netlify URL to `allowedOrigins` array (after Netlify gives you the URL)
- [ ] Commit and push changes

### 3️⃣ Deploy Frontend (3 minutes)
- [ ] Go to https://app.netlify.com and sign up
- [ ] Click "Add new site" → "Import an existing project"
- [ ] Choose GitHub and select your repository
- [ ] Set Base directory: `frontend`
- [ ] Set Build command: `npm run build`
- [ ] Set Publish directory: `frontend/build`
- [ ] Click "Deploy site"

### 4️⃣ Update CORS (2 minutes)
- [ ] Copy your Netlify URL (e.g., `https://architect-xxx.netlify.app`)
- [ ] Edit `backend/src/server.js`
- [ ] Uncomment and update the Netlify URL in `allowedOrigins`
- [ ] Commit and push (Render will auto-redeploy)

### 5️⃣ Test Everything (5 minutes)
- [ ] Visit your Netlify site
- [ ] Navigate to Projects page
- [ ] Go to `/admin` and login
- [ ] Try creating a new project
- [ ] Test contact form
- [ ] Check all pages load correctly

---

## 🎯 Expected Results

- **Frontend URL**: `https://your-site-name.netlify.app`
- **Backend URL**: `https://your-backend.onrender.com`
- **Admin Login**: `admin@architectsilas.com` / `Admin@123456`

---

## ⚠️ Common Issues

**Problem**: Can't login to admin
- Check backend URL in `.env.production`
- Check browser console for CORS errors
- Verify backend is running on Render

**Problem**: Images not loading
- Images are stored in-memory and will reset on backend restart
- For production, use cloud storage (AWS S3, Cloudinary)

**Problem**: Backend is slow
- Render free tier spins down after 15 minutes
- First request takes 30-60 seconds to wake up
- Consider upgrading to paid tier or use UptimeRobot

---

## 📖 Full Guide

For detailed instructions, see `DEPLOYMENT_GUIDE.md`
