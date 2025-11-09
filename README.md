# 🎓 CampusConnect Event Management App

A comprehensive full-stack event management system designed for college campuses, built with React Native (Expo) and Node.js + Express + MongoDB. Features include event creation, RSVP management, push notifications, QR code tickets, admin approval system, and real-time updates.

![React Native](https://img.shields.io/badge/React%20Native-Expo-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![Push Notifications](https://img.shields.io/badge/Push-Notifications-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Libraries & Dependencies](#libraries--dependencies)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Production Build](#production-build)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🎨 Frontend Features (React Native + Expo)

**Authentication & Authorization**
- 📱 Student registration with comprehensive validation
- 🔐 Separate login for Students, Class Representatives (CR), and Admins
- 🔑 JWT token-based authentication with AsyncStorage
- 🚪 Auto-login on app restart
- 🔒 Secure password change functionality

**Event Management**
- 📋 Browse all approved events with pull-to-refresh
- 🔍 Search events by title, description, or organizer
- 🏷️ Filter by category (Technical, Cultural, Sports, Workshop, etc.)
- 📅 Calendar view with visual event markers
- 📝 Create events with image upload, date/time pickers
- ✏️ Edit/delete own created events
- ✅ RSVP to events with capacity tracking
- ❌ Cancel RSVP before event
- 👥 View attendee lists
- 📊 "My Events" - Track created events and RSVPs

**Push Notifications**
- 🔔 Automated event reminders (24 hours and 1 hour before)
- 📣 New event notifications
- ✅ Event approval/rejection alerts
- 📢 Event update notifications
- 🔕 In-app notification center with read/unread status

**QR Code System**
- 🎟️ Generate QR code tickets for registered events
- 📸 Scan QR codes for attendance marking (Admin/CR)
- ✨ Visual ticket modal with event details

**User Profile**
- 👤 View and edit profile information
- 📞 Update contact details
- 🔐 Change password securely
- 🔔 Manage push notification tokens

**Admin/CR Panel**
- ⚡ Event approval dashboard
- ✅ Approve pending events
- ❌ Reject events with reason
- 📊 Event statistics (pending, approved, rejected)
- 📸 QR scanner for attendance
- 👥 View all registered users

**UI/UX**
- 🎨 Modern, polished interface with consistent theme
- 🌈 Centralized color palette and typography
- 💫 Smooth animations and transitions
- ⏳ Loading states with ActivityIndicator
- ❗ User-friendly error messages
- 📱 Responsive design for all screen sizes
- 🔄 Pull-to-refresh on all list screens
- 🖼️ Image preview and caching

**Sharing & Integration**
- 📤 Share event details via native share sheet
- 🗺️ Open event location in Maps app
- 📧 Contact organizer via email/phone

### 🖥️ Backend Features (Node.js + Express + MongoDB)

**API & Architecture**
- ⚡ RESTful API with 35+ endpoints
- 🏗️ MVC architecture (Models, Controllers, Routes)
- 🔐 JWT middleware for protected routes
- 🛡️ Role-based access control (Student, CR, Admin)
- ✅ Comprehensive input validation
- ❌ Centralized error handling
- 🌐 CORS enabled for cross-origin requests

**Database (MongoDB Atlas)**
- 📊 3 main collections (Students, Events, Notifications)
- 🔗 Mongoose ODM with schema validation
- 🔍 Indexed fields for faster queries
- 🗑️ Auto-delete old notifications (30 days TTL)
- 📈 Population for referenced documents

**Authentication & Security**
- 🔐 bcryptjs password hashing (10 salt rounds)
- 🎫 JWT token generation and verification
- ⏰ 30-day token expiration
- 🚫 Protected routes with auth middleware
- 👤 Role-based authorization checks

**Event Management System**
- ✍️ CRUD operations for events
- 🔄 Event approval workflow (pending → approved/rejected)
- 👥 RSVP management with capacity tracking
- 🚫 Prevent double RSVPs
- ✅ Only admins/CRs can approve events
- 🔔 Notifications on event status changes

**Push Notification Service**
- 📱 Expo Push Notifications integration
- 🤖 Automated reminders via cron jobs
- ⏰ Hourly cron job checks upcoming events
- 📬 Send notifications to all event attendees
- 🔕 Handle invalid/expired push tokens

**Cron Job Scheduler**
- ⏱️ Runs every hour (0 * * * *)
- 🔍 Checks events in next 24 hours and 1 hour
- 📤 Sends push notifications via Expo
- ✅ Tracks sent reminders (prevents duplicates)
- 📊 Logs notification sending status

**Image Upload (Cloudinary)**
- 📸 Multer middleware for file handling
- ☁️ Cloudinary CDN for image storage
- 🖼️ Image optimization and transformation
- 🔗 Returns CDN URL for database storage

**Notification System**
- 📬 In-app notification creation
- 🔔 Push notification sending
- 📊 Track read/unread status
- 🗑️ Auto-delete after 30 days
- 🔍 Query by user and read status

**Deployment (Render)**
- 🌐 Hosted on Render.com
- 🔄 Auto-deploy on git push
- 📊 Environment variable management
- 📈 Health check endpoints
- 🚀 Production-ready configuration

## 🧩 Tech Stack

### Frontend
- **React Native** (0.72+) - Cross-platform mobile framework
- **Expo** (SDK 49+) - Development platform and build tool
- **React Navigation** (v6) - Stack, tab, and drawer navigation
- **Axios** - HTTP client for API calls
- **AsyncStorage** - Persistent local storage
- **Expo Vector Icons** - 10,000+ icons (Ionicons)
- **Expo Notifications** - Push notification handling
- **Expo Image Picker** - Camera and gallery access
- **React Native Modal** - Custom modal components
- **Date/Time Pickers** - Native date/time selection

### Backend
- **Node.js** (18+) - JavaScript runtime
- **Express.js** (4.18+) - Web application framework
- **MongoDB Atlas** - Cloud NoSQL database
- **Mongoose** (7.0+) - MongoDB object modeling
- **Render** - Backend hosting platform (deployed)
- **jsonwebtoken** - JWT generation and verification
- **bcryptjs** - Password hashing with salt
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing
- **multer** - Multipart form-data handling
- **cloudinary** - Cloud image storage and CDN
- **expo-server-sdk** - Push notification sending
- **node-cron** - Scheduled task automation

### Cloud Services
- **MongoDB Atlas** - Database hosting
- **Render** - Backend API hosting
- **Cloudinary** - Image CDN and storage
- **Expo** - Push notifications and app builds

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Mobile Application                      │
│                    (React Native + Expo)                    │
├─────────────────────────────────────────────────────────────┤
│  Screens  │  Components  │  Navigation  │  API Client       │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/HTTPS (Axios)
                      │ JWT Auth Headers
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend API Server                        │
│                 (Node.js + Express.js)                      │
├─────────────────────────────────────────────────────────────┤
│  Routes  │  Controllers  │  Middleware  │  Services         │
└─────┬───────────┬───────────────┬────────────────┬──────────┘
      │           │               │                │
      ▼           ▼               ▼                ▼
┌─────────┐ ┌──────────┐  ┌─────────────┐  ┌─────────────┐
│ MongoDB │ │Cloudinary│  │Expo Push API│  │  Cron Jobs  │
│  Atlas  │ │  (CDN)   │  │(Notif. Send)│  │ (Scheduler) │
└─────────┘ └──────────┘  └─────────────┘  └─────────────┘
```

### Data Flow

**Authentication Flow:**
1. User registers/logs in → Frontend sends credentials
2. Backend validates → Generates JWT token
3. Token stored in AsyncStorage
4. All subsequent requests include JWT in headers
5. Middleware verifies token before processing

**Event Creation Flow:**
1. User fills event form → Image picked from gallery
2. Image uploaded to Cloudinary → URL received
3. Event data + image URL → Backend API
4. Event saved to MongoDB with "pending" status
5. Admin receives notification for approval
6. Upon approval → All users receive push notification

**Push Notification Flow:**
1. User grants notification permissions → Expo token generated
2. Token sent to backend → Stored in user profile
3. Cron job runs hourly → Checks upcoming events
4. Notifications sent via Expo Push API → User devices receive

### Database Schemas

#### Student/User Schema
```javascript
{
  _id: ObjectId,                    // MongoDB auto-generated ID
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6                    // Hashed with bcryptjs
  },
  phone: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true                  // 1, 2, 3, 4
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['student', 'cr', 'admin'],
    default: 'student'
  },
  expoPushToken: {
    type: String,                   // Expo push notification token
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

#### Event Schema
```javascript
{
  _id: ObjectId,
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    minlength: 20
  },
  category: {
    type: String,
    required: true,
    enum: ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Competition', 'Other']
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true                  // Format: "10:00 AM"
  },
  location: {
    type: String,
    required: true
  },
  organizer: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,                   // Cloudinary URL
    default: null
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: {
    type: String,
    default: null
  },
  remindersSent: {
    day: { type: Boolean, default: false },    // 24h reminder sent
    hour: { type: Boolean, default: false }    // 1h reminder sent
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

#### Notification Schema
```javascript
{
  _id: ObjectId,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['event_approved', 'event_rejected', 'event_reminder', 'event_updated', 'new_event', 'rsvp_confirmation'],
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    default: null
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000                // Auto-delete after 30 days
  }
}
```

**Indexes:**
- `Student`: email (unique), rollNumber (unique)
- `Event`: date, status, category, createdBy
- `Notification`: user, createdAt, read

## 📚 Libraries & Dependencies

### Frontend Dependencies
```json
{
  "@react-navigation/native": "^6.1.7",
  "@react-navigation/stack": "^6.3.17",
  "@react-navigation/bottom-tabs": "^6.5.8",
  "axios": "^1.4.0",
  "expo": "~49.0.0",
  "expo-image-picker": "~14.3.2",
  "expo-notifications": "~0.20.1",
  "react": "18.2.0",
  "react-native": "0.72.3",
  "react-native-modal": "^13.0.1",
  "@react-native-async-storage/async-storage": "1.18.2",
  "@expo/vector-icons": "^13.0.0"
}
```

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.0.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.0",
  "dotenv": "^16.0.3",
  "cors": "^2.8.5",
  "multer": "^1.4.5-lts.1",
  "cloudinary": "^1.37.3",
  "expo-server-sdk": "^3.7.0",
  "node-cron": "^3.0.2"
}
```

## 📁 Project Structure

```
app2/
├── backend/                      # Node.js Backend
│   ├── config/
│   │   └── database.js          # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── eventController.js   # Event CRUD operations
│   │   └── notificationController.js  # Notification handling
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification middleware
│   ├── models/
│   │   ├── Student.js           # User/Student schema
│   │   ├── Event.js             # Event schema
│   │   └── Notification.js      # Notification schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth API endpoints
│   │   ├── eventRoutes.js       # Event API endpoints
│   │   └── notificationRoutes.js # Notification endpoints
│   ├── .env                     # Environment variables
│   ├── .gitignore
│   ├── package.json
│   ├── server.js                # Express server entry
│   ├── createAdmin.js           # Admin creation script
│   └── README.md
│
├── frontend/                     # React Native App
│   ├── api/
│   │   └── api.js               # Axios API client
│   ├── components/
│   │   ├── Button.js            # Custom button component
│   │   ├── InputField.js        # Form input component
│   │   ├── LoadingSpinner.js    # Loading indicator
│   │   └── QRTicketModal.js     # QR code modal
│   ├── config/
│   │   └── environment.js       # API URL configuration
│   ├── constants/
│   │   └── theme.js             # Colors, spacing, typography
│   ├── screens/
│   │   ├── LandingPage.js       # Welcome screen
│   │   ├── LoginScreen.js       # Student login
│   │   ├── RegisterScreen.js    # Student registration
│   │   ├── AdminLoginScreen.js  # Admin/CR login
│   │   ├── DashboardScreen.js   # Main event listing
│   │   ├── EventDetailsScreen.js # Event details view
│   │   ├── CreateEventScreen.js # Event creation form
│   │   ├── ProfileScreen.js     # User profile
│   │   ├── NotificationsScreen.js # Notification list
│   │   ├── CalendarScreen.js    # Calendar view
│   │   ├── MyEventsScreen.js    # User's events
│   │   ├── AdminPanelScreen.js  # Admin dashboard
│   │   ├── QRScannerScreen.js   # QR scanner
│   │   └── SettingsScreen.js    # App settings
│   ├── .gitignore
│   ├── app.json                 # Expo configuration
│   ├── eas.json                 # EAS Build configuration
│   ├── package.json
│   ├── App.js                   # Root component
│   └── README.md
│
├── DOCS.md                      # Comprehensive documentation
├── README.md                    # This file
├── GETTING_STARTED.md          # Setup guide
├── BUILD_APK_GUIDE.md          # Build instructions
└── ARCHITECTURE.md             # System architecture
    │   └── api.js               # API configuration & methods
    ├── components/
    │   ├── Button.js            # Custom button component
    │   ├── InputField.js        # Custom input component
    │   └── LoadingSpinner.js    # Loading component
    ├── constants/
    │   └── theme.js             # Colors, typography, spacing
    ├── screens/
    │   ├── LandingPage.js       # Welcome screen
    │   ├── LoginScreen.js       # Login form
    │   ├── RegisterScreen.js    # Registration form
    │   └── HomeScreen.js        # Dashboard
    ├── .gitignore
    ├── App.js                   # Main app with navigation
    ├── app.json                 # Expo configuration
    ├── babel.config.js
    └── package.json
```

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Git** - Version control
- **Expo CLI** - `npm install -g expo-cli`
- **Android Studio** or **Xcode** (for mobile emulators)
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Event Management/app2"
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## 🔧 Configuration

### Backend Configuration

1. **Update `.env` file** in `backend/` directory:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://samuel272lazar:root@123@cluster0.wpnllx4.mongodb.net/campusconnect?retryWrites=true&w=majority&appName=Cluster0

# JWT Secret Key (Change in production!)
JWT_SECRET=campusconnect_secret_key_2025_secure

# Server Configuration
PORT=5000
NODE_ENV=development
```

⚠️ **Important:** In production, use a strong, random JWT secret and secure MongoDB credentials.

### Frontend Configuration

1. **Update API URL** in `frontend/api/api.js`:

```javascript
// For Android Emulator
const API_BASE_URL = 'http://10.0.2.2:5000/api';

// For iOS Simulator
const API_BASE_URL = 'http://localhost:5000/api';

// For Physical Device (replace with your computer's IP)
const API_BASE_URL = 'http://192.168.1.x:5000/api';
```

To find your IP address:
- **Windows:** `ipconfig` in Command Prompt
- **Mac/Linux:** `ifconfig` in Terminal

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
npm start
```

You should see:
```
🚀 ==========================================
🚀 Server running in development mode
🚀 Server started on port 5000
🚀 API URL: http://localhost:5000
🚀 ==========================================
✅ MongoDB Connected: cluster0.wpnllx4.mongodb.net
📊 Database: campusconnect
```

### Start Frontend App

```bash
cd frontend
npm start
```

This will open Expo DevTools in your browser.

### Run on Device/Emulator

- **Android:** Press `a` or scan QR code with Expo Go app
- **iOS:** Press `i` or scan QR code with Camera app
- **Web:** Press `w` (limited functionality)

## 📡 API Documentation

### Base URL
```
Production: https://your-app.onrender.com/api
Development: http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Register Student
```http
POST /api/auth/register
```
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@college.edu",
  "password": "SecurePass123",
  "phone": "9876543210",
  "department": "Computer Science",
  "year": "2",
  "rollNumber": "CS2021001"
}
```
**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@college.edu",
    "role": "student"
  }
}
```

#### 2. Login (Student/Admin/CR)
```http
POST /api/auth/login
```
**Request Body:**
```json
{
  "email": "john@college.edu",
  "password": "SecurePass123"
}
```

#### 3. Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

#### 4. Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### 5. Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "9876543210",
  "department": "Computer Science"
}
```

#### 6. Change Password
```http
PUT /api/auth/change-password
Authorization: Bearer <token>

{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass456"
}
```

#### 7. Update Push Token
```http
PUT /api/auth/push-token
Authorization: Bearer <token>

{
  "expoPushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
}
```

### Event Endpoints

#### 1. Get All Events (Approved)
```http
GET /api/events
GET /api/events?category=Technical
GET /api/events?search=hackathon
```

#### 2. Get Event by ID
```http
GET /api/events/:id
```

#### 3. Create Event
```http
POST /api/events
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Tech Fest 2025",
  "description": "Annual technical festival",
  "category": "Technical",
  "date": "2025-12-15",
  "time": "10:00 AM",
  "location": "Main Auditorium",
  "capacity": 200,
  "organizer": "CS Department",
  "image": <file>
}
```

#### 4. Update Event
```http
PUT /api/events/:id
Authorization: Bearer <token>
```

#### 5. Delete Event
```http
DELETE /api/events/:id
Authorization: Bearer <token>
```

#### 6. RSVP to Event
```http
POST /api/events/:id/rsvp
Authorization: Bearer <token>
```

#### 7. Cancel RSVP
```http
DELETE /api/events/:id/rsvp
Authorization: Bearer <token>
```

#### 8. Get My Events (Created)
```http
GET /api/events/my-events
Authorization: Bearer <token>
```

#### 9. Get My RSVPs
```http
GET /api/events/my-rsvps
Authorization: Bearer <token>
```

### Admin Endpoints

#### 1. Get Pending Events
```http
GET /api/events/admin/pending
Authorization: Bearer <admin-token>
```

#### 2. Approve Event
```http
PUT /api/events/:id/approve
Authorization: Bearer <admin-token>
```

#### 3. Reject Event
```http
PUT /api/events/:id/reject
Authorization: Bearer <admin-token>

{
  "reason": "Does not meet guidelines"
}
```

#### 4. Get All Users
```http
GET /api/auth/admin/users
Authorization: Bearer <admin-token>
```

### Notification Endpoints

#### 1. Get User Notifications
```http
GET /api/notifications
Authorization: Bearer <token>
```

#### 2. Mark as Read
```http
PUT /api/notifications/:id/read
Authorization: Bearer <token>
```

#### 3. Mark All as Read
```http
PUT /api/notifications/read-all
Authorization: Bearer <token>
```

#### 4. Delete Notification
```http
DELETE /api/notifications/:id
Authorization: Bearer <token>
```

### Error Responses

**400 Bad Request:**
```json
{
  "message": "Please provide all required fields"
}
```

**401 Unauthorized:**
```json
{
  "message": "Not authorized, no token"
}
```

**403 Forbidden:**
```json
{
  "message": "Not authorized as admin"
}
```

**404 Not Found:**
```json
{
  "message": "Event not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Server error",
  "error": "Error details..."
}
```

## 🎨 Color Palette

The app uses a professional and modern color scheme:

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary Purple | `#6C63FF` | Primary buttons, headers |
| Coral Pink | `#FF6584` | Accent elements |
| Teal | `#4ECDC4` | Success states |
| Light Background | `#F8F9FE` | App background |
| White | `#FFFFFF` | Cards, surfaces |
| Dark Text | `#2D3748` | Primary text |
| Light Text | `#A0AEC0` | Secondary text |

## 📱 Screenshots

### Landing Page
- Welcome screen with animated features
- Login and Register buttons

### Login Screen
- Email and password fields
- Form validation
- Forgot password link

### Register Screen
- Comprehensive registration form
- All student details (Name, USN, Email, etc.)
- Dropdown selectors for Year, Semester, Gender, Department
- Password strength validation

### Home Screen
- User profile card
- Quick action buttons
- Upcoming events section
- Statistics cards

## 🔐 Security Features

1. **Password Hashing:** bcryptjs with salt rounds
2. **JWT Authentication:** Secure token-based auth
3. **Input Validation:** Server-side and client-side
4. **CORS Protection:** Configured for specific origins
5. **Environment Variables:** Sensitive data in .env
6. **Error Handling:** No sensitive info in error messages

## 🧪 Testing

### Test Registration
1. Open the app
2. Click "Create Account"
3. Fill in all fields with valid data
4. Submit and verify success

### Test Login
1. Use registered credentials
2. Verify token storage
3. Check automatic navigation to Home

### Test Protected Routes
1. Try accessing `/api/auth/profile` without token
2. Verify 401 response
3. Add valid token and verify success

## 🚧 Future Enhancements

### Planned Features
- [ ] **Certificate Generation** - Auto-generate participation certificates
- [ ] **Analytics Dashboard** - Detailed event analytics and insights
- [ ] **Email Notifications** - Nodemailer integration for email alerts
- [ ] **SMS Notifications** - Twilio integration for SMS reminders
- [ ] **Social Media Integration** - Share to Facebook, Twitter, LinkedIn
- [ ] **Event Feedback System** - Post-event ratings and reviews
- [ ] **Attendance Tracking** - QR code check-in/out system
- [ ] **Event Chat** - Real-time chat for event attendees
- [ ] **Event Polls** - Create polls for event attendees

### UI/UX Improvements
- [ ] **Dark Mode** - System-wide dark theme
- [ ] **Multi-language Support** - i18n for regional languages
- [ ] **Offline Mode** - Cache events for offline viewing
- [ ] **Advanced Filters** - Filter by date range, location, etc.
- [ ] **Map Integration** - Google Maps for event locations


### Admin Features
- [ ] **Advanced Analytics** - Charts and graphs for event data
- [ ] **Bulk Operations** - Bulk approve/reject events
- [ ] **User Management** - Ban/suspend users
- [ ] **Event Templates** - Reusable event templates
- [ ] **Automated Reports** - Weekly/monthly event reports
- [ ] **Role Management** - Custom roles and permissions

### Technical Improvements
- [ ] **GraphQL API** - Replace REST with GraphQL
- [ ] **WebSocket** - Real-time updates without polling
- [ ] **Redis Cache** - Cache frequently accessed data
- [ ] **Microservices** - Split into independent services
- [ ] **Docker** - Containerize application
- [ ] **CI/CD Pipeline** - Automated testing and deployment
- [ ] **Unit Tests** - Jest/Mocha test coverage
- [ ] **API Rate Limiting** - Prevent API abuse
- [ ] **CDN Integration** - Faster static content delivery

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## � Building Android APK

Want to create an installable APK for distribution? Follow our comprehensive guide:

📖 **[BUILD_APK_GUIDE.md](BUILD_APK_GUIDE.md)** - Complete APK building instructions

### Quick Build Steps:

```bash
# Install EAS CLI (if not installed)
npm install -g eas-cli

# Navigate to frontend directory
cd frontend

# Login to Expo account
eas login

# Build production APK
eas build --platform android --profile production

# Download APK from Expo dashboard when complete
# https://expo.dev/accounts/YOUR_USERNAME/projects
```

**Build Profiles:**
- `development` - Development build with debugging
- `preview` - Preview APK for testing
- `production` - Production-ready signed APK

**Important Notes:**
1. **Backend is deployed on Render** - Production API is live
2. Update `frontend/config/environment.js` with Render API URL
3. Build typically takes 10-20 minutes
4. APK will be available on Expo dashboard for download

**Deployment Stack:**
- **Backend Hosting:** Render (https://render.com)
- **Database:** MongoDB Atlas
- **Image Storage:** Cloudinary CDN
- **Push Notifications:** Expo Push API

📖 **[BUILD_APK_GUIDE.md](BUILD_APK_GUIDE.md)** - Detailed build instructions  
📖 **[DOCS.md](DOCS.md)** - Complete documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Samuel Lazar (SammyBoy-09)**  
📧 Email: [Your Email]  
🔗 GitHub: [@SammyBoy-09](https://github.com/SammyBoy-09)  
📦 Repository: [Event-Management-Mini-Project](https://github.com/SammyBoy-09/Event-Management-Mini-Project)

## 🙏 Acknowledgments

- **React Native & Expo** - Cross-platform mobile development
- **MongoDB Atlas** - Cloud database hosting
- **Cloudinary** - Image CDN and storage
- **Expo Push Notifications** - Push notification service
- **Express.js Community** - Backend framework
- **Open Source Contributors** - All the amazing libraries

## 📞 Support & Documentation

For detailed guides and troubleshooting:
- 📖 **[DOCS.md](DOCS.md)** - Complete documentation
- 🚀 **[GETTING_STARTED.md](GETTING_STARTED.md)** - Setup guide
- 📦 **[BUILD_APK_GUIDE.md](BUILD_APK_GUIDE.md)** - Build instructions
- 🏗️ **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture

**Need help?** Open an issue in the repository!

---

**Built with ❤️ for Campus Event Management**  
*Last Updated: November 9, 2025*
