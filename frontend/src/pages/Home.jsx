import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Wrench, SearchCode, ArrowRight } from 'lucide-react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page animate-fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Detect Vehicle Faults with <span className="text-gradient">AI Precision</span>
            </h1>
            <p className="hero-subtitle">
              Instantly diagnose your car's issues, understand OBD-II codes, and get estimated repair costs using advanced machine learning models.
            </p>
            <div className="hero-cta">
              <Link to="/diagnose" className="btn-primary btn-lg">
                Diagnose Now <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="btn-secondary btn-lg">
                Learn More
              </Link>
            </div>
            
            <div className="hero-stats">
              <div className="stat-item glass-panel">
                <h3 className="text-gradient">92%</h3>
                <p>Accuracy</p>
              </div>
              <div className="stat-item glass-panel">
                <h3 className="text-gradient">100+</h3>
                <p>Faults Detected</p>
              </div>
              <div className="stat-item glass-panel">
                <h3 className="text-gradient">24/7</h3>
                <p>AI Support</p>
              </div>
            </div>
          </div>
          
          <div className="hero-visual">
            <div className="ai-brain-container delay-200">
              <div className="glow-orb"></div>
              <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=600" alt="Futuristic Car" className="hero-img glass-panel" />
              <div className="floating-card glass-panel card-1 animate-float delay-100">
                <SearchCode size={24} className="icon-blue" />
                <div>
                  <h4>P0300 Detected</h4>
                  <p>Engine Misfire</p>
                </div>
              </div>
              <div className="floating-card glass-panel card-2 animate-float delay-300">
                <Wrench size={24} className="icon-purple" />
                <div>
                  <h4>Fix Suggestion</h4>
                  <p>Check Spark Plugs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section container delay-200">
        <div className="section-header">
          <h2 className="section-title">Why choose AutoPulse AI?</h2>
          <p className="section-desc">Experience the next generation of vehicle maintenance with intelligent insights.</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <SearchCode size={32} color="#3b82f6" />
            </div>
            <h3>Smart Diagnostics</h3>
            <p>Input text symptoms or connect OBD-II data for instant fault identification.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <Wrench size={32} color="#8b5cf6" />
            </div>
            <h3>Actionable Fixes</h3>
            <p>Get both temporary roadside fixes and permanent professional solutions.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <ShieldCheck size={32} color="#10b981" />
            </div>
            <h3>Cost Estimation</h3>
            <p>Avoid being overcharged with our real-time estimated repair costs in INR.</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works-section container delay-300">
        <div className="glass-panel hiw-container">
          <div className="hiw-content">
            <h2>How It Works</h2>
            <div className="hiw-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div>
                  <h4>Input Symptoms</h4>
                  <p>Describe what you hear, feel, or see, or provide OBD data.</p>
                </div>
              </div>
              <div className="step line"></div>
              <div className="step">
                <div className="step-number">2</div>
                <div>
                  <h4>AI Processing</h4>
                  <p>Our ML model analyzes data across thousands of known faults.</p>
                </div>
              </div>
              <div className="step line"></div>
              <div className="step">
                <div className="step-number">3</div>
                <div>
                  <h4>Get Results</h4>
                  <p>Receive fault name, severity, exact fixes and cost estimates.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
