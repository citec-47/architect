const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function run() {
  try {
    const api = 'http://localhost:5000';
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');

    const loginRes = await fetch(`${api}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(JSON.stringify(loginData));
    const token = loginData.token;

    const projectId = 5; // project created earlier
    const imageUrl = 'https://res.cloudinary.com/dlpc2ainn/image/upload/v1779304426/architect-portfolio/images/kmqqpzdp4kw310n8bb6d.png';
    const videoUrl = 'https://res.cloudinary.com/dlpc2ainn/video/upload/v1779304443/architect-portfolio/videos/jxqjzfqp4tsbbsgd9acx.mp4';

    const resp = await fetch(`${api}/api/projects/${projectId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ existingImages: JSON.stringify([imageUrl]), existingVideos: JSON.stringify([videoUrl]) }),
    });
    const respData = await resp.json();
    if (!resp.ok) throw new Error(JSON.stringify(respData));
    console.log('Updated project:', respData);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

run();
