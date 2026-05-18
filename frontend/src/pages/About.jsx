import React from 'react';
import { ShieldCheck, Target, Users } from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <div className="about-page container animate-fade-in">
      <div className="about-header text-center">
        <h1 className="text-gradient">About AutoPulse AI</h1>
        <p className="subtitle">Democratizing vehicle diagnostics for everyone, everywhere.</p>
      </div>

      <div className="about-content glass-panel">
        <div className="vision-mission">
          <div className="story-block">
            <h3><Target className="icon-blue" /> Our Mission</h3>
            <p>
              AutoPulse AI aims to eliminate the stress and uncertainty of car breakdowns. 
              By combining cutting-edge machine learning with automotive expertise, we provide 
              instant, accurate diagnoses and cost estimates so drivers can make informed decisions.
            </p>
          </div>
          <div className="story-block">
            <h3><ShieldCheck className="icon-purple" /> Our Focus</h3>
            <p>
              We focus on transparency and accuracy. Traditional repair shops often leave 
              customers guessing about the true nature of their vehicle problems and the real 
              costs involved. We're bridging the information gap with AI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
