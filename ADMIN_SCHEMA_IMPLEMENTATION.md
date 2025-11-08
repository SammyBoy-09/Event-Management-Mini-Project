# Separate Admin Schema Implementation

## Overview
Created a separate Admin schema and authentication system to properly separate admin and student accounts, with registration capability for admins.

## Changes Made

### 1. Backend Changes

#### New Admin Model (`backend/models/Admin.js`)
- **Separate MongoDB schema** for admins
- **Fields:**
  - `name`: Full name (required, 2-100 chars)
  - `email`: Unique email (required, validated format)
  - `password`: Hashed password (required, min 6 chars)
  - `phone`: 10-digit phone number (required)
  - `department`: Department name (required)
  - `role`: Enum ['admin', 'cr', 'CR'] (default: 'admin')
  - `permissions`: Object with admin permissions:
    - `canApproveEvents`: Boolean (default: true)
    - `canDeleteEvents`: Boolean (default: true)
    - `canManageUsers`: Boolean (default: false)
    - `canScanQR`: Boolean (default: true)
  - `approvedEvents`: Array of event references
  - `lastLogin`: Date of last login
  - `createdAt`: Auto-generated timestamp

#### Updated Auth Controller (`backend/controllers/authController.js`)
**Modified `generateToken` function:**
- Now accepts `type` parameter ('student' or 'admin')
- JWT payload includes user type for proper authentication

**New Functions:**
1. **`registerAdmin`** - POST `/api/auth/admin/register`
   - Validates: name, email, phone, department, password
   - Checks for duplicate email
   - Hashes password with bcrypt
   - Creates admin with specified role (admin or cr)
   - Returns token and admin data

2. **`loginAdmin`** - POST `/api/auth/admin/login`
   - Validates email and password
   - Finds admin by email
   - Compares hashed password
   - Updates `lastLogin` timestamp
   - Returns token and admin data with permissions

3. **`getAdminProfile`** - GET `/api/auth/admin/profile`
   - Requires JWT authentication
   - Returns admin profile with populated `approvedEvents`
   - Excludes password field

#### Updated Auth Routes (`backend/routes/authRoutes.js`)
**New Admin Routes:**
- `POST /api/auth/admin/register` - Register new admin (public for now)
- `POST /api/auth/admin/login` - Login admin
- `GET /api/auth/admin/profile` - Get admin profile (protected)

### 2. Frontend Changes

#### Updated API Functions (`frontend/api/api.js`)
**New Admin API Methods:**
1. **`registerAdmin(adminData)`**
   - Endpoint: `/auth/admin/register`
   - Payload: name, email, phone, department, password, role
   - Returns: token and admin data

2. **`loginAdmin(credentials)`**
   - Endpoint: `/auth/admin/login`
   - Payload: email, password
   - Returns: token and admin data with permissions

3. **`getAdminProfile()`**
   - Endpoint: `/auth/admin/profile`
   - Requires: JWT token in headers
   - Returns: Complete admin profile

#### Updated AdminLoginScreen (`frontend/screens/AdminLoginScreen.js`)
**Changes:**
- Replaced `loginStudent` with `loginAdmin` API call
- Removed client-side role verification (now handled by backend)
- Added "Register Here" link to navigate to AdminRegister
- Updated info text to mention registration capability
- Simplified login flow (backend ensures only admins can log in)

**New UI Elements:**
- Register section with "Need an admin account? Register Here" link
- Updated warning text: "Only authorized personnel should create admin accounts"
- Updated info section to explain admin registration

#### New AdminRegisterScreen (`frontend/screens/AdminRegisterScreen.js`)
**Features:**
- **Registration Form Fields:**
  - Full Name (required, min 2 chars)
  - Admin Email (required, validated format)
  - Phone Number (required, 10 digits, number pad)
  - Department (required)
  - Account Type selector: Admin or Class Rep
  - Password (required, min 6 chars, show/hide toggle)
  - Confirm Password (required, must match)

- **Role Selection:**
  - Toggle between "Admin" and "Class Rep" roles
  - Visual feedback with icons and color coding
  - Shield-checkmark icon for Admin
  - People icon for Class Rep

- **Validation:**
  - Real-time error clearing on input change
  - Email format validation
  - Phone number format (10 digits only)
  - Password length check (min 6 chars)
  - Password match confirmation

- **UI Design:**
  - Red theme (#EF4444) matching AdminLoginScreen
  - Shield-checkmark icon header
  - White registration card with shadow
  - Back button to return to AdminLogin
  - "Already have an account? Sign In" link

- **Warning Box:**
  - "Authorized Personnel Only" message
  - Explains admin permissions and responsibilities

- **Info Section:**
  - Lists admin permissions:
    - ✓ Approve and reject events
    - ✓ Scan QR codes for check-ins
    - ✓ Manage event attendance

#### Updated App.js Navigation
**Added:**
- Import for `AdminRegisterScreen`
- Stack.Screen route: `AdminRegister`
- Slide-in animation from right (same as other auth screens)

---

## API Endpoints Summary

### Admin Authentication Endpoints

#### 1. Register Admin
```
POST /api/auth/admin/register
```
**Request Body:**
```json
{
  "name": "John Admin",
  "email": "admin@college.edu",
  "phone": "1234567890",
  "department": "Computer Science",
  "password": "securepass123",
  "role": "admin" // or "cr"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Admin registration successful",
  "data": {
    "token": "jwt-token-here",
    "student": {
      "id": "admin-id",
      "name": "John Admin",
      "email": "admin@college.edu",
      "phone": "1234567890",
      "department": "Computer Science",
      "role": "admin",
      "permissions": {
        "canApproveEvents": true,
        "canDeleteEvents": true,
        "canManageUsers": false,
        "canScanQR": true
      }
    }
  }
}
```

#### 2. Login Admin
```
POST /api/auth/admin/login
```
**Request Body:**
```json
{
  "email": "admin@college.edu",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-here",
    "student": {
      "id": "admin-id",
      "name": "John Admin",
      "email": "admin@college.edu",
      "phone": "1234567890",
      "department": "Computer Science",
      "role": "admin",
      "permissions": {
        "canApproveEvents": true,
        "canDeleteEvents": true,
        "canManageUsers": false,
        "canScanQR": true
      },
      "lastLogin": "2025-11-08T10:30:00.000Z"
    }
  }
}
```

#### 3. Get Admin Profile
```
GET /api/auth/admin/profile
Headers: Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "admin": {
      "id": "admin-id",
      "name": "John Admin",
      "email": "admin@college.edu",
      "phone": "1234567890",
      "department": "Computer Science",
      "role": "admin",
      "permissions": {
        "canApproveEvents": true,
        "canDeleteEvents": true,
        "canManageUsers": false,
        "canScanQR": true
      },
      "approvedEvents": [...],
      "lastLogin": "2025-11-08T10:30:00.000Z",
      "createdAt": "2025-11-01T08:00:00.000Z"
    }
  }
}
```

---

## Navigation Flow

### Admin Registration Flow
```
AuthLandingScreen
  ↓ Click "Admin / CR"
AdminLoginScreen
  ↓ Click "Register Here"
AdminRegisterScreen
  ↓ Fill form & submit
  ↓ Auto-login after registration
Dashboard (with admin features)
```

### Admin Login Flow
```
AuthLandingScreen
  ↓ Click "Admin / CR"
AdminLoginScreen
  ↓ Enter credentials & login
Dashboard (with admin features)
```

---

## Database Collections

### Before (Single Collection)
- **students**: Mixed collection with student, admin, and CR roles

### After (Separate Collections)
- **students**: Only regular students
- **admins**: Administrators and Class Representatives (CRs)

**Benefits:**
- ✓ Clear data separation
- ✓ Different field requirements (students have USN, year, semester; admins have permissions)
- ✓ Better security (separate authentication logic)
- ✓ Easier to manage permissions
- ✓ Scalable for future admin features

---

## Security Considerations

### Current Implementation (Public Registration)
- **Admin registration is currently PUBLIC** for development/testing
- Any user can create an admin account

### Recommended for Production:
1. **Restrict admin registration endpoint:**
   ```javascript
   // Add middleware to verify super admin token
   router.post('/admin/register', protectSuperAdmin, registerAdmin);
   ```

2. **Add email verification:**
   - Send verification email after registration
   - Require admin approval before account activation

3. **Add role-based middleware:**
   - Verify user type from JWT token
   - Restrict admin-only routes

4. **Add audit logging:**
   - Log all admin actions (approvals, deletions)
   - Track who created each admin account

---

## Testing Checklist

### Backend Testing:
- [x] Backend server starts without errors
- [ ] POST /api/auth/admin/register creates admin in database
- [ ] POST /api/auth/admin/login returns admin token
- [ ] GET /api/auth/admin/profile returns admin data
- [ ] Admin and Student collections are separate
- [ ] Passwords are properly hashed
- [ ] JWT tokens include user type

### Frontend Testing:
- [ ] AdminLoginScreen → AdminRegisterScreen navigation works
- [ ] AdminRegisterScreen form validation works
- [ ] Role selector (Admin/CR) toggles properly
- [ ] Phone number accepts only 10 digits
- [ ] Password show/hide toggle works
- [ ] Password match validation works
- [ ] Registration creates account and auto-logs in
- [ ] Admin login uses correct API endpoint
- [ ] Dashboard shows admin features after login

### Integration Testing:
- [ ] Create admin account via registration
- [ ] Login with admin account
- [ ] Access Admin Panel
- [ ] Approve/reject events (admin permissions)
- [ ] Scan QR codes (admin permissions)
- [ ] Verify admin data persists correctly

---

## Files Created/Modified

### Created:
1. `backend/models/Admin.js` (79 lines) - New admin schema
2. `frontend/screens/AdminRegisterScreen.js` (492 lines) - Admin registration UI

### Modified:
1. `backend/controllers/authController.js`
   - Added `registerAdmin`, `loginAdmin`, `getAdminProfile` functions
   - Updated `generateToken` to include user type

2. `backend/routes/authRoutes.js`
   - Added 3 new admin routes

3. `frontend/api/api.js`
   - Added `registerAdmin`, `loginAdmin`, `getAdminProfile` functions

4. `frontend/screens/AdminLoginScreen.js`
   - Changed to use `loginAdmin` API
   - Added registration link
   - Updated UI text for registration capability

5. `frontend/App.js`
   - Added AdminRegisterScreen import and route

---

## Next Steps

### Immediate:
1. **Test the complete flow:**
   - Register new admin account
   - Login with admin account
   - Verify admin features work

2. **Update middleware:**
   - Modify `authMiddleware.js` to handle admin tokens
   - Add admin-only route protection

### Future Enhancements:
1. **Super Admin Role:**
   - Add super admin role for user management
   - Only super admins can create other admins

2. **Admin Dashboard:**
   - Separate admin dashboard with analytics
   - User management interface
   - System settings

3. **Audit Logs:**
   - Log all admin actions
   - Admin activity history
   - Security monitoring

4. **Email Verification:**
   - Send verification email on registration
   - Require email confirmation before activation

5. **Permission Management:**
   - UI to customize admin permissions
   - Role-based access control (RBAC)
   - Permission templates

---

## Summary

Successfully implemented a **separate Admin schema** with:
- ✅ Dedicated Admin MongoDB collection
- ✅ Separate registration endpoint (`/api/auth/admin/register`)
- ✅ Separate login endpoint (`/api/auth/admin/login`)
- ✅ AdminRegisterScreen with role selection (Admin/CR)
- ✅ Updated AdminLoginScreen with registration link
- ✅ Permission system for granular access control
- ✅ Last login tracking
- ✅ Proper data separation between students and admins

**Result:** Clean separation of concerns, better security, and scalable architecture for future admin features.

**Status:** ✅ Implementation Complete | 🔲 Testing Pending
