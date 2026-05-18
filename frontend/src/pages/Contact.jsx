import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page container animate-fade-in">
      <div className="contact-header">
        <h1 className="text-gradient">Get In Touch</h1>
        <p>Have questions or feedback? We'd love to hear from you.</p>
      </div>

      <div className="contact-grid">
        <div className="contact-info glass-panel">
          <h3>Contact Information</h3>
          <p>We're dedicated to improving auto diagnostics. Let us know how we can help.</p>
          
          <div className="info-items">
            <div className="info-item">
              <Mail className="icon-blue" />
              <div>
                <h4>Email</h4>
                <p>support@autopulse.ai</p>
              </div>
            </div>
            <div className="info-item">
              <Phone className="icon-purple" />
              <div>
                <h4>Phone</h4>
                <p>+91 (080) 1234-5678</p>
              </div>
            </div>
            <div className="info-item">
              <MapPin className="icon-blue" />
              <div>
                <h4>Office</h4>
                <p>Tech Park, Bengaluru, India</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form glass-panel">
          <h3>Send a Message</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label className="input-label">Name</label>
              <input type="text" placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label className="input-label">Email</label>
              <input type="email" placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label className="input-label">Message</label>
              <textarea rows="4" placeholder="How can we help?"></textarea>
            </div>
            <button className="btn-primary" style={{ width: '100%' }}>
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
