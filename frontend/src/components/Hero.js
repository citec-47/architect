import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Hero.css';

const API_ORIGIN = process.env.REACT_APP_API_ORIGIN || 'https://architect-o17k.onrender.com';

const FALLBACK_CAMEROON_SLIDES = [
  {
    id: 1,
    title: 'Bamenda Hillside Residence',
    image_url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&h=600&fit=crop',
  },
  {
    id: 2,
    title: 'Douala Contemporary Family Home',
    image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=600&fit=crop',
  },
  {
    id: 3,
    title: 'Yaoundé Urban Courtyard Villa',
    image_url: 'https://images.unsplash.com/photo-1600566753151-384129cf4e3e?w=1200&h=600&fit=crop',
  },
  {
    id: 4,
    title: 'Limbe Coastal Architecture',
    image_url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=600&fit=crop',
  },
  {
    id: 5,
    title: 'Buea Green-Climate Residence',
    image_url: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=1200&h=600&fit=crop',
  },
  {
    id: 6,
    title: 'West Region Modern Compound',
    image_url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&h=600&fit=crop',
  },
  {
    id: 7,
    title: 'Cameroon-Inspired Stone and Timber Home',
    image_url: 'https://images.unsplash.com/photo-1600607687644-c7f34b5063ec?w=1200&h=600&fit=crop',
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const response = await axios.get(`${API_ORIGIN}/api/gallery`);
      const apiSlides = (Array.isArray(response.data) ? response.data : [])
        .filter((item) => item?.image_url)
        .slice(0, 7);
      setImages(apiSlides.length > 0 ? apiSlides : FALLBACK_CAMEROON_SLIDES);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      setImages(FALLBACK_CAMEROON_SLIDES);
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
