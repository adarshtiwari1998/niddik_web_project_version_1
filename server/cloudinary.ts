
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create storage engine for CV uploads
const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cv_upload',
    resource_type: 'auto',
    allowed_formats: ['pdf', 'doc', 'docx'],
    transformation: [{ quality: 'auto' }],
    // Enhanced public access settings
    public_id: (req, file) => `cv_${Date.now()}`,
    access_mode: 'public',
    folder_access_mode: 'public',
    access_control: { access_type: 'public' },
    use_filename: true,
    unique_filename: true,
    overwrite: true,
    type: 'upload',
    resource_options: {
      type: 'upload',
      access_mode: 'public',
      access_control: 'public'
    }
  } as any
});

// Create the multer upload instance for CVs
export const resumeUpload = multer({ 
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

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
