import { v2 as cloudinary } from 'cloudinary';

export const uploadToCloudinary = async (filePath, folder = 'resumes') => {
  // Configure at call time to ensure env vars are loaded
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  try {
    const result = await cloudinary.uploader.upload(filePath, { folder });
    return result;
  } catch (error) {
    throw new Error('Error uploading file to Cloudinary: ' + error.message);
  }
};
