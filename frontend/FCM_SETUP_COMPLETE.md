# ✅ FCM Setup Complete - Ready to Build APK

## Current Status

Your project is **already configured correctly** for FCM push notifications! Here's what you have:

✅ `google-services.json` in `frontend/` directory  
✅ `app.json` configured with `googleServicesFile` path  
✅ `expo-notifications` plugin configured  
✅ Backend using `expo-server-sdk` (supports FCM automatically)  
✅ Firebase Cloud Messaging API (V1) enabled in Firebase Console

## Why Notifications Work in Expo Go But Not APK

| Environment | How It Works |
|-------------|--------------|
| **Expo Go** | Uses Expo's development notification service (no FCM needed) |
| **Standalone APK** | Uses Firebase Cloud Messaging directly (requires google-services.json + proper build) |

When you scan QR code with Expo Go, it uses Expo's servers. When you build an APK, it uses your Firebase project.

## Solution: Rebuild APK with EAS Build

Your configuration is correct, but you need to rebuild the APK using **EAS Build** (Expo Application Services) for FCM to be properly integrated.

### Step 1: Install EAS CLI (if not already installed)

```bash
npm install -g eas-cli
```

### Step 2: Login to Expo

```bash
cd frontend
eas login
```

Enter your Expo account credentials.

### Step 3: Build APK with EAS

```bash
eas build --platform android --profile preview
```

This will:
- Upload your code to Expo's build servers
- Properly integrate `google-services.json` with FCM
- Build a production-ready APK with working push notifications
- Download the APK when complete

### Step 4: Install and Test

1. Download the APK from the EAS build URL
2. Install on your Android device
3. Create an event and have admin approve it
4. **Notification will now pop up!** 🎉

## Why EAS Build Is Required

**Local builds** (using `expo build:android` or `npx expo run:android`) don't properly integrate FCM credentials. **EAS Build** handles:

- ✅ Proper FCM credential integration
- ✅ Google Services configuration
- ✅ Push notification channel setup
- ✅ Production-ready signing

## Alternative: Local Build with Additional Steps

If you prefer local builds, you need to:

1. Set up Android Studio
2. Configure Firebase manually in native Android project
3. Build using `npx expo run:android --variant release`

**This is much more complex.** EAS Build is recommended.

## Verification After New Build

Test push notifications:

1. **Local Notification Test**: Use the test button in the app ✅ (already works)
2. **Backend Notification Test**: Have admin approve an event
3. **Expected Result**: Pop-up notification appears on home screen

## Your FCM Configuration Details

- **Project ID**: campusconnect-a9667
- **Sender ID**: 125972960581
- **Package Name**: com.campusconnect.app
- **FCM API**: V1 (modern, enabled ✅)

## Common Issues After Rebuild

If notifications still don't work after EAS build:

### Issue 1: Notification Permissions
- Go to Settings → Apps → CampusConnect → Notifications
- Ensure notifications are enabled

### Issue 2: Backend Not Sending
- Check backend logs when admin approves event
- Verify user's `expoPushToken` is saved in database

### Issue 3: Invalid Push Token
- Clear app data and re-register for notifications
- Check console for "Push token registered" message

## Quick Command Summary

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login
cd frontend
eas login

# 3. Build APK
eas build --platform android --profile preview

# 4. Wait for build (10-15 minutes)
# 5. Download APK from provided URL
# 6. Install and test!
```

## No Code Changes Needed!

Your code is already correct. Just rebuild with EAS and notifications will work! 🚀
