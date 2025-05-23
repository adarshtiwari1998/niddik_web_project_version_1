
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
    folder: 'public',
    resource_type: 'raw',
    allowed_formats: ['pdf', 'doc', 'docx'],
    public_id: (req, file) => {
      const timestamp = Date.now();
      const extension = file.originalname.split('.').pop();
      const filename = file.originalname.replace(`.${extension}`, '');
      return `${filename}_${timestamp}.${extension}`;
    },
    use_filename: true,
    unique_filename: true,
    overwrite: true,
    access_mode: 'public',
    type: 'upload',
    resource_type: 'raw',
    folder_access_mode: 'public',
    resource_options: {
      type: 'upload',
      access_mode: 'public',
      folder_access_mode: 'public'
    },
    overwrite: true,
    use_filename: true,
    folder_access_mode: 'public'
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
