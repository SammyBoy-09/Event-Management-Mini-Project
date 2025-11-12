# Android Studio Setup Guide for Push Notifications

This guide will help you set up and test push notifications using Android Studio from scratch.

---

## Prerequisites

### 1. Install Android Studio
- Download: [Android Studio](https://developer.android.com/studio)
- Version: Latest stable (Hedgehog or newer recommended)
- During installation, make sure to install:
  - Android SDK
  - Android SDK Platform
  - Android Virtual Device (AVD)

### 2. System Requirements
- Windows 10/11 (64-bit)
- At least 8GB RAM (16GB recommended)
- 8GB free disk space minimum

---

## Part 1: Android Studio Initial Setup

### Step 1: Install Android Studio

1. Download Android Studio from the official website
2. Run the installer
3. Choose "Standard" installation
4. Wait for SDK components to download (~2-3 GB)

### Step 2: Configure SDK

1. Open Android Studio
2. Go to **File** → **Settings** (or **Configure** → **Settings** on welcome screen)
3. Navigate to **Appearance & Behavior** → **System Settings** → **Android SDK**
4. Under **SDK Platforms** tab, install:
   - ✅ Android 13.0 (Tiramisu) - API Level 33
   - ✅ Android 12.0 (S) - API Level 31
   - ✅ Android 11.0 (R) - API Level 30
5. Under **SDK Tools** tab, ensure these are installed:
   - ✅ Android SDK Build-Tools
   - ✅ Android SDK Platform-Tools
   - ✅ Android Emulator
   - ✅ Google Play Services
6. Click **Apply** → **OK**

### Step 3: Set Environment Variables

Add Android SDK to your PATH:

```powershell
# Open PowerShell as Administrator and run:
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LOCALAPPDATA\Android\Sdk", "User")
[System.Environment]::SetEnvironmentVariable("Path", "$env:Path;$env:LOCALAPPDATA\Android\Sdk\platform-tools;$env:LOCALAPPDATA\Android\Sdk\tools", "User")
```

**Verify:**
```powershell
# Restart PowerShell and run:
adb --version
# Should show: Android Debug Bridge version X.X.X
```

---

## Part 2: Create Android Virtual Device (Emulator)

### Step 1: Open AVD Manager

1. In Android Studio, go to **Tools** → **Device Manager**
2. Click **Create Device**

### Step 2: Configure Emulator

1. **Select Hardware**:
   - Choose **Pixel 5** (recommended) or any device with **Play Store** icon
   - Click **Next**

2. **Select System Image**:
   - Click **Download** next to **Android 13.0 (Tiramisu) API Level 33**
   - Choose **x86_64** architecture
   - Wait for download to complete
   - Click **Next**

3. **Verify Configuration**:
   - AVD Name: `Pixel_5_API_33`
   - Startup orientation: Portrait
   - Enable **Device Frame** (optional)
   - Graphics: **Hardware - GLES 2.0** (faster)
   - RAM: 2048 MB minimum
   - VM heap: 256 MB
   - Internal Storage: 2048 MB
   - SD Card: 512 MB (optional)
   - Click **Finish**

### Step 3: Start Emulator

1. In Device Manager, click **▶ (Play)** button next to your AVD
2. Wait for emulator to boot (~2-3 minutes first time)
3. **Important**: Make sure emulator has Play Store (you'll see the Play Store app icon)

**Verify Emulator is Running:**
```powershell
# In PowerShell:
adb devices
# Should show:
# List of devices attached
# emulator-5554   device
```

---

## Part 3: Build React Native App for Android

### Step 1: Generate Native Android Project

Since you're using Expo, we need to prebuild the native Android code:

```powershell
# Navigate to frontend directory
cd "D:\sam\Projects\Event Management\app2\frontend"

# Install expo-cli if not already installed
npm install -g expo-cli

# Generate native Android project
npx expo prebuild --platform android

# This creates:
# - android/ folder with native Android project
# - Copies google-services.json to android/app/
```

### Step 2: Verify google-services.json Placement

After prebuild, check:
```
frontend/
  android/
    app/
      google-services.json  ← Should be here
      src/
      build.gradle
```

If missing, manually copy:
```powershell
Copy-Item ".\google-services.json" ".\android\app\google-services.json"
```

### Step 3: Install Dependencies

```powershell
# Install JavaScript dependencies
npm install

# Install Android dependencies (Gradle)
cd android
.\gradlew clean
cd ..
```

---

## Part 4: Open Project in Android Studio

### Step 1: Open Android Project

1. Open Android Studio
2. Click **Open** (or **File** → **Open**)
3. Navigate to: `D:\sam\Projects\Event Management\app2\frontend\android`
4. Select the **android** folder
5. Click **OK**

### Step 2: Gradle Sync

Android Studio will automatically:
1. Detect it's an Android project
2. Start Gradle sync
3. Download dependencies (~5-10 minutes first time)

**Wait for:**
- "Gradle sync finished" message at bottom
- No red errors in Build window

### Step 3: Verify Firebase Configuration

1. In Android Studio, open **Project** view (left sidebar)
2. Navigate to **app** → **google-services.json**
3. Verify file exists and contains:
   ```json
   {
     "project_info": {
       "project_number": "125972960581",
       "project_id": "campusconnect-xxxxx"
     },
     "client": [
       {
         "client_info": {
           "android_client_info": {
             "package_name": "com.campusconnect.app"
           }
         }
       }
     ]
   }
   ```

4. **Check package name matches** in `app/build.gradle`:
   ```gradle
   android {
       defaultConfig {
           applicationId "com.campusconnect.app"  // Must match
       }
   }
   ```

---

## Part 5: Run App on Emulator

### Method 1: Using Android Studio

1. **Start Emulator** (if not already running)
   - Tools → Device Manager → Play button

2. **Select Device**
   - Top toolbar → Device dropdown → Select your emulator

3. **Run App**
   - Click **▶ Run** (green play button) or press `Shift + F10`
   - Select **app** configuration
   - Wait for build and installation (~5-10 minutes first time)

### Method 2: Using Command Line (Recommended for Expo)

```powershell
# Make sure emulator is running first
# In frontend directory:

# Start Metro bundler
npx expo start --android

# Or use React Native CLI directly:
npx react-native run-android
```

**What happens:**
1. Metro bundler starts (JavaScript server)
2. App builds and installs on emulator
3. App launches automatically
4. You'll see Metro bundler logs in terminal

---

## Part 6: Test Push Notifications

### Step 1: Enable Notification Permissions

When app launches:
1. You'll see a permission dialog: "Allow CampusConnect to send notifications?"
2. Click **Allow**

### Step 2: Verify Push Token Registration

**In emulator, check Logcat (Android Studio):**

1. Open **Logcat** tab (bottom of Android Studio)
2. Set filter to: `expo-notifications`
3. Look for log message:
   ```
   Expo push token: ExponentPushToken[xxxxxxxxxx]
   ```

**Or check backend logs:**
- Should see: "Push token registered for user: <userId>"

### Step 3: Test Notification Flow

**Scenario 1: Event Approval Notification**

1. **On Student Account (in emulator):**
   - Create a new event
   - Fill in details
   - Submit event

2. **On Admin Account (on another device or web):**
   - Go to Admin Panel
   - Find pending event
   - Click **Approve**

3. **Back to Emulator:**
   - Notification should appear in ~2-5 seconds
   - Check notification drawer (swipe down from top)
   - Tap notification → should open Event Details screen

**Scenario 2: Test Notification Manually**

Use Firebase Console to send test notification:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **CampusConnect**
3. Go to **Cloud Messaging** (left menu)
4. Click **Send your first message**
5. Enter:
   - Notification title: "Test Notification"
   - Notification text: "Testing push notifications"
6. Click **Next**
7. Target: **Single device**
8. FCM registration token: `<Your Expo Push Token>`
9. Click **Review** → **Publish**

**Check emulator:** Notification should appear within seconds.

---

## Part 7: Debug Push Notifications

### Check 1: Verify Google Play Services

Emulator **MUST** have Google Play Services:

```powershell
# Check if Play Services is installed
adb shell "pm list packages | grep google"

# Should include:
# com.google.android.gms (Google Play Services)
```

If missing:
- Create new AVD with **Play Store** icon
- Don't use "Google APIs" (without Play Store)

### Check 2: Check Logcat for Errors

In Android Studio Logcat, filter by:
- `expo-notifications`
- `FCM`
- `FirebaseMessaging`

**Common error patterns:**
```
Error: SERVICE_NOT_AVAILABLE
→ Play Services not installed or outdated

Error: INVALID_SENDER
→ google-services.json mismatch with package name

Error: MismatchSenderId
→ FCM Sender ID doesn't match google-services.json
```

### Check 3: Test with adb logcat

```powershell
# View all logs in real-time
adb logcat | Select-String "expo|FCM|notification"

# Filter for errors only
adb logcat *:E | Select-String "notification"
```

### Check 4: Verify Firebase Setup

**In Firebase Console:**
1. Go to **Project Settings** → **Cloud Messaging**
2. Verify **Cloud Messaging API (Legacy)** is **ENABLED**
3. Or enable **Firebase Cloud Messaging API (V1)**
4. Check **Sender ID** matches in `google-services.json`

### Check 5: Test Notification Locally

Create a test script in backend:

```javascript
// backend/testNotification.js
const { sendPushNotification } = require('./services/pushNotificationService');

const testToken = 'ExponentPushToken[YOUR_TOKEN_HERE]'; // From emulator logs

async function testPush() {
  try {
    const result = await sendPushNotification(
      testToken,
      'Test Notification',
      'If you see this, push notifications are working!',
      { test: true }
    );
    console.log('✅ Notification sent:', result);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testPush();
```

Run it:
```powershell
cd backend
node testNotification.js
```

---

## Part 8: Common Issues & Solutions

### Issue 1: "App not installed" error

**Solution:**
```powershell
# Uninstall existing app
adb uninstall com.campusconnect.app

# Reinstall
npx expo run:android
```

### Issue 2: Emulator is slow/laggy

**Solution:**
1. Allocate more RAM to AVD (4096 MB)
2. Enable hardware acceleration:
   - Windows: Install Intel HAXM
   - Go to SDK Manager → SDK Tools → Intel x86 Emulator Accelerator
3. Use ARM64 system image instead of x86_64

### Issue 3: Metro bundler port conflict

**Solution:**
```powershell
# Kill existing Metro process
Stop-Process -Name node -Force

# Start with different port
npx expo start --port 8082
```

### Issue 4: Google Play Services outdated

**In emulator:**
1. Open Play Store
2. Search "Google Play Services"
3. Update if available
4. Restart emulator

### Issue 5: Notifications not appearing

**Check:**
1. ✅ Notification permission granted
2. ✅ App is in foreground/background (not killed)
3. ✅ Do Not Disturb is OFF
4. ✅ Battery saver is OFF
5. ✅ Emulator has internet connection

**Test internet:**
```powershell
adb shell ping google.com
```

### Issue 6: Build fails with "Duplicate class" error

**Solution:**
```powershell
cd android
.\gradlew clean
cd ..
npx expo run:android
```

---

## Part 9: Production Testing

### Step 1: Build Release APK

```powershell
cd "D:\sam\Projects\Event Management\app2\frontend"

# Build production APK
npx expo build:android

# Or using EAS Build:
eas build --platform android --profile production
```

### Step 2: Install on Physical Device

1. Enable Developer Options on Android phone:
   - Settings → About phone → Tap Build number 7 times
2. Enable USB Debugging:
   - Settings → Developer options → USB debugging
3. Connect phone via USB
4. Install APK:
   ```powershell
   adb install path\to\your-app.apk
   ```

### Step 3: Test on Physical Device

Same flow as emulator:
1. Grant notification permissions
2. Create event
3. Approve event (from admin)
4. Verify notification appears

---

## Quick Reference Commands

```powershell
# Start emulator
emulator -avd Pixel_5_API_33

# List devices
adb devices

# Start Metro bundler
npx expo start

# Run on Android
npx expo run:android

# View logs
adb logcat | Select-String "expo"

# Uninstall app
adb uninstall com.campusconnect.app

# Restart adb server
adb kill-server
adb start-server

# Clear app data
adb shell pm clear com.campusconnect.app
```

---

## Troubleshooting Checklist

Before asking for help, verify:

- [ ] Android Studio installed and updated
- [ ] SDK Platform 33 (Android 13) installed
- [ ] Emulator created with **Play Store** support
- [ ] `google-services.json` in `android/app/` folder
- [ ] Package name matches: `com.campusconnect.app`
- [ ] Firebase project created and Android app added
- [ ] FCM API enabled in Firebase Console
- [ ] Notification permissions granted in app
- [ ] Emulator has internet connection
- [ ] Google Play Services updated in emulator
- [ ] No errors in Logcat (filter: `expo-notifications`)

---

## Next Steps

Once notifications work in emulator:

1. ✅ Test all notification scenarios:
   - Event approval
   - Event rejection
   - Event reminders (24h, 1h before)
   
2. ✅ Test on physical device

3. ✅ Build production APK with `eas build`

4. ✅ Distribute APK for user testing

---

## Support Resources

- **Expo Notifications Docs**: https://docs.expo.dev/versions/latest/sdk/notifications/
- **Firebase Console**: https://console.firebase.google.com/
- **Android Studio Docs**: https://developer.android.com/studio/intro
- **React Native Debugging**: https://reactnative.dev/docs/debugging

---

**Your setup is ready! Start with Part 1 and work through each section step by step.** 🚀

Let me know if you encounter any issues!
