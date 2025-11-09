# CampusConnect Event Management - Complete Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Features](#features)
3. [Admin Panel](#admin-panel)
4. [Push Notifications](#push-notifications)
5. [Deployment](#deployment)
6. [Testing](#testing)

---

## Architecture Overview

### Tech Stack
**Frontend:**
- React Native (Expo)
- React Navigation
- Axios for API calls
- AsyncStorage for local data
- Expo Notifications for push notifications

**Backend:**
- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary for image uploads
- Expo Server SDK for push notifications
- node-cron for scheduled tasks

### Project Structure
```
app2/
├── frontend/              # React Native Expo app
│   ├── screens/          # All app screens
│   ├── components/       # Reusable components
│   ├── api/             # API integration
│   ├── constants/       # Theme and constants
│   └── config/          # Environment config
├── backend/             # Node.js Express server
│   ├── models/         # Mongoose schemas
│   ├── controllers/    # Route controllers
│   ├── routes/         # API routes
│   ├── middleware/     # Auth middleware
│   └── config/         # Database config
```

---

## Features

### Core Features ✅
1. **User Authentication**
   - Student registration with college email validation
   - Admin/CR login system
   - JWT-based authentication
   - Role-based access control

2. **Event Management**
   - Create events (Admin/CR only)
   - Browse events (all users)
   - RSVP to events
   - Cancel RSVP
   - Event approval system
   - Image upload support
   - QR code tickets

3. **Push Notifications**
   - Event reminders (1 day before, 1 hour before)
   - New event notifications
   - Event approval/rejection notifications
   - Cron job scheduler for automated reminders

4. **Admin Panel**
   - Approve/reject pending events
   - View all events
   - Manage users
   - QR scanner for attendance

5. **Student Features**
   - Browse events by category
   - Search events
   - View event details
   - RSVP management
   - Profile management
   - My Events section
   - Calendar view
   - QR ticket generation

---

## Admin Panel

### Admin Types
1. **Super Admin** - Full access
2. **CR (Class Representative)** - Can create events, limited admin access

### Admin Functions
- **Event Approval**: Review and approve/reject student-created events
- **Event Management**: Edit/delete any event
- **User Management**: View all users
- **QR Scanner**: Scan student tickets for attendance
- **Analytics**: View event statistics

### Creating Admin Account
```bash
cd backend
node createAdmin.js
```

Follow prompts to create admin account.

---

## Push Notifications

### Setup
1. **Get Expo Push Token** (automatic on app start)
2. **Token Storage** (stored in backend on login/register)
3. **Notification Sending** (backend sends via Expo Push API)

### Notification Types
1. **Event Reminders**
   - 24 hours before event
   - 1 hour before event
   - Automated via cron job

2. **Event Notifications**
   - New event created
   - Event approved/rejected
   - Event updated/cancelled

### Cron Schedule
```javascript
// Runs every hour to check for upcoming events
'0 * * * *' - Check for events in next 24 hours
'0 * * * *' - Check for events in next 1 hour
```

### Testing Push Notifications
1. Create event with date/time in near future
2. Wait for scheduled time
3. Check notification on device
4. Or use testing endpoint to send test notification

---

## Deployment

### Backend Deployment (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   PORT=5000
   ```
4. Deploy!

### Frontend Build (EAS)
```bash
cd frontend
eas build --platform android --profile production
```

**Download APK from Expo dashboard when complete**

---

## Testing

### Backend Testing
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

### Frontend Testing
```bash
cd frontend
npm start
# Scan QR code with Expo Go app
```

### Test Accounts
**Admin:**
- Email: admin@campus.com
- Password: Admin@123

**Student:**
- Register with any college email
- Use format: yourname@college.edu

### Testing Checklist
- ✅ User registration/login
- ✅ Create event (admin)
- ✅ Browse events
- ✅ RSVP to event
- ✅ View My Events
- ✅ Push notifications
- ✅ QR ticket generation
- ✅ Admin approval
- ✅ Event search/filter
- ✅ Profile management

---

## UI/UX Polish

### Completed Improvements
1. **Text Overflow Prevention**
   - Added numberOfLines to all text elements
   - Fixed ProfileScreen Department field overlap
   - Proper text wrapping everywhere

2. **Theme Consistency**
   - All screens use centralized theme constants
   - Consistent colors, spacing, typography
   - Standardized shadows across all cards

3. **Button Standardization**
   - Height: 50px
   - Border radius: RADIUS.MD (8px)
   - Active opacity: 0.7-0.8
   - Consistent styling

4. **Loading States**
   - ActivityIndicator on all loading screens
   - Consistent loading experience
   - Spinner + text for better UX

5. **Professional Appearance**
   - Clean layouts
   - Proper spacing
   - Smooth transitions
   - No UI glitches

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Events
- `GET /api/events` - Get all approved events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/rsvp` - RSVP to event
- `DELETE /api/events/:id/rsvp` - Cancel RSVP
- `GET /api/events/pending` - Get pending events (admin)
- `PUT /api/events/:id/approve` - Approve event (admin)
- `PUT /api/events/:id/reject` - Reject event (admin)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `POST /api/notifications/token` - Update push token

---

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/event-management
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Frontend (config/environment.js)
```javascript
export const API_URL = 'http://your-backend-url.com';
// or for local: 'http://localhost:5000'
```

---

## Troubleshooting

### Common Issues

**Push notifications not working:**
1. Check Expo push token is saved in backend
2. Verify notification permissions granted
3. Check cron job is running
4. Test with manual notification send

**Images not uploading:**
1. Verify Cloudinary credentials
2. Check file size (max 10MB)
3. Check internet connection

**Backend connection failed:**
1. Check API_URL in frontend config
2. Verify backend is running
3. Check network connection
4. Check CORS settings

**Build failed:**
1. Check all dependencies installed
2. Verify app.json is correct
3. Check for syntax errors
4. Clear cache: `expo start -c`

---

## Credits

**Developer:** Samuel Lazar (SammyBoy-09)  
**Repository:** Event-Management-Mini-Project  
**License:** MIT

---

*Last Updated: November 9, 2025*
