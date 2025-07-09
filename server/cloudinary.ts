
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create memory storage for initial file processing
const memoryStorage = multer.memoryStorage();

// Create the multer upload instance with memory storage
export const resumeUpload = multer({ 
  storage: memoryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    console.log('File filter check:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    // Accept pdf, doc, docx files with various MIME types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-word', // Alternative DOC MIME type
      'application/doc', // Alternative DOC MIME type
      'application/ms-word', // Alternative DOC MIME type
      'application/x-msword' // Alternative DOC MIME type
    ];
    
    // Also check by file extension as a fallback
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    
    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension || '')) {
      console.log('File accepted');
      cb(null, true);
    } else {
      console.log('File rejected - invalid type');
      cb(new Error(`Invalid file type. Only PDF, DOC and DOCX files are allowed. Received: ${file.mimetype}`));
    }
  }
});

// Function to upload buffer to Cloudinary
export async function uploadToCloudinary(buffer: Buffer, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now();
    const nameWithoutExt = filename.split('.')[0];
    const extension = filename.split('.').pop() || 'pdf';
    const publicId = `cv-data_${timestamp}_${nameWithoutExt}`;
    
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'Niddik-Assets/cv-data',
        resource_type: 'raw',
        public_id: publicId,
        format: extension,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        access_mode: 'public'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else if (result) {
          console.log('Cloudinary upload successful:', result.secure_url);
          resolve(result.secure_url);
        } else {
          reject(new Error('No result from Cloudinary'));
        }
      }
    );
    
    uploadStream.end(buffer);
  });
}

// Create storage engine for SEO meta assets (images)
const seoMetaStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'Niddik-Assets/seo-meta',
    resource_type: 'image',
    type: 'upload',
    delivery_type: 'upload',
    access_mode: 'public',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    public_id: (req, file) => {
      const timestamp = Date.now();
      const extension = file.originalname.split('.').pop() || '';
      const nameWithoutExt = file.originalname.split('.')[0];
      return `seo-meta_${timestamp}_${nameWithoutExt}`;
    }
  }
});

// Create the multer upload instance for SEO meta assets
export const seoMetaUpload = multer({ 
  storage: seoMetaStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept image files
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, WebP and SVG files are allowed.'));
    }
  }
});

export { cloudinary };
