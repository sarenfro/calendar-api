# Render Deployment Checklist ✅

Quick reference for deploying to Render.

## Pre-Deployment

- [ ] Code is ready in `calendar-api` folder
- [ ] GitHub account created
- [ ] Render account created (free)

## GitHub Setup (5 minutes)

- [ ] Go to https://github.com/new
- [ ] Create repo: `calendar-api`
- [ ] Run these commands:
  ```bash
  cd calendar-api
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/YOUR-USERNAME/calendar-api.git
  git branch -M main
  git push -u origin main
  ```
- [ ] Verify files are on GitHub

## Render Setup (3 minutes)

- [ ] Go to https://render.com
- [ ] Sign up with GitHub
- [ ] Click "New +" → "Web Service"
- [ ] Connect `calendar-api` repository
- [ ] Configure:
  - Name: `team-calendar-api`
  - Region: (closest to you)
  - Branch: `main`
  - Runtime: `Node`
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Plan: **Free**
- [ ] Add environment variable:
  - Key: `NODE_ENV`
  - Value: `production`
- [ ] Click "Create Web Service"
- [ ] Wait 2-3 minutes for deployment

## Testing (1 minute)

- [ ] Copy your Render URL (e.g., `https://team-calendar-api.onrender.com`)
- [ ] Test health endpoint: `YOUR-URL/api/health`
- [ ] Should see: `{"status":"ok",...}`
- [ ] Test web interface: `YOUR-URL/client.html`

## Update Client (2 minutes)

- [ ] Open `client.html`
- [ ] Change `const API_URL = 'http://localhost:3000';`
- [ ] To: `const API_URL = 'https://team-calendar-api.onrender.com';`
- [ ] Save and commit:
  ```bash
  git add client.html
  git commit -m "Update API URL"
  git push
  ```
- [ ] Wait ~1 minute for auto-deploy
- [ ] Verify web interface works

## Share with Team

- [ ] Copy your URL: `https://team-calendar-api.onrender.com/client.html`
- [ ] Send to team with instructions (see TEAM_GUIDE.md)
- [ ] Have them upload their calendars
- [ ] Start scheduling! 🎉

## Optional Enhancements

- [ ] Set up UptimeRobot to keep service warm
- [ ] Add custom domain
- [ ] Set up monitoring
- [ ] Configure backup strategy

---

## Quick Commands Reference

```bash
# Update and deploy
git add .
git commit -m "Description of changes"
git push

# Check git status
git status

# View git log
git log --oneline

# Force rebuild (if needed)
# Do this in Render dashboard: Manual Deploy → Clear cache & deploy
```

---

## URLs to Save

- **GitHub Repo:** https://github.com/YOUR-USERNAME/calendar-api
- **Render Dashboard:** https://dashboard.render.com
- **Live API:** https://team-calendar-api.onrender.com
- **Web Interface:** https://team-calendar-api.onrender.com/client.html
- **API Health:** https://team-calendar-api.onrender.com/api/health

---

## Common Issues

**Build fails:**
- Check Render logs
- Verify `package.json` is correct
- Clear cache and redeploy

**Can't push to GitHub:**
- Verify remote: `git remote -v`
- Check credentials: `git config user.name` and `git config user.email`

**Service won't start:**
- Check Start Command is `npm start`
- Verify all dependencies are in `package.json`

**CORS errors:**
- Already handled - check client.html is using correct URL

---

Total Time: ~15 minutes from start to deployed! ⚡
