import React, { useState } from 'react';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <a
          className="brand-link"
          href="#home"
          onClick={(event) => {
            event.preventDefault();
            scrollToSection('home');
          }}
          aria-label="Go to home"
        >
          <img
            src="/brand-icon.svg"
            alt="Architect Silas logo"
            className="brand-icon"
          />
          <div className="logo">
            <h1>ARCHITECT SILAS</h1>
          </div>
        </a>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li>
              <a onClick={() => scrollToSection('home')} href="#home">
                Home
              </a>
            </li>
            <li>
              <a onClick={() => scrollToSection('projects')} href="#projects">
                Projects
              </a>
            </li>
            <li>
              <a onClick={() => scrollToSection('about')} href="#about">
                About
              </a>
            </li>
            <li>
              <a onClick={() => scrollToSection('contact')} href="#contact">
                Get in Touch
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
