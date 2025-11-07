# Admin Panel Troubleshooting Guide

## Issue: "Access Denied" when trying to access Admin Panel

### Quick Fix Steps

1. **Force Logout and Login Again**
   - Go to Profile screen
   - Tap "Logout"
   - Login again with admin credentials:
     - Email: `admin@campusconnect.com`
     - Password: `admin123`

2. **Why This Works**
   The issue occurs because the user role might not be properly stored in AsyncStorage during initial login. Logging out and back in refreshes the stored user data with the correct role.

3. **Check Your Role**
   - After logging in, go to Profile screen
   - Look at your role badge under your name
   - It should show "ADMIN" or "CR"
   - Open browser console (F12) and check for logs like:
     ```
     Profile loaded - Role: admin
     ```

## New Admin Panel Button Location

The Admin Panel button has been **moved to a better location**:

### Old Location ❌
- Was in "Actions" section at the bottom of Profile screen
- Easy to miss

### New Location ✅
- **Prominently displayed under your profile header**
- Shows as a blue button with shield icon
- Only visible to admin and CR users
- Located right below your department/year badges

## Testing the Admin Panel

### Step 1: Login as Admin
```
Email: admin@campusconnect.com
Password: admin123
```

### Step 2: Navigate to Profile
- Tap on "Profile" tab in bottom navigation

### Step 3: Look for Admin Panel Button
- Should see a **blue button** with shield icon
- Located under your name and role badge
- Button text: "Admin Panel"

### Step 4: Access Admin Panel
- Tap the Admin Panel button
- You should see:
  - Stats showing pending events count
  - Your role badge
  - List of pending events (if any)
  - Approve/Reject buttons for each event

## Creating Test Events

To test the admin approval workflow:

1. **Logout from admin account**
2. **Login as a regular student**
3. **Create a new event** (will be pending)
4. **Logout and login as admin**
5. **Go to Admin Panel**
6. **Approve or reject the event**

## Console Logs for Debugging

When accessing the Admin Panel, check console for these logs:

```javascript
// When navigating from Profile
Navigating to Admin Panel, role: admin

// When Admin Panel loads
Admin Panel - User Data: {email: "admin@campusconnect.com", role: "admin", ...}
Admin Panel - User Role: admin
Admin Panel - Access Granted
```

If you see:
```javascript
Admin Panel - Access Denied, Role: undefined
// or
Admin Panel - Access Denied, Role: student
```

Then your user data is not properly stored. **Solution: Logout and login again.**

## Backend Status Check

If Admin Panel loads but shows no events, check backend:

1. Open browser and go to: `https://event-management-mini-project.onrender.com`
2. If you see "502 Bad Gateway", backend is down
3. Wait a few minutes for Render to wake up the service
4. Pull to refresh in Admin Panel

## Admin Panel Features

### Stats Header
- **Pending Approval**: Count of events awaiting approval
- **Your Role**: Shows ADMIN or CR badge

### Event Cards
Each pending event shows:
- Event title and description
- Date, time, and location
- Category
- Creator name
- Three action buttons:
  - **View Details**: See full event info
  - **Approve**: Approve the event (turns green)
  - **Reject**: Reject the event (turns red)

### Pull to Refresh
- Swipe down to refresh the event list
- Or tap the refresh icon in header

## Common Issues

### Issue 1: Button Not Showing
**Symptom**: Admin Panel button not visible in Profile
**Cause**: Role not properly set
**Fix**: 
1. Check console logs
2. Pull down to refresh Profile screen
3. If still not showing, logout and login again

### Issue 2: Access Denied Screen
**Symptom**: See "Access Denied" message
**Cause**: User role is not 'admin' or 'cr'
**Fix**:
1. Logout
2. Login with correct admin credentials
3. If using custom admin, verify role in MongoDB

### Issue 3: No Events Showing
**Symptom**: Admin Panel loads but shows empty list
**Cause**: No pending events in system
**Fix**: Create a test event as regular user first

### Issue 4: Backend Down
**Symptom**: 502 Bad Gateway error
**Cause**: Render free tier goes to sleep
**Fix**: Wait 30-60 seconds for backend to wake up

## Next Steps After Admin Panel Works

1. ✅ Admin Panel access working
2. ⏭️ Test event approval workflow
3. ⏭️ Build new APK with admin features
4. ⏭️ Implement remaining features from audit report:
   - QR Code Tickets
   - Event Images
   - Push Notifications
   - Security improvements

## Need More Help?

Check these files:
- `ADMIN_PANEL_SETUP.md` - Complete setup guide
- `ADMIN_TESTING_GUIDE.md` - Detailed testing steps
- `FEATURE_AUDIT_REPORT.md` - Full feature analysis

## Technical Details

### Access Control Logic
```javascript
// AdminPanelScreen.js
if (userData?.role === 'admin' || userData?.role === 'cr') {
  // Grant access
} else {
  // Show access denied
}
```

### User Data Storage
```javascript
// Stored in AsyncStorage
{
  "email": "admin@campusconnect.com",
  "role": "admin",
  "name": "Admin User",
  // ... other fields
}
```

### Profile Screen Updates
- Now updates AsyncStorage when profile loads
- Ensures role is always fresh from backend
- Added console logging for debugging
