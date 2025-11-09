# Cloudinary Setup Guide

This guide will help you set up Cloudinary for event image uploads.

## What is Cloudinary?

Cloudinary is a cloud-based image and video management service. We use it to store event flyers, posters, and invitation images.

**Free Tier Benefits:**
- 25 GB storage
- 25 GB monthly bandwidth
- Automatic image optimization
- CDN delivery for fast loading

## Setup Steps

### 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Click **Sign Up for Free**
3. Choose one of these options:
   - Sign up with Google
   - Sign up with GitHub
   - Sign up with email
4. Complete the registration process

### 2. Get Your API Credentials

After logging in:

1. Go to your **Dashboard** (you'll see it immediately after logging in)
2. You'll see a section called **Account Details** with:
   - **Cloud Name**: Your unique cloud name (e.g., `dxxxxxx`)
   - **API Key**: A long number (e.g., `123456789012345`)
   - **API Secret**: A secret key (click the eye icon to reveal it)

### 3. Update Your `.env` File

Open your `backend/.env` file and update these values:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

Replace:
- `your_cloud_name_here` with your Cloud Name
- `your_api_key_here` with your API Key
- `your_api_secret_here` with your API Secret

**Example:**
```env
CLOUDINARY_CLOUD_NAME=dab12cd3e
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=AbCdEfGhIjKlMnOpQrStUvWxYz
```

### 4. Restart Your Server

After updating the `.env` file:

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm start
```

## Testing the Setup

### Using Postman or Thunder Client

1. **Get Authentication Token:**
   - Login to get a JWT token
   - POST to `/api/auth/login`

2. **Upload an Image:**
   - Method: `POST`
   - URL: `http://localhost:5000/api/events/upload-image`
   - Headers: 
     - `Authorization: Bearer YOUR_JWT_TOKEN`
   - Body: `form-data`
     - Key: `image` (type: File)
     - Value: Select an image file (JPEG, PNG, GIF, WebP)
   - Maximum file size: 5 MB

3. **Expected Response:**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/event-images/abc123.jpg",
    "publicId": "event-images/abc123"
  }
}
```

4. **Use the URL:**
   - Copy the `imageUrl` from the response
   - Use it when creating an event in the `image` field

## Image Specifications

### Supported Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### Automatic Optimizations
Images are automatically:
- Resized to maximum 1200x630 pixels (maintains aspect ratio)
- Optimized for quality
- Converted to the best format for the user's browser
- Stored in `event-images/` folder in your Cloudinary account

### File Size Limit
- Maximum: 5 MB per image
- Recommended: Keep images under 2 MB for best performance

## Viewing Your Uploads

1. Log in to [https://cloudinary.com](https://cloudinary.com)
2. Go to **Media Library**
3. Click on **event-images** folder
4. You'll see all uploaded event images

## Troubleshooting

### Error: "No image file provided"
- Make sure you're sending a file in the request body
- Key must be named `image`
- Must be form-data, not JSON

### Error: "Invalid credentials"
- Check your `.env` file
- Make sure there are no spaces around the values
- Verify credentials in Cloudinary dashboard
- Restart your server after updating `.env`

### Error: "File too large"
- Maximum file size is 5 MB
- Compress your image before uploading
- Use online tools like TinyPNG or Squoosh

### Error: "Invalid file type"
- Only JPEG, PNG, GIF, and WebP are supported
- Convert your image to a supported format

## Security Notes

⚠️ **Important:**
- Never commit your `.env` file to GitHub
- Keep your API Secret private
- The `.env` file is already in `.gitignore`
- Each developer should have their own Cloudinary account for development

## Next Steps

After setting up Cloudinary:
1. ✅ Backend is ready to receive image uploads
2. ⏳ Frontend needs to be updated with image picker
3. ⏳ Display images in event cards and details screens

---

**Need Help?**
- Cloudinary Documentation: https://cloudinary.com/documentation
- Support: https://support.cloudinary.com
