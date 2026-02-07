import { v2 as cloudinary } from 'cloudinary';

const connectCloudinary = async () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}


export const uploadToCloudinary = (fileBuffer, folder = 'artisan-connect') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto', // Automatically detect file type
        transformation: [
          { width: 1000, height: 1000, crop: 'limit' }, // Limit max dimensions
          { quality: 'auto' }, // Automatic quality optimization
          { fetch_format: 'auto' } // Automatic format selection
        ]
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export default connectCloudinary;