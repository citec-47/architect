# Quick Start Guide - Architect Silas Portfolio

## ⚡ 5-Minute Quick Start

### Option A: Using Neon Database (Recommended)

1. **Create Neon Account**
   - Go to https://neon.tech
   - Sign up and create a new project
   - Copy the connection string

2. **Backend Setup (1 min)**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env - paste your Neon CONNECTION_STRING
   npm run migrate
   npm run dev  # Should see "Database connected successfully"
   ```

3. **Frontend Setup (1 min)**
   ```bash
   cd ../frontend
   npm install
   npm start  # Opens http://localhost:3000
   ```

4. **Done!** 🎉
   - Browse to `http://localhost:3000`
   - View gallery carousel at the top
   - See sample projects
   - Try the contact form

### Option B: Using Local PostgreSQL

1. **Install PostgreSQL**
   - Windows: https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Create Database**
   ```bash
   createdb architect_db
   psql architect_db < database/schema.sql
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env:
   # DATABASE_URL=postgresql://postgres:password@localhost:5432/architect_db
   npm run migrate
   npm run dev
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

## 📸 Customizing Content

### Change Gallery Images

**Via Browser (Admin Panel needed - future)**
Use the CMS interface to upload new images

**Via Database (Current)**
```sql
UPDATE gallery_images SET image_url = 'https://your-image-url.jpg' WHERE id = 1;
```

**Via API**
```bash
curl -X PUT http://localhost:5000/api/gallery/1 \
  -H "Content-Type: application/json" \
  -d '{"image_url":"https://new-image.jpg","title":"New Title"}'
```

### Add Projects

**Via API**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Project",
    "description": "A beautiful design",
    "image_url": "https://image-url.jpg",
    "category": "Residential",
    "featured": true
  }'
```

**Via Database**
```sql
INSERT INTO projects (title, description, image_url, category, featured)
VALUES ('Project Name', 'Description', 'https://image.jpg', 'Residential', true);
```

### Change Architect Name & Info

1. **Header** - `frontend/src/components/Header.js`
   ```jsx
   <h1>YOUR NAME HERE</h1>
   ```

2. **About Section** - `frontend/src/components/About.js`
   - Update bio text
   - Update experience years
   - Update project count
   - Update awards

3. **Contact Info** - `frontend/src/components/Contact.js`
   ```jsx
   Email: <a href="mailto:your.email@example.com">your.email@example.com</a>
   Phone: <a href="tel:+237679222942">+237679222942</a>
   Location: "Your City, State"
   ```

4. **Footer** - `frontend/src/components/Footer.js`
   - Update company name
   - Update contact details
   - Update social links

## 🎨 Customizing Design

### Color Scheme

Edit `frontend/src/styles/global.css`:

```css
/* Change button colors */
.btn {
  background-color: #000000;  /* Change to your color */
  color: #ffffff;
}

.btn:hover {
  background-color: #ffffff;
  color: #000000;
}

/* Change text color */
body {
  color: #333333;  /* Primary text */
}

p {
  color: #666666;  /* Secondary text */
}
```

### Typography

Replace font family in global.css:

```css
body {
  font-family: 'Your Font Name', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Your Font Name', sans-serif;
}
```

Google Fonts recommendation:
- **Elegant**: Playfair Display (titles) + Lato (body)
- **Modern**: Montserrat (titles) + Open Sans (body)
- **Minimal**: Inter (all elements)

### Section Spacing

Edit `frontend/src/styles/global.css`:

```css
section {
  padding: 6rem 0;  /* Change 6rem to your preferred spacing */
}
```

## 🔗 API Integration Guide

All API calls go to `http://localhost:5000/api`

### Project Management

```javascript
import { projectAPI } from './services/api';

// Get all projects
const projects = await projectAPI.getAll();

// Get featured projects
const featured = await projectAPI.getFeatured();

// Get single project
const project = await projectAPI.getById(1);

// Create project
await projectAPI.create({
  title: "New Project",
  description: "Details",
  image_url: "https://...",
  category: "Residential",
  featured: true
});

// Update project
await projectAPI.update(1, { title: "Updated Title" });

// Delete project
await projectAPI.delete(1);
```

### Gallery Management

```javascript
import { galleryAPI } from './services/api';

// Get all gallery images
const images = await galleryAPI.getAll();

// Add image
await galleryAPI.add({
  title: "New Image",
  image_url: "https://..."
});

// Update image
await galleryAPI.update(1, {
  image_url: "https://new-url.jpg"
});
```

### Contact Form

```javascript
import { contactAPI } from './services/api';

// Submit form
await contactAPI.create({
  name: "John Doe",
  email: "john@example.com",
  message: "I'm interested in..."
});

// Get messages (admin)
const messages = await contactAPI.getAll();

// Mark as read
await contactAPI.markAsRead(1);

// Delete message
await contactAPI.delete(1);
```

## 🚀 Deploying Your Site

### Frontend (Vercel - Free & Easiest)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your `frontend` folder
4. Deploy (automatic)
5. Set `REACT_APP_API_URL` env variable to your backend URL

### Backend (Railway - $5/month)

1. Go to https://railway.app
2. Create new project
3. Connect GitHub repo
4. Add PostgreSQL database
5. Set `DATABASE_URL` environment variable
6. Deploy

### Full Stack on One Server (AWS/DigitalOcean)

1. SSH into server
2. Install Node.js, PostgreSQL
3. Clone repo
4. Setup backend with PM2
5. Setup frontend with Nginx
6. Configure SSL with Let's Encrypt

## 📞 Support & Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Database Connection Failed
- Check `.env` file has correct `DATABASE_URL`
- Ensure PostgreSQL/Neon is accessible
- Try: `psql -c "SELECT 1"`

### CORS Errors
- Ensure backend is running
- Check `Access-Control-Allow-Origin`
- Verify proxy in `frontend/package.json`

### Images Not Showing
- URL must be publicly accessible
- Use HTTPS URLs when possible
- Test URL in browser

## 📊 Monitoring & Analytics (Future)

Add Google Analytics:
```jsx
// In frontend/src/index.js
import ReactGA from 'react-ga';
ReactGA.initialize('GA_MEASUREMENT_ID');
ReactGA.pageview(window.location.pathname);
```

## 🔐 Production Checklist

- [ ] Change "ARCHITECT SILAS" to real name
- [ ] Update all contact information
- [ ] Replace sample projects with real work
- [ ] Update gallery images
- [ ] Set up CORS for production domain
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure contact form email notifications
- [ ] Add Google Analytics
- [ ] Test on mobile devices
- [ ] Test form submissions
- [ ] Setup monitoring/alerts

## 📚 Next Steps

1. **Add Authentication** - Protect admin endpoints
2. **Email Notifications** - Send confirmation emails
3. **CMS Interface** - Admin dashboard for content
4. **Blog Section** - Share design updates
5. **Testimonials** - Client quotes
6. **Before/After Gallery** - Transformation showcase
7. **Service Pricing** - Display packages

---

Happy building! 🏗️
