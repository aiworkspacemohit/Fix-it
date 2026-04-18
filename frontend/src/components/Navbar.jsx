import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Wrench } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active-link' : '';

  return (
    <nav className="food-navbar">
      <div className="container nav-content">
        
        {/* Left: Logo */}
        <Link to="/" className="nav-logo" onClick={() => setMobileMenu(false)}>
           <div className="logo-icon-box">
              <Wrench size={24} color="var(--primary-accent)" />
           </div>
           <span className="logo-text">FixIt</span>
        </Link>

        {/* Center: Links */}
        <div className="nav-center-links">
           <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
           <Link to="/services" className={`nav-link ${isActive('/services')}`}>Services</Link>
           <Link to="/workers" className={`nav-link ${isActive('/workers')}`}>Workers</Link>
           <Link to="/about" className={`nav-link ${isActive('/about')}`}>About</Link>
           <Link to="/contact" className={`nav-link ${isActive('/contact')}`}>Contact</Link>
        </div>

        {/* Right: Actions */}
        <div className="nav-right-actions">
           <Link to="/workers" className="icon-action-btn" title="Search Professionals"><Search size={20} /></Link>
           
           {user ? (
             <div className="user-dashboard-actions">
                <Link to="/dashboard" className="btn-secondary">Dashboard</Link>
                <button onClick={logout} className="nav-link text-muted" style={{border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 600}}>Logout</button>
             </div>
           ) : (
             <div className="guest-actions">
                <Link to="/login" className="nav-link" style={{fontWeight: 600}}>Log In</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
             </div>
           )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileMenu(!mobileMenu)} className="mobile-toggle-btn">
           {mobileMenu ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="mobile-dropdown">
           <Link to="/" onClick={() => setMobileMenu(false)} className="mobile-link">Home</Link>
           <Link to="/services" onClick={() => setMobileMenu(false)} className="mobile-link">Services</Link>
           <Link to="/workers" onClick={() => setMobileMenu(false)} className="mobile-link">Workers</Link>
           <Link to="/about" onClick={() => setMobileMenu(false)} className="mobile-link">About</Link>
           <Link to="/contact" onClick={() => setMobileMenu(false)} className="mobile-link">Contact</Link>
           
           <div className="mobile-auth-divider"></div>
           {user ? (
             <>
               <Link to="/dashboard" onClick={() => setMobileMenu(false)} className="mobile-link text-accent">Dashboard</Link>
               <button onClick={() => { logout(); setMobileMenu(false); }} className="mobile-link" style={{textAlign:'left', border:'none', background:'none', width:'100%', cursor: 'pointer'}}>Logout</button>
             </>
           ) : (
             <>
               <Link to="/login" onClick={() => setMobileMenu(false)} className="mobile-link">Log In</Link>
               <Link to="/register" onClick={() => setMobileMenu(false)} className="mobile-link text-accent">Sign Up</Link>
             </>
           )}
        </div>
      )}

      <style jsx>{`
        .food-navbar {
           background: var(--card-bg);
           box-shadow: 0 2px 10px rgba(0,0,0,0.05);
           position: sticky;
           top: 0;
           z-index: 1000;
           width: 100%;
        }
        .nav-content {
           display: flex;
           justify-content: space-between;
           align-items: center;
           height: 80px;
        }
        
        .nav-logo {
           display: flex;
           align-items: center;
           gap: 12px;
           text-decoration: none;
        }
        .logo-icon-box {
           width: 44px; height: 44px; background: rgba(255, 122, 0, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center;
        }
        .logo-text { font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.5px; }

        .nav-center-links { display: flex; gap: 32px; align-items: center; }
        .nav-link { text-decoration: none; color: var(--text-secondary); font-weight: 500; font-size: 1rem; transition: color 0.2s; position: relative; }
        .nav-link:hover, .nav-link.active-link { color: var(--primary-accent); }
        .nav-link.active-link::after { content: ''; position: absolute; bottom: -6px; left: 0; width: 100%; height: 2px; background: var(--primary-accent); border-radius: 2px; }

        .nav-right-actions { display: flex; gap: 20px; align-items: center; }
        .icon-action-btn { background: none; border: none; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; transition: background 0.2s; }
        .icon-action-btn:hover { background: rgba(0,0,0,0.05); color: var(--primary-accent); }
        
        .guest-actions, .user-dashboard-actions { display: flex; align-items: center; gap: 20px; }

        .mobile-toggle-btn { display: none; background: none; border: none; color: var(--text-primary); cursor: pointer; }

        .mobile-dropdown { position: absolute; top: 80px; left: 0; width: 100%; background: var(--card-bg); padding: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.08); display: flex; flex-direction: column; gap: 16px; border-top: 1px solid var(--border-light); }
        .mobile-link { text-decoration: none; color: var(--text-primary); font-size: 1.1rem; font-weight: 600; padding: 10px 16px; border-radius: 8px; }
        .mobile-link:hover { background: rgba(255, 122, 0, 0.05); color: var(--primary-accent); }
        .mobile-auth-divider { height: 1px; background: var(--border-light); margin: 8px 0; }

        @media (max-width: 1024px) {
           .nav-center-links, .nav-right-actions { display: none; }
           .mobile-toggle-btn { display: block; }
        }
      `}</style>
    </nav>
  );
};
export default Navbar;
