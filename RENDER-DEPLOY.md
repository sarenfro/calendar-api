# Deploy to Render - Step-by-Step Guide

## 🎯 Overview

You'll deploy your Calendar API to Render in about 5 minutes. It will be:
- ✅ Completely free
- ✅ Accessible from anywhere
- ✅ Auto-deploys when you update code
- ✅ Has a permanent URL like `https://team-calendar-api.onrender.com`

---

## 📋 Prerequisites

- GitHub account (free)
- Your calendar-api code

---

## Step 1: Push Your Code to GitHub

### If you haven't already:

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Repository name: `calendar-api`
   - Make it Public or Private (both work)
   - Don't initialize with README (you already have files)
   - Click "Create repository"

2. **Push your code:**
   ```bash
   cd calendar-api
   
   # Initialize git if not already done
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit - Calendar API"
   
   # Add GitHub as remote (replace YOUR-USERNAME)
   git remote add origin https://github.com/YOUR-USERNAME/calendar-api.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

3. **Verify:** Go to your GitHub repository and make sure all files are there

---

## Step 2: Sign Up for Render

1. **Go to [render.com](https://render.com)**

2. **Click "Get Started for Free"** or "Sign Up"

3. **Sign up with GitHub:**
   - Click "GitHub" button
   - Authorize Render to access your GitHub
   - This makes deployment super easy!

4. **Complete your profile** (if asked)

---

## Step 3: Create a New Web Service

1. **Click "New +" button** (top right)

2. **Select "Web Service"**

3. **Connect your repository:**
   - You'll see a list of your GitHub repositories
   - Find and click "Connect" next to `calendar-api`
   - If you don't see it, click "Configure GitHub App" and grant access

---

## Step 4: Configure Your Web Service

Fill in these settings:

### Basic Settings:
- **Name:** `team-calendar-api` (or whatever you prefer)
  - This will be part of your URL
  - Must be unique across all Render

- **Region:** Choose closest to your team
  - `Oregon (US West)`
  - `Ohio (US East)`
  - `Frankfurt (Europe)`
  - `Singapore (Asia)`

- **Branch:** `main` (should be auto-detected)

- **Root Directory:** Leave blank

### Build & Deploy Settings:
- **Runtime:** `Node`

- **Build Command:** `npm install`

- **Start Command:** `npm start`

### Instance Type:
- **Plan:** Select **"Free"** ⭐
  - 512 MB RAM
  - Shared CPU
  - Spins down after 15 min of inactivity
  - Perfect for team scheduling!

### Environment Variables:
- Click "Add Environment Variable"
- **Key:** `NODE_ENV`
- **Value:** `production`

---

## Step 5: Deploy!

1. **Click "Create Web Service"** (bottom of page)

2. **Wait for deployment:**
   - You'll see a build log
   - Should take 2-3 minutes
   - Look for: "Your service is live 🎉"

3. **Get your URL:**
   - At the top, you'll see your URL
   - Example: `https://team-calendar-api.onrender.com`
   - **Copy this URL!**

---

## Step 6: Update Your Client

1. **Open `client.html` in your code**

2. **Update the API_URL:**
   ```javascript
   // Change this line:
   const API_URL = 'http://localhost:3000';
   
   // To your Render URL:
   const API_URL = 'https://team-calendar-api.onrender.com';
   ```

3. **Save and commit:**
   ```bash
   git add client.html
   git commit -m "Update API URL for Render deployment"
   git push
   ```

4. **Render will auto-deploy** your changes in ~1 minute!

---

## Step 7: Test Your API

1. **Open your Render URL** in browser:
   ```
   https://team-calendar-api.onrender.com/api/health
   ```

2. **You should see:**
   ```json
   {
     "status": "ok",
     "calendarsLoaded": 0,
     "timestamp": "2026-01-29T..."
   }
   ```

3. **Open the web interface:**
   ```
   https://team-calendar-api.onrender.com/client.html
   ```

---

## Step 8: Share with Your Team! 🎉

**Send this to your teammates:**

```
Hey team! 

I set up our calendar scheduler. Here's how to use it:

1. Go to: https://team-calendar-api.onrender.com/client.html

2. Export your calendar as .ics:
   - Google Calendar: Settings → Export
   - Outlook: File → Save Calendar
   - Apple Calendar: File → Export

3. Upload your .ics file on the website

4. We can now find meeting times where everyone is free!

Let me know if you have questions.
```

---

## 🔧 Managing Your Deployment

### View Logs:
1. Go to your Render dashboard
2. Click on your service
3. Click "Logs" tab
4. See real-time logs

### Re-deploy Manually:
1. Go to your service
2. Click "Manual Deploy"
3. Choose "Clear build cache & deploy"

### Environment Variables:
1. Go to your service
2. Click "Environment" tab
3. Add/edit variables
4. Click "Save Changes"

### Custom Domain (Optional):
1. Buy a domain (e.g., from Namecheap)
2. In Render: Settings → Custom Domain
3. Add your domain
4. Update DNS records as shown
5. SSL certificate auto-generated!

---

## 🐛 Troubleshooting

### "Service Failed to Start"
- Check logs for errors
- Verify `package.json` has correct start script
- Make sure all dependencies are in `package.json`

### "Cannot find module"
- Click "Manual Deploy" → "Clear build cache & deploy"
- This reinstalls all dependencies

### CORS Errors
- Already handled in code with `cors()`
- If issues persist, check browser console

### Service is Slow
- Free tier spins down after 15 min inactivity
- First request after sleep takes ~30 seconds
- Subsequent requests are fast
- Upgrade to $7/month for always-on

### Can't Access from Team
- Make sure you shared the `.onrender.com` URL, not `localhost`
- Check service is "Live" in Render dashboard
- Try accessing `/api/health` endpoint to verify

---

## 🚀 Next Steps

### Auto-Deploy on Git Push
Already set up! Every time you push to GitHub:
1. Render detects the change
2. Rebuilds your app
3. Deploys automatically
4. Takes ~1-2 minutes

### Monitor Uptime
Set up free monitoring:
1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Add your Render URL
3. Get alerts if it goes down

### Backup Strategy
- Code is on GitHub (safe!)
- Calendar data is in-memory (resets on restart)
- For production, consider adding a database

---

## 💡 Pro Tips

1. **Keep your service warm:**
   - Set up a cron job to ping it every 10 minutes
   - Use UptimeRobot (free) to ping your `/api/health` endpoint

2. **Monitor usage:**
   - Render dashboard shows bandwidth and compute hours
   - Free tier is 750 hours/month (more than enough!)

3. **Team calendar updates:**
   - Have team re-upload calendars weekly
   - Or set up calendar URL imports (future feature)

4. **Scaling:**
   - If you outgrow free tier, $7/month gets you:
     - Always-on (no sleeping)
     - More memory
     - Faster builds

---

## 📊 What You Get on Free Tier

- ✅ 512 MB RAM
- ✅ 750 hours/month compute (31+ days!)
- ✅ 100 GB bandwidth/month
- ✅ Unlimited deploys
- ✅ Auto SSL/HTTPS
- ✅ DDoS protection
- ✅ GitHub auto-deploy

Perfect for team of 5-20 people!

---

## 🆘 Need Help?

**Render Support:**
- Docs: https://render.com/docs
- Community: https://community.render.com

**API Issues:**
- Check logs in Render dashboard
- Test `/api/health` endpoint
- Verify environment variables

**GitHub Issues:**
- Make sure you pushed latest code
- Check GitHub Actions (if any) aren't failing

---

## 🎉 You're Done!

Your Calendar API is now:
- ✅ Live on the internet
- ✅ Accessible to your team
- ✅ Auto-deploying from GitHub
- ✅ Completely free

**Your URL:** `https://team-calendar-api.onrender.com`

Share it with your team and start finding those perfect meeting times! 📅
