# 🚀 Backend Server - Quick Start Guide

## ⚡ How to Start the Backend

### Option 1: Using npm (Recommended)
```bash
cd backend
npm start
```

### Option 2: Using PowerShell Script
```powershell
powershell -File "backend/start-server.ps1"
```

### Option 3: Direct Node
```bash
cd backend
node server.js
```

## ✅ Server Started Successfully When You See:
```
🚀 ==========================================
🚀 Server running in development mode
🚀 Server started on port 5000
🚀 API URL: http://localhost:5000
🚀 Network URL: http://192.168.x.x:5000
🚀 ==========================================
✅ MongoDB Connected
📊 Database: test
```

## 🔧 Troubleshooting

### Port 5000 Already in Use?
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
Stop-Process -Id <PID> -Force
```

### Can't Connect from Mobile Device?
1. ✅ Ensure computer and device are on the **same WiFi network**
2. ✅ Check Windows Firewall - allow Node.js
3. ✅ Verify IP address: run `ipconfig` and check IPv4 Address
4. ✅ Frontend will auto-detect the IP address

### MongoDB Connection Issues?
1. ✅ Check `.env` file has correct `MONGO_URI`
2. ✅ Verify internet connection
3. ✅ Check MongoDB Atlas whitelist (allow 0.0.0.0/0 for development)

## 📡 API Base URL

The frontend now **automatically detects** your IP address!

- **Physical Device**: Auto-detected from Expo
- **Android Emulator**: `http://10.0.2.2:5000/api`
- **iOS Simulator**: `http://localhost:5000/api`

No more hardcoded IP addresses! 🎉

## 🌐 Network Access

The server listens on `0.0.0.0:5000`, accessible from:
- ✅ Localhost: `http://localhost:5000`
- ✅ Network: `http://<your-ip>:5000`
- ✅ Physical devices on same WiFi
- ✅ Emulators and simulators

## 📚 Key Features

✅ **Auto-network binding** - Works on any network
✅ **MongoDB Atlas** - Cloud database
✅ **JWT Authentication** - Secure token-based auth
✅ **CORS Enabled** - Works with React Native
✅ **Error Handling** - Won't crash in development
✅ **Request Logging** - See all API calls

## 🔐 Environment Variables

Check `.env` file:
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=campusconnect_secret_key_2025_secure
PORT=5000
NODE_ENV=development
```

## 📱 Testing with Frontend

1. Start backend: `npm start`
2. Keep the terminal window open
3. Start frontend: `cd ../frontend && npm start`
4. Scan QR code with Expo Go
5. Frontend auto-connects to backend! ✨

---

**Ready to go!** Just run `npm start` and keep the terminal open.
