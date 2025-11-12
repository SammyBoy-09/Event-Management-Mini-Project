# CampusConnect Logo Design Guide

## Design Concept
Create a modern, professional logo for CampusConnect Event Management App

### Visual Elements
1. **Calendar/Event Symbol** - Represents event management
2. **Connection/Network Symbol** - Represents campus connectivity
3. **Modern & Clean** - Appeals to students and administrators

## Suggested Design Options

### Option 1: Calendar + Connection
- Central element: Stylized calendar icon
- Around it: Connection nodes or dots forming a network
- Colors: Purple gradient (#6C63FF to #8A84FF)

### Option 2: Letter C + Event
- Large "C" (for CampusConnect)
- Inside the C: Small calendar or ticket icon
- Minimalist and bold

### Option 3: Abstract Campus
- Geometric buildings/campus silhouette
- Event pin/marker on top
- Purple and coral accent (#FF6584)

## Color Specifications

### Primary Colors
- **Main Purple**: #6C63FF
- **Light Purple**: #8A84FF
- **Coral Accent**: #FF6584
- **White**: #FFFFFF

### Gradients (Optional)
- Linear: #6C63FF → #FF6584
- Radial: #6C63FF center, #8A84FF edges

## Technical Requirements

### App Icon (icon.png)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Shape**: Square (no rounded corners - OS handles this)
- **Safe Zone**: Keep important elements within central 80%
- **Background**: Transparent OR solid #6C63FF

### Primary Colors
- **Main Purple**: #6C63FF
- **Light Purple**: #8A84FF
- **Coral Accent**: #FF6584
- **White**: #FFFFFF

### Gradients (Optional)
- Linear: #6C63FF → #FF6584
- Radial: #6C63FF center, #8A84FF edges

## Technical Requirements

### App Icon (icon.png)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Shape**: Square (no rounded corners - OS handles this)
- **Safe Zone**: Keep important elements within central 80%
- **Background**: Transparent OR solid #6C63FF

### Android Adaptive Icon (adaptive-icon.png)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Safe Zone**: Keep logo within central 66% (660x660px circle)
- **Background**: Transparent (uses backgroundColor from app.json)

## Design Tools & Resources

### Online Tools (Free)
1. **Canva** (canva.com)
   - Use "App Icon" template (1024x1024)
   - Search "Calendar" or "Event" icons
   - Apply purple color scheme

2. **Figma** (figma.com)
   - Create 1024x1024 frame
   - Use vector shapes
   - Export as PNG

3. **LogoMakr** (logomakr.com)
   - Quick logo creation
   - Basic shapes and icons
   - Download PNG

### Icon Libraries
- **Ionicons** - icons.expo.fyi (matches your app's icon set)
- **Font Awesome** - fontawesome.com
- **Flaticon** - flaticon.com (free icons)

## Recommended Simple Approach

### Quick Option: Text + Icon
1. Create 1024x1024 canvas in Canva/Figma
2. Set background: #6C63FF (purple)
3. Add white calendar icon (large, centered)
4. Add "CC" text in white, bold font below icon
5. Optional: Add subtle gradient overlay

### Professional Option: Hire Designer
- **Fiverr**: $5-25 for logo design
- **99designs**: Contest-based, higher quality
- Provide this guide as a brief

## Installation Steps

Once you have your logo files:

1. Place files in `frontend/assets/` folder:
   - icon.png (1024x1024)
   - splash.png (1200x1200)
   - adaptive-icon.png (1024x1024)

2. Update app.json (see LOGO_SETUP_INSTRUCTIONS.md)

3. Test the logo:
   ```bash
   npx expo start --clear
   ```

4. Build new APK with logo:
   ```bash
   eas build --platform android --profile production
   ```

## Design Inspiration

### Similar Apps
- Eventbrite (colorful, friendly)
- Meetup (community-focused)
- Google Calendar (clean, professional)

### Color Psychology
- **Purple (#6C63FF)**: Trust, creativity, innovation
- **Coral (#FF6584)**: Energy, excitement, youth
- Combination: Modern, vibrant, campus-appropriate

## Need Help?

If you want a simple placeholder logo quickly:
1. Go to Canva.com
2. Search "App Icon Purple"
3. Pick a template with calendar/event theme
4. Change colors to match (#6C63FF, #FF6584)
5. Download as PNG (1024x1024)
6. Also export at 1200x1200 for splash

## Examples of Good Logos

**Characteristics:**
✅ Recognizable at small sizes (48x48px)
✅ Works in both light and dark themes
✅ Single focal point
✅ Limited color palette (2-3 colors)
✅ No small text/details

**Avoid:**
❌ Photos or complex images
❌ Too many colors
❌ Small text that's unreadable when scaled
❌ Super detailed illustrations
