# Free Deployment Options (No Credit Card Needed!)

## 🌟 Option 1: Render (RECOMMENDED - Easiest & Best Free Tier)

### Why Render?
- ✅ Completely free forever (no credit card)
- ✅ Doesn't sleep (unlike Heroku free tier)
- ✅ 750 hours/month free compute
- ✅ Auto-deploys from GitHub
- ✅ Free SSL certificates

### Steps:

1. **Push your code to GitHub:**
   ```bash
   cd calendar-api
   git init
   git add .
   git commit -m "Initial commit"
   
   # Create a new repo on GitHub, then:
   git remote add origin https://github.com/YOUR-USERNAME/calendar-api.git
   git push -u origin main
   ```

2. **Go to [render.com](https://render.com)** and sign up (free)

3. **Click "New +" → "Web Service"**

4. **Connect your GitHub repository**

5. **Configure:**
   - **Name:** `team-calendar-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

6. **Click "Create Web Service"**

7. **Wait 2-3 minutes** for deployment

8. **Get your URL:** `https://team-calendar-api.onrender.com`

9. **Update client.html** with your new URL:
   ```javascript
   const API_URL = 'https://team-calendar-api.onrender.com';
   ```

10. **Share with your team!**

### Notes:
- Free tier may spin down after inactivity (starts up in ~30 seconds)
- Plenty for a small team
- Can upgrade to always-on for $7/month if needed

---

## 🚂 Option 2: Railway (Beautiful UI, $5 Free Credit Monthly)

### Why Railway?
- ✅ $5 free credit every month (enough for small teams)
- ✅ Modern, intuitive interface
- ✅ One-click deploy from GitHub
- ✅ No credit card for trial ($5 credit)

### Steps:

1. **Push to GitHub** (same as above)

2. **Go to [railway.app](https://railway.app)** and sign up with GitHub

3. **Click "Start a New Project"**

4. **Select "Deploy from GitHub repo"**

5. **Choose your calendar-api repository**

6. **Railway auto-detects Node.js** and deploys automatically

7. **Click "Settings" → "Generate Domain"** to get your public URL

8. **Update client.html** with the Railway URL

9. **Done!** Share the URL with your team

### Notes:
- $5 credit renews monthly
- For a small team, this covers hosting indefinitely
- Very fast deployments
- Great logging and monitoring

---

## ✈️ Option 3: Fly.io (Global Deployment, Great Performance)

### Why Fly.io?
- ✅ 3 shared VMs free
- ✅ 160GB bandwidth/month
- ✅ Global edge deployment
- ✅ Excellent performance

### Steps:

1. **Install Fly CLI:**
   ```bash
   # Mac/Linux
   curl -L https://fly.io/install.sh | sh
   
   # Windows
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **Sign up:**
   ```bash
   flyctl auth signup
   ```

3. **Launch your app:**
   ```bash
   cd calendar-api
   flyctl launch
   ```

4. **Answer the prompts:**
   - App name: `team-calendar-api` (or your choice)
   - Region: Choose closest to your team
   - Postgres database: No
   - Redis: No
   - Deploy now: Yes

5. **Get your URL:** `https://team-calendar-api.fly.dev`

6. **Update client.html**

7. **Deploy updates:**
   ```bash
   flyctl deploy
   ```

### Notes:
- Free tier is very generous
- Great for teams spread across locations
- Slightly more technical than Render/Railway

---

## 🐙 Option 4: Vercel (Super Fast, Great for APIs)

### Why Vercel?
- ✅ Completely free for hobby projects
- ✅ Instant deployments
- ✅ Automatic HTTPS
- ✅ GitHub integration

### Steps:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd calendar-api
   vercel
   ```

3. **Follow the prompts** (just press Enter for defaults)

4. **Get your URL** (shown in terminal)

5. **For production:**
   ```bash
   vercel --prod
   ```

### Notes:
- Best for serverless
- May need slight modifications for this API
- Great for small teams

---

## 📊 Comparison Table

| Platform | Free Tier | Sleeps? | Setup Time | Best For |
|----------|-----------|---------|------------|----------|
| **Render** | 750hrs/mo | After inactivity | 5 min | **BEST - Small teams** |
| **Railway** | $5/mo credit | No | 3 min | Teams needing always-on |
| **Fly.io** | 3 VMs | No | 10 min | Global teams |
| **Vercel** | Unlimited | No | 5 min | Quick prototypes |

---

## 🎯 My Recommendation

**For your use case, I recommend Render:**

1. ✅ Completely free
2. ✅ No credit card needed
3. ✅ Easiest setup
4. ✅ Good enough for team scheduling
5. ✅ Can upgrade later if needed

**Quick Render Setup:**
```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Team calendar API"
git remote add origin YOUR_GITHUB_URL
git push -u origin main

# 2. Go to render.com
# 3. New Web Service → Connect GitHub
# 4. Deploy (takes 2 minutes)
# 5. Done!
```

---

## 💰 If You Outgrow Free Tier

When your team grows or needs always-on:
- **Render:** $7/month (always on)
- **Railway:** $5/month credit (usually enough)
- **DigitalOcean:** $5/month (full VM)
- **Fly.io:** $1.94/month per VM

---

## 🔄 Updating Your Deployment

All platforms support auto-deploy from GitHub:

1. Make changes to your code
2. Push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```
3. Platform auto-deploys in 1-2 minutes

---

## ⚡ Want the Absolute Fastest? (Still Free!)

**Use ngrok for instant sharing:**
```bash
npm install -g ngrok
npm start
ngrok http 3000
```

Share the ngrok URL immediately. Perfect for:
- Quick demos
- Testing with team
- Same-day meetings

**Downside:** URL changes each time you restart

---

## 🆘 Troubleshooting

**Build fails on Render/Railway:**
- Check Node version in package.json:
  ```json
  "engines": {
    "node": "18.x"
  }
  ```

**API returns 404:**
- Make sure Start Command is `npm start`
- Check that PORT environment variable is used

**CORS errors:**
- Add your frontend URL to CORS whitelist
- Or use `cors()` without restrictions for team use

---

## 📱 Quick Deploy Script

Want one command to deploy? Save this as `deploy-render.sh`:

```bash
#!/bin/bash
echo "🚀 Deploying to Render..."

# Check if git repo exists
if [ ! -d .git ]; then
    git init
    git add .
    git commit -m "Initial commit"
fi

echo "✅ Code committed"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git remote add origin YOUR_URL && git push -u origin main"
echo "2. Go to render.com"
echo "3. New Web Service → Connect your repo"
echo "4. Deploy!"
```

---

Need help with any of these? Let me know which platform you choose!
