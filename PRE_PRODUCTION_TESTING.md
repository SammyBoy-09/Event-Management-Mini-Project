# Pre-Production Testing Checklist

**Status**: Testing in progress before building production APK

---

## ✅ Current Setup Status

- **Emulator**: Running (`Medium_Phone_API_36.1`)
- **Expo Dev Server**: Running on `exp://192.168.29.217:8081`
- **Backend**: Connected to `https://event-management-mini-project.onrender.com/api`
- **Google Play Services**: ⚠️ **NOT AVAILABLE** (emulator doesn't have Play Store)

---

## 🔴 **CRITICAL: Push Notifications Won't Work on Current Emulator**

**Why?**
- Current emulator: `Medium_Phone_API_36.1` (Google APIs only)
- Needs: System image with **Google Play Store** for push notifications
- Error seen: `SERVICE_NOT_AVAILABLE`

**Solution Options:**

### Option A: Create New Emulator with Google Play (Recommended)
1. Open Android Studio → Tools → Device Manager
2. Click "Create Device"
3. Select: Pixel 5 or Pixel 6
4. Download system image: **Android 13 (API 33) with Google Play** ⭐
5. Name it: `Pixel_5_API_33_PlayStore`
6. Start new emulator
7. Run `npx expo start` and press `a`

### Option B: Test on Physical Android Phone ⭐ **FASTEST**
1. Install **Expo Go** from Play Store
2. Connect phone to same WiFi as PC
3. Scan QR code from terminal
4. Test all features including push notifications ✅

---

## 📋 Testing Checklist

### Phase 1: Basic Functionality (Current Emulator - OK)

#### Authentication
- [ ] **Student Registration**
  - Create new student account
  - Verify email validation
  - Check password requirements
  - Confirm success message

- [ ] **Student Login**
  - Login with valid credentials
  - Check "Remember me" functionality
  - Verify navigation to Dashboard

- [ ] **Admin Login**
  - Login as admin
  - Verify admin panel access
  - Check admin-specific features

#### Student Features
- [ ] **Dashboard**
  - View upcoming events
  - View registered events
  - Check event categories
  - Verify search functionality

- [ ] **Event Creation**
  - Create new event
  - Fill all required fields
  - Upload event image (if applicable)
  - Submit for approval
  - Verify "Pending" status

- [ ] **Event Details**
  - View event details
  - Register for event
  - Unregister from event
  - Check attendee count

- [ ] **Profile Screen**
  - View profile information
  - Update profile details
  - Change password
  - Logout functionality

#### Admin Features
- [ ] **Admin Panel Access**
  - Navigate to Admin Panel
  - View pending events list
  - View all events statistics

- [ ] **Event Approval**
  - Select pending event
  - Click "Approve" button
  - Verify event status changes to "Approved"
  - Check if event appears in student's feed

- [ ] **Event Rejection**
  - Select pending event
  - Enter rejection reason
  - Click "Reject" button
  - Verify event status changes to "Rejected"

- [ ] **Event Management**
  - Edit event details
  - Delete event
  - View event statistics

---

### Phase 2: Push Notifications (Requires Google Play Services)

⚠️ **CANNOT TEST ON CURRENT EMULATOR** - Needs Google Play

When testing with Google Play emulator or physical device:

#### Notification Scenarios

- [ ] **Event Approval Notification**
  1. Student creates event (Device A/Browser)
  2. Admin approves event (Device B/Browser)
  3. **Verify**: Student receives push notification on Device A
  4. **Check**: Notification title: "Event Approved"
  5. **Check**: Notification body includes event name
  6. **Action**: Tap notification → should open Event Details

- [ ] **Event Rejection Notification**
  1. Student creates event (Device A/Browser)
  2. Admin rejects event with reason (Device B/Browser)
  3. **Verify**: Student receives push notification on Device A
  4. **Check**: Notification title: "Event Rejected"
  5. **Check**: Notification body includes rejection reason
  6. **Action**: Tap notification → should open Event Details

- [ ] **Event Reminder - 24 Hours Before**
  1. Create event scheduled for tomorrow same time
  2. Wait for automated reminder (or manually trigger from backend)
  3. **Verify**: Notification received
  4. **Check**: Notification body: "Your event starts in 24 hours"

- [ ] **Event Reminder - 1 Hour Before**
  1. Create event scheduled for 1 hour later
  2. Wait for automated reminder
  3. **Verify**: Notification received
  4. **Check**: Notification body: "Your event starts in 1 hour"

- [ ] **Notification Permissions**
  - On first launch, check permission dialog appears
  - Grant notification permissions
  - Verify "Allow" is selected

- [ ] **Notification Icon & Color**
  - Check notification uses app icon
  - Check notification accent color matches theme (#6C63FF)

- [ ] **Notification Sound & Vibration**
  - Verify notification sound plays
  - Verify device vibrates

- [ ] **Notification Tap Behavior**
  - Tap notification → App opens
  - App navigates to correct event
  - Event details displayed correctly

---

### Phase 3: In-App Notifications (Works on Current Emulator)

- [ ] **Notifications Screen**
  - Navigate to Notifications screen
  - View list of all notifications
  - Check unread notification count (badge)
  - Mark notification as read
  - Delete notification

- [ ] **Notification Badge**
  - Create event and get it approved
  - Check red badge appears on Notifications icon
  - Open Notifications screen
  - Verify badge disappears after viewing

---

### Phase 4: Edge Cases & Error Handling

- [ ] **Network Errors**
  - Disable internet on device
  - Try to create event
  - Verify error message displayed
  - Re-enable internet
  - Retry operation

- [ ] **Invalid Data**
  - Try to create event with missing fields
  - Check validation messages
  - Try invalid date (past date)

- [ ] **Session Expiry**
  - Wait for token to expire (or manually expire)
  - Try to perform action
  - Verify redirects to login

- [ ] **Concurrent Actions**
  - Multiple users register for same event
  - Check attendee count updates correctly
  - No duplicate registrations

---

## 🔍 Backend Verification

Before building APK, verify backend:

### Check Backend Logs (Render Dashboard)

- [ ] **Push Token Registration**
  - Look for log: `"Push token registered for user: <userId>"`
  - Verify Expo push token format: `ExponentPushToken[xxxxx]`

- [ ] **Notification Sending**
  - Look for log: `"Push notification sent: ..."`
  - Check for errors in sending

- [ ] **Event Status Updates**
  - Look for log: `"Event status updated to: approved/rejected"`
  - Verify notification creation in database

### Check MongoDB Database

- [ ] **Notifications Collection**
  - Check notifications are being created
  - Verify `recipient` field is correct
  - Check `type` field values
  - Verify `relatedEvent` references exist

- [ ] **Students Collection**
  - Check `expoPushToken` field is populated
  - Verify token format is correct

---

## 🎯 Manual Backend Testing (Optional)

Test push notification manually using backend test script:

```javascript
// backend/testNotification.js
const { sendPushNotification } = require('./services/pushNotificationService');

const testToken = 'ExponentPushToken[YOUR_TOKEN_FROM_LOGS]';

async function testPush() {
  try {
    const result = await sendPushNotification(
      testToken,
      'Test Notification',
      'If you see this, push notifications work!',
      { test: true }
    );
    console.log('✅ Notification sent:', result);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testPush();
```

Run:
```powershell
cd backend
node testNotification.js
```

---

## 📱 Testing on Physical Device

### Setup Steps:

1. **Install Expo Go**
   - Open Play Store on phone
   - Search "Expo Go"
   - Install app

2. **Connect to Same WiFi**
   - Ensure phone and PC on same network
   - WiFi must allow device communication

3. **Scan QR Code**
   - Open Expo Go app
   - Tap "Scan QR Code"
   - Scan QR from terminal
   - App will load automatically

4. **Grant Permissions**
   - Allow notifications when prompted
   - Grant any other required permissions

5. **Test All Features**
   - Follow testing checklist above
   - Pay special attention to push notifications

---

## 🚨 Known Issues to Fix Before Production

- [ ] **Notification Sound File Missing**
  - Current: Removed from app.json (was causing build error)
  - Fix: Add notification.wav to assets/ or keep default sound

- [ ] **Push Notifications on Emulator**
  - Issue: SERVICE_NOT_AVAILABLE on current emulator
  - Fix: Use emulator with Google Play or test on physical device

- [ ] **Java 22 Build Issues**
  - Issue: Gradle incompatibility with Java 22
  - Fix: Install Java 17 or use EAS Build (cloud)

---

## ✅ Final Checks Before Building APK

- [ ] All critical features working
- [ ] Push notifications tested and working
- [ ] No console errors in app
- [ ] Backend is stable (no crashes)
- [ ] MongoDB data is correct
- [ ] Admin features tested
- [ ] Student features tested
- [ ] Edge cases handled
- [ ] Error messages are user-friendly
- [ ] UI looks good on different screen sizes

---

## 🎯 Next Steps After Testing

### If All Tests Pass:

**Option 1: EAS Build (Recommended - Avoids Java issues)**
```powershell
cd frontend
eas build --platform android --profile production
```
- Builds in cloud (no Java version issues)
- Downloads APK when ready (10-30 minutes)
- Automatically includes google-services.json

**Option 2: Local Build (Requires Java 17)**
```powershell
# After installing Java 17
cd frontend
npx expo run:android --variant release
```

### If Tests Fail:
1. Document failures in this file
2. Fix issues in code
3. Test again
4. Repeat until all pass

---

## 📊 Test Results Log

### Test Session 1: [Date/Time]

**Environment:**
- Device: `Medium_Phone_API_36.1` emulator
- Expo Version: 54.0.23
- React Native Version: 0.72+

**Results:**
- ✅ App launches successfully
- ✅ Backend connected
- ✅ Login/Registration works
- ❌ Push notifications fail (no Google Play Services)

**Action Needed:**
- Test on device with Google Play Services OR
- Test on physical device

---

### Test Session 2: [Date/Time] - TO BE COMPLETED

**Environment:**
- Device: [Physical device or Google Play emulator]

**Results:**
- [ ] To be filled after testing

---

## 🔧 Quick Commands Reference

```powershell
# Start dev server
cd frontend
npx expo start

# Check connected devices
adb devices

# View app logs
adb logcat | Select-String -Pattern "expo"

# Install on device
npx expo run:android

# Build production APK (EAS)
eas build --platform android --profile production

# Build production APK (local - needs Java 17)
npx expo run:android --variant release
```

---

**Current Status**: ⏳ Awaiting testing with Google Play Services enabled device

**Blocker**: Push notifications cannot be tested on current emulator (no Google Play)

**Recommendation**: Test on physical Android device for complete validation ✅
