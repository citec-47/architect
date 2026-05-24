const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const localFile = process.argv[2] || path.join(__dirname, '..', 'uploads', 'images', 'sample.jpg');

(async () => {
  try {
    console.log('Uploading:', localFile);
    const res = await cloudinary.uploader.upload(localFile, {
      folder: 'architect-portfolio/images',
      use_filename: true,
      unique_filename: false,
      overwrite: false,
    });
    console.log('Uploaded URL:', res.secure_url);
  } catch (err) {
    console.error('Upload error:', err.message || err);
    process.exit(1);
  }
})();
