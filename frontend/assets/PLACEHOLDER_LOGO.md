# Quick Placeholder Logo Generator

## Instant Placeholder (5 seconds)

While you design your professional logo, use this temporary placeholder:

### Method 1: Download from URL

Open these URLs in your browser and save as:

1. **icon.png**
   ```
   https://dummyimage.com/1024x1024/6C63FF/ffffff&text=CC
   ```
   - Right-click → Save As → `icon.png`
   - Place in `frontend/assets/`

2. **splash.png**
   ```
   https://dummyimage.com/1200x1200/6C63FF/ffffff&text=CampusConnect
   ```
   - Right-click → Save As → `splash.png`
   - Place in `frontend/assets/`

3. **adaptive-icon.png**
   ```
   https://dummyimage.com/1024x1024/6C63FF/ffffff&text=CC
   ```
   - Same as icon.png
   - Save As → `adaptive-icon.png`
   - Place in `frontend/assets/`

### Method 2: Online Logo Maker (10 minutes)

**Quick Canva Logo:**
1. Go to: https://www.canva.com/create/logos/
2. Search "App Icon" template
3. Choose purple template
4. Add calendar icon (search "calendar" in elements)
5. Add "CC" or "CampusConnect" text
6. Download as PNG

**Sizes to download:**
- First download: 1024x1024 → Save as `icon.png` and `adaptive-icon.png`
- Second download: 1200x1200 → Save as `splash.png`

### Method 3: Use AI Logo Generator (2 minutes)

**Looka.com (Free trial):**
1. Go to https://looka.com
2. Enter "CampusConnect"
3. Select "Events" industry
4. Choose colors: Purple (#6C63FF), Coral (#FF6584)
5. Select logo you like
6. Download (free trial gives low-res)

---

## Professional Logo Design Prompt

If you're using Canva, Figma, or hiring a designer, use this prompt:

```
Create an app icon for "CampusConnect" - a campus event management app.

Requirements:
- Modern, minimalist design
- Square format, 1024x1024 pixels
- Primary color: Purple (#6C63FF)
- Accent color: Coral/Pink (#FF6584)
- Include calendar or event-related symbol
- Text: "CC" or small "CampusConnect" (optional)
- Background: Solid purple or purple gradient
- Icons/symbols in white or coral
- PNG with transparency or solid background

Style: Clean, professional, recognizable at small sizes (48px)
Inspiration: Modern SaaS apps, Google Calendar, Eventbrite
```

---

## Test Your Logo

After placing your logo files:

```powershell
cd frontend
npx expo start --clear
```

Press `a` to open Android, or scan QR code on your phone.

---

## Current Status

✅ Assets folder created  
✅ app.json configured  
✅ Logo paths set up  
⏳ **You need to**: Add 3 image files to `frontend/assets/`

**Files needed:**
- `icon.png` (1024x1024)
- `splash.png` (1200x1200)  
- `adaptive-icon.png` (1024x1024)

Use Method 1 above for instant placeholders!
