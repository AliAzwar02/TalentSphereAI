import { uploadToCloudinary } from '../utils/upload.js';

export const handleFileUpload = async (req, res, next) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const file = req.files.file;
    const result = await uploadToCloudinary(file.tempFilePath);

    req.file = {
      cloudinaryUrl: result.secure_url,
    };

    next();
  } catch (error) {
    next(error);
  }
};