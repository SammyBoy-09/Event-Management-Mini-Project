# Fix Push Notifications in Standalone APK Build

## Problem
Push notifications work in **Expo Go** (development) but **NOT in standalone APK** builds.

## Root Cause
Expo Go has its own built-in notification infrastructure, but standalone APK builds require proper **Firebase Cloud Messaging (FCM)** configuration with server credentials.

---

## Solution: Add FCM Server Key

### Step 1: Get FCM Server Key from Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **campusconnect-a9667**
3. Click **⚙️ (gear icon)** → **Project settings**
4. Navigate to **Cloud Messaging** tab
5. Under **Project credentials** section:
   - If you see **Cloud Messaging API (Legacy)** disabled:
     - Click **⋮ (three dots)** → **Manage API in Google Cloud Console**
     - Enable **Cloud Messaging API (Legacy)**
   - Copy the **Server key** (starts with `AAAA...`)

### Step 2: Add FCM Server Key to Your Expo Project

**Option A: Using Expo Secrets (Recommended for security)**

```bash
cd frontend
npx eas secret:create --scope project --name FCM_SERVER_KEY --value YOUR_SERVER_KEY_HERE --type string
```

**Option B: Add to app.json (Quick but less secure)**

Add this to `frontend/app.json` under the root `expo` object:

```json
{
  "expo": {
    ...other config...,
    "android": {
      ...existing android config...,
      "googleServicesFile": "./google-services.json"
    },
    "notification": {
      ...existing notification config...
    },
    "extra": {
      "eas": {
        "projectId": "f4bbeab9-7030-40d9-83d3-8ff08a9d4173"
      },
      "fcmServerKey": "YOUR_FCM_SERVER_KEY_HERE"
    }
  }
}
```

⚠️ **Security Warning:** If using Option B, add `app.json` to `.gitignore` or use environment variables.

### Step 3: Update Backend to Use FCM Server Key

The backend also needs the FCM server key. Add it to your backend `.env` file:

```env
FCM_SERVER_KEY=YOUR_FCM_SERVER_KEY_HERE
```

### Step 4: Rebuild Your APK

```bash
cd frontend
eas build --platform android --profile preview
```

---

## Alternative: Use Expo's Push Notification Service (Easier)

If you don't want to deal with FCM server keys, you can use **Expo's push notification service** which works in both Expo Go and standalone builds:

### Backend Changes Required:

**File:** `backend/services/pushNotificationService.js`

```javascript
const axios = require('axios');

const sendPushNotification = async (expoPushToken, title, body, data = {}) => {
  try {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: title,
      body: body,
      data: data,
      priority: 'high',
      channelId: 'default'
    };

    // Use Expo's push notification API (works in both Expo Go and standalone)
    const response = await axios.post(
      'https://exp.host/--/api/v2/push/send',
      message,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    console.error('Push notification error:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendPushNotification, sendBulkPushNotifications };
```

This approach uses Expo's infrastructure and doesn't require FCM server keys.

---

## Verification Steps

After rebuilding the APK:

1. Install the new APK on your device
2. Grant notification permissions when prompted
3. Log in to the app
4. Create an event and have an admin approve it
5. You should see a push notification pop-up! 🎉

### Debug Checklist

- [ ] FCM Server Key added to project
- [ ] `google-services.json` file present in `frontend/` directory
- [ ] Backend `.env` has FCM_SERVER_KEY (if needed)
- [ ] Rebuilt APK after configuration changes
- [ ] Device has notification permissions enabled
- [ ] Device is not in Do Not Disturb mode
- [ ] Backend logs show notification being sent

---

## Why This Happens

| Environment | Notification Infrastructure |
|-------------|---------------------------|
| **Expo Go** | Uses Expo's built-in notification service (no FCM needed) |
| **Standalone APK** | Requires Firebase Cloud Messaging (FCM) with server key |

When you run `expo start` and scan QR code with Expo Go:
- ✅ Expo Go handles notifications automatically
- ✅ No FCM configuration needed

When you build APK with `eas build`:
- ❌ Expo Go is NOT included in the APK
- ❌ FCM server key MUST be configured
- ✅ `google-services.json` is bundled but needs server credentials

---

## Quick Fix Summary

**Fastest Solution (No FCM Server Key needed):**

1. Use Expo's push API in backend (code above)
2. Rebuild APK: `eas build --platform android --profile preview`
3. Install new APK and test

**Production-Ready Solution (With FCM):**

1. Get FCM Server Key from Firebase Console
2. Add to Expo project via `eas secret:create` or `app.json`
3. Add to backend `.env` file
4. Rebuild APK
5. Test on device

---

## Additional Resources

- [Expo Push Notifications Docs](https://docs.expo.dev/push-notifications/overview/)
- [Firebase Cloud Messaging Setup](https://docs.expo.dev/push-notifications/fcm-credentials/)
- [EAS Build Configuration](https://docs.expo.dev/build/introduction/)
