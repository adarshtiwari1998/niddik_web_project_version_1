
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Log configuration (development purposes)
console.log('Cloudinary configuration:', {
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key,
});

// Create storage engine for resume uploads
const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'resumes',
    resource_type: 'raw',
    type: 'upload',
    format: async (req, file) => file.originalname.split('.').pop() || 'pdf',
    public_id: (req, file) => `resume_${Date.now()}`,
    allowed_formats: ['pdf', 'doc', 'docx'],
    access_mode: 'public'
  }
});

// Create the multer upload instance for resumes
export const resumeUpload = multer({ 
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Function to get configured storage for different purposes
export const getCloudinaryStorage = (
  folder: string,
  format = 'png',
  publicIdPrefix = '',
  isProtected = false
) => {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder,
      resource_type: 'image',
      type: isProtected ? 'private' : 'upload',
      format: async (req, file) => format,
      public_id: (req, file) => `${publicIdPrefix}_${Date.now()}`
    }
  });
};

// Function to delete file from Cloudinary
export const deleteFile = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    return false;
  }
};

export { cloudinary };
