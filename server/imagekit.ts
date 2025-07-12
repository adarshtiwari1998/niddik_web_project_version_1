import ImageKit from 'imagekit';
import multer from 'multer';

// Configure ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || ''
});

// Create memory storage for logo uploads
const storage = multer.memoryStorage();

export const logoUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    // Accept image files only
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, WebP and SVG files are allowed.'));
    }
  }
});

// Function to upload buffer to ImageKit
export async function uploadLogoToImageKit(buffer: Buffer, filename: string, folder: string = 'company-logos'): Promise<string> {
  try {
    const timestamp = Date.now();
    const nameWithoutExt = filename.split('.')[0];
    const extension = filename.split('.').pop() || 'png';
    const fileName = `${folder}_${timestamp}_${nameWithoutExt}.${extension}`;

    const result = await imagekit.upload({
      file: buffer,
      fileName: fileName,
      folder: `Niddik-Assets/${folder}`,
      useUniqueFileName: true,
      transformation: {
        pre: 'w-150,h-75,c-at_max'
      }
    });

    return result.url;
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw new Error('Failed to upload logo to ImageKit');
  }
}

export { imagekit };