# Fix: Images and Videos Not Displaying in Production

## Problem
Files uploaded to Render are stored on an **ephemeral filesystem** which means they disappear when the server restarts or redeploys.

## Solution: Use Cloudinary (Free Cloud Storage)

---

## Step 1: Create Cloudinary Account (5 minutes)

1. Go to https://cloudinary.com/users/register_free
2. Sign up for FREE account
3. Verify your email
4. Go to **Dashboard** → You'll see:
   - Cloud Name (e.g., `dxxx1234`)
   - API Key (e.g., `123456789012345`)
   - API Secret (e.g., `abcdefghijklmnopqrstuv`)

**Keep this tab open - you'll need these values!**

---

## Step 2: Add Environment Variables to Render

1. Go to your Render dashboard: https://dashboard.render.com
2. Click on your **architect** web service
3. Go to **Environment** tab (left sidebar)
4. Click **"Add Environment Variable"** and add these **4 new variables**:

```
CLOUDINARY_CLOUD_NAME = your-cloud-name
CLOUDINARY_API_KEY = your-api-key
CLOUDINARY_API_SECRET = your-api-secret
USE_CLOUDINARY = true
```

5. Click **"Save Changes"**
6. Your service will automatically redeploy

---

## Step 3: Push Updated Code

The code is already updated in your local repository. Just push it:

```bash
cd C:\Users\ADMIN\Desktop\architect
git add -A
git commit -m "Add Cloudinary support for persistent file storage"
git push
```

---

## Step 4: Test It!

1. Wait for Render to redeploy (~3-5 minutes)
2. Go to https://architectsilas.netlify.app/admin
3. Login and upload a new project with images/videos
4. Images/videos will now be stored on Cloudinary permanently!

---

## How It Works

- **Development (local)**: Uses local `uploads/` folder
- **Production (Render)**: Uses Cloudinary when `USE_CLOUDINARY=true`
- **Files are stored permanently** on Cloudinary's servers
- **Cloudinary Free Tier**: 25GB storage + 25GB bandwidth/month

---

## Benefits

✅ Files persist across server restarts  
✅ Files persist across redeploys  
✅ Fast CDN delivery worldwide  
✅ Automatic image optimization  
✅ FREE up to 25GB  

---

## Already Uploaded Files

⚠️ **Note**: Files uploaded before this change are lost (ephemeral filesystem).  
You'll need to re-upload them after setting up Cloudinary.

---

## Need Help?

If you get stuck, share:
- Your Cloudinary dashboard screenshot (hide API Secret!)
- Render deployment logs
- Any error messages

---

**Start with Step 1 above!** ☁️
