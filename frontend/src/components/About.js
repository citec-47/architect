import React from 'react';
import './About.css';

const About = () => {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>About Architect Silas</h2>
            <p>
              With over 5 years of experience in architectural design and urban planning, I have dedicated
              my career to creating spaces that seamlessly blend aesthetic elegance with practical functionality.
              My approach focuses on understanding the unique needs of each client and translating their vision
              into remarkable, timeless designs.
            </p>
            <p>
              I believe that architecture is more than just buildings—it's about creating environments that
              enhance the quality of life. Each project is an opportunity to innovate, to respect the environment,
              and to contribute positively to the communities we shape.
            </p>

            <div className="philosophy">
              <h3>Design Philosophy</h3>
              <p>
                <strong>Minimalism Meets Functionality:</strong> Every element serves a purpose. We eliminate
                unnecessary ornamentation to reveal the pure beauty of form and space.
              </p>
              <p>
                <strong>Sustainable Excellence:</strong> My designs prioritize environmental responsibility,
                incorporating green technologies and sustainable materials to ensure buildings that endure while
                minimizing ecological impact.
              </p>
              <p>
                <strong>Client-Centric Design:</strong> Your vision drives every decision. I listen, collaborate,
                and iterate until we've created something that exceeds expectations.
              </p>
              <p>
                <strong>Timeless Elegance:</strong> We create designs that won't be dated next season. Our work
                stands the test of time, remaining beautiful and relevant for generations.
              </p>
            </div>
          </div>

          <div className="about-stats">
            <div className="stat">
              <h3>5</h3>
              <p>Years of Experience</p>
            </div>
            <div className="stat">
              <h3>50+</h3>
              <p>Completed Projects</p>
            </div>
            <div className="stat">
              <h3>200+</h3>
              <p>Satisfied Clients</p>
            </div>
            <div className="stat">
              <h3>5</h3>
              <p>Design Awards</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
