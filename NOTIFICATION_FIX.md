# Quick Fix: Notifications Not Working in APK

## The Problem
✅ Works in development (Expo Go)  
❌ Doesn't work in production APK

## Why?
Production builds need **Firebase Cloud Messaging (FCM)** setup.

## Quick Solution (5 minutes)

### 1. Go to Firebase Console
https://console.firebase.google.com/

### 2. Create/Select Project
- Project name: **CampusConnect**

### 3. Add Android App
- Click Android icon
- Package name: `com.campusconnect.app`
- Click "Register app"

### 4. Download File
- Download `google-services.json`
- Save to: `frontend/google-services.json`

### 5. Rebuild APK
```powershell
cd frontend
eas build --platform android --profile production
```

### 6. Done!
Install new APK and test notifications.

---

## What's Already Done
✅ app.json updated with notification config  
✅ Backend code ready  
✅ Frontend notification handlers ready  

## What You Need to Do
⏳ Firebase setup (5 minutes)  
⏳ Download google-services.json  
⏳ Rebuild APK  

**See PUSH_NOTIFICATIONS_SETUP.md for detailed guide**
