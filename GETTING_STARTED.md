# 🎯 CampusConnect - Getting Started Guide

Welcome to CampusConnect! This guide will help you get up and running in minutes.

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Dependencies

**Option A - Automatic (Recommended):**
```powershell
# Windows PowerShell
.\setup.ps1
```
```bash
# Mac/Linux Terminal
chmod +x setup.sh
./setup.sh
```

**Option B - Manual:**
```bash
# Install backend
cd backend
npm install

# Install frontend
cd ../frontend
npm install
```

### Step 2: Configure Backend

The `.env` file is already created in `backend/` folder with MongoDB connection. You're good to go!

**Optional:** Update these values:
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5000
```

### Step 3: Configure Frontend

Update the API URL in `frontend/api/api.js`:

```javascript
// Line 11-14
const API_BASE_URL = 'http://10.0.2.2:5000/api';  // Android Emulator
// OR
const API_BASE_URL = 'http://localhost:5000/api';  // iOS Simulator
// OR
const API_BASE_URL = 'http://YOUR_IP:5000/api';    // Physical Device
```

**To find your IP:**
- Windows: Run `ipconfig` in Command Prompt
- Mac/Linux: Run `ifconfig` in Terminal

### Step 4: Start Backend Server

```bash
cd backend
npm start
```

**You should see:**
```
🚀 Server running in development mode
🚀 Server started on port 5000
✅ MongoDB Connected: cluster0.wpnllx4.mongodb.net
```

### Step 5: Start Frontend App

**Open a new terminal:**
```bash
cd frontend
npm start
```

**You should see:**
```
› Metro waiting on exp://...
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

### Step 6: Run on Your Device

**Option A - Physical Device:**
1. Install **Expo Go** app from Play Store/App Store
2. Scan the QR code shown in terminal
3. Wait for the app to load

**Option B - Emulator:**
1. Press `a` for Android emulator
2. Press `i` for iOS simulator

**Option C - Web (limited features):**
1. Press `w` to open in browser

---

## 🎮 Using the App

### First Time User Flow

1. **Landing Page**
   - See welcome screen
   - Click "Create Account"

2. **Register Screen**
   - Fill all 9 fields:
     - Name: Your full name
     - USN: University Seat Number (e.g., 1MS21CS001)
     - Email: Your email
     - Password: At least 6 chars, include uppercase, lowercase, number
     - Confirm Password: Match the password
     - Year: Select 1-4
     - Semester: Select 1-8
     - Phone: 10 digit number
     - Gender: Male/Female/Other
     - Department: Select from dropdown
   - Click "Create Account"
   - On success, automatically logged in

3. **Home Screen**
   - See your profile
   - View dashboard
   - Access quick actions
   - Click logout icon (top right) to logout

### Returning User Flow

1. **Landing Page**
   - Click "Login"

2. **Login Screen**
   - Enter email
   - Enter password
   - Click "Login"
   - On success, navigate to Home

---

## 🧪 Testing the App

### Test Case 1: Registration
```
Name: John Doe
USN: TEST001
Email: john@test.com
Password: Test@123
Confirm Password: Test@123
Year: 2
Semester: 4
Phone: 9876543210
Gender: Male
Department: Computer Science & Engineering
```

**Expected:** Success message → Navigate to Home → See profile

### Test Case 2: Login
```
Email: john@test.com
Password: Test@123
```

**Expected:** Success message → Navigate to Home → See profile

### Test Case 3: Validation Errors

**Try these to see validation:**
- Empty email → "Email is required"
- Invalid email → "Email is invalid"
- Short password → "Password must be at least 6 characters"
- Weak password → "Password must contain uppercase, lowercase, and number"
- Mismatched passwords → "Passwords do not match"
- Invalid phone → "Phone number must be 10 digits"

---

## 🔍 Troubleshooting

### Problem: Cannot connect to backend

**Symptoms:**
- Login/Register fails
- "Network Error" message

**Solutions:**
1. Check if backend server is running (see terminal)
2. Verify API_BASE_URL in `frontend/api/api.js`
3. For physical device:
   - Use your computer's IP address
   - Ensure phone and computer on same WiFi
   - Check firewall settings

### Problem: MongoDB connection error

**Symptoms:**
- Backend shows "MongoDB Connection Error"

**Solutions:**
1. Check internet connection
2. Verify MONGO_URI in `.env` is correct
3. Ensure IP is whitelisted in MongoDB Atlas:
   - Go to MongoDB Atlas
   - Network Access → Add IP Address
   - Add current IP or allow from anywhere (0.0.0.0/0)

### Problem: Expo app not loading

**Symptoms:**
- QR code scanned but app doesn't load
- "Cannot connect to Metro" error

**Solutions:**
1. Ensure phone and computer on same network
2. Restart Expo server: `npm start -- --clear`
3. Try different connection type (Tunnel/LAN/Local)
4. Check firewall allows connections

### Problem: Build errors

**Symptoms:**
- App won't start
- Dependency errors

**Solutions:**
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules
npm install
npm start -- --clear
```

---

## 📱 Device-Specific Setup

### Android Emulator (Android Studio)

1. Install Android Studio
2. Create AVD (Android Virtual Device)
3. Start emulator
4. In terminal, press `a`

**API URL:** `http://10.0.2.2:5000/api`

### iOS Simulator (Mac only)

1. Install Xcode
2. In terminal, press `i`

**API URL:** `http://localhost:5000/api`

### Physical Android Device

1. Install Expo Go from Play Store
2. Enable Developer Mode on phone
3. Scan QR code
4. Update API URL to your computer's IP

**API URL:** `http://192.168.x.x:5000/api`

### Physical iOS Device

1. Install Expo Go from App Store
2. Open Camera app
3. Scan QR code
4. Update API URL to your computer's IP

**API URL:** `http://192.168.x.x:5000/api`

---

## 🎨 Understanding the UI

### Color System

The app uses a consistent color palette:

- **Purple (#6C63FF)**: Primary actions, headers
- **Coral (#FF6584)**: Secondary actions, accents
- **Teal (#4ECDC4)**: Success states, tertiary actions
- **White (#FFFFFF)**: Cards, surfaces
- **Light Blue (#F8F9FE)**: Background
- **Dark Gray (#2D3748)**: Text

### Typography

- **H1 (32px)**: Page titles
- **H2 (28px)**: Section titles
- **H3 (24px)**: Card titles
- **Body (16px)**: Regular text
- **Caption (12px)**: Helper text

---

## 🔐 Security Best Practices

### For Development

Current setup is fine for development.

### For Production

**Must Change:**
1. JWT_SECRET in `.env` → Use strong random string
2. MongoDB password → Use strong password
3. API URL → Use production backend URL
4. CORS origins → Restrict to your domain only

**Recommended:**
1. Enable MongoDB authentication
2. Use HTTPS for API
3. Implement rate limiting
4. Add request logging
5. Set up monitoring

---

## 📚 Learning Resources

### React Native
- [Official Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)

### Node.js & Express
- [Express Guide](https://expressjs.com/en/guide/routing.html)
- [Node.js Docs](https://nodejs.org/en/docs/)

### MongoDB
- [MongoDB University](https://university.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/)

### JWT
- [JWT.io](https://jwt.io/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

---

## 🎯 Next Steps

After getting the app running:

1. ✅ Test all features (register, login, profile)
2. ✅ Explore the code structure
3. ✅ Read ARCHITECTURE.md for deep dive
4. ✅ Try modifying colors in theme.js
5. ✅ Add a new field to registration
6. ✅ Create a new screen
7. ✅ Add a new API endpoint

---

## 💡 Pro Tips

1. **Keep backend running** while developing frontend
2. **Use console.log** liberally for debugging
3. **Check terminal** for error messages
4. **Use React DevTools** for component inspection
5. **Test on real device** for best experience
6. **Git commit frequently** to track changes
7. **Read error messages** carefully - they're helpful!

---

## 🆘 Need Help?

1. Check this guide first
2. See README.md for detailed info
3. Check ARCHITECTURE.md for technical details
4. Review code comments
5. Search error messages online
6. Ask in React Native community

---

## ✅ Checklist

Before considering the setup complete:

- [ ] Backend server running without errors
- [ ] Frontend app loads in Expo
- [ ] Can register a new user
- [ ] Can login with credentials
- [ ] Can see profile on home screen
- [ ] Can logout successfully
- [ ] Validation works on all fields
- [ ] Error messages display properly
- [ ] UI looks good on your device

---

**🎉 Congratulations!** You're all set up and ready to build amazing features!

**Happy Coding! 🚀**
