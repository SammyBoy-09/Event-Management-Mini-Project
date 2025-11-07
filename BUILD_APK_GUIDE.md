# 📱 Building APK for CampusConnect

## 🚀 Quick Build Guide

### Option 1: Build APK with EAS (Recommended)

#### Step 1: Login to Expo
```bash
cd frontend
npx eas login
```

#### Step 2: Configure the Project
```bash
npx eas build:configure
```
This will create/update your `eas.json` and link to your Expo project.

#### Step 3: Build the APK
```bash
# For testing (internal distribution)
npx eas build -p android --profile preview

# For production release
npx eas build -p android --profile production
```

The build process takes about 10-15 minutes. You'll get a download link when it's done.

---

## ⚙️ Important: Production Backend Setup

### Current Setup
The app currently uses manual API URL: `http://192.168.29.217:5000/api`

**This will NOT work for other users!** They need access to your backend.

### Solutions:

#### Solution 1: Deploy Backend Online (Recommended)

Deploy your backend to a cloud service:

**Free Options:**
1. **Render** (https://render.com)
   - Easy deployment
   - Free tier available
   - Auto-sleeps after inactivity

2. **Railway** (https://railway.app)
   - $5 free credit monthly
   - Easy MongoDB integration

3. **Heroku** (https://heroku.com)
   - Free tier with limitations

4. **Vercel** (for Node.js APIs)
   - Free tier available

**Steps:**
1. Deploy backend to chosen platform
2. Get your production URL (e.g., `https://your-app.render.com`)
3. Update `frontend/api/api.js`:
   ```javascript
   // Change this line:
   const MANUAL_API_URL = 'https://your-app.render.com/api';
   ```
4. Rebuild the APK

#### Solution 2: Local Network Only (Testing)

If you want to keep using local backend (for testing only):

1. **Update API URL before each build:**
   ```javascript
   // In frontend/api/api.js
   const MANUAL_API_URL = 'http://YOUR-CURRENT-IP:5000/api';
   ```

2. **Start backend on your computer:**
   ```bash
   cd backend
   npm start
   ```

3. **Users must be on the same WiFi network**

4. **Find your IP:**
   ```bash
   ipconfig  # Look for IPv4 Address
   ```

**⚠️ Limitations:**
- Only works on same WiFi
- Backend must be running on your computer
- IP changes when network changes

---

## 📦 Build Process Details

### What Happens During Build:

1. ✅ Expo compiles your React Native code
2. ✅ Bundles all JavaScript into native code
3. ✅ Creates Android APK file
4. ✅ Signs the APK (for production)
5. ✅ Uploads to Expo servers
6. ✅ Provides download link

### Build Profiles:

**Preview Profile** (`--profile preview`)
- ✅ Quick builds
- ✅ APK format (easy to share)
- ✅ Good for testing
- ⚠️ Not optimized for Play Store

**Production Profile** (`--profile production`)
- ✅ Optimized build
- ✅ Ready for Play Store
- ✅ Signed with production keys
- ⏱️ Takes longer to build

---

## 📲 After Build Completes

### 1. Download the APK
You'll get a link like:
```
https://expo.dev/artifacts/eas/xxxxx.apk
```

### 2. Share with Users
Methods to share:
- Google Drive
- Dropbox
- Direct download link
- WhatsApp/Email (if file size allows)

### 3. Installation on Android
Users need to:
1. Download the APK
2. Enable "Install from Unknown Sources" in Settings
3. Tap the APK file to install
4. Open CampusConnect app

---

## 🔒 For Play Store Release

### Additional Steps:

1. **Create a Google Play Developer Account** ($25 one-time fee)

2. **Generate Upload Key:**
   ```bash
   npx eas credentials
   ```

3. **Build AAB (Android App Bundle):**
   Update `eas.json`:
   ```json
   "production": {
     "android": {
       "buildType": "app-bundle"
     }
   }
   ```

4. **Build:**
   ```bash
   npx eas build -p android --profile production
   ```

5. **Upload to Google Play Console**

---

## 🐛 Troubleshooting

### Build Fails
- Check `app.json` for errors
- Ensure all dependencies are compatible
- Check Expo Go version matches SDK version

### App Crashes on Install
- Check API URL is correct
- Verify backend is accessible
- Check Android permissions in `app.json`

### "Network Request Failed"
- Backend not accessible
- Wrong API URL
- Firewall blocking connections

---

## 📝 Checklist Before Building

- [ ] Backend is deployed online OR
- [ ] Local backend IP is updated in code
- [ ] App name and version are correct in `app.json`
- [ ] Package name is unique (`com.campusconnect.app`)
- [ ] Tested on physical device
- [ ] All features work correctly
- [ ] No console errors

---

## 💡 Quick Build Commands

```bash
# Install EAS CLI (one-time)
npm install -g eas-cli

# Navigate to frontend
cd frontend

# Login to Expo
npx eas login

# Configure project
npx eas build:configure

# Build APK for testing
npx eas build -p android --profile preview

# Build APK for production
npx eas build -p android --profile production

# Check build status
npx eas build:list
```

---

## 🌐 Deploy Backend to Render (Quick Guide)

1. **Create Render Account** (https://render.com)

2. **Create New Web Service**
   - Connect your GitHub repo
   - Select the `backend` directory
   - Choose "Node" environment

3. **Configure:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add Environment Variables:
     ```
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_secret
     PORT=5000
     NODE_ENV=production
     ```

4. **Deploy!**
   - Get your URL: `https://your-app.onrender.com`
   - Update frontend API URL
   - Rebuild APK

---

## 📞 Need Help?

Check these resources:
- Expo Docs: https://docs.expo.dev
- EAS Build: https://docs.expo.dev/build/introduction
- React Native: https://reactnative.dev

---

**Ready to build!** Follow the steps above and you'll have an installable APK in about 15-20 minutes! 🚀
