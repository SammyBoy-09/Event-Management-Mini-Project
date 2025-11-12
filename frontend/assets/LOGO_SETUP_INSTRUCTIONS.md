# Logo Setup Instructions

## Step-by-Step Guide to Add Your Logo

### 1. Create Your Logo Images

You need 3 images:

#### icon.png
- **Size**: 1024x1024 pixels
- **Purpose**: App icon (home screen)
- **Location**: `frontend/assets/icon.png`

#### splash.png
- **Size**: 1200x1200 pixels  
- **Purpose**: Splash screen when app opens
- **Location**: `frontend/assets/splash.png`

#### adaptive-icon.png
- **Size**: 1024x1024 pixels
- **Purpose**: Android adaptive icon (foreground layer)
- **Location**: `frontend/assets/adaptive-icon.png`

---

### 2. Quick Temporary Logo (For Testing)

If you want to test NOW before creating a proper logo, you can use this placeholder:

**Option A: Use Expo's default**
```bash
# Download Expo's default icon
# Or copy any 1024x1024 image to assets/icon.png
```

**Option B: Create simple colored square**
1. Go to: https://dummyimage.com/1024x1024/6C63FF/ffffff&text=CC
2. Save as `icon.png`
3. Copy to `frontend/assets/icon.png`
4. Copy same file as `splash.png` and `adaptive-icon.png`

---

### 3. Place Your Files

After creating/downloading your logo files:

```
frontend/
  assets/
    ├── icon.png           ← 1024x1024 app icon
    ├── splash.png         ← 1200x1200 splash screen
    └── adaptive-icon.png  ← 1024x1024 android adaptive icon
```

---

### 4. app.json Configuration

Your `frontend/app.json` should have been updated to:

```json
{
  "expo": {
    "name": "CampusConnect",
    "slug": "campusconnect",
    "version": "1.0.0",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#6C63FF"
    },
    "android": {
      "icon": "./assets/icon.png",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#6C63FF"
      }
    },
    "ios": {
      "icon": "./assets/icon.png"
    }
  }
}
```

---

### 5. Test Your Logo

```powershell
# Clear cache and restart
cd frontend
npx expo start --clear

# The app should now show your logo
```

---

### 6. Build APK with Logo

```powershell
# For EAS build
eas build --platform android --profile production

# For local build (after expo prebuild)
cd android
./gradlew assembleRelease
```

---

## Troubleshooting

### Logo Not Showing?
1. Check file names match exactly (case-sensitive)
2. Ensure files are in `frontend/assets/` folder
3. Clear Expo cache: `npx expo start --clear`
4. Check image dimensions: `1024x1024` for icons

### Splash Screen Issues?
- Ensure `splash.png` is `1200x1200` or larger
- Check `backgroundColor` in app.json matches your design
- Use `"resizeMode": "contain"` to prevent cropping

### Android Adaptive Icon Not Working?
- Ensure logo is centered in `adaptive-icon.png`
- Keep important elements within central 66% (safe zone)
- Test on different Android devices (shapes vary)

---

## Quick Testing Without Building

To see how your icon looks:

1. **In Expo Go**:
   - Open app in Expo Go
   - The icon won't show (Expo Go uses its own icon)
   - Splash screen WILL show

2. **In Standalone Build**:
   - Only way to see the home screen icon
   - Build APK or use Android Studio

---

## Recommended: Quick Logo Services

If you want a professional logo fast:

### Fiverr (Budget: $10-50)
1. Go to fiverr.com
2. Search "app icon design"
3. Show them the LOGO_DESIGN_GUIDE.md
4. Get files in 1-3 days

### DIY (Budget: Free, Time: 30 min)
1. Use Canva.com (free account)
2. Create "App Icon" project (1024x1024)
3. Use calendar icon + purple background
4. Export all 3 sizes

---

## Current Status

✅ Assets folder created
✅ app.json will be updated next
✅ Design guide provided
⏳ Logo images needed (you create these)

**Next Step**: Create or download your logo images and place them in `frontend/assets/`
