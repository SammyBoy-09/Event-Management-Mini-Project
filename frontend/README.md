# Frontend Quick Start Guide

## Installation

```bash
cd frontend
npm install
```

## Configuration

Update API URL in `api/api.js`:

```javascript
// For Android Emulator
const API_BASE_URL = 'http://10.0.2.2:5000/api';

// For iOS Simulator  
const API_BASE_URL = 'http://localhost:5000/api';

// For Physical Device
const API_BASE_URL = 'http://YOUR_IP:5000/api';
```

## Run Application

```bash
npm start
```

Then:
- Press `a` for Android
- Press `i` for iOS
- Press `w` for web
- Scan QR code with Expo Go app

## Project Structure

```
frontend/
├── api/              # API configuration
├── components/       # Reusable components
├── constants/        # Theme, colors, typography
├── screens/          # App screens
└── App.js           # Main navigation
```

## Available Screens

1. **LandingPage** - Welcome screen
2. **LoginScreen** - User login
3. **RegisterScreen** - New user registration
4. **HomeScreen** - Dashboard after login

## Components

### Button
```jsx
<Button
  title="Click Me"
  onPress={() => {}}
  loading={false}
  variant="primary" // primary, secondary, outline
/>
```

### InputField
```jsx
<InputField
  label="Email"
  placeholder="Enter email"
  icon="mail-outline"
  value={email}
  onChangeText={setEmail}
  error={error}
/>
```

### LoadingSpinner
```jsx
<LoadingSpinner size="large" color={COLORS.primary} />
```

## Styling

### Colors
Access via `COLORS` from `constants/theme.js`:
- `COLORS.primary` - #6C63FF
- `COLORS.secondary` - #FF6584
- `COLORS.background` - #F8F9FE

### Typography
Access via `TYPOGRAPHY`:
- `TYPOGRAPHY.h1` - Large heading
- `TYPOGRAPHY.body1` - Body text
- `TYPOGRAPHY.caption` - Small text

### Spacing
Access via `SPACING`:
- `SPACING.sm` - 8px
- `SPACING.md` - 16px
- `SPACING.lg` - 24px

## Navigation

Uses React Navigation Stack:

```javascript
// Navigate to screen
navigation.navigate('Login');

// Go back
navigation.goBack();

// Replace screen (no back button)
navigation.replace('Home');
```

## AsyncStorage

Store data locally:

```javascript
// Save
await AsyncStorage.setItem('key', 'value');

// Get
const value = await AsyncStorage.getItem('key');

// Remove
await AsyncStorage.removeItem('key');
```

## API Methods

```javascript
import { registerStudent, loginStudent, getProfile } from './api/api';

// Register
const response = await registerStudent(userData);

// Login
const response = await loginStudent({ email, password });

// Get Profile
const response = await getProfile();
```

## Form Validation

### Email
```javascript
/\S+@\S+\.\S+/.test(email)
```

### Phone (10 digits)
```javascript
/^[0-9]{10}$/.test(phone)
```

### Password (strong)
```javascript
/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
```

## Common Issues

### Cannot connect to backend
- Check API_BASE_URL in api.js
- Ensure backend server is running
- For physical device, use computer's IP address

### Expo Go app not loading
- Ensure phone and computer are on same network
- Check firewall settings
- Try restarting Expo DevTools

### Build errors
```bash
# Clear cache
npm start -- --clear

# Or
expo start -c
```

## Building for Production

### Android APK
```bash
expo build:android
```

### iOS IPA
```bash
expo build:ios
```

### Using EAS Build
```bash
npm install -g eas-cli
eas build --platform android
```
