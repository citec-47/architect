import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Hero.css';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/gallery');
      setImages(response.data);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      // Use fallback images if API fails
      setImages([
        {
          id: 1,
          title: 'Modern Villa 1',
          image_url:
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=600&fit=crop',
        },
        {
          id: 2,
          title: 'Contemporary Home',
          image_url:
            'https://images.unsplash.com/photo-1600121848594-d746dfc1d3b7?w=1200&h=600&fit=crop',
        },
        {
          id: 3,
          title: 'Luxury Residence',
          image_url:
            'https://images.unsplash.com/photo-1600585154363-967b9dcb6d2d?w=1200&h=600&fit=crop',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return <div className="hero-loading">Loading...</div>;
  }

  return (
    <section className="hero" id="home">
      <div className="gallery-container">
        {images.length > 0 && (
          <>
            <div className="gallery-slide">
              <img
                src={images[currentSlide].image_url}
                alt={images[currentSlide].title}
                className="slide-image"
              />
              <div className="slide-caption">
                <h2>{images[currentSlide].title}</h2>
              </div>
            </div>

            <button className="gallery-btn prev" onClick={prevSlide}>
              &#10094;
            </button>
            <button className="gallery-btn next" onClick={nextSlide}>
              &#10095;
            </button>

            <div className="gallery-dots">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                ></button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <h1>Crafting Spaces That Inspire</h1>
          <p>
            Welcome to the portfolio of Architect Silas, where modern design meets timeless elegance.
            Explore exceptional architectural works that redefine living spaces.
          </p>
          <button className="btn" onClick={scrollToProjects}>
            View Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
