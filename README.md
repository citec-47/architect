# Architect Portfolio - Admin Dashboard

A comprehensive architectural portfolio website with a powerful admin dashboard for managing projects, gallery, and contact messages.

## Features

### 🎨 Landing Page
- **Dynamic Project Display**: All projects created in admin dashboard automatically appear on the landing page
- **Category Filtering**: Filter projects by Residential, Commercial, or Hospitality
- **Image Gallery Carousel**: All project images automatically appear in the Hero gallery section
- **Responsive Design**: Mobile, tablet, and desktop friendly
- **Project Details Modal**: Click any project to view full details and all images

### 🔐 Admin Dashboard
Access the admin dashboard at: `http://localhost:3000/admin`

**Login Credentials:**
- Email: `admin@architectsilas.com`
- Password: `Admin@123456`

#### Project Management
- **Create Projects**: Add new projects with:
  - Title, description, and category (Residential/Commercial/Hospitality)
  - Multiple image URLs (add as many as needed)
  - Featured project option (displays with ★ badge)
- **Edit Projects**: Update any project details or images
- **Delete Projects**: Remove projects with confirmation
- **Auto Gallery Update**: All project images automatically appear in the landing page gallery

#### Gallery Management
- View all images from all projects
- Images are automatically aggregated from projects
- Each image shows which project it belongs to

#### Contact Message Management
- View all contact form submissions
- Mark messages as read/unread
- Delete messages
- Email notifications (admin receives email when message submitted)
- Auto-confirmation email sent to visitors

## How It Works

### Workflow: Creating a Project

1. **Login to Admin Dashboard**
   - Navigate to `http://localhost:3000/admin`
   - Enter admin credentials

2. **Create New Project**
   - Click "Projects" tab
   - Click "+ Create New Project" button
   - Fill in the form:
     - **Title**: e.g., "Modern Villa in Beverly Hills"
     - **Category**: Select Residential, Commercial, or Hospitality
     - **Description**: Detailed paragraph about the project
     - **Images**: Add 3+ image URLs (click "+ Add Another Image" for more)
     - **Featured**: Check if this should be a featured project

3. **Submit & View**
   - Click "Create Project"
   - Project appears immediately on landing page
   - All images appear in the gallery carousel
   - Project can be filtered by category

### Category Filtering on Landing Page

Once you have 12+ projects:
- Click "Residential" to see only residential projects
- Click "Commercial" to see only commercial projects  
- Click "Hospitality" to see only hospitality projects
- Click "All" to see all projects

Each category shows:
- Category name and description header
- All projects in that category
- Project count and image count
- Featured projects marked with ★

### Gallery Integration

- **Automatic**: Every image you add to a project automatically appears in the Hero gallery carousel
- **No manual upload needed**: Just add image URLs in the project form
- **Auto-rotation**: Gallery cycles through all images every 5 seconds
- **Manual navigation**: Previous/Next buttons and dot indicators

## Technical Stack

### Frontend
- React 18
- React Router 6
- Axios for API calls
- Responsive CSS with mobile-first design

### Backend
- Node.js + Express
- JWT authentication
- Nodemailer for email notifications
- Mock data mode (no database required for demo)

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
node src/server.js
```
Backend runs on: `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
npm start
```
Frontend runs on: `http://localhost:3000`

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects (supports ?category=Residential filter)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (requires auth)
- `PUT /api/projects/:id` - Update project (requires auth)
- `DELETE /api/projects/:id` - Delete project (requires auth)

### Gallery
- `GET /api/gallery` - Get all images (aggregates from all projects)

### Contact
- `GET /api/contact` - Get all messages (requires auth)
- `POST /api/contact` - Submit contact form
- `PUT /api/contact/:id/read` - Mark as read (requires auth)
- `DELETE /api/contact/:id` - Delete message (requires auth)

### Admin
- `POST /api/admin/login` - Login and get JWT token
- `GET /api/admin/verify` - Verify JWT token

## Project Categories

### Residential
For homes, villas, apartments, and residential complexes

### Commercial
For office buildings, retail spaces, and commercial developments

### Hospitality
For hotels, restaurants, resorts, and hospitality venues

## Image Requirements

- Use **direct image URLs** (e.g., Unsplash, Imgur, or your own CDN)
- Recommended size: 800x600px or larger
- Format: JPEG, PNG, or WebP
- Each project can have **unlimited images**

## Demo Data

The system comes with 4 sample projects:
1. Modern Villa (Residential)
2. Urban Apartment Complex (Residential)
3. Commercial Office Tower (Commercial)
4. Boutique Hotel (Hospitality)

You can edit or delete these and create your own!

## Support

For issues or questions, check the console for error messages. The application uses mock data mode, so no database setup is required.