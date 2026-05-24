const fs = require('fs');
const path = require('path');
// load .env so script has Cloudinary creds when run directly
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function latestFile(dir) {
  const files = fs.readdirSync(dir).map(f => ({ f, t: fs.statSync(path.join(dir, f)).mtimeMs }));
  if (!files.length) return null;
  files.sort((a,b)=>b.t-a.t);
  return files[0].f;
}

async function upload() {
  try {
    const imagesDir = path.join(__dirname, '..', 'uploads', 'images');
    const videosDir = path.join(__dirname, '..', 'uploads', 'videos');

    const latestImage = latestFile(imagesDir);
    const latestVideo = latestFile(videosDir);

    if (latestImage) {
      const imagePath = path.join(imagesDir, latestImage);
      process.stdout.write(`Uploading image ${latestImage} ... `);
      const res = await cloudinary.uploader.upload(imagePath, { folder: 'architect-portfolio/images' });
      console.log('done');
      console.log('Image URL:', res.secure_url);
    } else {
      console.log('No image found to upload.');
    }

    if (latestVideo) {
      const videoPath = path.join(videosDir, latestVideo);
      process.stdout.write(`Uploading video ${latestVideo} ... `);
      const res2 = await cloudinary.uploader.upload(videoPath, { resource_type: 'video', folder: 'architect-portfolio/videos' });
      console.log('done');
      console.log('Video URL:', res2.secure_url);
    } else {
      console.log('No video found to upload.');
    }
  } catch (err) {
    console.error('Upload failed:', err.message || err);
    process.exit(1);
  }
}

upload();
