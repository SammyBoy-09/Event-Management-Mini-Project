# 🚀 Deploy Backend to Render.com (Free)

## Quick Deployment Steps

### 1. Prepare Your Backend

Make sure your `server.js` uses the PORT from environment:
```javascript
const PORT = process.env.PORT || 5000;
```
✅ Already configured!

### 2. Create Render Account
Go to: https://render.com/register

### 3. Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub account
3. Select your repository: `Event-Management-Mini-Project`
4. Configure:
   - **Name**: `campusconnect-backend`
   - **Region**: Choose closest to users
   - **Branch**: `main` or `feature/dynamic-api-url`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### 4. Add Environment Variables

Click **"Advanced"** and add:

```
MONGO_URI=mongodb+srv://eventmanager:root123@cluster1.z4z9fiu.mongodb.net/?appName=Cluster1
JWT_SECRET=campusconnect_secret_key_2025_secure
NODE_ENV=production
PORT=5000
```

### 5. Deploy!

Click **"Create Web Service"**

The deployment takes 2-5 minutes. You'll get a URL like:
```
https://campusconnect-backend.onrender.com
```

### 6. Test Your Backend

Visit: `https://your-app.onrender.com/`

You should see:
```json
{
  "success": true,
  "message": "🎓 CampusConnect Event Management API",
  "version": "1.0.0"
}
```

### 7. Update Frontend

In `frontend/api/api.js`, update:
```javascript
const MANUAL_API_URL = 'https://your-app.onrender.com/api';
```

### 8. Rebuild APK

```bash
cd frontend
npx eas build -p android --profile preview
```

---

## ⚠️ Important Notes

### Free Tier Limitations:
- App sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds (cold start)
- Good for testing and small projects

### Solutions:
1. **Upgrade to Paid Plan** ($7/month) - No sleep
2. **Keep Alive Service** - Ping your backend every 14 minutes
3. **Use Railway/Heroku** - Different free tier limits

---

## 🔄 Auto-Deploy on Push

Render automatically redeploys when you push to GitHub!

Just:
```bash
git add .
git commit -m "Update backend"
git push
```

Render will automatically rebuild and redeploy! ✨

---

## 📊 Monitor Your Backend

- **Dashboard**: https://dashboard.render.com
- **Logs**: View real-time logs
- **Metrics**: CPU, memory usage
- **Events**: Deployment history

---

## 🐛 Troubleshooting

### Build Fails
- Check `package.json` is in backend folder
- Verify Node version compatibility
- Check build logs in Render dashboard

### App Crashes
- Check environment variables are set
- View logs in Render dashboard
- Verify MongoDB connection string

### Slow Response
- Free tier wakes from sleep (30s first request)
- Consider paid plan for faster response
- Use Railway if Render is too slow

---

## 💡 Alternative: Railway.app

Railway is another great option with $5 free credit:

1. Go to: https://railway.app
2. Sign in with GitHub
3. Click **"New Project"**
4. Select your repo
5. Deploy automatically!

Railway is faster but has monthly credit limit.

---

**Your backend will be accessible worldwide once deployed! 🌍**
