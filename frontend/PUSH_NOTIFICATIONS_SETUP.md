# Push Notifications Setup Guide

## Problem
Push notifications work in Expo Go but not in production APK builds. This is because production builds require Firebase Cloud Messaging (FCM) configuration.

## Why This Happens
- **Expo Go**: Uses Expo's own push notification infrastructure (works out of the box)
- **Standalone Build**: Requires your own FCM credentials from Firebase Console

## Solution: Set Up Firebase Cloud Messaging (FCM)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Enter project name: **CampusConnect** (or any name)
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Add Android App to Firebase

1. In Firebase Console, click the **Android icon** (Add Android app)
2. Enter your package name: `com.campusconnect.app`
   - ⚠️ Must match the package in `app.json`
3. Skip App nickname (optional)
4. Skip SHA-1 (not needed for push notifications)
5. Click "Register app"

### Step 3: Download google-services.json

1. Firebase will generate `google-services.json`
2. Click "Download google-services.json"
3. Save it to: `frontend/google-services.json`
   ```
   frontend/
     google-services.json  ← Place here
     app.json
     App.js
     ...
   ```

### Step 4: Get FCM Server Key (for Backend)

1. In Firebase Console, click the **Gear icon** → **Project settings**
2. Go to **Cloud Messaging** tab
3. Find **Server key** (under Cloud Messaging API)
4. Copy the server key
5. Add to your backend `.env` file:
   ```
   FCM_SERVER_KEY=your_server_key_here
   ```

### Step 5: Update Backend (Optional Enhancement)

The current setup uses Expo's push service which works fine. But if you want direct FCM:

```javascript
// In backend, you can optionally use FCM directly
// But Expo handles this for you, so current code is fine
```

### Step 6: Rebuild the APK

```powershell
cd frontend
eas build --platform android --profile production
```

### Step 7: Test Push Notifications

1. Install the new APK
2. Login to the app
3. Grant notification permissions
4. Create an event (as student)
5. Approve it (as admin)
6. Check if notification appears

---

## Current Setup Status

✅ **app.json configured** with:
- Notification permissions (RECEIVE_BOOT_COMPLETED, VIBRATE)
- Notification icon and color
- `useNextNotificationsApi: true`
- Reference to google-services.json

⏳ **Needs:**
- google-services.json file from Firebase
- FCM setup in Firebase Console

---

## Troubleshooting

### Notifications Still Not Working?

1. **Check Permissions**
   ```javascript
   // In your app, check notification permissions
   const { status } = await Notifications.getPermissionsAsync();
   console.log('Notification permission:', status);
   ```

2. **Check Push Token**
   ```javascript
   // Verify token is being registered
   // Should see in backend logs: "Push token registered"
   ```

3. **Check Firebase Console**
   - Go to Cloud Messaging → Send test message
   - Use the Expo push token from your app
   - If test works, backend code is the issue
   - If test fails, FCM setup is the issue

4. **Check Backend Logs**
   ```
   // Should see when notification is sent:
   "Push notification sent: ..."
   ```

5. **Common Issues**
   - **Package name mismatch**: Must match in app.json and Firebase
   - **google-services.json missing**: Must be in frontend/ folder
   - **Outdated credentials**: Firebase keys can expire
   - **Network issues**: Device must have internet
   - **Battery saver mode**: May block background notifications

### Verify FCM Setup

Run this test from your backend:

```javascript
const { sendPushNotification } = require('./services/pushNotificationService');

// Test with your Expo push token
const token = 'ExponentPushToken[xxxxxx]';
await sendPushNotification(
  token,
  'Test Notification',
  'If you see this, FCM is working!',
  { test: true }
);
```

---

## Alternative: Use EAS Credentials

If you don't want to manually set up Firebase, let EAS do it:

```powershell
# Build with auto credentials (EAS handles FCM)
cd frontend
eas build --platform android --profile production
```

EAS will automatically:
1. Create Firebase project
2. Generate google-services.json
3. Configure push notifications

But you need EAS Build credits (free tier has limited builds).

---

## Quick Fix (If Still Not Working)

If notifications still don't work after Firebase setup:

### Option A: Use Local Notifications (Fallback)

Update `eventController.js` to also save to Notification model:

```javascript
// Already doing this ✅
await Notification.create({
  recipient: event.createdBy,
  type: notificationType,
  title: 'Event Status Updated',
  message: notificationMessage,
  relatedEvent: event._id
});
```

Users can check NotificationsScreen in-app even if push fails.

### Option B: Use EAS Notifications Service

Switch to EAS Notifications (paid but reliable):

```powershell
expo install expo-notifications
eas build --platform android --profile production
```

---

## Summary

**What you need to do:**

1. ✅ Update app.json (already done)
2. ⏳ Create Firebase project
3. ⏳ Add Android app to Firebase
4. ⏳ Download google-services.json → place in frontend/
5. ⏳ Copy FCM server key → add to backend .env
6. ⏳ Rebuild APK: `eas build --platform android --profile production`
7. ⏳ Test notifications

**After these steps, notifications will work in production builds!** 🔔
