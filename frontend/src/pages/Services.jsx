import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Droplets, Zap, Wind, Hammer, Wrench, Paintbrush, Bug, CheckCircle2, Navigation } from 'lucide-react';

const SERVICES_LIST = [
  { name: 'Plumbing', icon: <Droplets size={32} />, desc: 'Expert pipe repairs, leak fixes, and complete bathroom installations by certified plumbers.', features: ['Leak Detection', 'Pipe Replacement', 'Clog Removal'] },
  { name: 'Electrical', icon: <Zap size={32} />, desc: 'Safe wiring, power failure solutions, and modern appliance installations.', features: ['Circuit Repair', 'Lighting Setup', 'Panel Upgrades'] },
  { name: 'AC Repair', icon: <Wind size={32} />, desc: 'Stay cool with instant cooling fixes, deep cleaning, and seasonal maintenance.', features: ['Filter Cleaning', 'Gas Refill', 'Compressor Repair'] },
  { name: 'Carpentry', icon: <Hammer size={32} />, desc: 'Custom furniture building, door installations, and structural woodworking.', features: ['Custom Cabinets', 'Furniture Repair', 'Wood Polish'] },
  { name: 'Painting', icon: <Paintbrush size={32} />, desc: 'Professional interior and exterior painting services with premium color selections.', features: ['Wall Texturing', 'Waterproofing', 'Quick Dry'] },
  { name: 'Pest Control', icon: <Bug size={32} />, desc: 'Eco-friendly pest eradication and severe infestation management solutions.', features: ['Termite Control', 'Rodent Removal', 'Deep Sanitization'] },
];

const Services = () => {
  return (
    <div className="services-page-wrapper section">
      <div className="container">
        
        {/* Header Content */}
        <div className="text-center m-b-big">
           <h1 className="hero-heading">Explore Our Services</h1>
           <p className="text-muted" style={{fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto'}}>
             From minor fixes to major renovations, our network of verified professionals is equipped to handle every aspect of your home maintenance.
           </p>
        </div>

        {/* Services Grid */}
        <div className="services-list-grid">
           {SERVICES_LIST.map((srv, idx) => (
              <div className="card service-card-detailed" key={idx}>
                 <div className="service-card-header">
                    <div className="service-icon-box text-accent">{srv.icon}</div>
                    <h2>{srv.name}</h2>
                 </div>
                 
                 <p className="text-muted mt-4 mb-4">{srv.desc}</p>
                 
                 <ul className="service-feature-list">
                    {srv.features.map((feature, i) => (
                       <li key={i}><CheckCircle2 size={16} color="var(--secondary-accent)" /> <span>{feature}</span></li>
                    ))}
                 </ul>
                 
                 <div className="card-footer-action mt-4">
                    <Link to="/workers" className="btn-secondary w-full" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'}}>
                       Find a {srv.name} Expert <Navigation size={16} />
                    </Link>
                 </div>
              </div>
           ))}
        </div>

        {/* Guarantee Banner */}
        <div className="guarantee-banner card mt-big">
           <ShieldCheck size={48} color="white" />
           <div className="guarantee-text">
              <h2 style={{color: 'white', marginBottom: '8px', fontSize: '2rem'}}>The FixIt Happiness Guarantee</h2>
              <p style={{fontSize: '1.1rem', opacity: 0.9}}>If you're not completely satisfied with the quality of a booked service, we will send another professional to fix it at absolutely zero cost to you.</p>
           </div>
        </div>

      </div>

      <style jsx>{`
        .services-page-wrapper {
           min-height: 100vh;
           background: var(--background);
           padding-top: 60px;
           padding-bottom: 100px;
        }

        .m-b-big { margin-bottom: 60px; }
        .mt-big { margin-top: 80px; }
        .mt-4 { margin-top: 20px; }
        .mb-4 { margin-bottom: 20px; }
        
        .hero-heading { font-size: 3rem; color: var(--text-primary); margin-bottom: 16px; letter-spacing: -1px; }

        .services-list-grid {
           display: grid;
           grid-template-columns: repeat(3, 1fr);
           gap: 32px;
        }

        .service-card-detailed {
           display: flex; flex-direction: column; padding: 40px; border: 1px solid var(--border-light); box-shadow: 0 4px 20px rgba(0,0,0,0.03); transition: transform 0.2s, box-shadow 0.2s;
        }
        .service-card-detailed:hover {
           transform: translateY(-5px); box-shadow: var(--shadow-main); border-color: var(--primary-accent);
        }

        .service-card-header {
           display: flex; align-items: center; gap: 16px;
        }
        .service-icon-box {
           width: 64px; height: 64px; background: rgba(255,122,0,0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center;
        }

        .service-card-detailed h2 { font-size: 1.5rem; color: var(--text-primary); }

        .service-feature-list {
           list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: auto; /* push footer down */
        }
        .service-feature-list li {
           display: flex; align-items: center; gap: 10px; font-size: 0.95rem; font-weight: 600; color: var(--text-primary);
        }

        .card-footer-action {
           border-top: 1px solid var(--border-light); padding-top: 24px;
        }
        .w-full { width: 100%; border-radius: var(--radius-pill); padding: 14px; }

        .guarantee-banner {
           background: var(--secondary-accent); color: white; display: flex; align-items: center; gap: 40px; padding: 48px 60px; border-radius: 24px; box-shadow: var(--shadow-main); border: none;
        }
        
        @media (max-width: 1024px) {
           .services-list-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
           .services-list-grid { grid-template-columns: 1fr; }
           .guarantee-banner { flex-direction: column; text-align: center; gap: 24px; padding: 32px; }
        }
      `}</style>
    </div>
  );
};

export default Services;
