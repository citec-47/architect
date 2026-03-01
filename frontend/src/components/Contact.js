import React, { useState } from 'react';
import { contactAPI } from '../services/api';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await contactAPI.create(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="container">
        <h2>Get in Touch</h2>
        <p className="contact-intro">
          Have a project in mind? I'd love to discuss your vision and create something extraordinary together.
        </p>

        <div className="contact-wrapper">
          <form className="contact-form" onSubmit={handleSubmit}>
            {submitted && (
              <div className="success-message">
                ✓ Thank you! Your message has been sent successfully. I'll get back to you soon.
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
                rows="6"
                required
              ></textarea>
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          <div className="contact-info">
            <div className="info-item">
              <h3>Contact Information</h3>
              <p>
                Feel free to reach out through any of the following channels. I'm always happy to discuss new projects
                and opportunities.
              </p>
            </div>

            <div className="info-item">
              <h4>Email</h4>
              <p>
                <a href="mailto:silaschah18@gmail.com">silaschah18@gmail.com</a>
              </p>
            </div>

            <div className="info-item">
              <h4>Phone</h4>
              <p>
                <a href="tel:+237679222942">+237679222942</a>
              </p>
            </div>

            <div className="info-item">
              <h4>Location</h4>
              <p>Bamenda, Northwest, Cameroon</p>
            </div>

            <div className="info-item">
              <h4>Office Hours</h4>
              <p>
                Monday – Friday: 9:00 AM – 6:00 PM
                <br />
                Saturday: By appointment
                <br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
