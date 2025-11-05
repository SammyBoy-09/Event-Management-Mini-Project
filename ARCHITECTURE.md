# CampusConnect Event Management App
# Architecture & Development Guide

## System Architecture

### High-Level Overview

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  React Native   │◄───────►│   Node.js API    │◄───────►│   MongoDB       │
│   (Frontend)    │  HTTP   │   (Backend)      │  ODM    │   (Database)    │
│                 │  JWT    │                  │ Mongoose│                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

### Technology Stack Layers

```
┌────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                   │
│  React Native | Expo | React Navigation | Paper UI     │
└────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────┐
│                    API LAYER                            │
│        Axios | AsyncStorage | JWT Storage              │
└────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                    │
│  Express.js | Routes | Controllers | Middleware        │
└────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────┐
│                    DATA ACCESS LAYER                    │
│           Mongoose ODM | MongoDB Driver                 │
└────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────┐
│                    DATA LAYER                           │
│              MongoDB Atlas (Cloud Database)             │
└────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
User Input (Login/Register)
        ↓
Frontend Validation
        ↓
API Request (POST /api/auth/login or /register)
        ↓
Backend Validation
        ↓
Password Hashing (Register) or Comparison (Login)
        ↓
Generate JWT Token
        ↓
Return Token + User Data
        ↓
Store in AsyncStorage
        ↓
Auto-attach to subsequent requests
        ↓
Access Protected Routes
```

## Data Flow

### Registration Flow
```
1. User fills registration form
2. Frontend validates input
3. POST request to /api/auth/register
4. Backend validates data
5. Check if email/USN exists
6. Hash password with bcrypt
7. Create student document in MongoDB
8. Generate JWT token
9. Return token + student data
10. Store token in AsyncStorage
11. Navigate to HomeScreen
```

### Login Flow
```
1. User enters credentials
2. Frontend validates input
3. POST request to /api/auth/login
4. Backend finds user by email
5. Compare password with bcrypt
6. Generate JWT token
7. Return token + student data
8. Store token in AsyncStorage
9. Navigate to HomeScreen
```

### Protected Route Access
```
1. User requests protected resource
2. Axios interceptor adds JWT from AsyncStorage
3. Request sent with Authorization header
4. Backend middleware verifies JWT
5. If valid, attach user to request
6. Continue to route handler
7. Return requested data
```

## Database Schema Design

### Student Collection
```javascript
{
  _id: ObjectId("..."),
  name: "John Doe",
  usn: "1MS21CS001",
  email: "john@example.com",
  password: "$2a$10$hashed...",  // Hashed with bcrypt
  year: 2,
  semester: 4,
  phone: "9876543210",
  gender: "Male",
  department: "Computer Science & Engineering",
  registeredEvents: [
    ObjectId("event1"),
    ObjectId("event2")
  ],
  createdAt: ISODate("2025-11-03T..."),
  updatedAt: ISODate("2025-11-03T...")
}
```

### Indexes
```javascript
// For faster queries
email: 1 (unique)
usn: 1 (unique)
```

## API Design Patterns

### RESTful Conventions
```
POST   /api/auth/register    - Create new student
POST   /api/auth/login        - Authenticate student
GET    /api/auth/profile      - Get current user (protected)
```

### Request/Response Format
```javascript
// Success Response
{
  success: true,
  message: "Operation successful",
  data: { /* actual data */ }
}

// Error Response
{
  success: false,
  message: "Error description",
  error: "Technical details" // Only in development
}
```

## Security Implementation

### Password Security
- **Hashing Algorithm:** bcryptjs
- **Salt Rounds:** 10
- **Storage:** Never store plain text
```javascript
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
```

### JWT Security
- **Algorithm:** HS256
- **Expiration:** 30 days
- **Storage:** AsyncStorage (frontend)
- **Transmission:** Bearer token in Authorization header
```javascript
const token = jwt.sign({ id: student._id }, JWT_SECRET, {
  expiresIn: '30d'
});
```

### Input Validation
- **Frontend:** Real-time validation
- **Backend:** Mongoose schema validation
- **Sanitization:** Trim, lowercase (email), uppercase (USN)

## Frontend Architecture

### Component Hierarchy
```
App.js (Navigation Container)
  ├── LandingPage
  ├── LoginScreen
  ├── RegisterScreen
  └── HomeScreen
      └── Components (Button, InputField, etc.)
```

### State Management
- **Local State:** useState for component-level state
- **Persistent State:** AsyncStorage for auth data
- **Future:** Context API or Redux for global state

### Navigation Structure
```javascript
Stack Navigator
  ├── Landing (initial)
  ├── Login
  ├── Register
  └── Home (protected)
```

## Backend Architecture

### Layered Architecture
```
Routes → Controllers → Models → Database
  ↑          ↑
Middleware  Validation
```

### Request Lifecycle
```
1. Request arrives at Express
2. CORS middleware
3. Body parser middleware
4. Route matching
5. Auth middleware (if protected)
6. Controller function
7. Model operations
8. Response formatting
9. Error handling (if any)
10. Send response
```

## Error Handling Strategy

### Frontend
```javascript
try {
  const response = await apiCall();
  // Handle success
} catch (error) {
  // Show user-friendly error
  Alert.alert('Error', error.message);
}
```

### Backend
```javascript
// Controller level
try {
  // Operation
} catch (error) {
  res.status(500).json({
    success: false,
    message: 'User-friendly message',
    error: process.env.NODE_ENV === 'development' ? error.message : {}
  });
}
```

## Performance Optimization

### Database
- Indexes on frequently queried fields
- Mongoose lean queries for read-only data
- Connection pooling

### Frontend
- Component memoization (React.memo)
- Lazy loading screens
- Image optimization
- Debounced API calls

### Backend
- Response compression
- Caching strategies (future)
- Rate limiting (future)

## Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# Test locally

# Commit
git commit -m "Add new feature"

# Push
git push origin feature/new-feature

# Create pull request
```

### 2. Testing Checklist
- [ ] Frontend validation works
- [ ] API endpoint responds correctly
- [ ] Database updates properly
- [ ] Error handling works
- [ ] UI is responsive
- [ ] No console errors

### 3. Deployment Steps
1. Update environment variables
2. Build frontend (expo build)
3. Deploy backend (Heroku, AWS, etc.)
4. Update API URL in frontend
5. Test production build

## Scalability Considerations

### Current Limitations
- No horizontal scaling strategy
- No caching layer
- No CDN for assets
- Single database instance

### Future Improvements
- Load balancing
- Redis caching
- CDN integration
- Database replication
- Microservices architecture

## Monitoring & Logging

### Current Setup
- Console logs in development
- Basic error logging

### Recommended Additions
- Winston for structured logging
- Sentry for error tracking
- Morgan for HTTP logging
- PM2 for process management

## Code Quality Standards

### Naming Conventions
- **Variables:** camelCase
- **Functions:** camelCase
- **Components:** PascalCase
- **Constants:** UPPER_SNAKE_CASE
- **Files:** PascalCase (components), camelCase (utilities)

### Code Organization
- One component per file
- Separate concerns (components, screens, utils)
- Reusable components in /components
- API calls in /api
- Constants in /constants

### Comments
- JSDoc for functions
- Inline comments for complex logic
- README for each major directory

## Testing Strategy (Future)

### Unit Tests
- Component testing (Jest + React Testing Library)
- API endpoint testing (Supertest)
- Model validation testing

### Integration Tests
- Authentication flow
- API integration
- Database operations

### E2E Tests
- User registration flow
- Login flow
- Protected route access

## Maintenance Guide

### Regular Tasks
- Update dependencies monthly
- Review security vulnerabilities
- Optimize slow queries
- Clean up unused code
- Update documentation

### Monitoring Checklist
- Server uptime
- API response times
- Error rates
- Database performance
- User feedback

---

**Version:** 1.0.0  
**Last Updated:** November 3, 2025  
**Maintained by:** CampusConnect Team
