import React from 'react';
import { Shield, Users, Clock, Award, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import electricianImg from '../assets/electrician.jpg';

const About = () => {
  return (
    <div className="about-page-wrapper section">
      
      {/* 1. Hero Section */}
      <div className="container">
         <div className="about-hero text-center">
            <h1 className="hero-heading">Reimagining Home Maintenance</h1>
            <p className="text-muted" style={{fontSize: '1.25rem', maxWidth: '800px', margin: '0 auto 40px'}}>
              At FixIt, we believe that maintaining your home should be as easy and satisfying as ordering your favorite meal. 
              We bridge the gap between busy homeowners and thoroughly vetted, elite local professionals.
            </p>
         </div>
      </div>

      {/* 2. Visual Split Section */}
      <div className="bg-white" style={{padding: '80px 0'}}>
         <div className="container split-layout">
            <div className="split-left">
               <img src={electricianImg} alt="Professional Worker" className="rounded-img shadow-img" />
            </div>
            <div className="split-right">
               <h2 style={{fontSize: '2.2rem', marginBottom: '24px', color: 'var(--text-primary)'}}>Our Mission</h2>
               <p className="text-muted" style={{fontSize: '1.1rem', marginBottom: '24px', lineHeight: '1.7'}}>
                 The home services industry has traditionally been plagued by unreliability, opaque pricing, and lack of accountability. We launched FixIt to change that paradigm completely.
               </p>
               <p className="text-muted" style={{fontSize: '1.1rem', marginBottom: '32px', lineHeight: '1.7'}}>
                 By leveraging smart algorithmic matching and maintaining a relentlessly rigorous vetting process for our professionals, we ensure that every job—no matter how small—is executed flawlessly.
               </p>
               
               <div className="core-values-list">
                  <div className="value-item">
                     <Shield className="text-accent" />
                     <span>Trust & Transparency</span>
                  </div>
                  <div className="value-item">
                     <Award className="text-accent" />
                     <span>Uncompromising Quality</span>
                  </div>
                  <div className="value-item">
                     <Clock className="text-accent" />
                     <span>Respect for Your Time</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 3. By The Numbers */}
      <div className="container m-t-big">
         <div className="stats-banner card">
            <div className="stat-box">
               <h3>10k+</h3>
               <p>Repairs Completed</p>
            </div>
            <div className="stat-box">
               <h3>4.9/5</h3>
               <p>Average Rating</p>
            </div>
            <div className="stat-box">
               <h3>500+</h3>
               <p>Verified Elite Experts</p>
            </div>
            <div className="stat-box">
               <h3>24/7</h3>
               <p>Unmatched Support</p>
            </div>
         </div>
      </div>

      {/* 4. Join Story */}
      <div className="container m-t-big text-center">
         <div className="join-cta-card card">
            <h2>Ready to experience the difference?</h2>
            <p className="text-muted" style={{fontSize:'1.1rem', marginBottom: '32px'}}>Join thousands of satisfied homeowners who trust FixIt.</p>
            <div style={{display: 'flex', gap: '16px', justifyContent: 'center'}}>
               <Link to="/register" className="btn-primary" style={{padding: '16px 32px', fontSize: '1.1rem'}}>Sign Up Free</Link>
               <Link to="/workers" className="btn-secondary" style={{padding: '16px 32px', fontSize: '1.1rem'}}>Browse Experts</Link>
            </div>
         </div>
      </div>

      <style jsx>{`
        .about-page-wrapper {
           min-height: 100vh;
           background: var(--background);
           padding-top: 60px;
           padding-bottom: 100px;
        }

        .bg-white { background: var(--card-bg); border-top: 1px solid var(--border-light); border-bottom: 1px solid var(--border-light); }
        .hero-heading { font-size: 3.5rem; color: var(--text-primary); margin-bottom: 24px; letter-spacing: -1.5px; }

        .split-layout {
           display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
        }
        .rounded-img { width: 100%; border-radius: 24px; object-fit: cover; height: 500px; }
        .shadow-img { box-shadow: var(--shadow-main); }

        .core-values-list { display: flex; flex-direction: column; gap: 16px; }
        .value-item { display: flex; align-items: center; gap: 16px; font-size: 1.1rem; font-weight: 700; color: var(--text-primary); }
        .value-item .text-accent { color: var(--primary-accent); }

        .m-t-big { margin-top: 80px; }
        
        .stats-banner {
           display: grid; grid-template-columns: repeat(4, 1fr); padding: 60px; text-align: center; border: 1px solid var(--border-light); box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }
        .stat-box h3 { font-size: 3.5rem; color: var(--primary-accent); letter-spacing: -1.5px; margin-bottom: 8px; }
        .stat-box p { font-size: 1.1rem; font-weight: 600; color: var(--text-secondary); }

        .join-cta-card {
           padding: 80px; background: rgba(255,122,0,0.04); border: 1px dashed rgba(255,122,0,0.3); box-shadow: none;
        }
        .join-cta-card h2 { font-size: 2.5rem; color: var(--text-primary); margin-bottom: 16px; letter-spacing: -1px; }

        @media (max-width: 1024px) {
           .split-layout { grid-template-columns: 1fr; }
           .stats-banner { grid-template-columns: 1fr 1fr; gap: 40px; }
           .rounded-img { height: 350px; }
        }
        @media (max-width: 768px) {
           .stats-banner { grid-template-columns: 1fr; }
           .join-cta-card { padding: 40px 20px; }
           .join-cta-card div { flex-direction: column; }
        }
      `}</style>
    </div>
  );
};

export default About;
