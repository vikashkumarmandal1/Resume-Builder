# Photo Upload Feature - Cloudinary Setup Guide

## Overview
The photo upload feature allows users to upload their profile photo to Cloudinary and display it in their resume and portfolio templates.

## Backend Setup

### 1. Environment Variables
Add these to your `.env` file in the backend directory:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Get Cloudinary Credentials
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Navigate to your Dashboard
4. Copy your:
   - Cloud Name
   - API Key
   - API Secret

### 3. Installed Packages
The following packages have been added to the backend:
- `cloudinary` - For uploading images
- `multer` - For handling file uploads

## Features

### Upload API Endpoint
**POST** `/api/upload/profile-photo`
- Accepts FormData with:
  - `photo`: Image file (max 5MB, images only)
  - `dossierId`: The dossier ID to associate the photo with
- Returns: `{ success: true, photoUrl: "https://..." }`

### Delete API Endpoint
**DELETE** `/api/upload/profile-photo/:dossierId`
- Removes the profile photo from Cloudinary and the dossier
- Returns: `{ success: true, message: "Photo deleted successfully" }`

## Frontend Implementation

### Changes to `StepProfile.jsx`
- Added photo upload UI with preview
- Display current photo with delete button
- Upload indicator with error handling
- File size and format information

### Portfolio Display
The profile photo is automatically displayed in these portfolio templates:
1. **PortfolioMinimal** - Hero section with photo
2. **PortfolioCreative** - Circular photo in about section
3. **DeveloperDark** - Large photo background in hero section

## Data Model
The `photoUrl` field has been added to the profile schema in the Dossier model:
```javascript
profile: {
  name: String,
  email: String,
  phone: String,
  location: String,
  cognizantId: String,
  role: String,
  track: String,
  linkedIn: String,
  github: String,
  photoUrl: String,  // New field for profile photo
}
```

## Usage Flow

1. **User navigates to Profile step** in the builder
2. **Clicks "Choose Photo"** to select an image
3. **Image is uploaded** to Cloudinary via API
4. **Photo URL is saved** to dossier profile
5. **Photo displays** in all portfolio templates
6. **User can delete** the photo with the X button

## Error Handling
- File validation: Only image files allowed
- Size limit: 5MB maximum
- Network errors are displayed to the user
- Old photos are automatically deleted when a new one is uploaded

## Notes
- Photos are stored in a dedicated folder: `resume-builder/profile-photos/`
- Public IDs are generated with user ID and timestamp for uniqueness
- The feature requires authentication (Bearer token in Authorization header)
