import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, ArrowRight, Zap, Droplets, Wind, Wrench, Hammer, CheckCircle2, ShieldCheck, Clock, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { name: 'Plumbing', icon: <Droplets size={32} />, desc: 'Expert pipe repairs & installations.' },
  { name: 'Electrical', icon: <Zap size={32} />, desc: 'Safe wiring & power solutions.' },
  { name: 'AC Repair', icon: <Wind size={32} />, desc: 'Stay cool with instant cooling fixes.' },
  { name: 'Carpentry', icon: <Hammer size={32} />, desc: 'Custom furniture & structural woodworking.' }
];

const Home = () => {
  const [workers, setWorkers] = useState([]);
  
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/workers`);
        setWorkers(data);
      } catch (err) {
        toast.error('Failed to fetch workers');
      }
    };
    fetchWorkers();
  }, []);

  return (
    <div className="home-wrapper">
      
      {/* 2. HERO SECTION */}
      <section className="food-hero section">
         <div className="container hero-grid">
            <div className="hero-left fade-in-up">
               <h1 className="hero-heading">Reliable Home Services for a <span className="text-accent">Better Life</span></h1>
               <p className="hero-subtext text-muted">Book verified experts for cleaning, plumbing, electrical, and more. Transparent pricing, instant booking.</p>
               <div className="hero-cta">
                  <Link to="/services" className="btn-primary">Explore Services <ArrowRight size={18} /></Link>
               </div>
            </div>
            
            <div className="hero-right">
               <div className="hero-image-wrapper">
                  <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800" alt="Home Services Professionals" className="main-hero-img" />
                  
                  {/* Floating Elements */}
                  <div className="float-card float-1 card-light">
                     <Clock className="text-accent" />
                     <div><strong>Fast Service</strong><span>Under 2 hours</span></div>
                  </div>
                  <div className="float-card float-2 card-light">
                     <ShieldCheck className="text-secondary" />
                     <div><strong>Trusted Experts</strong><span>Background Verified</span></div>
                  </div>
                  <div className="float-card float-3 card-light">
                     <Tag className="text-accent" />
                     <div><strong>Affordable</strong><span>Best Pricing</span></div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3. FEATURED SERVICES CAROUSEL */}
      <section className="section bg-white">
         <div className="container">
            <h2 className="section-title">Popular Sub-Services</h2>
            <div className="carousel-wrapper">
               {['Deep Cleaning', 'Furnace Repair', 'Sofa Cleaning', 'Pipe Installation', 'Wall Painting'].map((srv, idx) => (
                  <div className="carousel-card card-light" key={idx}>
                     <img src={`https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80`} alt={srv} />
                     <div className="caro-content">
                        <h3>{srv}</h3>
                        <p className="text-muted">From $45/hr</p>
                        <Link to="/services" className="btn-secondary" style={{padding: '8px 16px', fontSize:'0.9rem', width:'100%', marginTop:'10px'}}>Book Now</Link>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 4. OUR CATEGORIES */}
      <section className="section">
         <div className="container">
            <h2 className="section-title text-center">Our Core Categories</h2>
            <div className="grid grid-4">
               {CATEGORIES.map(cat => (
                  <div className="category-card card" key={cat.name}>
                     <div className="cat-icon text-accent">{cat.icon}</div>
                     <h3>{cat.name}</h3>
                     <p className="text-muted">{cat.desc}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 5. GET STARTED TODAY */}
      <section className="section bg-white get-started-section">
         <div className="container split-layout">
            <div className="split-left">
               <h2 className="section-title">Get Started Today in 3 Easy Steps</h2>
               <p className="text-muted mb-4">We've revolutionized home services so you can get back to living. Our intelligent backend guarantees matching accuracy.</p>
               
               <ul className="feature-list">
                  <li><CheckCircle2 color="var(--secondary-accent)" size={24} /> <strong>AI Matching:</strong> Our algorithm instantly connects you to the optimal professional.</li>
                  <li><CheckCircle2 color="var(--secondary-accent)" size={24} /> <strong>Real-time Chat:</strong> Discuss custom issues via our secure platform.</li>
                  <li><CheckCircle2 color="var(--secondary-accent)" size={24} /> <strong>Easy Booking:</strong> Select your timeframe and pay securely.</li>
               </ul>
            </div>
            <div className="split-right">
               <img src="https://images.unsplash.com/photo-1544717685-618765275e7a?auto=format&fit=crop&q=80&w=600" className="rounded-img" alt="Chat UI Display" />
            </div>
         </div>
      </section>

      {/* 6. TOP WORKERS SECTION */}
      <section className="section">
         <div className="container">
            <h2 className="section-title">Top Rated Professionals</h2>
            <div className="grid grid-3">
               {workers.slice(0, 3).map(worker => (
                  <div className="worker-card card" key={worker._id}>
                     <div className="w-header">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.userId?.name}`} alt="Avatar" className="w-avatar" />
                        <div>
                           <h3>{worker.userId?.name}</h3>
                           <p className="text-muted">{worker.category} Specialist</p>
                        </div>
                     </div>
                     <div className="w-stats">
                        <div className="rating"><Star size={16} fill="var(--primary-accent)" color="var(--primary-accent)" /> 4.9 (120 reviews)</div>
                        <div className="price">${worker.hourlyRate}/hour</div>
                     </div>
                     <Link to={`/worker/${worker.userId?._id}`} className="btn-primary" style={{width:'100%'}}>Book Provider</Link>
                  </div>
               ))}
               
               {workers.length === 0 && <p className="text-muted">Loading network professionals...</p>}
            </div>
         </div>
      </section>

      {/* 7. MEET OUR TEAM */}
      <section className="section bg-white team-section">
         <div className="container text-center">
            <h2 className="section-title">Meet the Leadership</h2>
            <div className="grid grid-3 team-grid">
               {[
                  {n: 'Sarah Jenkins', r: 'Head of Operations', i: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200'},
                  {n: 'David Smith', r: 'CTO / Backend Architect', i: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200'},
                  {n: 'Elena Rodriguez', r: 'Provider Relations', i: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'}
               ].map(t => (
                  <div className="team-card card" key={t.n}>
                     <img src={t.i} alt={t.n} className="t-img" />
                     <h3>{t.n}</h3>
                     <p className="text-muted">{t.r}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* 8. PROMO SECTION */}
      <section className="container mb-big">
         <div className="promo-banner card">
            <div className="promo-content">
               <h2>Ready to transform your home?</h2>
               <p>Get <strong>20% Discount</strong> on Your First Service!</p>
            </div>
            <Link to="/register" className="btn-primary promo-btn">Claim Offer Now</Link>
         </div>
      </section>

      <style jsx>{`
        .bg-white { background: var(--card-bg); }
        .text-center { text-align: center; }
        .mb-4 { margin-bottom: 24px; }
        .mb-big { margin-bottom: 100px; }
        
        .section-title { font-size: 2.2rem; margin-bottom: 40px; color: var(--text-primary); letter-spacing:-0.5px;}

        /* Hero */
        .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .hero-heading { font-size: 3.5rem; line-height: 1.1; margin-bottom: 20px; color: var(--text-primary); }
        .hero-subtext { font-size: 1.2rem; margin-bottom: 40px; max-width: 500px; }
        
        .hero-image-wrapper { position: relative; }
        .main-hero-img { width: 100%; border-radius: 40px; box-shadow: var(--shadow-main); object-fit: cover; height: 500px; }
        
        .float-card { position: absolute; padding: 12px 20px; display: flex; align-items: center; gap: 12px; border-radius: 99px; white-space: nowrap; z-index: 2; width: max-content; }
        .float-card div { display: flex; flex-direction: column; }
        .float-card strong { font-size: 0.9rem; color: var(--text-primary); }
        .float-card span { font-size: 0.75rem; color: var(--text-secondary); }
        
        .float-1 { top: 40px; right: -40px; }
        .float-2 { bottom: 60px; left: -40px; }
        .float-3 { bottom: -20px; right: 20px; }

        /* Carousel */
        .carousel-wrapper { display: flex; gap: 24px; overflow-x: auto; padding-bottom: 24px; scroll-snap-type: x mandatory; }
        .carousel-wrapper::-webkit-scrollbar { height: 8px; }
        .carousel-wrapper::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 10px; }
        .carousel-card { min-width: 280px; scroll-snap-align: start; padding: 0; overflow: hidden; }
        .carousel-card img { width: 100%; height: 180px; object-fit: cover; }
        .caro-content { padding: 20px; }
        .caro-content h3 { font-size: 1.1rem; margin-bottom: 4px; }
        
        /* Categories */
        .category-card { text-align: center; display: flex; flex-direction: column; align-items: center; padding: 40px 24px; }
        .cat-icon { width: 80px; height: 80px; background: rgba(255,122,0,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        .category-card h3 { margin-bottom: 10px; }

        /* Get Started */
        .split-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .feature-list { list-style: none; display: flex; flex-direction: column; gap: 20px; }
        .feature-list li { display: flex; align-items: flex-start; gap: 16px; font-size: 1.05rem; }
        .feature-list p { margin-top: 4px; }
        .rounded-img { width: 100%; border-radius: 20px; box-shadow: var(--shadow-main); }

        /* Worker Cards */
        .worker-card { display: flex; flex-direction: column; gap: 20px; }
        .w-header { display: flex; align-items: center; gap: 16px; }
        .w-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; background: #EEE; }
        .w-stats { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid var(--border-light); font-weight: 600; }
        .rating { display: flex; align-items: center; gap: 6px; }
        .price { color: var(--primary-accent); }

        /* Team */
        .team-grid { justify-content: center; }
        .team-card { display: flex; flex-direction: column; align-items: center; }
        .t-img { width: 120px; height: 120px; border-radius: 50%; margin-bottom: 20px; object-fit: cover; }

        /* Promo */
        .promo-banner { background: var(--secondary-accent); color: white; display: flex; justify-content: space-between; align-items: center; padding: 48px; border-radius: 24px; }
        .promo-content h2 { color: white; font-size: 2.2rem; margin-bottom: 8px; }
        .promo-content p { font-size: 1.2rem; }
        .promo-btn { background: white; color: var(--secondary-accent); padding: 18px 40px; font-size: 1.1rem; border-radius: var(--radius-pill); cursor: pointer; text-decoration: none; font-weight: 800; }
        .promo-btn:hover { background: #F9FAFB; transform: scale(1.05); }

        @media (max-width: 1024px) {
           .hero-grid, .split-layout { grid-template-columns: 1fr; }
           .hero-left { text-align: center; }
           .hero-cta { display: flex; justify-content: center; }
           .float-card { display: none; }
           .promo-banner { flex-direction: column; text-align: center; gap: 24px; padding: 32px; }
        }
      `}</style>
    </div>
  );
};

export default Home;
