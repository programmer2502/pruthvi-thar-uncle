import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Diagnose AI', path: '/diagnose' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <nav className="navbar glass-panel">
      <div className="container nav-container">
        <Link to="/" className="brand">
          <Activity className="brand-icon" size={28} color="#8b5cf6" />
          <span className="brand-text text-gradient">AutoPulse AI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="nav-links desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          <Link to="/diagnose" className="btn-primary start-btn">Start Diagnosis</Link>
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X color="white" /> : <Menu color="white" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <div className={`mobile-nav glass-panel ${isOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`mobile-link ${location.pathname === link.path ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            {link.name}
          </Link>
        ))}
        <Link to="/diagnose" className="btn-primary" onClick={() => setIsOpen(false)}>
          Start Diagnosis
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
