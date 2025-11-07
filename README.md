# 🎓 CampusConnect Event Management App

A full-stack student login/register system built with React Native (frontend) and Node.js + Express + MongoDB (backend).

![CampusConnect](https://img.shields.io/badge/React%20Native-0.72-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🎨 Frontend Features
- **Landing Page** with animated feature showcase
- **Student Registration** with comprehensive form validation
- **Student Login** with JWT authentication
- **Event Dashboard** with category filters and RSVP
- **Event Creation** with date/time pickers and validation
- **Event Details** with share and directions functionality
- **Notifications System** with real-time updates
- **User Profile** with edit and password change
- **Auto-login** using AsyncStorage
- **Beautiful UI** with modern color palette
- **Form Validation** (email format, password strength, phone number)
- **Loading States** and error handling
- **Responsive Design** for all screen sizes
- **Pull-to-Refresh** on all list screens

### 🖥️ Backend Features
- **RESTful API** with Express.js (22+ endpoints)
- **MongoDB** integration with Mongoose (3 models)
- **JWT Authentication** with 30-day token expiration
- **Password Hashing** using bcryptjs
- **Event Management** (CRUD operations)
- **RSVP System** with attendee tracking
- **Notification System** with multiple types
- **Role-Based Access Control** (Student, CR, Admin)
- **Input Validation** and error handling
- **CORS** enabled for cross-origin requests
- **Protected Routes** with JWT middleware
- **Comprehensive Error Messages**

## 🧩 Tech Stack

### Frontend
- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation library
- **React Native Paper** - UI component library
- **Axios** - HTTP client
- **AsyncStorage** - Local storage
- **Expo Vector Icons** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **cors** - Cross-Origin Resource Sharing
- **body-parser** - Request body parsing

## 📁 Project Structure

```
app2/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   └── authController.js    # Authentication logic
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification
│   ├── models/
│   │   └── Student.js           # Student schema
│   ├── routes/
│   │   └── authRoutes.js        # API routes
│   ├── .env                     # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # Entry point
│
└── frontend/
    ├── api/
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
http://localhost:5000/api
```

### Endpoints

#### 1. Register Student
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "usn": "1MS21CS001",
  "email": "john@example.com",
  "password": "SecurePass123",
  "year": 2,
  "semester": 4,
  "phone": "9876543210",
  "gender": "Male",
  "department": "Computer Science & Engineering"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "student": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "usn": "1MS21CS001",
      "email": "john@example.com",
      "year": 2,
      "semester": 4,
      "phone": "9876543210",
      "gender": "Male",
      "department": "Computer Science & Engineering"
    }
  }
}
```

#### 2. Login Student
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "student": { /* student data */ }
  }
}
```

#### 3. Get Profile (Protected)
```http
GET /auth/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "student": { /* student data */ }
  }
}
```

### Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Not authorized - Invalid token"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Server error during registration",
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

- [ ] Event browsing and registration
- [ ] Event creation (admin panel)
- [ ] QR code ticket generation
- [ ] Push notifications
- [ ] Payment integration
- [ ] Social media sharing
- [ ] Calendar integration
- [ ] Event reminders
- [ ] Certificate generation
- [ ] Analytics dashboard
- [ ] Dark mode support
- [ ] Multi-language support

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
# Install EAS CLI
npm install -g eas-cli

# Navigate to frontend
cd frontend

# Login to Expo
npx eas login

# Build APK
npx eas build -p android --profile preview
```

**Important:** Before building, deploy your backend online so the app works for all users!

📖 **[DEPLOY_BACKEND.md](DEPLOY_BACKEND.md)** - Backend deployment guide

## �📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

- **SammyBoy-09** - Samuel Lazar
- **CampusConnect Team** - Initial work

## 🙏 Acknowledgments

- React Native documentation
- Express.js community
- MongoDB Atlas
- Expo team
- All open-source contributors

## 📞 Support

For support, open an issue in the repository or check our detailed guides:
- [Building APK Guide](BUILD_APK_GUIDE.md)
- [Backend Deployment Guide](DEPLOY_BACKEND.md)
- [Backend Quick Start](backend/START_HERE.md)

---

**Made with ❤️ by CampusConnect Team**
