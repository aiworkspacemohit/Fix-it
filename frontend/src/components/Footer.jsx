import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="food-footer">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-brand">
            <Link to="/" className="brand-logo">
               <div className="f-logo-icon">
                 <Wrench size={24} color="var(--primary-accent)" />
               </div>
               <span className="f-logo-text">FixIt</span>
            </Link>
            <p className="text-muted mt-4">Reliable home services at your fingertips. Bringing professional repairs and maintenance directly to your door.</p>
            <div className="social-links mt-6">
              <a href="#" className="social-icon"><FaFacebook size={20} /></a>
              <a href="#" className="social-icon"><FaTwitter size={20} /></a>
              <a href="#" className="social-icon"><FaInstagram size={20} /></a>
              <a href="#" className="social-icon"><FaLinkedin size={20} /></a>
            </div>
          </div>
          
          <div className="footer-links-group">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">All Services</Link></li>
              <li><Link to="/workers">Our Experts</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>
          
          <div className="footer-links-group">
            <h3>Support</h3>
            <ul>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/">FAQs</Link></li>
              <li><Link to="/">Terms of Service</Link></li>
              <li><Link to="/">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h3>Contact Info</h3>
            <ul className="contact-list">
              <li><MapPin size={18} className="c-icon" /> <span>123 Service Blvd, NY 10001</span></li>
              <li><Phone size={18} className="c-icon" /> <span>+1 (555) 123-4567</span></li>
              <li><Mail size={18} className="c-icon" /> <span>support@fixit.com</span></li>
            </ul>
          </div>

        </div>
        
        <div className="footer-bottom">
          <p className="text-muted">&copy; {new Date().getFullYear()} FixIt Home Services. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        .food-footer {
          background: #FFFFFF;
          padding: 80px 0 20px;
          border-top: 1px solid var(--border-light);
        }
        
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 60px;
          margin-bottom: 60px;
        }

        .brand-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
        .f-logo-icon { width: 40px; height: 40px; background: rgba(255,122,0,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .f-logo-text { font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: var(--text-primary); }
        .mt-4 { margin-top: 16px; }
        .mt-6 { margin-top: 24px; }

        .social-links { display: flex; gap: 12px; }
        .social-icon { width: 40px; height: 40px; border-radius: 50%; background: var(--input-bg); color: var(--text-primary); display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .social-icon:hover { background: var(--primary-accent); color: white; transform: translateY(-3px); }

        .footer-links-group h3, .footer-contact h3 { margin-bottom: 24px; font-size: 1.2rem; color: var(--text-primary); }
        .footer-links-group ul { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .footer-links-group a { color: var(--text-secondary); text-decoration: none; transition: color 0.2s; }
        .footer-links-group a:hover { color: var(--primary-accent); }

        .contact-list { list-style: none; display: flex; flex-direction: column; gap: 16px; }
        .contact-list li { display: flex; align-items: flex-start; gap: 12px; color: var(--text-secondary); }
        .c-icon { color: var(--primary-accent); flex-shrink: 0; margin-top: 2px; }

        .footer-bottom { padding-top: 24px; border-top: 1px solid var(--border-light); text-align: center; }

        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 40px; }
        }
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
