# 🧪 Admin Panel Testing Guide

## ✅ Setup Complete!

Your Admin Panel has been successfully integrated! Here's how to test it:

---

## 📱 Testing Steps

### 1. **Login as Admin**

**Admin Credentials:**
- **Email:** `admin@campusconnect.com`
- **Password:** `admin123`

**Steps:**
1. Open your CampusConnect app
2. If already logged in, logout first (Profile → Logout)
3. On login screen, enter admin credentials
4. Login successfully

**Expected Result:**
- ✅ Login successful
- ✅ Dashboard loads
- ✅ Profile shows "ADMIN" role badge

---

### 2. **Access Admin Panel**

**Steps:**
1. Go to Profile screen (bottom navigation)
2. Scroll down to "Actions" section
3. Look for "Admin Panel" button (with shield icon)
4. Tap on "Admin Panel"

**Expected Result:**
- ✅ "Admin Panel" button is visible (shield icon)
- ✅ Admin Panel screen opens
- ✅ Stats cards show "0 Pending Approval" and "ADMIN"
- ✅ Empty state message: "All Caught Up!"

---

### 3. **Create a Test Event (As Regular User)**

**Steps:**
1. Logout from admin account
2. Register a NEW regular user (or login with existing one)
3. Go to Dashboard → "+" button (Create Event)
4. Fill in event details:
   - Title: "Test Event for Admin Approval"
   - Description: "This is a test event"
   - Date: Pick a future date
   - Time: Any time
   - Location: "Test Location"
   - Category: Pick any
   - Max Attendees: 50
5. Tap "Create Event"

**Expected Result:**
- ✅ Success message: "Event created successfully"
- ✅ Event appears in "My Events" with **PENDING** badge
- ✅ Event does NOT appear on main Dashboard (only approved events show)
- ✅ Regular user does NOT see "Admin Panel" button in Profile

---

### 4. **Approve the Event (As Admin)**

**Steps:**
1. Logout from regular user account
2. Login as admin (admin@campusconnect.com / admin123)
3. Go to Profile → Admin Panel
4. You should see the pending event card
5. Tap "Approve" button (green)
6. Confirm the action

**Expected Result:**
- ✅ Pending event appears in Admin Panel list
- ✅ Event card shows all details (title, date, location, category, creator name)
- ✅ "Approve" button works
- ✅ Event disappears from pending list after approval
- ✅ Success message: "Event approved successfully!"
- ✅ Event now appears on Dashboard (visible to all users)

---

### 5. **Test Event Rejection**

**Steps:**
1. Logout, login as regular user again
2. Create another test event: "Event to be Rejected"
3. Logout, login as admin
4. Go to Admin Panel
5. Tap "Reject" button (red)
6. Confirm rejection in dialog

**Expected Result:**
- ✅ Rejection confirmation dialog appears
- ✅ Event disappears from pending list
- ✅ Success message: "Event has been rejected"
- ✅ Event does NOT appear on Dashboard
- ✅ Rejected event removed from creator's "My Events"

---

### 6. **Test Access Control**

**Steps:**
1. Logout from admin account
2. Login as regular user
3. Go to Profile screen
4. Look for "Admin Panel" button

**Expected Result:**
- ✅ "Admin Panel" button is NOT visible for regular users
- ✅ If somehow accessed (via direct navigation), should show "Access Denied" screen
- ✅ "Go Back" button returns to previous screen

---

### 7. **Test Pull-to-Refresh**

**Steps:**
1. Login as admin
2. Go to Admin Panel
3. Pull down on the list to refresh
4. Create a new event from another device/user
5. Refresh the Admin Panel

**Expected Result:**
- ✅ Pull-to-refresh works smoothly
- ✅ Loading indicator shows while refreshing
- ✅ New pending events appear after refresh

---

### 8. **Test View Details**

**Steps:**
1. Login as admin
2. Go to Admin Panel with at least one pending event
3. Tap "View Details" button (outline button)

**Expected Result:**
- ✅ Navigates to EventDetailsScreen
- ✅ Shows full event information
- ✅ Back button returns to Admin Panel

---

## ✅ Complete Testing Checklist

Mark each as you test:

**Admin Account:**
- [ ] Admin login works with admin@campusconnect.com
- [ ] Profile shows "ADMIN" role
- [ ] Admin Panel button visible in Profile

**Event Creation Flow:**
- [ ] Regular user can create events
- [ ] New events have "pending" status
- [ ] Pending events appear in creator's "My Events"
- [ ] Pending events do NOT appear on main Dashboard

**Admin Panel UI:**
- [ ] Admin Panel loads successfully
- [ ] Stats cards show correct counts
- [ ] Empty state shows when no pending events
- [ ] Pending events list displays correctly
- [ ] Event cards show all details (title, date, location, creator)

**Approve Functionality:**
- [ ] Approve button works
- [ ] Confirmation/success message appears
- [ ] Event removed from pending list
- [ ] Approved event appears on Dashboard
- [ ] All users can see approved event

**Reject Functionality:**
- [ ] Reject button shows confirmation dialog
- [ ] Rejection works correctly
- [ ] Event removed from pending list
- [ ] Rejected event does NOT appear on Dashboard

**Access Control:**
- [ ] Regular users don't see Admin Panel button
- [ ] Direct access shows "Access Denied"
- [ ] CRs (if any) can access Admin Panel

**UI/UX:**
- [ ] Pull-to-refresh works
- [ ] Loading states show correctly
- [ ] Buttons are responsive
- [ ] Navigation works smoothly
- [ ] Error handling works (if backend is down)

---

## 🐛 Common Issues & Solutions

### Issue: "Admin Panel button not showing"
**Solution:**
1. Verify you're logged in as admin
2. Check Profile screen - role should show "ADMIN"
3. Logout and login again to refresh token

### Issue: "No pending events showing"
**Solution:**
1. Create a new event as regular user first
2. Pull-to-refresh on Admin Panel
3. Check that event status is 'pending' in MongoDB

### Issue: "Approved event not showing on Dashboard"
**Solution:**
1. Go to Dashboard and pull-to-refresh
2. Check filters (ensure category filter is not excluding it)
3. Verify event status changed to 'approved' in MongoDB

### Issue: "Failed to load pending events"
**Solution:**
1. Check backend is running (`cd backend && npm start`)
2. Verify MongoDB connection is working
3. Check API URL in frontend/api/api.js
4. Check network connectivity

---

## 📊 What Changed?

### Before Admin Panel:
- ✅ Events were auto-approved on creation
- ✅ All events immediately visible on Dashboard
- ❌ No moderation system
- ❌ Spam events could be created

### After Admin Panel:
- ✅ Events start with 'pending' status
- ✅ Admin must approve before visible
- ✅ Spam/inappropriate events can be rejected
- ✅ Better quality control
- ✅ Professional event management

---

## 🎯 Next Steps

After testing is complete:

1. **Change Admin Password:**
   - Login as admin
   - Go to Profile → Change Password
   - Use a strong password

2. **Create More Admin Accounts (if needed):**
   - Run: `node backend/createAdmin.js` again
   - Or manually create in MongoDB Atlas

3. **Test on Physical Device:**
   - Build new APK with admin panel
   - Test full workflow on phone

4. **Production Deployment:**
   - All changes already pushed to GitHub
   - Render should auto-deploy backend changes
   - Build new APK for distribution

5. **Document Admin Credentials:**
   - Store admin credentials securely
   - Never commit to git
   - Share only with trusted moderators

---

## 🎉 Success Criteria

Your Admin Panel is working correctly if:

- ✅ Admin can login and access Admin Panel
- ✅ Regular users cannot access Admin Panel
- ✅ Events are created with 'pending' status
- ✅ Admin can approve events successfully
- ✅ Approved events appear on Dashboard
- ✅ Admin can reject events successfully
- ✅ Rejected events do NOT appear on Dashboard
- ✅ Pull-to-refresh updates pending list
- ✅ UI is smooth and responsive

---

**Testing Status:** ⏳ Ready for Manual Testing  
**Last Updated:** November 2025

Happy Testing! 🚀
