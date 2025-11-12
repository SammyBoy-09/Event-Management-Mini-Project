# Physical Phone Testing Guide

**Status**: ✅ App is running on your phone!

**Your Push Token**: `ExponentPushToken[akCQCAMt4E0VKY-q0Q2vPW]`

---

## ✅ What's Already Working

From the logs, I can see:
- ✅ App loaded on your phone
- ✅ Push token registered with backend
- ✅ Backend connected successfully
- ✅ Events loading correctly
- ✅ 5 events visible: Blood Donation, Kannada Rajostava, new events, test 4, Test Event 2

---

## 🧪 Testing Checklist - Follow in Order

### Step 1: Basic App Navigation ✅

**On Your Phone:**
- [ ] You should see the Dashboard with events
- [ ] Scroll through the events list
- [ ] Tap on an event to view details
- [ ] Navigate to Profile screen
- [ ] Navigate to Notifications screen

**Status**: ✅ Already working based on logs

---

### Step 2: Test Push Notifications 🔔 **CRITICAL**

#### **Scenario A: Event Approval Notification**

**Part 1: Create Event (On Phone)**
1. Tap **"Create Event"** button (+ icon)
2. Fill in event details:
   - **Title**: "Push Notification Test"
   - **Description**: "Testing push notifications"
   - **Date**: Tomorrow at 2 PM
   - **Category**: Sports or Cultural
   - **Max Attendees**: 50
3. Tap **"Submit"** button
4. ✅ Should see "Event created successfully"
5. **Keep the app open** or minimize it

**Part 2: Approve Event (On PC Browser)**
1. Open browser on your PC
2. Go to: `https://event-management-mini-project.onrender.com` (or your admin URL)
3. Login as Admin
4. Navigate to **Admin Panel**
5. Find "Push Notification Test" event
6. Click **"Approve"** button

**Part 3: Verify Notification (On Phone)**
- ⏱️ **Within 2-5 seconds**, you should receive a push notification
- 📱 Notification should say:
  - **Title**: "Event Status Updated" or "Event Approved"
  - **Body**: "Push Notification Test has been approved"
- **Test Actions**:
  - [ ] Notification appears in notification drawer ✅
  - [ ] Notification has app icon ✅
  - [ ] Phone vibrates ✅
  - [ ] Notification sound plays ✅
  - [ ] Tap notification → App opens to event details ✅

---

#### **Scenario B: Event Rejection Notification**

**Part 1: Create Another Event (On Phone)**
1. Create new event:
   - **Title**: "Rejection Test Event"
   - **Description**: "Testing rejection notification"
   - Other details...
2. Submit event

**Part 2: Reject Event (On PC Browser)**
1. In Admin Panel, find "Rejection Test Event"
2. Click **"Reject"** button
3. Enter reason: "Testing rejection notifications"
4. Confirm rejection

**Part 3: Verify Notification (On Phone)**
- [ ] Receive push notification within 2-5 seconds
- [ ] Notification body includes rejection reason
- [ ] Tap notification → Opens event details
- [ ] Event status shows "Rejected"

---

### Step 3: In-App Notifications 📬

**On Your Phone:**
1. Look at the **Notifications icon** in navigation bar
2. [ ] Should see a red badge with number (unread notifications count)
3. Tap **Notifications** icon
4. [ ] Should see list of all notifications
5. [ ] Tap a notification → Opens related event
6. [ ] Badge disappears after viewing

---

### Step 4: Event Management

#### **Register for Event**
1. Go back to Dashboard
2. Tap on "Blood Donation" event (or any event)
3. Tap **"Register"** or **"RSVP"** button
4. [ ] Should see success message
5. [ ] Button changes to "Unregister"
6. [ ] Attendee count increases by 1

#### **Unregister from Event**
1. While in same event details
2. Tap **"Unregister"** button
3. [ ] Should see confirmation
4. [ ] Button changes back to "Register"
5. [ ] Attendee count decreases by 1

---

### Step 5: Profile & Settings

**On Your Phone:**
1. Navigate to **Profile** screen
2. [ ] Should see your name and email
3. [ ] View registered events
4. [ ] Check profile information is correct
5. Try **"Edit Profile"** (if available)
6. Test **"Logout"** button
7. [ ] Should redirect to login screen
8. Login again to continue testing

---

### Step 6: Edge Cases

#### **Test Offline Mode**
1. Turn off WiFi/Mobile Data on phone
2. Try to load events
3. [ ] Should see error message
4. [ ] App doesn't crash
5. Turn WiFi back on
6. Pull to refresh
7. [ ] Events load successfully

#### **Test Invalid Data**
1. Go to Create Event
2. Try to submit without filling required fields
3. [ ] Should see validation errors
4. [ ] Fields highlighted in red
5. [ ] User-friendly error messages

#### **Test Multiple Notifications**
1. Create 3 events quickly
2. Have admin approve all 3
3. [ ] All 3 notifications appear
4. [ ] Badge shows "3"
5. [ ] All notifications in notifications list

---

## 🎯 Critical Features to Verify

### Must Work Before Production:

- [ ] **Push Notifications**: Appear within 5 seconds ⭐ **MOST IMPORTANT**
- [ ] **Notification Tap**: Opens correct event
- [ ] **Event Registration**: Count updates correctly
- [ ] **Admin Approval**: Works from browser
- [ ] **Admin Rejection**: Works with reason
- [ ] **Login/Logout**: Session management works
- [ ] **Create Event**: Validation and submission
- [ ] **Network Errors**: Handled gracefully
- [ ] **Badge Count**: Updates correctly
- [ ] **No App Crashes**: App is stable

---

## 📊 Test Results - Fill This Out

### ✅ Working Features:
```
- Backend connection: ✅
- Push token registration: ✅
- Events loading: ✅
- Dashboard: ✅
- 
(Add more as you test)
```

### ❌ Issues Found:
```
Issue 1: [Describe issue]
- Steps to reproduce:
- Expected behavior:
- Actual behavior:

Issue 2: [Describe issue]
- Steps to reproduce:
- Expected behavior:
- Actual behavior:
```

### ⚠️ Minor Issues (Non-Blocking):
```
(List any UI glitches, performance issues, etc.)
```

---

## 🚀 After Testing - Next Steps

### If All Tests Pass ✅

**You're ready to build production APK!**

Run this command:
```powershell
cd "D:\sam\Projects\Event Management\app2\frontend"
eas build --platform android --profile production
```

**Or if you want to test production APK first:**
```powershell
npx expo run:android --variant release
```

### If Tests Fail ❌

1. Document all issues in this file
2. Report issues to me
3. We'll fix them together
4. Re-test after fixes
5. Repeat until all pass

---

## 💡 Pro Tips for Testing

1. **Test with Multiple Users**:
   - Use phone for student
   - Use browser for admin
   - Test concurrent actions

2. **Test Network Conditions**:
   - Good WiFi
   - Slow WiFi
   - Mobile data
   - Offline mode

3. **Test Different Scenarios**:
   - Multiple notifications
   - Rapid actions
   - Background/Foreground app
   - App minimized

4. **Check Logs**:
   - Look at terminal for errors
   - Watch for network failures
   - Monitor backend logs on Render

---

## 🔍 How to Check Backend Logs

1. Go to: https://dashboard.render.com
2. Open your backend service
3. Click **"Logs"** tab
4. Look for:
   ```
   ✅ "Push notification sent: ..."
   ✅ "Push token registered for user: ..."
   ✅ "Event status updated to: approved"
   ```

---

## 📱 Current Status

**Device**: Your Physical Phone
**Connection**: WiFi (192.168.29.217)
**Push Token**: `ExponentPushToken[akCQCAMt4E0VKY-q0Q2vPW]`
**Backend**: Connected ✅
**Status**: Ready for testing! 🎉

---

**Start testing now and report back with results!** 📝

Let me know if you encounter ANY issues during testing!
