const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const API_ORIGIN = 'http://localhost:5000';

async function uploadDir(dir, resourceType, folder) {
  if (!fs.existsSync(dir)) return {};
  const files = fs.readdirSync(dir).filter(f => !f.startsWith('.'));
  const map = {};
  for (const f of files) {
    const localPath = path.join(dir, f);
    try {
      process.stdout.write(`Uploading ${f} ... `);
      const res = await cloudinary.uploader.upload(localPath, resourceType === 'video' ? { resource_type: 'video', folder } : { folder });
      map[f] = res.secure_url;
      console.log('done');
    } catch (err) {
      console.error(`failed: ${err.message || err}`);
    }
  }
  return map;
}

async function fetchJson(url, opts) {
  const r = await fetch(url, opts);
  const j = await r.json();
  if (!r.ok) throw new Error(JSON.stringify(j));
  return j;
}

async function loginAsAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD required in .env');
  const res = await fetchJson(`${API_ORIGIN}/api/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  return res.token;
}

async function updateProjectsAndGallery(mapping) {
  const token = await loginAsAdmin();
  const projects = await fetchJson(`${API_ORIGIN}/api/projects`);

  for (const p of projects) {
    const images = (p.images || []).map(img => {
      if (img.startsWith('/uploads/')) return mapping[path.basename(img)] || img;
      return img;
    });
    const videos = (p.videos || []).map(v => {
      if (v.startsWith('/uploads/')) return mapping[path.basename(v)] || v;
      return v;
    });

    // Only update if any local paths were replaced
    const changed = images.some(i => i.startsWith('https://res.cloudinary.com')) || videos.some(v => v.startsWith('https://res.cloudinary.com'));
    if (changed) {
      console.log(`Updating project ${p.id} -> images:${images.length}, videos:${videos.length}`);
      await fetchJson(`${API_ORIGIN}/api/projects/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ existingImages: JSON.stringify(images), existingVideos: JSON.stringify(videos) }),
      });
    }
  }

  // Update standalone gallery images
  const gallery = await fetchJson(`${API_ORIGIN}/api/gallery`);
  for (const g of gallery) {
    if (g.standalone && g.image_url && g.image_url.startsWith('/uploads/')) {
      const file = path.basename(g.image_url);
      const cloudUrl = mapping[file];
      if (cloudUrl) {
        const idMatch = String(g.id).replace('gallery-', '');
        const idNum = parseInt(idMatch, 10);
        if (!isNaN(idNum)) {
          console.log(`Updating gallery ${idNum} -> ${cloudUrl}`);
          await fetchJson(`${API_ORIGIN}/api/gallery/${idNum}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ image_url: cloudUrl }),
          });
        }
      }
    }
  }
}

async function main() {
  console.log('Starting migration to Cloudinary...');
  const imagesDir = path.join(__dirname, '..', 'uploads', 'images');
  const videosDir = path.join(__dirname, '..', 'uploads', 'videos');
  const imageMap = await uploadDir(imagesDir, 'image', 'architect-portfolio/images');
  const videoMap = await uploadDir(videosDir, 'video', 'architect-portfolio/videos');

  const mapping = { ...imageMap, ...videoMap };
  const mapPath = path.join(__dirname, 'cloudinary_uploads_map.json');
  fs.writeFileSync(mapPath, JSON.stringify(mapping, null, 2));
  console.log('Saved mapping to', mapPath);

  await updateProjectsAndGallery(mapping);
  console.log('Migration complete.');
}

main().catch(err => { console.error('Migration failed:', err); process.exit(1); });
