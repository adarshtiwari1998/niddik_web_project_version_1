import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create storage engine for uploads
const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
//   params: {
//     folder: 'public',
//     resource_type: 'auto',
//     public_id: (req, file) => {
//       const timestamp = Date.now();
//       return `resume_${timestamp}`;
//     }
//   }
// });
    params: {
      folder: 'Niddik-Assets/cv-data',
      public_id: (req, file) => `cv-data_${Date.now()}`,
    },
  });

// Create the multer upload instance
export const resumeUpload = multer({ 
  storage: resumeStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});


export { cloudinary };