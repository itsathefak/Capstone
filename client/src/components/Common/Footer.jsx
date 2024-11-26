import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Logo and Company Info */}
        <div className="footer-section company-info">
          <h1 className="footer-title">AppointME</h1>
          <p>Your go-to platform for easy and efficient appointment scheduling.</p>
        </div>

        {/* Navigation Links */}
        <div className="footer-section links">
          <h1 className="footer-title">Quick Links</h1>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="contact-us">Contact</a></li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="footer-section social-media">
          <h1 className="footer-title">Follow Us</h1>
          <div className="social-icons">
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook"><FaFacebookF /></a>
            <a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook"><FaTwitter /></a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook"><FaLinkedinIn /></a>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook"><FaInstagram /></a>
          </div>
        </div>

        {/* Contact Info Section */}
        <div className="footer-section contact-info">
          <h1 className="footer-title">Contact Us</h1>
          <p>Email: <a href="mailto:support@appointme.com">appointme24@gmail.com</a></p>
          <p>Phone: <a href="tel:+1234567890">+1 (234) 567-890</a></p>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>Copyright © 2024 | AppointME | All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
