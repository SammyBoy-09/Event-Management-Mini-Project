# Backend Quick Start Guide

## Installation

```bash
cd backend
npm install
```

## Environment Setup

Create a `.env` file with:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

## Run Development Server

```bash
npm start
```

For auto-reload during development:
```bash
npm run dev
```

## Test API Endpoints

### Health Check
```bash
curl http://localhost:5000
```

### Register Student
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "usn": "TEST001",
    "email": "test@example.com",
    "password": "Test@123",
    "year": 2,
    "semester": 4,
    "phone": "9876543210",
    "gender": "Male",
    "department": "Computer Science"
  }'
```

### Login Student
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }'
```

### Get Profile (replace TOKEN with actual JWT)
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

## Database Schema

### Student Model
```javascript
{
  name: String (required, 2-100 chars),
  usn: String (required, unique, uppercase),
  email: String (required, unique, valid email),
  password: String (required, hashed, min 6 chars),
  year: Number (required, 1-4),
  semester: Number (required, 1-8),
  phone: String (required, 10 digits),
  gender: String (required, Male/Female/Other),
  department: String (required),
  registeredEvents: [ObjectId] (ref: Event),
  createdAt: Date,
  updatedAt: Date
}
```

## Common Issues

### MongoDB Connection Error
- Check if MongoDB URI is correct
- Ensure IP is whitelisted in MongoDB Atlas
- Verify network connection

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

### JWT Token Issues
- Ensure JWT_SECRET is set in .env
- Token expires after 30 days
- Check Authorization header format: "Bearer <token>"
