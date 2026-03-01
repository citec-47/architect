const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const { authenticateToken } = require('./middleware/auth');
const { sendContactEmail, sendConfirmationEmail } = require('./services/emailService');
const adminRoutes = require('./routes/adminRoutes');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uploadsRoot = path.join(__dirname, '..', 'uploads');
const imageUploadsPath = path.join(uploadsRoot, 'images');
const videoUploadsPath = path.join(uploadsRoot, 'videos');

[uploadsRoot, imageUploadsPath, videoUploadsPath].forEach((dirPath) => {
  fs.mkdirSync(dirPath, { recursive: true });
});

app.use('/uploads', express.static(uploadsRoot));

const projectMediaStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (file.mimetype.startsWith('image/')) {
      callback(null, imageUploadsPath);
      return;
    }
    if (file.mimetype.startsWith('video/')) {
      callback(null, videoUploadsPath);
      return;
    }
    callback(new Error('Unsupported media type'));
  },
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname);
    const safeBaseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9_-]/g, '-');
    callback(null, `${Date.now()}-${safeBaseName}${extension}`);
  },
});

const uploadProjectMedia = multer({
  storage: projectMediaStorage,
  limits: {
    fileSize: 100 * 1024 * 1024,
    files: 40,
  },
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      callback(null, true);
      return;
    }
    callback(new Error('Only image and video files are allowed'));
  },
}).fields([
  { name: 'images', maxCount: 20 },
  { name: 'videos', maxCount: 20 },
]);

const toPublicMediaPath = (filePath) => {
  const relativePath = path.relative(path.join(__dirname, '..'), filePath);
  return `/${relativePath.replace(/\\/g, '/')}`;
};

const parseStringArrayField = (value) => {
  if (value === undefined || value === null || value === '') {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === 'string' && item.trim() !== '');
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => typeof item === 'string' && item.trim() !== '');
      }
    } catch (error) {
      return value.trim() ? [value.trim()] : [];
    }
  }

  return [];
};

const toBoolean = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return false;
};

// Admin routes (must be before protected endpoints)
app.use('/api/admin', adminRoutes);

// Mock data for demo mode
const mockProjects = [
  {
    id: 1,
    title: 'Modern Villa',
    description: 'A stunning modern villa with minimalist design and natural lighting. This architectural masterpiece seamlessly blends contemporary aesthetics with functional living spaces. Floor-to-ceiling windows invite abundant natural light, while the open-plan layout creates a sense of spaciousness and flow.',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'
    ],
    videos: [],
    category: 'Residential',
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Urban Apartment Complex',
    description: 'Contemporary multi-family residential project in the heart of the city. This development features 50 units with sustainable materials and energy-efficient systems. Amenities include a rooftop garden, fitness center, and communal workspace.',
    image_url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
    ],
    videos: [],
    category: 'Residential',
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Commercial Office Tower',
    description: 'State-of-the-art commercial office space with sustainable design. The tower features a double-skin facade system for optimal thermal performance, green roof technology, and smart building automation. LEED Platinum certified with 30 floors of Grade A office space.',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop'
    ],
    videos: [],
    category: 'Commercial',
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: 'Boutique Hotel',
    description: 'Luxury boutique hotel combining elegance with modern amenities. Features 45 rooms and suites, a rooftop bar with panoramic city views, spa facilities, and a fine-dining restaurant. Interior design emphasizes local craftsmanship and sustainable materials.',
    image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&h=600&fit=crop'
    ],
    videos: [],
    category: 'Hospitality',
    featured: true,
  },
];

const mockGallery = [
  { id: 1, title: 'Modern Villa 1', image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=600&fit=crop', display_order: 1 },
  { id: 2, title: 'Contemporary Home', image_url: 'https://images.unsplash.com/photo-1600121848594-d746dfc1d3b7?w=1200&h=600&fit=crop', display_order: 2 },
  { id: 3, title: 'Luxury Residence', image_url: 'https://images.unsplash.com/photo-1600585154363-967b9dcb6d2d?w=1200&h=600&fit=crop', display_order: 3 },
];

const mockMessages = [];

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running (demo mode)', timestamp: new Date().toISOString() });
});

// API Routes - Mock data mode
app.get('/api/projects', (req, res) => {
  const { category } = req.query;
  let projects = mockProjects;
  
  if (category && category !== 'All') {
    projects = mockProjects.filter((p) => p.category === category);
  }
  
  res.json(projects);
});

app.get('/api/projects/featured', (req, res) => {
  res.json(mockProjects.filter((p) => p.featured));
});

app.get('/api/projects/:id', (req, res) => {
  const project = mockProjects.find((p) => p.id === parseInt(req.params.id));
  if (project) {
    res.json(project);
  } else {
    res.status(404).json({ message: 'Project not found' });
  }
});

app.post('/api/projects', authenticateToken, uploadProjectMedia, (req, res) => {
  const { title, description, category, featured } = req.body;
  
  if (!title || !description || !category) {
    return res.status(400).json({ message: 'Title, description, and category are required' });
  }

  const uploadedImages = (req.files?.images || []).map((file) => toPublicMediaPath(file.path));
  const uploadedVideos = (req.files?.videos || []).map((file) => toPublicMediaPath(file.path));

  const existingImages = parseStringArrayField(req.body.existingImages);
  const existingVideos = parseStringArrayField(req.body.existingVideos);
  const normalizedImages = [...existingImages, ...uploadedImages];
  const normalizedVideos = [...existingVideos, ...uploadedVideos];

  const newProject = {
    id: mockProjects.length > 0 ? Math.max(...mockProjects.map((p) => p.id)) + 1 : 1,
    title,
    description,
    category,
    featured: toBoolean(featured),
    image_url: normalizedImages[0] || null,
    images: normalizedImages,
    videos: normalizedVideos,
    created_at: new Date().toISOString(),
  };
  
  mockProjects.push(newProject);
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', authenticateToken, uploadProjectMedia, (req, res) => {
  const projectIndex = mockProjects.findIndex((p) => p.id === parseInt(req.params.id));
  
  if (projectIndex === -1) {
    return res.status(404).json({ message: 'Project not found' });
  }
  
  const { title, description, category, featured } = req.body;
  const uploadedImages = (req.files?.images || []).map((file) => toPublicMediaPath(file.path));
  const uploadedVideos = (req.files?.videos || []).map((file) => toPublicMediaPath(file.path));

  const hasExistingImagesField = Object.prototype.hasOwnProperty.call(req.body, 'existingImages');
  const hasExistingVideosField = Object.prototype.hasOwnProperty.call(req.body, 'existingVideos');

  const baseImages = hasExistingImagesField
    ? parseStringArrayField(req.body.existingImages)
    : (mockProjects[projectIndex].images || []);
  const baseVideos = hasExistingVideosField
    ? parseStringArrayField(req.body.existingVideos)
    : (mockProjects[projectIndex].videos || []);

  const nextImages = [...baseImages, ...uploadedImages];
  const nextVideos = [...baseVideos, ...uploadedVideos];
  
  mockProjects[projectIndex] = {
    ...mockProjects[projectIndex],
    title: title || mockProjects[projectIndex].title,
    description: description || mockProjects[projectIndex].description,
    category: category || mockProjects[projectIndex].category,
    featured: featured !== undefined ? toBoolean(featured) : mockProjects[projectIndex].featured,
    images: nextImages,
    videos: nextVideos,
    image_url: nextImages[0] || (hasExistingImagesField ? null : mockProjects[projectIndex].image_url),
    updated_at: new Date().toISOString(),
  };
  
  res.json(mockProjects[projectIndex]);
});

app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  const projectIndex = mockProjects.findIndex((p) => p.id === parseInt(req.params.id));
  
  if (projectIndex === -1) {
    return res.status(404).json({ message: 'Project not found' });
  }
  
  mockProjects.splice(projectIndex, 1);
  res.json({ message: 'Project deleted successfully' });
});

app.get('/api/gallery', (req, res) => {
  // Aggregate all images from projects + standalone gallery images
  const projectImages = mockProjects.flatMap((project, index) => 
    (project.images || []).map((imageUrl, imgIndex) => ({
      id: `project-${project.id}-${imgIndex}`,
      title: `${project.title} - Image ${imgIndex + 1}`,
      image_url: imageUrl,
      project_id: project.id,
      project_title: project.title,
      category: project.category,
      display_order: index * 10 + imgIndex
    }))
  );
  
  const standaloneImages = mockGallery.map((img) => ({
    ...img,
    id: `gallery-${img.id}`,
    standalone: true
  }));
  
  const allImages = [...projectImages, ...standaloneImages]
    .sort((a, b) => a.display_order - b.display_order);
  
  res.json(allImages);
});

app.post('/api/gallery', authenticateToken, (req, res) => {
  const newImage = {
    id: Math.max(...mockGallery.map((g) => g.id)) + 1,
    ...req.body,
  };
  mockGallery.push(newImage);
  res.status(201).json(newImage);
});

app.put('/api/gallery/:id', authenticateToken, (req, res) => {
  const image = mockGallery.find((g) => g.id === parseInt(req.params.id));
  if (image) {
    Object.assign(image, req.body);
    res.json(image);
  } else {
    res.status(404).json({ message: 'Gallery image not found' });
  }
});

app.get('/api/contact', authenticateToken, (req, res) => {
  res.json(mockMessages);
});

app.post('/api/contact', async (req, res) => {
  const newMessage = {
    id: mockMessages.length + 1,
    ...req.body,
    created_at: new Date().toISOString(),
    read: false,
  };
  mockMessages.push(newMessage);
  
  // Send emails asynchronously (don't block response)
  try {
    sendContactEmail(newMessage).catch(err => console.error('Error sending admin email:', err));
    sendConfirmationEmail(newMessage).catch(err => console.error('Error sending confirmation email:', err));
  } catch (error) {
    console.error('Error in email service:', error);
  }
  
  res.status(201).json({ message: 'Message sent successfully', data: newMessage });
});

app.put('/api/contact/:id/read', authenticateToken, (req, res) => {
  const msg = mockMessages.find((m) => m.id === parseInt(req.params.id));
  if (msg) {
    msg.read = true;
    res.json(msg);
  } else {
    res.status(404).json({ message: 'Message not found' });
  }
});

app.delete('/api/contact/:id', authenticateToken, (req, res) => {
  const index = mockMessages.findIndex((m) => m.id === parseInt(req.params.id));
  if (index !== -1) {
    mockMessages.splice(index, 1);
    res.json({ message: 'Message deleted successfully' });
  } else {
    res.status(404).json({ message: 'Message not found' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Start server (demo mode - no database required)
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📡 Demo mode - Using mock data`);
      console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
      console.log(`\n✨ Backend is ready for frontend connections!`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
