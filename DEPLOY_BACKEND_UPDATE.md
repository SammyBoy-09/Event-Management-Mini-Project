# 🚀 Deploy Backend Updates to Render

## Current Issue
Your local backend has these new features:
- ✅ `/api/health` endpoint for server warmup
- ✅ Push token registration endpoint

But your **Render deployment** doesn't have these updates yet, causing 404 errors.

## Solution: Deploy Backend to Render

### Option 1: Auto-Deploy via GitHub (Recommended)

If your Render service is connected to GitHub:

1. **Commit backend changes**:
   ```bash
   git add backend/server.js
   git commit -m "Add health endpoint for splash screen warmup"
   git push origin main
   ```

2. **Render will auto-deploy** (check Render dashboard for deployment progress)

3. **Wait 2-3 minutes** for deployment to complete

4. **Test health endpoint**:
   ```bash
   curl https://event-management-mini-project.onrender.com/api/health
   ```

### Option 2: Manual Deploy via Render Dashboard

If auto-deploy is not enabled:

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Select your **event-management** service
3. Click **Manual Deploy** → **Deploy latest commit**
4. Wait for deployment to complete

### Option 3: Redeploy Existing Code

If you don't want to commit:

1. Go to Render Dashboard
2. Click **Manual Deploy** → **Clear build cache & deploy**
3. This will redeploy current code

---

## Verify Backend is Updated

After deployment, test these endpoints:

### 1. Health Endpoint
```bash
curl https://event-management-mini-project.onrender.com/api/health
```

**Expected Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-12-04T...",
  "uptime": 123.45
}
```

### 2. Root Endpoint (should still work)
```bash
curl https://event-management-mini-project.onrender.com
```

**Expected Response:**
```json
{
  "success": true,
  "message": "🎓 CampusConnect Event Management API",
  "version": "1.0.0"
}
```

---

## After Backend is Deployed

### Test in Expo Go
1. Reload app (shake device → Reload)
2. Check console logs:
   - ✅ Should see: `✅ Backend ready in XXXms`
   - ✅ Should see: `✅ Push token registered with backend`
   - ❌ Should NOT see: `Request failed with status code 404`

### Build APK
Once backend is working:
```bash
cd frontend
eas build --platform android --profile preview
```

---

## Current Workaround

The app will work even with 404 errors, but:
- ⚠️ Push token won't be saved to backend
- ⚠️ You won't receive push notifications
- ✅ All other features work normally

**For production APK, you MUST deploy the backend first!**

---

## Quick Deploy Commands

```bash
# 1. Commit changes
git add backend/server.js
git commit -m "Add health endpoint and update routes"
git push origin main

# 2. Wait for Render auto-deploy (2-3 minutes)

# 3. Test health endpoint
curl https://event-management-mini-project.onrender.com/api/health

# 4. If successful, build APK
cd frontend
eas build --platform android --profile preview
```

---

## Troubleshooting

### Issue: Git push rejected
```bash
git pull origin main
git push origin main
```

### Issue: Auto-deploy not working
- Go to Render Dashboard → Settings → Enable Auto-Deploy
- Or use Manual Deploy button

### Issue: Backend still shows 404 after deploy
- Check Render logs for deployment errors
- Verify correct branch is deployed (should be `main`)
- Check if `server.js` was actually committed

### Issue: "Cannot find module" error in Render logs
```bash
# Ensure all dependencies are in package.json
cd backend
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

---

## Next Steps

1. ✅ Deploy backend to Render (choose option above)
2. ✅ Test health endpoint
3. ✅ Test app in Expo Go (should show "Server ready!")
4. ✅ Build APK with EAS
5. ✅ Test notifications in APK

**Estimated time: 5-10 minutes total**
