import React from 'react';
import { Activity, Mail, Phone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer glass-panel">
      <div className="container footer-content">
        <div className="footer-brand">
          <Link to="/" className="brand">
            <Activity className="brand-icon" size={24} color="#8b5cf6" />
            <span className="brand-text text-gradient">AutoPulse AI</span>
          </Link>
          <p className="footer-desc">
            Empowering drivers with AI-driven vehicle diagnostics. Detect faults, find solutions, and estimate costs instantly.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon"><Mail size={20} /></a>
            <a href="#" className="social-icon"><Phone size={20} /></a>
            <a href="#" className="social-icon"><Globe size={20} /></a>
          </div>
        </div>
        
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/diagnose">Diagnose AI</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        
        <div className="footer-newsletter">
          <h4>Stay Updated</h4>
          <p>Subscribe for the latest AI vehicle tech news.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button className="btn-primary">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} AutoPulse AI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
