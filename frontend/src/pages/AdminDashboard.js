import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const API_ORIGIN = process.env.REACT_APP_API_ORIGIN || 'http://localhost:5000';
const API_BASE = `${API_ORIGIN}/api`;

const resolveMediaUrl = (mediaUrl) => {
  if (!mediaUrl) {
    return '';
  }
  if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
    return mediaUrl;
  }
  return `${API_ORIGIN}${mediaUrl}`;
};

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Project form state
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);
  const projectFormRef = useRef(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    category: 'Residential',
    featured: false,
    existingImages: [],
    existingVideos: [],
    newImageFiles: [],
    newVideoFiles: []
  });

  // Load all dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      const [projectsRes, galleryRes, messagesRes] = await Promise.all([
        axios.get(`${API_BASE}/projects`),
        axios.get(`${API_BASE}/gallery`),
        axios.get(`${API_BASE}/contact`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setProjects(projectsRes.data);
      setGallery(galleryRes.data);
      setMessages(messagesRes.data);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load dashboard data');
    }
  }, [token]);

  // Verify token validity
  const verifyToken = useCallback(async () => {
    try {
      setLoading(true);
      await axios.get(`${API_BASE}/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsLoggedIn(true);
      loadDashboardData();
    } catch (err) {
      setToken(null);
      localStorage.removeItem('adminToken');
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }, [token, loadDashboardData]);

  // Check if already logged in
  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token, verifyToken]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/admin/login`, {
        email,
        password,
      });
      const { token: newToken } = response.data;
      setToken(newToken);
      localStorage.setItem('adminToken', newToken);
      setIsLoggedIn(true);
      setEmail('');
      setPassword('');
      setSuccess('Login successful!');
      loadDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
    setIsLoggedIn(false);
    setProjects([]);
    setGallery([]);
    setMessages([]);
  };

  // Mark message as read
  const markAsRead = async (messageId) => {
    try {
      const response = await axios.put(
        `${API_BASE}/contact/${messageId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(messages.map(m => (m.id === messageId ? response.data : m)));
      setSuccess('Message marked as read');
    } catch (err) {
      setError('Failed to mark message as read');
    }
  };

  // Delete message
  const deleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await axios.delete(
        `${API_BASE}/contact/${messageId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(messages.filter(m => m.id !== messageId));
      setSuccess('Message deleted successfully');
    } catch (err) {
      setError('Failed to delete message');
    }
  };

  // Delete project
  const deleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await axios.delete(
        `${API_BASE}/projects/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(projects.filter(p => p.id !== projectId));
      setSuccess('Project deleted successfully');
    } catch (err) {
      setError('Failed to delete project');
    }
  };

  // Delete gallery image
  const deleteGalleryImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    try {
      await axios.delete(
        `${API_BASE}/gallery/${imageId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGallery(gallery.filter(g => g.id !== imageId));
      setSuccess('Image deleted successfully');
    } catch (err) {
      setError('Failed to delete image');
    }
  };

  // Handle project form changes
  const handleProjectFormChange = (field, value) => {
    setProjectForm({ ...projectForm, [field]: value });
  };

  const handleMediaFilesChange = (field, files) => {
    setProjectForm({ ...projectForm, [field]: Array.from(files || []) });
  };

  const removeExistingMedia = (field, index) => {
    const nextMedia = projectForm[field].filter((_, itemIndex) => itemIndex !== index);
    setProjectForm({ ...projectForm, [field]: nextMedia });
  };

  // Create new project
  const createProject = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!projectForm.title || !projectForm.description) {
        setError('Title and description are required');
        setLoading(false);
        return;
      }

      const hasNewMedia = projectForm.newImageFiles.length > 0 || projectForm.newVideoFiles.length > 0;

      let projectData;
      if (hasNewMedia) {
        projectData = new FormData();
        projectData.append('title', projectForm.title);
        projectData.append('description', projectForm.description);
        projectData.append('category', projectForm.category);
        projectData.append('featured', String(projectForm.featured));
        projectForm.newImageFiles.forEach((file) => projectData.append('images', file));
        projectForm.newVideoFiles.forEach((file) => projectData.append('videos', file));
      } else {
        projectData = {
          title: projectForm.title,
          description: projectForm.description,
          category: projectForm.category,
          featured: projectForm.featured,
        };
      }

      const response = await axios.post(
        `${API_BASE}/projects`,
        projectData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProjects([response.data, ...projects]);
      setSuccess('Project created successfully!');
      setShowProjectForm(false);
      resetProjectForm();
      loadDashboardData(); // Refresh all data including gallery
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  // Edit project
  const startEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      category: project.category,
      featured: project.featured || false,
      existingImages: project.images && project.images.length > 0 ? project.images : [],
      existingVideos: project.videos && project.videos.length > 0 ? project.videos : [],
      newImageFiles: [],
      newVideoFiles: []
    });
    setShowProjectForm(true);
  };

  useEffect(() => {
    if (showProjectForm && projectFormRef.current) {
      projectFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showProjectForm, editingProject]);

  // Update project
  const updateProject = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const hasNewMedia = projectForm.newImageFiles.length > 0 || projectForm.newVideoFiles.length > 0;

      let projectData;
      if (hasNewMedia) {
        projectData = new FormData();
        projectData.append('title', projectForm.title);
        projectData.append('description', projectForm.description);
        projectData.append('category', projectForm.category);
        projectData.append('featured', String(projectForm.featured));
        projectData.append('existingImages', JSON.stringify(projectForm.existingImages));
        projectData.append('existingVideos', JSON.stringify(projectForm.existingVideos));
        projectForm.newImageFiles.forEach((file) => projectData.append('images', file));
        projectForm.newVideoFiles.forEach((file) => projectData.append('videos', file));
      } else {
        projectData = {
          title: projectForm.title,
          description: projectForm.description,
          category: projectForm.category,
          featured: projectForm.featured,
          existingImages: projectForm.existingImages,
          existingVideos: projectForm.existingVideos,
        };
      }

      const response = await axios.put(
        `${API_BASE}/projects/${editingProject.id}`,
        projectData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProjects(projects.map(p => p.id === editingProject.id ? response.data : p));
      setSuccess('Project updated successfully!');
      setShowProjectForm(false);
      setEditingProject(null);
      resetProjectForm();
      loadDashboardData(); // Refresh all data including gallery
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project');
    } finally {
      setLoading(false);
    }
  };

  // Reset project form
  const resetProjectForm = () => {
    setProjectForm({
      title: '',
      description: '',
      category: 'Residential',
      featured: false,
      existingImages: [],
      existingVideos: [],
      newImageFiles: [],
      newVideoFiles: []
    });
    setEditingProject(null);
  };

  const cancelProjectForm = () => {
    setShowProjectForm(false);
    setEditingProject(null);
    resetProjectForm();
  };

  // Login form UI
  if (!isLoggedIn) {
    return (
      <div className="admin-login">
        <div className="login-container">
          <h1>Admin Login</h1>
          <p className="login-subtitle">Manage your architectural portfolio</p>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@architectsilas.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="demo-credentials">
            <p><strong>Demo Credentials:</strong></p>
            <p>Email: <code>admin@architectsilas.com</code></p>
            <p>Password: <code>Admin@123456</code></p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard UI
  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects ({projects.length})
        </button>
        <button
          className={`tab ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          Gallery ({gallery.length})
        </button>
        <button
          className={`tab ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          Messages ({messages.length})
        </button>
      </div>

      <div className="admin-content">
        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="tab-content">
            <div className="tab-header">
              <h2>Projects</h2>
              {!showProjectForm && (
                <button
                  className="create-btn"
                  onClick={() => setShowProjectForm(true)}
                >
                  + Create New Project
                </button>
              )}
            </div>

            {showProjectForm && (
              <div className="project-form-container" ref={projectFormRef}>
                <h3>{editingProject ? 'Edit Project' : 'Create New Project'}</h3>
                <form onSubmit={editingProject ? updateProject : createProject}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Project Title *</label>
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={(e) => handleProjectFormChange('title', e.target.value)}
                        placeholder="e.g., Modern Villa"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Category *</label>
                      <select
                        value={projectForm.category}
                        onChange={(e) => handleProjectFormChange('category', e.target.value)}
                        required
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Hospitality">Hospitality</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      value={projectForm.description}
                      onChange={(e) => handleProjectFormChange('description', e.target.value)}
                      placeholder="Detailed description of the project..."
                      rows="5"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={projectForm.featured}
                        onChange={(e) => handleProjectFormChange('featured', e.target.checked)}
                      />
                      <span className="checkbox-label">Featured Project</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <label>Project Images</label>
                    {projectForm.existingImages.length > 0 && (
                      <div className="existing-media-list">
                        {projectForm.existingImages.map((image, index) => (
                          <div key={`existing-image-${index}`} className="existing-media-item">
                            <img
                              src={resolveMediaUrl(image)}
                              alt={`Project ${index + 1}`}
                              onClick={() => setPreviewMedia({ type: 'image', src: resolveMediaUrl(image), title: projectForm.title })}
                            />
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={() => removeExistingMedia('existingImages', index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleMediaFilesChange('newImageFiles', e.target.files)}
                    />
                    {projectForm.newImageFiles.length > 0 && (
                      <p className="upload-summary">
                        {projectForm.newImageFiles.length} new image(s) selected
                      </p>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Project Videos</label>
                    {projectForm.existingVideos.length > 0 && (
                      <div className="existing-media-list">
                        {projectForm.existingVideos.map((video, index) => (
                          <div key={`existing-video-${index}`} className="existing-media-item existing-video-item">
                            <video
                              controls
                              preload="metadata"
                              onClick={() => setPreviewMedia({ type: 'video', src: resolveMediaUrl(video), title: projectForm.title })}
                            >
                              <source src={resolveMediaUrl(video)} />
                              Your browser does not support the video tag.
                            </video>
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={() => removeExistingMedia('existingVideos', index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <input
                      type="file"
                      accept="video/*"
                      multiple
                      onChange={(e) => handleMediaFilesChange('newVideoFiles', e.target.files)}
                    />
                    {projectForm.newVideoFiles.length > 0 && (
                      <p className="upload-summary">
                        {projectForm.newVideoFiles.length} new video(s) selected
                      </p>
                    )}
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="submit-btn" disabled={loading}>
                      {loading ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={cancelProjectForm}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="items-grid">
              {projects.length === 0 ? (
                <p>No projects yet. Click "Create New Project" to add one.</p>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="item-card editable-card"
                    onClick={() => startEditProject(project)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        startEditProject(project);
                      }
                    }}
                  >
                    {project.image_url ? (
                      <img
                        src={resolveMediaUrl(project.image_url)}
                        alt={project.title}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewMedia({ type: 'image', src: resolveMediaUrl(project.image_url), title: project.title });
                        }}
                      />
                    ) : (
                      <div className="item-media-placeholder">No image attached</div>
                    )}
                    <h3>{project.title}</h3>
                    <p className="description-preview">
                      {project.description.substring(0, 100)}...
                    </p>
                    <p className="category">{project.category}</p>
                    {project.featured && (
                      <span className="featured-badge">★ Featured</span>
                    )}
                    {project.images && (
                      <p className="image-count">{project.images.length} images</p>
                    )}
                    {project.videos && project.videos.length > 0 && (
                      <p className="image-count">{project.videos.length} videos</p>
                    )}
                    <div className="card-actions">
                      <button
                        type="button"
                        className="edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditProject(project);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProject(project.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="tab-content">
            <h2>Gallery</h2>
            <div className="gallery-grid">
              {gallery.length === 0 ? (
                <p>No gallery images yet</p>
              ) : (
                gallery.map((image) => (
                  <div key={image.id} className="gallery-item">
                    <img
                      src={resolveMediaUrl(image.image_url)}
                      alt={image.title}
                      onClick={() => setPreviewMedia({ type: 'image', src: resolveMediaUrl(image.image_url), title: image.title })}
                    />
                    <h3>{image.title}</h3>
                    <button
                      className="delete-btn"
                      onClick={() => deleteGalleryImage(image.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="tab-content">
            <h2>Contact Messages</h2>
            {messages.length === 0 ? (
              <p>No messages yet</p>
            ) : (
              <div className="messages-table-wrapper">
                <table className="messages-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Message</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((msg) => (
                      <tr key={msg.id} className={msg.read ? 'read' : 'unread'}>
                        <td>{msg.name}</td>
                        <td>{msg.email}</td>
                        <td>{msg.message.substring(0, 50)}...</td>
                        <td>{new Date(msg.created_at).toLocaleDateString()}</td>
                        <td>
                          {msg.read ? (
                            <span className="status-badge read">Read</span>
                          ) : (
                            <span className="status-badge unread">Unread</span>
                          )}
                        </td>
                        <td>
                          {!msg.read && (
                            <button
                              className="action-btn"
                              onClick={() => markAsRead(msg.id)}
                            >
                              Mark as Read
                            </button>
                          )}
                          <button
                            className="delete-btn"
                            onClick={() => deleteMessage(msg.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {previewMedia && (
        <div className="media-preview-modal" onClick={() => setPreviewMedia(null)}>
          <div className="media-preview-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setPreviewMedia(null)}>×</button>
            {previewMedia.type === 'image' ? (
              <img src={previewMedia.src} alt={previewMedia.title || 'Preview'} className="preview-image" />
            ) : (
              <video className="preview-video" controls autoPlay preload="metadata">
                <source src={previewMedia.src} />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
