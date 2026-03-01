const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage for images
const cloudinaryImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'architect-portfolio/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1920, height: 1080, crop: 'limit' }], // Max dimensions
  },
});

// Cloudinary storage for videos
const cloudinaryVideoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'architect-portfolio/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi', 'webm'],
  },
});

module.exports = {
  cloudinary,
  cloudinaryImageStorage,
  cloudinaryVideoStorage,
};
