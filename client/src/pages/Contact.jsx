import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { submitContactForm } from '../api/contact';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await submitContactForm(formData);
      setStatus({ type: 'success', message: 'Message sent successfully!' });
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-banner">
        <img src="https://it-expertsolutions.com/images/2020/10/30/contact-us-banner.jpg" alt="Contact Us Banner" className="banner-image" />
      </div>

      <div className="company-details">
        <h2>Contact Us</h2>
        <div className="details-card">
          <div className="detail-item">
            <FaMapMarkerAlt className="detail-icon" />
            <div className="detail-text">
              <h3>Head Office</h3>
              <p>123, Downtown, Toronto, ON</p>
            </div>
          </div>
          <div className="detail-item">
            <FaPhoneAlt className="detail-icon" />
            <div className="detail-text">
              <h3>Phone</h3>
              <p>+1 234 567 890</p>
            </div>
          </div>
          <div className="detail-item">
            <FaEnvelope className="detail-icon" />
            <div className="detail-text">
              <h3>Email</h3>
              <p>contact@appointme247.com</p>
            </div>
          </div>
        </div>
      </div>
      {/* Map Container */}
      <div className="map-container">
        <div className="map-card left">
          <h3>Toronto Location</h3>
          <iframe
            title="Toronto Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d369107.53666429064!2d-79.7076989920169!3d43.71776753961089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cb90d7c63ba5%3A0x323555502ab4c477!2sToronto%2C%20ON!5e0!3m2!1sen!2sca!4v1730851563167!5m2!1sen!2sca"
            width="100%"
            height="400"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        <div className="map-card right">
          <h3>Waterloo Location</h3>
          <iframe
            title="Waterloo Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d92638.89821864756!2d-80.62911998324455!3d43.48218891522432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882bf1565ffe672b%3A0x5037b28c7231d90!2sWaterloo%2C%20ON!5e0!3m2!1sen!2sca!4v1730851803695!5m2!1sen!2sca"
            width="100%"
            height="400"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Contact Form */}
      <div className="contact-form">
        <h2>Get In Touch</h2>
        {status && <p className={`status-message ${status.type}`}>{status.message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="name-group">
            <div className="form-group">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Enter your first name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Enter your last name"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number:</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Type your message here..."
            />
          </div>
          <button type="submit" className="submit-button">
            Submit
            <span className="arrow">→</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
