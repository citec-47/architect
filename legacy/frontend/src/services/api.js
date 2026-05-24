import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || `${process.env.REACT_APP_API_ORIGIN || 'https://architect-o17k.onrender.com'}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Projects API
export const projectAPI = {
  getAll: () => api.get('/projects'),
  getFeatured: () => api.get('/projects/featured'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

// Gallery API
export const galleryAPI = {
  getAll: () => api.get('/gallery'),
  add: (data) => api.post('/gallery', data),
  update: (id, data) => api.put(`/gallery/${id}`, data),
};

// Contact API
export const contactAPI = {
  getAll: () => api.get('/contact'),
  create: (data) => api.post('/contact', data),
  markAsRead: (id) => api.put(`/contact/${id}/read`),
  delete: (id) => api.delete(`/contact/${id}`),
};

export default api;
