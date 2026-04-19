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
      <div className="nav-content">
        
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
           background: rgba(255, 255, 255, 0.85);
           backdrop-filter: blur(16px);
           -webkit-backdrop-filter: blur(16px);
           box-shadow: 0 10px 40px rgba(0,0,0,0.08);
           position: fixed;
           top: 24px;
           left: 50%;
           transform: translateX(-50%);
           width: calc(100% - 48px);
           max-width: 1000px;
           z-index: 1000;
           border-radius: 999px;
           border: 1px solid var(--border-light);
           transition: all 0.3s ease;
        }
        .nav-content {
           display: flex;
           justify-content: space-between;
           align-items: center;
           height: 72px;
           padding: 0 24px;
        }
        
        .nav-logo {
           display: flex;
           align-items: center;
           gap: 12px;
           text-decoration: none;
        }
        .logo-icon-box {
           width: 40px; height: 40px; background: rgba(255, 122, 0, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;
        }
        .logo-text { font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; color: var(--text-primary); letter-spacing: -0.5px; }

        .nav-center-links { display: flex; gap: 32px; align-items: center; }
        .nav-link { text-decoration: none; color: var(--text-secondary); font-weight: 600; font-size: 0.95rem; transition: color 0.2s; position: relative; }
        .nav-link:hover, .nav-link.active-link { color: var(--text-primary); }
        .nav-link.active-link::after { content: ''; position: absolute; bottom: -25px; left: 50%; transform: translateX(-50%); width: 24px; height: 3px; background: var(--primary-accent); border-radius: 3px 3px 0 0; }

        .nav-right-actions { display: flex; gap: 16px; align-items: center; }
        .icon-action-btn { background: var(--input-bg); border: 1px solid var(--border-light); color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; transition: all 0.2s; }
        .icon-action-btn:hover { background: var(--primary-accent); color: white; border-color: var(--primary-accent); }
        
        .guest-actions, .user-dashboard-actions { display: flex; align-items: center; gap: 12px; }

        .mobile-toggle-btn { display: none; background: var(--input-bg); border: 1px solid var(--border-light); color: var(--text-primary); cursor: pointer; border-radius: 50%; width: 44px; height: 44px; align-items: center; justify-content: center; transition: all 0.2s; }
        .mobile-toggle-btn:hover { background: var(--primary-accent); color: white; border-color: var(--primary-accent); }

        .mobile-dropdown { position: absolute; top: 85px; left: 0; width: 100%; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); padding: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); display: flex; flex-direction: column; gap: 16px; border-radius: 32px; border: 1px solid var(--border-light); overflow: hidden; }
        .mobile-link { text-decoration: none; color: var(--text-primary); font-size: 1.1rem; font-weight: 600; padding: 12px 20px; border-radius: 16px; transition: all 0.2s; }
        .mobile-link:hover { background: rgba(255, 122, 0, 0.1); color: var(--primary-accent); padding-left: 24px; }
        .mobile-auth-divider { height: 1px; background: var(--border-light); margin: 8px 0; }

        @media (max-width: 1024px) {
           .nav-center-links, .nav-right-actions { display: none; }
           .mobile-toggle-btn { display: flex; }
        }
        
        @media (max-width: 768px) {
           .food-navbar {
              top: 16px;
              width: calc(100% - 32px);
           }
        }
      `}</style>
    </nav>
  );
};
export default Navbar;
