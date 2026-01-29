# Deployment Guide - Sharing with Your Team

There are several ways to make this calendar API accessible to your teammates:

## Option 1: Quick Local Network Sharing (Fastest)

If you're on the same network (office, home, etc.):

### Steps:
1. Start the server on your machine:
   ```bash
   npm start
   ```

2. Find your local IP address:
   
   **Mac/Linux:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   
   **Windows:**
   ```bash
   ipconfig
   ```
   Look for your IPv4 address (e.g., 192.168.1.100)

3. Update server.js to listen on all interfaces:
   ```javascript
   // Change this line:
   app.listen(PORT, () => {
   
   // To this:
   app.listen(PORT, '0.0.0.0', () => {
   ```

4. Share the URL with teammates:
   ```
   http://YOUR-IP-ADDRESS:3000
   ```
   Example: `http://192.168.1.100:3000`

5. They can open `http://YOUR-IP-ADDRESS:3000/client.html` in their browser

**Pros:** Instant, no signup required  
**Cons:** Only works on same network, requires your computer running

---

## Option 2: Heroku (Free & Easy Cloud Hosting)

Deploy to Heroku for free cloud access:

### Steps:

1. **Install Heroku CLI:**
   ```bash
   # Mac
   brew tap heroku/brew && brew install heroku
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku:**
   ```bash
   heroku login
   ```

3. **Prepare your app:**
   ```bash
   cd calendar-api
   git init
   git add .
   git commit -m "Initial commit"
   ```

4. **Create Heroku app:**
   ```bash
   heroku create your-team-calendar-api
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

6. **Open your app:**
   ```bash
   heroku open
   ```

7. **Share the URL with your team:**
   ```
   https://your-team-calendar-api.herokuapp.com
   ```

**Pros:** Free, accessible anywhere, always online  
**Cons:** Limited to 550 hours/month on free tier, sleeps after 30 min inactivity

---

## Option 3: Railway (Modern Alternative to Heroku)

Railway offers a modern deployment experience:

### Steps:

1. **Visit [railway.app](https://railway.app)** and sign up with GitHub

2. **Click "New Project"** → "Deploy from GitHub repo"

3. **Select your repository** (you'll need to push to GitHub first)

4. **Railway auto-detects** Node.js and deploys

5. **Get your URL** from the Railway dashboard

6. **Share with team**

**Pros:** Very easy, generous free tier, great DX  
**Cons:** Requires GitHub account

---

## Option 4: DigitalOcean App Platform

For a more robust solution:

### Steps:

1. **Sign up** at [DigitalOcean](https://www.digitalocean.com)

2. **Create App** → Choose GitHub/GitLab

3. **Select repository** and branch

4. **Configure:**
   - Build Command: `npm install`
   - Run Command: `npm start`
   - Port: 3000

5. **Deploy** and get your public URL

6. **Share with team**

**Pricing:** $5/month for basic plan  
**Pros:** Professional, scalable, good for long-term  
**Cons:** Costs money

---

## Option 5: ngrok (Quick Tunnel, Great for Testing)

Create a secure tunnel to your localhost:

### Steps:

1. **Install ngrok:**
   ```bash
   # Mac
   brew install ngrok
   
   # Or download from https://ngrok.com/download
   ```

2. **Start your server:**
   ```bash
   npm start
   ```

3. **In another terminal, create tunnel:**
   ```bash
   ngrok http 3000
   ```

4. **Share the ngrok URL** (looks like `https://abc123.ngrok.io`)

5. **Update client.html** to use the ngrok URL instead of localhost

**Pros:** Instant, no deployment needed  
**Cons:** URL changes each time, free tier has limitations

---

## Option 6: Docker + Any Cloud Provider

For maximum flexibility:

### Steps:

1. **Create Dockerfile** (see docker-deployment.md)

2. **Build image:**
   ```bash
   docker build -t calendar-api .
   ```

3. **Deploy to:**
   - AWS ECS
   - Google Cloud Run
   - Azure Container Instances
   - Any Docker host

**Pros:** Portable, professional, scalable  
**Cons:** More complex setup

---

## Recommended Quick Setup for Teams

### For Small Teams (2-10 people):
**Best: Railway or Heroku**
- 5 minutes to deploy
- Free tier sufficient
- No maintenance

### For Same Office/Network:
**Best: Local Network Sharing**
- Instant setup
- No external dependencies
- Keep data private

### For Enterprise:
**Best: DigitalOcean or AWS**
- Professional hosting
- Scalable
- Custom domain support

---

## Security Considerations

Before sharing publicly, consider adding:

### 1. Authentication
```javascript
// Add API key middleware
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

### 2. Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

### 3. HTTPS
All cloud platforms provide HTTPS automatically. For local deployments, use:
- Let's Encrypt (free SSL certificates)
- Cloudflare (free proxy with SSL)

---

## Updating Client URLs

After deployment, update `client.html`:

```javascript
// Change this:
const API_URL = 'http://localhost:3000';

// To your deployed URL:
const API_URL = 'https://your-app.herokuapp.com';
```

---

## Monitoring Your Deployment

### Health Checks
The API includes a `/api/health` endpoint. Set up monitoring:

- **Uptime Robot** (free) - https://uptimerobot.com
- **Pingdom** - https://www.pingdom.com
- **Better Uptime** - https://betteruptime.com

### Logs
View logs on your platform:
```bash
# Heroku
heroku logs --tail

# Railway
railway logs

# DigitalOcean
Check the app dashboard
```

---

## Need Help?

1. **Deployment issues?** Check the platform-specific docs
2. **API not working?** Test with `/api/health` endpoint
3. **CORS errors?** Ensure your frontend URL is in CORS config

## Next Steps

1. Choose your deployment method
2. Follow the steps above
3. Share the URL with your team
4. Have teammates upload their calendars
5. Start finding meeting times!
