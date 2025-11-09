# 🚀 Quick Start: Testing Push Notifications

## ⚡ Fast Track (5 Minutes)

### Step 1: Start the Backend (Terminal 1)
```bash
cd backend
node server.js
```

**Expected output:**
```
✅ MongoDB Connected
🚀 Server started on port 5000
🚀 Network URL: http://192.168.29.217:5000
Starting reminder cron jobs...
Reminder cron jobs started successfully
```

### Step 2: Start the Frontend (Terminal 2)
```bash
cd frontend
npm start
```

**You'll see a QR code** - keep this terminal open!

### Step 3: Install Expo Go on Your Phone
- **Android**: Google Play Store → Search "Expo Go" → Install
- **iOS**: App Store → Search "Expo Go" → Install

### Step 4: Connect Your Phone
1. **Make sure your phone and computer are on the SAME WiFi network**
2. Open **Expo Go** app on your phone
3. **Scan the QR code** from Terminal 2:
   - **Android**: Use Expo Go app's "Scan QR Code" button
   - **iOS**: Use Camera app (it will open in Expo Go automatically)

### Step 5: Grant Permissions
When the app loads, you'll see a popup:
- **Tap "Allow"** to enable notifications
- The console should show: `Expo Push Token: ExponentPushToken[xxxxx]`

### Step 6: Test Your First Notification

#### Option A: Quick Test with Script
```bash
# In Terminal 3 (in backend folder):
cd backend

# Copy your token from the app console, then run:
node testPushNotification.js ExponentPushToken[YOUR_TOKEN_HERE]
```

You should receive a test notification on your phone! 🎉

#### Option B: Test with Real App Flow
1. **Login** or **Register** a new account
2. Go to **Dashboard**
3. Find an **approved event**
4. Tap **"RSVP Now"**
5. **You should get a notification immediately!** ✅

### Step 7: Test Notification Tap
1. **Tap the notification** you just received
2. App should **navigate to the event details** automatically
3. ✅ Success!

---

## 🎯 What Just Happened?

1. ✅ Backend server started with push notification support
2. ✅ Cron jobs started for automated reminders
3. ✅ Frontend connected to backend over local network
4. ✅ Your phone registered for push notifications
5. ✅ Push token sent to backend and stored
6. ✅ You received your first push notification!

---

## 📱 Full Testing Scenarios

Now that basic setup works, test these scenarios:

### 1. RSVP Confirmation ✅ (Already tested!)
- You did this in Step 6B
- **What happens**: Immediate notification when you RSVP

### 2. New RSVP Alert (Need 2 devices/accounts)
**Setup:**
- Phone 1: Create an event, wait for admin approval
- Phone 2: RSVP to that event
- **Result**: Phone 1 gets notification "John has RSVP'd..."

### 3. Event Approval (Need admin account)
**Setup:**
- Create event (pending status)
- Login as admin, approve it
- **Result**: Creator gets "Event Approved" notification

### 4. Event Updates
**Setup:**
- RSVP to an event
- Creator edits event details
- **Result**: All attendees get "Event Updated" notification

### 5. 24-Hour Reminder (Need to wait)
**Setup:**
- Create event exactly 24 hours from now
- RSVP to it
- Wait for next hour mark (cron runs hourly)
- **Result**: Get "Event Tomorrow" reminder

**⚡ Quick test** (don't wait 1 hour):
```javascript
// Temporarily edit backend/services/reminderService.js
// Line 11: Change '0 * * * *' to '* * * * *'
// This makes it run every minute instead of hourly
// Create event 24 hours ahead → Wait 1 minute → Get notification
// REMEMBER TO CHANGE IT BACK!
```

### 6. 1-Hour Reminder
**Setup:**
- Create event exactly 1 hour from now
- RSVP to it
- Wait 10 minutes (cron runs every 10 min)
- **Result**: Get "Event Starting Soon" reminder

---

## 🐛 Quick Troubleshooting

### ❌ "Push notifications only work on physical devices"
- You're on simulator/emulator
- **Fix**: Use a real phone

### ❌ No push token in console
- Permissions not granted
- **Fix**: Check Settings → Notifications → Enable for CampusConnect

### ❌ Token registered but no notifications
- Phone and computer on different networks
- **Fix**: Connect to same WiFi
- Check: Can you access `http://192.168.29.217:5000` in phone's browser?

### ❌ Notification received but tap doesn't work
- Navigation issue
- **Check**: Console logs when you tap notification
- **Look for**: "Notification tapped: {eventId: '...'}"

### ❌ Backend errors
- Missing dependencies
- **Fix**: 
```bash
cd backend
npm install expo-server-sdk node-cron
```

---

## 📊 What to Check

### Console Logs (App)
Look for these messages:
```
✅ "Expo Push Token: ExponentPushToken[xxx]"
✅ "Push token registered successfully"
✅ "Notification received: {...}"
✅ "Notification tapped: {...}"
```

### Backend Logs (Terminal)
Look for these messages:
```
✅ "Starting reminder cron jobs..."
✅ "Reminder cron jobs started successfully"
✅ "Push notification sent: {...}"
✅ "Running 24-hour reminder check..."
✅ "Sent X push notifications"
```

---

## 🎉 Success Checklist

- [ ] Backend running with cron jobs
- [ ] Frontend running and showing QR code
- [ ] Phone connected via Expo Go
- [ ] Permissions granted
- [ ] Push token registered (check console)
- [ ] RSVP notification received
- [ ] Tapping notification navigates to event
- [ ] Test script works (optional)

**All checked?** 🎉 **Your push notifications are working perfectly!**

---

## 📚 Need More Details?

📖 **Full Testing Guide**: See `PUSH_NOTIFICATIONS_TESTING_GUIDE.md`
- All 8 test scenarios
- Detailed step-by-step instructions
- Troubleshooting for every issue
- Testing checklist

📖 **Implementation Summary**: See `PUSH_NOTIFICATIONS_SUMMARY.md`
- What was implemented
- How it works
- Architecture details
- Configuration

---

## 🔧 Useful Commands

### Test Single Notification
```bash
cd backend
node testPushNotification.js YOUR_TOKEN
```

### Test Specific Scenario
```bash
node testPushNotification.js YOUR_TOKEN 2  # 24-hour reminder
node testPushNotification.js YOUR_TOKEN 3  # 1-hour reminder
node testPushNotification.js YOUR_TOKEN 4  # Event approval
node testPushNotification.js YOUR_TOKEN 5  # New RSVP
```

### Check Backend Logs
```bash
cd backend
node server.js
# Watch for push notification logs
```

### Restart Frontend
```bash
# If something goes wrong:
cd frontend
npm start -- --clear  # Clear cache and restart
```

---

## 💡 Pro Tips

1. **Network Issues?**
   - Make sure firewall isn't blocking port 5000
   - Try `ipconfig` (Windows) or `ifconfig` (Mac/Linux) to verify IP

2. **Testing Faster?**
   - Use the test script instead of waiting for cron jobs
   - Create multiple test accounts for different scenarios

3. **Multiple Devices?**
   - Test on both Android and iOS if possible
   - Rich notifications look different on each platform

4. **Debugging?**
   - Keep all 3 terminals visible (backend, frontend, phone logs)
   - Check console logs in all three places

---

## 🎯 Ready?

1. ✅ Backend running? → `cd backend && node server.js`
2. ✅ Frontend running? → `cd frontend && npm start`
3. ✅ Phone connected? → Scan QR with Expo Go
4. ✅ Permissions granted? → Tap "Allow"
5. ✅ Test notification? → RSVP to an event

**You're all set! Start testing! 🚀**

**Questions?** Check the full testing guide or the troubleshooting section above.
