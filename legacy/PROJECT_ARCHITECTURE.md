# Project Architecture & File Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Browser                        │
│                    (http://localhost:3000)                   │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                  React Frontend Application                   │
│                  (frontend/ directory)                        │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                      Components                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │   Header    │  │    Hero     │  │  Projects   │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │    About    │  │   Contact   │  │    Footer   │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Services (API Client)                    │  │
│  │                 (api.js - axios)                      │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │ REST API Calls
                     │ (http://localhost:5000/api)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│          Node.js/Express Backend Server                       │
│              (backend/ directory)                            │
│             (Port: 5000 / NodeEnv: dev)                      │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Routes (API Endpoints)              │  │
│  │  /api/projects    /api/gallery    /api/contact        │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Controllers                         │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │Project      │  │Gallery      │  │Contact      │  │  │
│  │  │Controller   │  │Controller   │  │Controller   │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Database Connection (pg)                   │  │
│  │               (database.js config)                    │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │ SQL Queries
                     ↓
┌─────────────────────────────────────────────────────────────┐
│            PostgreSQL Database                               │
│        (Local or Neon Cloud Database)                       │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ projects     │  │gallery_images│  │contact_      │     │
│  │ table        │  │table         │  │messages table│     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure & Descriptions

### Root Directory
```
architect/
├── README.md                    # (Placeholder)
├── SETUP_GUIDE.md              # Comprehensive setup guide
├── QUICKSTART.md               # 5-minute quick start
├── ENVIRONMENT_SETUP.md        # Detailed environment setup
├── PROJECT_ARCHITECTURE.md     # This file
├── backend/                    # Node.js/Express server
├── frontend/                   # React application
└── database/                   # Database files
```

---

## Backend File Structure

### backend/
```
backend/
├── package.json                # Node.js dependencies & scripts
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── src/
│   ├── server.js              # Main server entry point
│   ├── config/
│   │   └── database.js        # PostgreSQL connection pool
│   ├── routes/
│   │   ├── projectRoutes.js   # Project endpoints
│   │   ├── galleryRoutes.js   # Gallery endpoints
│   │   └── contactRoutes.js   # Contact endpoints
│   ├── controllers/
│   │   ├── projectController.js    # Project logic
│   │   ├── galleryController.js    # Gallery logic
│   │   └── contactController.js    # Contact logic
│   └── middleware/            # Custom middleware (future)
└── scripts/
    └── migrate.js             # Database initialization
```

### Backend Key Files

#### `src/server.js`
- Main server entry point
- Initializes Express app
- Sets up middleware (CORS, body-parser)
- Mounts routes
- Handles errors
- Connects to database

#### `src/config/database.js`
- Creates PostgreSQL connection pool
- Exports pool for use in queries
- Error handling for connection issues

#### `src/routes/*.js`
- Define API endpoints
- Attach controllers to routes
- Validate input with express-validator
- Example: `GET /api/projects` → getAllProjects

#### `src/controllers/*.js`
- Business logic for each route
- Database queries
- Error handling
- Response formatting

#### `scripts/migrate.js`
- Creates database tables if they don't exist
- Inserts sample data (projects, gallery images)
- Run with: `npm run migrate`

---

## Frontend File Structure

### frontend/
```
frontend/
├── package.json                # React dependencies & scripts
├── .gitignore                 # Git ignore rules
├── public/
│   └── index.html             # HTML entry point
├── src/
│   ├── index.js               # React entry point (ReactDOM)
│   ├── App.js                 # Main React component
│   ├── components/
│   │   ├── Header.js          # Navigation header
│   │   ├── Header.css         # Header styles
│   │   ├── Hero.js            # Hero section + image carousel
│   │   ├── Hero.css           # Hero styles
│   │   ├── Projects.js        # Projects grid
│   │   ├── Projects.css       # Projects styles
│   │   ├── About.js           # About section
│   │   ├── About.css          # About styles
│   │   ├── Contact.js         # Contact form
│   │   ├── Contact.css        # Contact styles
│   │   ├── Footer.js          # Footer
│   │   └── Footer.css         # Footer styles
│   ├── services/
│   │   └── api.js             # Axios API client
│   └── styles/
│       └── global.css         # Global styles
```

### Frontend Key Files

#### `public/index.html`
- HTML entry point
- Root div where React mounts
- Meta tags, title, favicon

#### `src/index.js`
- Creates React root
- Renders App component
- Imports global styles

#### `src/App.js`
- Main application component
- Imports and renders all page sections
- Handles layout structure

#### `src/services/api.js`
- Axios instance with BASE_URL
- API endpoints as methods:
  - `projectAPI.getAll()`
  - `galleryAPI.getAll()`
  - `contactAPI.create()`
- Centralized API management

#### `src/components/*.js` (React Components)

**Header.js**
- Navigation menu
- Logo/site name
- Responsive mobile menu
- Scroll-to-section functionality

**Hero.js**
- Image carousel with auto-rotate
- Manual navigation arrows
- Dot indicators
- CTA "View Projects" button

**Projects.js**
- Grid layout of projects
- Category filter buttons
- Project cards with hover effects
- Responsive grid

**About.js**
- Bio section
- Design philosophy
- Statistics cards
- Two-column layout

**Contact.js**
- Contact form (name, email, message)
- Form validation
- Success/error messages
- Contact information display
- Office hours

**Footer.js**
- Links to sections
- Contact info
- Social links
- Copyright

#### `src/styles/global.css`
- Base typography
- Reset styles
- Button styles
- Container & section base styles
- Responsive breakpoints
- Smooth scroll behavior

---

## Database Schema

### projects
```sql
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Relationships:**
- None (standalone table)

**Indexes:**
- category (for filtering)
- featured (for featured projects)

### gallery_images
```sql
CREATE TABLE gallery_images (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  display_order INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Relationships:**
- None (standalone table)

**Indexes:**
- display_order (for carousel order)

### contact_messages
```sql
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Relationships:**
- None (standalone table)

**Indexes:**
- read (for unread messages)
- created_at (for sorting)

---

## API Endpoints Reference

### Projects API

| Method | Endpoint | Params | Response |
|--------|----------|---------|----------|
| GET | `/api/projects` | - | Array of all projects |
| GET | `/api/projects/featured` | - | Array of featured projects |
| GET | `/api/projects/:id` | id: number | Single project object |
| POST | `/api/projects` | body: ProjectData | Created project object |
| PUT | `/api/projects/:id` | id, body: ProjectData | Updated project object |
| DELETE | `/api/projects/:id` | id: number | {message: success} |

### Gallery API

| Method | Endpoint | Params | Response |
|--------|----------|---------|----------|
| GET | `/api/gallery` | - | Array of gallery images |
| POST | `/api/gallery` | body: GalleryData | Created image object |
| PUT | `/api/gallery/:id` | id, body: GalleryData | Updated image object |

### Contact API

| Method | Endpoint | Params | Response |
|--------|----------|---------|----------|
| GET | `/api/contact` | - | Array of contact messages |
| POST | `/api/contact` | body: ContactData | {message: success, data: {...}} |
| PUT | `/api/contact/:id/read` | id: number | Updated message object |
| DELETE | `/api/contact/:id` | id: number | {message: success} |

---

## Data Flow Examples

### Loading Projects on Page Load

1. **User** opens http://localhost:3000
2. **Frontend** mounts `Projects` component
3. **React** useEffect hook triggers
4. **Frontend** calls `projectAPI.getAll()`
5. **Axios** makes HTTP GET to `http://localhost:5000/api/projects`
6. **Backend** receives GET request
7. **Route** matches `/api/projects` → calls `getAllProjects`
8. **Controller** queries database: `SELECT * FROM projects`
9. **Database** returns rows
10. **Controller** sends JSON response
11. **Frontend** receives data, setState
12. **React** re-renders with projects
13. **User** sees project grid

### Submitting Contact Form

1. **User** fills form (name, email, message)
2. **User** clicks "Send Message"
3. **Frontend** calls `contactAPI.create(formData)`
4. **Axios** makes HTTP POST to `/api/contact` with body
5. **Backend** receives POST request
6. **Route** matches `/api/contact` → calls `createMessage`
7. **Controller** validates input
8. **Controller** inserts into database
9. **Database** returns new row
10. **Controller** sends success response
11. **Frontend** shows success message
12. **Forms** resets for next entry

---

## Component Data Flow (Props)

```
App
├── Header (no props)
├── Hero
│   └── Fetches gallery images from API
├── Projects
│   └── Fetches projects from API, shows filtered results
├── About (no props, static content)
├── Contact
│   └── Handles form submission to API
└── Footer (no props, static links)
```

---

## Dependencies Overview

### Backend Dependencies
```json
{
  "express": "Web framework",
  "cors": "Cross-origin requests",
  "body-parser": "Parse JSON/form data",
  "pg": "PostgreSQL client",
  "dotenv": "Environment variables",
  "express-validator": "Input validation",
  "nodemon": "Dev auto-reload"
}
```

### Frontend Dependencies
```json
{
  "react": "UI library",
  "react-dom": "React DOM renderer",
  "axios": "HTTP client",
  "react-scripts": "Build tools"
}
```

---

## Deployment Considerations

### Frontend
- Build: `npm run build` → creates optimized bundle
- Host on: Vercel, Netlify, AWS S3+CloudFront
- Serve on HTTPS
- Point to production backend URL

### Backend
- Use production database (Neon, AWS RDS)
- Set NODE_ENV=production
- Use process manager (PM2, systemd)
- Enable HTTPS
- Setup logging
- Configure rate limiting

### Database
- Use managed service (Neon, AWS RDS)
- Enable backups
- Setup monitoring
- Restrict access to app server only

---

## Security Best Practices

✓ **Implemented:**
- Input validation (express-validator)
- CORS configuration
- SQL parameterized queries (pg)
- Environment variables for secrets

⚠️ **To Implement:**
- Authentication for admin endpoints
- Rate limiting
- HTTPS/SSL
- SQL injection prevention (already done with pg)
- XSS protection
- CSRF tokens
- Request size limits
- API key authentication

---

## Performance Optimizations

**Current:**
- Database connection pooling
- Indexed queries
- CSS minification in build

**Suggested:**
- API response caching
- Image compression/CDN
- Database query optimization
- Component lazy loading
- CSS-in-JS for better bundle size

---

## Monitoring & Logging

**Not Implemented Yet:**
- Application logging
- Error tracking (Sentry)
- Performance monitoring
- Database query logs
- API request logging

**Recommended Tools:**
- Winston/Pino (Node logging)
- Sentry (error tracking)
- New Relic (APM)
- CloudWatch (AWS)

---

## Future Enhancements

1. **Authentication System**
   - Admin login
   - JWT tokens
   - Protected endpoints

2. **CMS Dashboard**
   - Upload images
   - Add/edit projects
   - View messages
   - User management

3. **Email Integration**
   - Contact form notifications
   - Email confirmations
   - Newsletter

4. **Advanced Features**
   - Blog section
   - Client testimonials
   - Team members
   - Services pricing
   - Portfolio filtering
   - Search functionality

5. **Analytics**
   - Google Analytics
   - Conversion tracking
   - User behavior

6. **SEO**
   - Meta tags
   - Structured data
   - Sitemap
   - XML feed

---

This architecture provides a solid foundation for a professional portfolio website with room for growth and enhancement.
