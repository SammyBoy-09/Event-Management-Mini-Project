# 🛡️ Admin Panel Setup Guide

## Overview
The Admin Panel allows administrators and CRs (Class Representatives) to:
- ✅ Approve pending events
- ❌ Reject inappropriate events
- 👀 View event details before approval
- 📊 Monitor event submissions

## Features Implemented

### 1. **AdminPanelScreen** (`frontend/screens/AdminPanelScreen.js`)
- Beautiful UI with stats dashboard
- Pull-to-refresh functionality
- Real-time event list
- Approve/Reject actions with confirmations
- Access control (only admins/CRs can access)
- Empty state when no pending events

### 2. **Backend Support**
- Role-based access control (admin/cr/student)
- Event approval API endpoint: `PUT /api/events/:id/approve`
- Event rejection API endpoint: `PUT /api/events/:id/reject`
- Status filtering: `GET /api/events?status=pending`

### 3. **Event Status Flow**
```
Create Event → Pending → Admin Review → Approved/Rejected
                              ↓
                    Visible on Dashboard
```

## 🚀 Setup Instructions

### Step 1: Create Admin Account

You have 3 options to create an admin account:

#### **Option A: Using the provided script (Recommended)**

1. Open terminal in backend folder:
   ```bash
   cd backend
   ```

2. Run the admin creation script:
   ```bash
   node createAdmin.js
   ```

3. Login with these credentials:
   - **Email:** admin@campusconnect.com
   - **Password:** admin123
   - ⚠️ **Change password after first login!**

#### **Option B: Using MongoDB Atlas directly**

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to your cluster → Browse Collections
3. Find the `students` collection
4. Click "Insert Document"
5. Paste this JSON:
   ```json
   {
     "name": "Admin User",
     "usn": "ADMIN001",
     "email": "admin@campusconnect.com",
     "password": "admin123",
     "year": 4,
     "semester": 8,
     "phone": "1234567890",
     "gender": "Male",
     "department": "Administration",
     "role": "admin",
     "registeredEvents": []
   }
   ```
6. Click "Insert"

#### **Option C: Upgrade existing user to admin**

1. Go to MongoDB Atlas → Browse Collections
2. Find the `students` collection
3. Find your user by email
4. Click "Edit" (pencil icon)
5. Change `role` field from `"student"` to `"admin"`
6. Click "Update"

---

### Step 2: Test Admin Panel Access

1. **Login with admin account:**
   - Open the app
   - Login with admin credentials
   - You should see your role as "ADMIN" on the profile screen

2. **Access Admin Panel:**
   - Go to Profile screen
   - You should see "Admin Panel" option with a shield icon
   - Tap on it to open the Admin Panel

3. **Expected behavior:**
   - Regular users: Don't see "Admin Panel" button
   - Admin/CR users: See "Admin Panel" button in Profile

---

### Step 3: Test Event Approval Workflow

1. **Create a test event (as regular user):**
   - Logout from admin account
   - Register a new normal user
   - Create an event
   - ✅ Event should show as "pending" in "My Events"
   - ❌ Event should NOT appear on main Dashboard

2. **Approve event (as admin):**
   - Login with admin account
   - Go to Admin Panel
   - You should see the pending event
   - Tap "Approve"
   - ✅ Event disappears from Admin Panel (approved)

3. **Verify approval:**
   - Go back to Dashboard
   - ✅ The approved event should now be visible

4. **Test rejection:**
   - Create another event (as regular user)
   - Login as admin
   - Go to Admin Panel
   - Tap "Reject" → Confirm
   - ✅ Event should disappear (rejected)
   - ❌ Event should not appear on Dashboard

---

## 🎯 User Roles

### **Admin** (`role: 'admin'`)
- Full access to Admin Panel
- Can approve/reject any event
- Can see all events (including pending)
- Can edit/delete any event
- Can mark attendance

### **CR (Class Representative)** (`role: 'cr'`)
- Access to Admin Panel
- Can approve/reject events
- Can mark attendance
- Limited to department events (future enhancement)

### **Student** (`role: 'student'`)
- Default role for all registered users
- Cannot access Admin Panel
- Can only see approved events + their own pending events
- Can create events (pending approval)
- Can RSVP to approved events

---

## 📱 UI Features

### Admin Panel Screen
- **Header:** Shows "Admin Panel" title with back and refresh buttons
- **Stats Cards:**
  - Pending events count
  - Your role badge
- **Event Cards:** Display:
  - Event title and status badge
  - Description preview
  - Date, time, and location
  - Category tag
  - Event creator name
  - Three action buttons:
    - "View Details" (outline)
    - "Approve" (green)
    - "Reject" (red)

### Empty State
When no pending events:
- ✅ Checkmark icon
- "All Caught Up!" message
- Helpful text

### Access Denied Screen
For non-admin users:
- 🛡️ Shield icon
- "Access Denied" message
- "Go Back" button

---

## 🔧 Configuration

### Backend Configuration
All admin routes are already configured in `backend/routes/eventRoutes.js`:

```javascript
// Admin actions
router.put('/:id/approve', approveEvent);
router.put('/:id/reject', rejectEvent);
```

### Frontend Navigation
Admin Panel is added to the navigation stack in `frontend/App.js`:

```javascript
<Stack.Screen 
  name="AdminPanel" 
  component={AdminPanelScreen}
  options={{ animationEnabled: true }}
/>
```

---

## 🧪 Testing Checklist

- [ ] Admin user can login successfully
- [ ] Admin Panel button appears for admin users
- [ ] Admin Panel button does NOT appear for regular users
- [ ] Admin Panel loads pending events
- [ ] Approve button works correctly
- [ ] Reject button shows confirmation dialog
- [ ] Approved events appear on Dashboard
- [ ] Rejected events do NOT appear on Dashboard
- [ ] Non-admin users see "Access Denied" when accessing `/AdminPanel`
- [ ] Pull-to-refresh updates the pending events list
- [ ] Empty state shows when no pending events

---

## 🐛 Troubleshooting

### "Access Denied" even as admin
**Solution:** Check your user's role in MongoDB:
```javascript
db.students.findOne({ email: "your-email@example.com" })
```
Ensure `role` field is set to `"admin"` or `"cr"`.

### Admin Panel button not showing
**Solution:** 
1. Logout and login again
2. Check Profile screen - role should show "ADMIN"
3. Verify token is not expired (30 days validity)

### Events not appearing after approval
**Solution:**
1. Pull-to-refresh on Dashboard
2. Check event's `status` field in MongoDB:
   ```javascript
   db.events.find({ status: "approved" })
   ```

### Cannot approve/reject events
**Solution:**
1. Check backend logs for errors
2. Verify API endpoints are working:
   ```bash
   curl -X PUT http://localhost:5000/api/events/:id/approve \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

### "Failed to load pending events"
**Solution:**
1. Check backend is running
2. Verify MongoDB connection
3. Check network connectivity
4. Ensure API URL is correct in `frontend/api/api.js`

---

## 🔐 Security Best Practices

1. **Change default admin password immediately**
   - Use Profile → Change Password
   - Use strong password (12+ characters)

2. **Limit admin accounts**
   - Only create admin accounts for trusted users
   - Use CR role for department-level moderation

3. **Monitor admin actions**
   - Consider adding audit logs for approve/reject actions
   - Track who approved which events

4. **Never commit admin credentials**
   - Don't push `.env` files with admin passwords
   - Use environment variables for sensitive data

---

## 📈 Future Enhancements

### Phase 1 (Next Sprint)
- [ ] Batch approve/reject multiple events
- [ ] Add rejection reason field
- [ ] Notify event creator when approved/rejected
- [ ] Add event edit suggestion feature

### Phase 2 (Future)
- [ ] Admin dashboard with analytics
- [ ] User management (ban/unban users)
- [ ] Audit logs for admin actions
- [ ] Event report system
- [ ] Auto-approve trusted users after X approved events

### Phase 3 (Advanced)
- [ ] AI-powered content moderation
- [ ] Automated spam detection
- [ ] Department-wise admin hierarchy
- [ ] Admin notification preferences

---

## 📞 Support

If you encounter any issues:

1. Check this README first
2. Review backend logs: `cd backend && npm start`
3. Check frontend console: Expo Dev Tools
4. Verify MongoDB Atlas connection
5. Test API endpoints with Postman

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Create production admin account
- [ ] Change all default passwords
- [ ] Test approve/reject workflow end-to-end
- [ ] Verify access control (regular users can't access)
- [ ] Test on physical device
- [ ] Build new APK with admin panel
- [ ] Update documentation

---

**Admin Panel Status:** ✅ Fully Implemented  
**Last Updated:** November 2025  
**Tested:** ⏳ Pending Manual Testing

---

Great job! The Admin Panel is now fully integrated into your CampusConnect app! 🎉
