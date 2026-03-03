import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadPhotoToCloudinary(fileBuffer, fileName) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'resume-builder/profile-photos',
        resource_type: 'auto',
        public_id: `${fileName}-${Date.now()}`,
        overwrite: false,
      },
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}

export async function deletePhotoFromCloudinary(photoUrl) {
  try {
    // Extract public_id from the URL
    const urlParts = photoUrl.split('/');
    const fileName = urlParts[urlParts.length - 1].split('.')[0];
    const publicId = `resume-builder/profile-photos/${fileName}`;

    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
}
