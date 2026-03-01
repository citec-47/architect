# Architect Silas - Modern Portfolio Landing Page

A full-stack architectural portfolio website built with React, Node.js, and PostgreSQL. Features a modern, minimalist design showcasing architectural works with an interactive image gallery, projects showcase, and contact form.

## 🏗️ Project Structure

```
architect/
├── backend/               # Node.js/Express server
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/   # Middleware
│   │   ├── routes/       # API endpoints
│   │   └── server.js     # Main server file
│   ├── scripts/
│   │   └── migrate.js    # Database initialization
│   ├── package.json
│   └── .env.example
├── frontend/              # React application
│   ├── public/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── services/     # API services
│   │   ├── styles/       # CSS stylesheets
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── database/              # Database schema
└── README.md
```

## ✨ Features

- **Modern Hero Section**: Automated image carousel with manual controls
- **Responsive Projects Grid**: Filter projects by category
- **About Section**: Bio, design philosophy, and statistics
- **Contact Form**: Collect inquiries with validation
- **Elegant Design**: Minimalist aesthetic with white space, bold imagery
- **Smooth Navigation**: Scroll-based navigation with sticky header
- **Image Management**: Easily swap gallery and project images
- **Responsive Design**: Fully mobile-optimized

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **CSS3** - Styling with flexbox and grid
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database (via Neon)
- **Body-parser** - Request parsing
- **CORS** - Cross-origin resource sharing
- **Express-validator** - Request validation

### Database
- **PostgreSQL** - Relational database
- **Neon** - Serverless PostgreSQL hosting

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database (or Neon account)

### Installation

#### 1. Clone or extract the project
```bash
cd architect
```

#### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your database credentials
# DATABASE_URL=postgresql://user:password@host:port/database_name
```

#### 3. Database Setup

```bash
# Run migrations (from backend directory)
npm run migrate
```

This will:
- Create necessary tables (projects, gallery_images, contact_messages)
- Insert sample data

#### 4. Start Backend Server

```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

Server will run on `http://localhost:5000`

#### 5. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

#### 6. Start Frontend Dev Server

```bash
npm start
```

Frontend will open at `http://localhost:3000`

## 📋 API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/featured` - Get featured projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)

### Gallery
- `GET /api/gallery` - Get all gallery images
- `POST /api/gallery` - Add new gallery image (admin)
- `PUT /api/gallery/:id` - Update gallery image (admin)

### Contact
- `GET /api/contact` - Get all messages (admin)
- `POST /api/contact` - Submit contact form
- `PUT /api/contact/:id/read` - Mark message as read (admin)
- `DELETE /api/contact/:id` - Delete message (admin)

## 🎨 Customization

### Change Architect Name
1. Update `Header.js`: Change "ARCHITECT SILAS" text
2. Update `About.js`: Change name references
3. Update social links in `Footer.js`

### Update Gallery Images
1. **Via API**: POST to `/api/gallery` with new image URL
2. **Via Database**: Update `gallery_images` table
3. **UI**: Images auto-display in carousel

### Add/Edit Projects
1. **Via API**: POST/PUT to `/api/projects`
2. **Via Database**: Insert into `projects` table
3. **UI**: Projects auto-display in grid

### Customize Colors & Typography
Edit `src/styles/global.css` in frontend folder:
```css
/* Change primary colors */
h1, h2, h3 { font-family: 'Your Font'; }
.btn { background-color: #your-color; }
```

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: Below 768px

## 🔐 Security Notes

- Backend validates all inputs with express-validator
- Contact form emails should be verified before display
- API endpoints marked (admin) require authentication (to be implemented)
- Never commit `.env` file with real credentials

## 🚢 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy build/ folder
```

### Backend (Heroku/Railway)
```bash
# Set environment variables in deployment platform
git push heroku main
```

Update frontend API URL in environment variables for production.

## 📝 Database Schema

### projects
- `id` - Serial primary key
- `title` - Project name
- `description` - Project details
- `image_url` - Featured image URL
- `category` - Project category
- `featured` - Boolean flag
- `created_at`, `updated_at` - Timestamps

### gallery_images
- `id` - Serial primary key
- `title` - Image title
- `image_url` - Image URL
- `display_order` - Gallery order
- `created_at` - Timestamp

### contact_messages
- `id` - Serial primary key
- `name` - Visitor name
- `email` - Visitor email
- `message` - Contact message
- `read` - Boolean flag
- `created_at` - Timestamp

## 🐛 Troubleshooting

### Database Connection Error
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Verify network access to database

### CORS Errors
- Ensure backend is running on port 5000
- Check proxy settings in frontend package.json
- Verify backend CORS configuration

### Images Not Loading
- Check image URLs are publicly accessible
- Ensure gallery images exist in database
- Verify image format (JPEG, PNG, WebP supported)

## 📚 Documentation

For more details on component usage and API, see individual file comments.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💼 Author

**Architect Silas**  
Specializing in modern, minimalist architectural design.

---

Built with ❤️ for showcasing exceptional architectural work
