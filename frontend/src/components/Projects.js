import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Projects.css';

const API_ORIGIN = process.env.REACT_APP_API_ORIGIN || 'http://localhost:5000';

const resolveMediaUrl = (mediaUrl) => {
  if (!mediaUrl) {
    return '';
  }
  if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
    return mediaUrl;
  }
  return `${API_ORIGIN}${mediaUrl}`;
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [previewMedia, setPreviewMedia] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const params = filter !== 'All' ? { category: filter } : {};
      const response = await axios.get('http://localhost:5000/api/projects', { params });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const categories = ['All', 'Residential', 'Commercial', 'Hospitality'];

  const getCategoryDescription = (category) => {
    const descriptions = {
      Residential: 'Explore our collection of residential projects, from modern villas to urban apartments, each designed with comfort and elegance in mind.',
      Commercial: 'Discover our commercial projects featuring innovative office spaces, retail centers, and mixed-use developments that drive business success.',
      Hospitality: 'View our hospitality projects including luxury hotels, boutique accommodations, and resort designs that create memorable guest experiences.'
    };
    return descriptions[category] || 'Browse through our diverse portfolio of architectural projects.';
  };

  if (loading) {
    return <div className="projects-loading">Loading projects...</div>;
  }

  return (
    <section className="projects" id="projects">
      <div className="container">
        <h2>My Projects</h2>
        
        {filter !== 'All' && (
          <div className="category-header">
            <h3>{filter} Projects</h3>
            <p>{getCategoryDescription(filter)}</p>
          </div>
        )}

        <div className="filter-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {projects.length === 0 ? (
            <p className="no-projects">No projects found in this category.</p>
          ) : (
            projects.map((project) => (
              <div 
                key={project.id} 
                className="project-card"
                onClick={() => setSelectedProject(project)}
              >
                <div className="project-image">
                  {project.image_url ? (
                    <img
                      src={resolveMediaUrl(project.image_url)}
                      alt={project.title}
                    />
                  ) : (
                    <div className="project-media-placeholder">No image attached</div>
                  )}
                  <div className="project-overlay">
                    <span className="project-category">{project.category}</span>
                    {project.featured && <span className="featured-star">★</span>}
                  </div>
                </div>
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.description.substring(0, 120)}...</p>
                  {((project.images?.length || 0) > 0 || (project.videos?.length || 0) > 0) && (
                    <span className="image-indicator">
                      {(project.images?.length || 0)} photos • {(project.videos?.length || 0)} videos
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="project-modal" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedProject(null)}>×</button>
            <h2>{selectedProject.title}</h2>
            <span className="modal-category">{selectedProject.category}</span>
            
            {selectedProject.images && selectedProject.images.length > 0 && (
              <div className="modal-gallery">
                {selectedProject.images.map((img, index) => (
                  <img
                    key={index}
                    src={resolveMediaUrl(img)}
                    alt={`${selectedProject.title} ${index + 1}`}
                    onClick={() => setPreviewMedia({ type: 'image', src: resolveMediaUrl(img), title: selectedProject.title })}
                  />
                ))}
              </div>
            )}

            {selectedProject.videos && selectedProject.videos.length > 0 && (
              <div className="modal-gallery">
                {selectedProject.videos.map((video, index) => (
                  <video
                    key={`video-${index}`}
                    controls
                    preload="metadata"
                    onClick={() => setPreviewMedia({ type: 'video', src: resolveMediaUrl(video), title: selectedProject.title })}
                  >
                    <source src={resolveMediaUrl(video)} />
                    Your browser does not support the video tag.
                  </video>
                ))}
              </div>
            )}
            
            <div className="modal-description">
              <h3>Project Description</h3>
              <p>{selectedProject.description}</p>
            </div>
          </div>
        </div>
      )}

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
    </section>
  );
};

export default Projects;
