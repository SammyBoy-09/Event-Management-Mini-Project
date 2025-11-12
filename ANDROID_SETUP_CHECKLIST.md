# Android Studio Setup Checklist

**Starting Point**: Android Studio is installed ✅

---

## ☑️ Step 1: Configure Android SDK

### Task 1.1: Install SDK Platforms

1. Open Android Studio
2. Click **"More Actions"** → **"SDK Manager"** (or File → Settings → Android SDK)
3. In **SDK Platforms** tab:
   - ✅ Check **Android 13.0 (Tiramisu)** - API Level 33
   - ✅ Check **Android 12.0 (S)** - API Level 31
   - ✅ Check **Show Package Details** (bottom right)
   - ✅ Under Android 13.0, ensure these are checked:
     - Android SDK Platform 33
     - Google APIs Intel x86_64 Atom System Image
     - Google Play Intel x86_64 Atom System Image ⭐ (Important!)
4. Click **Apply** → Wait for download (~1-2 GB)
5. Click **OK**

**Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete

---

### Task 1.2: Install SDK Tools

1. In SDK Manager, switch to **SDK Tools** tab
2. Check these items:
   - ✅ Android SDK Build-Tools (latest version)
   - ✅ Android SDK Command-line Tools (latest)
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools
   - ✅ Google Play services
   - ✅ Intel x86 Emulator Accelerator (HAXM installer) - for Windows
3. Click **Apply** → Wait for download
4. Click **OK**

**Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete

---

### Task 1.3: Note Your SDK Path

**Before closing SDK Manager:**

1. Look at the top of SDK Manager window
2. Copy the **Android SDK Location** path
3. Example: `C:\Users\Sam\AppData\Local\Android\Sdk`
4. **Write it here**: `_________________________________`

**Status**: ⬜ Complete

---

## ☑️ Step 2: Set Environment Variables

### Task 2.1: Set ANDROID_HOME

**Copy your SDK path from Task 1.3**, then run in PowerShell:

```powershell
# Replace with YOUR actual SDK path
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\YourName\AppData\Local\Android\Sdk", "User")
```

**Status**: ⬜ Not Started | ⬜ Complete

---

### Task 2.2: Add to PATH

```powershell
# Run this (replace with YOUR SDK path)
$sdkPath = "C:\Users\YourName\AppData\Local\Android\Sdk"
$currentPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
$newPath = "$currentPath;$sdkPath\platform-tools;$sdkPath\tools;$sdkPath\cmdline-tools\latest\bin"
[System.Environment]::SetEnvironmentVariable("Path", $newPath, "User")
```

**Status**: ⬜ Not Started | ⬜ Complete

---

### Task 2.3: Verify Environment Variables

**Close and reopen PowerShell**, then run:

```powershell
# Check ANDROID_HOME
Write-Host "ANDROID_HOME: $env:ANDROID_HOME"

# Check if adb works
adb --version

# Check if avdmanager works
avdmanager list avd
```

**Expected Results:**
- ANDROID_HOME shows your SDK path
- adb shows version (e.g., "Android Debug Bridge version 1.0.41")
- avdmanager lists available AVDs (might be empty for now)

**Status**: ⬜ Not Started | ⬜ Complete

---

## ☑️ Step 3: Create Android Virtual Device (Emulator)

### Task 3.1: Open Device Manager

1. In Android Studio, go to **Tools** → **Device Manager**
2. Click **"Create Device"** (big + button)

**Status**: ⬜ Not Started | ⬜ Complete

---

### Task 3.2: Select Hardware

1. Select **Phone** category
2. Choose **Pixel 5** (or Pixel 6, Pixel 7)
   - ⚠️ **Make sure it has a Play Store icon** next to it!
3. Click **Next**

**Status**: ⬜ Not Started | ⬜ Complete

---

### Task 3.3: Select System Image

1. Click **Download** next to **Tiramisu (API Level 33)**
   - ⚠️ Choose the one with **Google Play** icon (not just Google APIs)
   - Target: **Android 13.0 (Google Play)**
   - ABI: **x86_64**
2. Wait for download (~1 GB)
3. Click **Next**

**Status**: ⬜ Not Started | ⬜ Complete

---

### Task 3.4: Configure AVD

1. **AVD Name**: `CampusConnect_Emulator`
2. **Startup orientation**: Portrait
3. Click **Show Advanced Settings**
4. Configure:
   - **RAM**: 2048 MB (or 4096 MB if you have 16GB+ RAM)
   - **VM heap**: 256 MB
   - **Internal Storage**: 2048 MB
   - **SD card**: 512 MB
   - **Graphics**: Hardware - GLES 2.0
5. Click **Finish**

**Status**: ⬜ Not Started | ⬜ Complete

---

### Task 3.5: Start Emulator

1. In Device Manager, click **▶ (Play button)** next to your emulator
2. Wait for boot (~2-3 minutes first time)
3. **Verify**:
   - Emulator opens and shows Android home screen
   - You can see **Play Store** app icon
   - Emulator is responsive

**Status**: ⬜ Not Started | ⬜ Complete

---

## ☑️ Step 4: Generate Native Android Project

### Task 4.1: Prebuild Expo Project

**In PowerShell, navigate to frontend directory:**

```powershell
cd "D:\sam\Projects\Event Management\app2\frontend"

# Generate native Android code
npx expo prebuild --platform android --clean
```

**What this does:**
- Creates `android/` folder with native Android project
- Copies `google-services.json` to `android/app/`
- Configures Gradle files
- Sets up notification permissions

**Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete

**Expected Output:**
```
✔ Created native project | gitignore skipped
✔ Updated package.json
✔ Config synced
```

---

### Task 4.2: Verify google-services.json

**Check if file was copied:**

```powershell
# Should show the file
Get-ChildItem "android\app\google-services.json"
```

**If missing, copy manually:**

```powershell
Copy-Item "google-services.json" "android\app\google-services.json"
```

**Status**: ⬜ Not Started | ⬜ Complete

---

## ☑️ Step 5: Open Project in Android Studio

### Task 5.1: Open Android Folder

1. In Android Studio, click **File** → **Open**
2. Navigate to: `D:\sam\Projects\Event Management\app2\frontend\android`
3. Select the **android** folder (not frontend)
4. Click **OK**
5. If asked "Trust Project?", click **Trust Project**

**Status**: ⬜ Not Started | ⬜ Complete

---

### Task 5.2: Wait for Gradle Sync

**Android Studio will automatically:**
1. Detect it's an Android project
2. Start "Gradle sync" (see progress at bottom)
3. Download dependencies (~5-10 minutes first time)

**Watch the bottom status bar:**
- "Gradle sync in progress..."
- Wait until it says "Gradle sync finished"

**If errors appear:**
- Note them down
- We'll troubleshoot together

**Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Complete

---

### Task 5.3: Verify Project Structure

**In Android Studio Project view (left sidebar):**

```
app/
  src/
    main/
      AndroidManifest.xml
      java/
      res/
  google-services.json  ← Should be here!
  build.gradle
```

**Check google-services.json:**
1. Double-click to open
2. Verify package name: `"package_name": "com.campusconnect.app"`

**Status**: ⬜ Not Started | ⬜ Complete

---

## ☑️ Step 6: Run App on Emulator

### Task 6.1: Verify Emulator is Running

```powershell
# Check connected devices
adb devices
```

**Expected output:**
```
List of devices attached
emulator-5554   device
```

**If empty:**
- Start emulator from Device Manager
- Wait 2-3 minutes
- Run `adb devices` again

**Status**: ⬜ Not Started | ⬜ Complete

---

### Task 6.2: Start Metro Bundler

**In a new PowerShell window:**

```powershell
cd "D:\sam\Projects\Event Management\app2\frontend"

# Start Metro bundler
npx expo start --android
```

**Keep this terminal open!**

**Expected output:**
```
Metro waiting on exp://192.168.x.x:8081
› Opening exp://192.168.x.x:8081 on Android...
```

**Status**: ⬜ Not Started | ⬜ In Progress | ⬜ Running

---

### Task 6.3: Install App on Emulator

**Option A: Using Expo CLI (Recommended)**

The Metro bundler should automatically:
1. Build the app
2. Install on emulator
3. Launch the app

**Option B: Using Android Studio**

1. In Android Studio, click **▶ Run** (green play button)
2. Select your emulator from dropdown
3. Wait for build (~5 minutes first time)

**Status**: ⬜ Not Started | ⬜ Building | ⬜ Installed

---

### Task 6.4: Verify App Launches

**In emulator:**
1. App should open automatically
2. See CampusConnect logo/splash screen
3. Land on Login/Register page

**If app crashes:**
- Check Metro bundler terminal for errors
- Check Android Studio Logcat (bottom tab)
- Note error messages

**Status**: ⬜ Not Started | ⬜ Complete

---

## ☑️ Step 7: Test Push Notifications

### Task 7.1: Grant Notification Permissions

**When app launches:**
1. Register/Login to app
2. Permission dialog appears: "Allow CampusConnect to send notifications?"
3. Click **Allow**

**Status**: ⬜ Not Started | ⬜ Complete

---

### Task 7.2: Check Push Token in Logs

**In Android Studio:**
1. Open **Logcat** tab (bottom)
2. Set filter: `expo-notifications`
3. Look for log:
   ```
   Expo push token: ExponentPushToken[xxxxxxxxxxxxxx]
   ```
4. **Copy this token** (we'll need it for testing)

**Token**: `_________________________________`

**Status**: ⬜ Not Started | ⬜ Complete

---

### Task 7.3: Test Notification Flow

**Create Event → Approve → Receive Notification**

1. **In emulator (as Student):**
   - Navigate to Create Event
   - Fill in event details
   - Submit event

2. **On another device/browser (as Admin):**
   - Login to admin account
   - Go to Admin Panel
   - Find pending event
   - Click **Approve**

3. **Back to emulator:**
   - Notification should appear in ~2-5 seconds
   - Swipe down notification drawer
   - Verify notification is there

**Status**: ⬜ Not Started | ⬜ Complete

---

### Task 7.4: Test Notification Tap

**In emulator:**
1. Tap the notification
2. App should open to Event Details screen
3. Verify event info is displayed

**Status**: ⬜ Not Started | ⬜ Complete

---

## ☑️ Step 8: Test with Firebase Console (Optional)

### Task 8.1: Send Test Notification

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select **CampusConnect** project
3. Go to **Engage** → **Messaging**
4. Click **Create your first campaign** or **New campaign**
5. Select **Firebase Notification messages**
6. Fill in:
   - **Title**: Test Notification
   - **Text**: Testing from Firebase Console
7. Click **Next**
8. **Target**: Single device
9. **FCM registration token**: Paste your Expo Push Token from Task 7.2
10. Click **Review** → **Publish**

**In emulator:** Notification should appear!

**Status**: ⬜ Not Started | ⬜ Complete

---

## 🎯 Summary

**Once all tasks are complete:**

✅ Android Studio configured  
✅ Android SDK installed  
✅ Environment variables set  
✅ Emulator created and running  
✅ Native Android project generated  
✅ App running on emulator  
✅ Push notifications working  

**Next Steps:**
- Test all notification scenarios (approval, rejection, reminders)
- Build production APK with `eas build`
- Test on physical device

---

## 📝 Notes & Issues

**Use this space to note any errors or issues:**

```
Issue 1: ___________________________________________

Solution: ___________________________________________


Issue 2: ___________________________________________

Solution: ___________________________________________
```

---

**Ready to start? Begin with Step 1: Configure Android SDK!** 🚀
