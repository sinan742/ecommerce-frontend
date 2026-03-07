import React from 'react';
import './Footer.css'; 
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-section brand">
          <h2 className="footer-logo">BEYOND <span className="highlight">THE PITCH</span></h2>
          <p>
            More than just a store; we are a collective of football enthusiasts dedicated to bringing you the highest quality gear from around the globe.
          </p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF/></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram/></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaXTwitter/></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube/></a>
          </div>
        </div>

        {/* Links Section */}
        <div className="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/Products">Products</a></li>
            <li><a href="/about">Our Story</a></li>
            <li><a href="/orders">Order Tracking</a></li>
          </ul>
        </div>

        {/* Newsletter / Contact Section */}
        <div className="footer-section contact">
          <h4>Newsletter</h4>
          <p>Get the latest drops and exclusive deals.</p>
          <div className="footer-subscribe">
            <input type="email" placeholder="Email Address" />
            <button>Join</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} Beyond the Pitch. All Rights Reserved.</p>
          <div className="footer-legal">
            <a href="/privacy-policy">Privacy Policy</a>
            <span>|</span>
            <a href="/terms-of-service">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;