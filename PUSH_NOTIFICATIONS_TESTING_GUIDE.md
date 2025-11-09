# 🧪 Push Notifications Testing Guide

## 📱 Prerequisites

### Required Hardware
- **Physical Android or iOS device** (Push notifications DO NOT work on emulators/simulators)
- USB cable for device connection
- Computer with the project running

### Required Software
- Expo Go app installed on your phone (Download from Play Store/App Store)
- OR Build a development build with `eas build --profile development`

### Backend Status
✅ Backend server running on: `http://192.168.29.217:5000`
✅ Cron jobs active for automated reminders

## 🚀 Step-by-Step Testing Instructions

### Step 1: Connect Your Device

#### Option A: Using Expo Go (Easiest)
1. Install **Expo Go** from Play Store (Android) or App Store (iOS)
2. Open terminal in frontend directory
3. Run: `npm start`
4. Scan the QR code with:
   - **Android**: Expo Go app
   - **iOS**: Camera app (opens in Expo Go)

#### Option B: Using Development Build
1. Build: `eas build --profile development --platform android`
2. Install the APK on your device
3. Run: `npx expo start --dev-client`

### Step 2: Enable Network Access

Make sure your phone and computer are on the **same WiFi network**:
- Computer network: Connected to WiFi
- Phone: Connect to the same WiFi
- Backend URL: `http://192.168.29.217:5000`

**Check if accessible:**
- Open browser on phone
- Navigate to: `http://192.168.29.217:5000`
- Should see: "🎓 CampusConnect Event Management API"

### Step 3: Grant Notification Permissions

1. **Launch the app** on your device
2. You should see a **permission popup**:
   - **iOS**: "Allow CampusConnect to send you notifications?"
   - **Android**: Usually auto-granted, but may ask
3. **Tap "Allow"** or "OK"

**If you missed the popup:**
- iOS: Settings → Notifications → CampusConnect → Enable
- Android: Settings → Apps → CampusConnect → Notifications → Enable

### Step 4: Login/Register

1. Open the app
2. **Create a new account** or login with existing credentials
3. After successful login, check the console logs:
   ```
   Expo Push Token: ExponentPushToken[xxxxxxxxxxxxx]
   Push token registered successfully
   ```

**Troubleshooting:**
- If you don't see the token, check that you're on a physical device
- Check that permissions were granted
- Restart the app and try again

### Step 5: Test Notification Scenarios

#### Test 1: RSVP Confirmation (Attendee) ✅

**Steps:**
1. Navigate to Dashboard
2. Find an **approved event**
3. Tap on the event
4. Tap **"RSVP Now"** button
5. **Expected Result:**
   - You should receive a push notification immediately
   - Title: "RSVP Confirmed"
   - Body: "You have successfully RSVP'd to [Event Name]"
   - Image: Event poster (if available)
   - **Tap the notification** → Should navigate to event details

**Check:**
- [ ] Notification received
- [ ] Sound played
- [ ] Image displayed
- [ ] Tapping opens event details

#### Test 2: New RSVP Alert (Event Creator) 👥

**Steps:**
1. Create a new event (use your account)
2. Wait for admin approval
3. Login with a **different account** (or ask someone else)
4. Have the other account RSVP to your event
5. **Expected Result:**
   - You (creator) receive a push notification
   - Title: "👥 New RSVP"
   - Body: "[Student Name] has RSVP'd to your event. X/Y attendees"
   - Image: Event poster

**Check:**
- [ ] Creator receives notification when someone RSVPs
- [ ] Attendee count shown correctly
- [ ] Image displayed

#### Test 3: Event Approval (Admin Action) 🎉

**Steps:**
1. Create a new event (status: pending)
2. Login as **admin** (or have admin approve it)
3. Admin approves your event
4. **Expected Result:**
   - You (creator) receive push notification
   - Title: "🎉 Event Approved"
   - Body: "Your event [Event Name] has been approved and is now live!"
   - Image: Event poster

**Check:**
- [ ] Notification received upon approval
- [ ] Image displayed
- [ ] Can tap to view event

#### Test 4: Event Rejection (Admin Action) ❌

**Steps:**
1. Create a new event
2. Admin rejects it with a reason
3. **Expected Result:**
   - You receive push notification
   - Title: "❌ Event Rejected"
   - Body: "Your event [Event Name] has been rejected. [Reason]"
   - Image: Event poster

**Check:**
- [ ] Notification received
- [ ] Rejection reason displayed

#### Test 5: Event Update (All Attendees) 📢

**Steps:**
1. RSVP to an event
2. Event creator updates event details (title, time, location, etc.)
3. **Expected Result:**
   - All attendees receive notification
   - Title: "📢 Event Updated"
   - Body: "The event [Event Name] has been updated. Please check the new details."

**Check:**
- [ ] Notification received by all attendees
- [ ] Can navigate to updated event

#### Test 6: Event Cancellation (All Attendees) ❌

**Steps:**
1. RSVP to an event
2. Event creator deletes the event
3. **Expected Result:**
   - All attendees receive notification
   - Title: "❌ Event Cancelled"
   - Body: "The event [Event Name] has been cancelled."

**Check:**
- [ ] Notification received
- [ ] Event removed from registered events

#### Test 7: 24-Hour Reminder (Automated) ⏰

**Steps:**
1. Create an event with date/time **exactly 24 hours from now**
2. RSVP to the event
3. Wait for the next hour (cron runs every hour at minute 0)
4. **Expected Result:**
   - Within the next hour, you receive notification
   - Title: "📅 Event Tomorrow"
   - Body: "[Event Name] is happening tomorrow at [Time]. Don't forget!"

**Check:**
- [ ] Notification received within 1 hour
- [ ] Correct event details

**Shortcut for testing:**
- Temporarily modify `reminderService.js` to run every minute:
  ```javascript
  // Change from: '0 * * * *'
  // To: '* * * * *'
  ```
- Create event 24 hours ahead
- Wait 1 minute for notification
- **Remember to change it back!**

#### Test 8: 1-Hour Reminder (Automated) ⏰

**Steps:**
1. Create an event with date/time **exactly 1 hour from now**
2. RSVP to the event
3. Wait for 10 minutes (cron runs every 10 minutes)
4. **Expected Result:**
   - Within 10 minutes, you receive notification
   - Title: "⏰ Event Starting Soon!"
   - Body: "[Event Name] is starting in 1 hour at [Time]. Get ready!"

**Check:**
- [ ] Notification received within 10 minutes
- [ ] Correct event details

### Step 6: Test Notification Tap Handling

**Test all notification states:**

#### Foreground (App Open)
1. Keep app open on Dashboard
2. Trigger a notification (RSVP to event)
3. **Expected:** Notification banner appears at top
4. **Tap it** → Should navigate to event details
5. **Check:** ✅ Navigation works

#### Background (App Minimized)
1. Minimize the app (home button)
2. Trigger a notification
3. **Expected:** Notification in notification center
4. **Tap it** → App opens and navigates to event
5. **Check:** ✅ Deep linking works

#### Killed (App Closed)
1. Force close the app (swipe away from recent apps)
2. Trigger a notification
3. **Expected:** Notification in notification center
4. **Tap it** → App launches and navigates to event
5. **Check:** ✅ Cold start navigation works

### Step 7: Test Rich Notifications

**Events with images:**
1. Create event with a poster/image
2. Trigger notification (RSVP, approval, etc.)
3. **Expected:**
   - **Android:** Large image preview in expanded notification
   - **iOS:** Image attachment visible
4. **Check:**
   - [ ] Image loads correctly
   - [ ] Image quality is good
   - [ ] Notification looks professional

## 🐛 Troubleshooting

### Issue: "Push notifications only work on physical devices"

**Solution:**
- You're running on emulator/simulator
- Install on a real phone

### Issue: No push token generated

**Solution:**
1. Check you granted permissions
2. Restart the app
3. Check console for errors
4. Ensure you're on physical device
5. Check `app.json` has correct Expo project ID

### Issue: Permission popup doesn't appear

**Solution:**
- iOS: Check Settings → Notifications → CampusConnect
- Android: Usually auto-granted
- Uninstall and reinstall app to reset permissions

### Issue: Token registered but no notifications received

**Check:**
1. **Backend logs:** Look for "Push notification sent" messages
2. **Token format:** Should start with `ExponentPushToken[`
3. **Network:** Phone and backend on same network
4. **Backend URL:** Accessible from phone browser

**Backend Logs to Monitor:**
```bash
cd backend
node server.js

# Look for:
# ✅ "Push notification sent: {...}"
# ✅ "Sent X push notifications"
# ❌ "Error sending push notification"
```

### Issue: Notifications work but tap doesn't navigate

**Solution:**
1. Check `App.js` has `navigationRef` properly set
2. Verify `eventId` is in notification data
3. Check console for navigation errors
4. Ensure `EventDetailsScreen` is registered in navigation

### Issue: Cron jobs not running

**Solution:**
1. Check backend console for:
   ```
   Starting reminder cron jobs...
   Reminder cron jobs started successfully
   ```
2. Check server time is correct
3. Look for "Running 24-hour reminder check..." logs
4. Verify events exist in database with correct dates

### Issue: Reminder notifications not received

**Check:**
1. Event date/time is exactly 24 hours or 1 hour ahead
2. Event status is "approved"
3. You have RSVP'd to the event
4. Cron job has run (check backend logs)
5. Your push token is valid

## 📊 Testing Checklist

### Basic Functionality
- [ ] App requests notification permissions
- [ ] Permission granted successfully
- [ ] Push token generated and logged
- [ ] Token sent to backend successfully
- [ ] User can login after granting permissions

### Notification Reception
- [ ] Foreground notifications display
- [ ] Background notifications appear in center
- [ ] Killed app notifications work
- [ ] Sound plays for notifications
- [ ] Vibration works (if enabled)

### Notification Types
- [ ] RSVP confirmation (attendee)
- [ ] New RSVP alert (creator)
- [ ] Event approval (creator)
- [ ] Event rejection (creator)
- [ ] Event updates (all attendees)
- [ ] Event cancellation (all attendees)
- [ ] 24-hour reminders (attendees)
- [ ] 1-hour reminders (attendees)

### Rich Notifications
- [ ] Event images display correctly
- [ ] Images load on Android
- [ ] Images load on iOS
- [ ] Notification layout looks good

### Navigation
- [ ] Tap notification from foreground
- [ ] Tap notification from background
- [ ] Tap notification from killed state
- [ ] Navigate to correct event details
- [ ] eventId passed correctly

### Edge Cases
- [ ] Multiple notifications stack properly
- [ ] Notifications for deleted events
- [ ] Notifications when no image
- [ ] Notifications with long text
- [ ] Multiple devices receive correctly

## 📱 Expected Console Output

### On App Launch:
```
Expo Push Token: ExponentPushToken[xxxxxxxxxxxxxx]
Push token registered successfully
```

### On Notification Received (Foreground):
```
Notification received: {
  request: {
    content: {
      title: 'RSVP Confirmed',
      body: 'You have successfully RSVP'd to...',
      data: { eventId: '...', type: 'rsvp_confirmation' }
    }
  }
}
```

### On Notification Tapped:
```
Notification tapped: {
  eventId: '66f1234567890abcdef',
  type: 'rsvp_confirmation'
}
```

## 🎯 Success Criteria

Your push notification system is working correctly if:

✅ All 8 notification scenarios work
✅ Notifications received in all app states (foreground/background/killed)
✅ Tap navigation works correctly
✅ Rich notifications display images
✅ Sound and vibration work
✅ Automated reminders trigger on schedule
✅ Multiple devices receive notifications
✅ No errors in backend or frontend logs

## 🔧 Quick Test Script

Want to test quickly? Run this sequence:

1. **Setup** (2 minutes):
   - Install app on phone
   - Grant permissions
   - Login with test account

2. **RSVP Test** (30 seconds):
   - RSVP to event
   - Check notification received
   - Tap notification

3. **Creator Test** (1 minute):
   - Create event on phone 1
   - RSVP from phone 2
   - Check phone 1 receives notification

4. **Reminder Test** (5 minutes):
   - Create event 24 hours ahead
   - RSVP to it
   - Wait for next hour mark
   - Check notification

Total time: **~10 minutes for basic testing**

## 📞 Need Help?

**Common Issues:**
1. No token? → Check permissions and restart app
2. No notifications? → Check network and backend logs
3. Tap doesn't work? → Check eventId in notification data
4. Reminders don't work? → Check event date/time and cron logs

**Debug Mode:**
- Check `npx expo start` terminal for frontend errors
- Check backend terminal for push sending logs
- Use `console.log` in notification listeners
- Check phone's notification settings

---

## 🎉 Ready to Test!

1. Make sure backend is running: `cd backend && node server.js`
2. Start frontend: `cd frontend && npm start`
3. Scan QR code on your phone
4. Follow the testing steps above
5. Report any issues you find!

**Good luck with testing! 🚀**
