import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Architect Silas</h4>
            <p>Crafting exceptional spaces through thoughtful design and innovative solutions.</p>
          </div>

          <div className="footer-section">
            <h4>Navigation</h4>
            <ul>
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#projects">Projects</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <p>
              Email: <a href="mailto:silaschah18@gmail.com">silaschah18@gmail.com</a>
            </p>
            <p>
              Phone: <a href="tel:+237679222942">+237679222942</a>
            </p>
          </div>

          <div className="footer-section">
            <h4>Follow</h4>
            <div className="social-links">
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" title="Instagram">
                Instagram
              </a>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" title="Pinterest">
                Pinterest
              </a>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <a href="#" title="LinkedIn">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Architect Silas. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
