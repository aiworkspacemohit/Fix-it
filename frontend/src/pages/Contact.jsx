import React, { useState } from 'react';
import { Mail, MessageSquare, Star, Send, Phone, MapPin, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const Contact = () => {
  const { user } = useAuth();
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, category: 'General', comments: '' });
  const [contactState, setContactState] = useState('idle'); // idle | loading | success | error
  const [feedbackState, setFeedbackState] = useState('idle');

  // ---- Formspree: replace YOUR_FORM_ID with your actual Formspree endpoint ID ----
  const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;
  const FEEDBACK_ENDPOINT = import.meta.env.VITE_FEEDBACK_ENDPOINT;

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }
    setContactState('loading');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(contactForm),
      });
      if (res.ok) {
        setContactState('success');
        setContactForm({ name: '', email: '', message: '' });
        toast.success('Message sent! We will get back to you shortly.');
      } else {
        setContactState('error');
        toast.error('Failed to send. Please try again.');
      }
    } catch (err) {
      setContactState('error');
      toast.error('Network error. Please check your connection.');
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackForm.comments.trim()) {
      toast.error('Please add a comment.');
      return;
    }
    setFeedbackState('loading');
    try {
      const res = await fetch(FEEDBACK_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...feedbackForm,
          user_email: user?.email || 'Guest',
          user_name: user?.name || 'Anonymous'
        }),
      });

      if (res.ok) {
        setFeedbackState('success');
        toast.success('Thank you for your valuable feedback!');
        setFeedbackForm({ rating: 5, category: 'General', comments: '' });
      } else {
        setFeedbackState('error');
        toast.error('Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      setFeedbackState('error');
      toast.error('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="contact-page-wrapper section">
      <div className="container">
        
        <div className="contact-header text-center m-b-big">
           <h1 className="hero-heading">Get in Touch</h1>
           <p className="text-muted" style={{fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto'}}>
             Whether you need technical support, have a business inquiry, or want to share your experience, we're here to listen.
           </p>
        </div>

        <div className="contact-grid">
           
           {/* Section 1: Contact Form */}
           <div className="card contact-card form-box-ui">
              <div className="card-header-ui">
                 <div className="icon-rounded"><Mail size={24} /></div>
                 <h2>Contact Support</h2>
                 <p className="text-muted">Send us a direct message for any assistance.</p>
              </div>
              
              <form onSubmit={handleContactSubmit} className="form-layout-ui mt-4">
                 <div className="input-group">
                   <label>Full Name</label>
                   <input 
                     type="text" required className="input-field" placeholder="John Doe"
                     value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})}
                   />
                 </div>
                 <div className="input-group">
                   <label>Email Address</label>
                   <input 
                     type="email" required className="input-field" placeholder="john@example.com"
                     value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})}
                   />
                 </div>
                 <div className="input-group">
                   <label>Your Message</label>
                   <textarea 
                     required className="input-field text-area-large" placeholder="How can we help you today?"
                     value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})}
                   ></textarea>
                 </div>

                 {contactState === 'success' ? (
                   <div className="form-state-box success-box">
                     <CheckCircle size={20} /> Message delivered! We'll respond shortly.
                   </div>
                 ) : contactState === 'error' ? (
                   <div className="form-state-box error-box">
                     <AlertCircle size={20} /> Something went wrong. Please try again.
                   </div>
                 ) : null}

                 <button type="submit" className="btn-primary w-full mt-2" disabled={contactState === 'loading'}>
                   {contactState === 'loading' ? <Loader size={18} className="spin-icon" /> : <Send size={18} />}
                   {contactState === 'loading' ? 'Sending...' : 'Send Message'}
                 </button>
              </form>
           </div>

           {/* Section 2: Feedback Form */}
           <div className="card contact-card form-box-ui">
              <div className="card-header-ui">
                 <div className="icon-rounded green"><MessageSquare size={24} /></div>
                 <h2>Platform Feedback</h2>
                 <p className="text-muted">Help us improve the FixIt experience.</p>
              </div>
              
              <form onSubmit={handleFeedbackSubmit} className="form-layout-ui mt-4">
                 
                 <div className="input-group">
                   <label>Overall Rating</label>
                   <div className="stars-interactive">
                     {[1,2,3,4,5].map(star => (
                        <button 
                          type="button" key={star} 
                          className={`star-btn ${feedbackForm.rating >= star ? 'active' : ''}`}
                          onClick={() => setFeedbackForm({...feedbackForm, rating: star})}
                        >
                          <Star size={32} />
                        </button>
                     ))}
                   </div>
                 </div>

                 <div className="input-group">
                   <label>Feedback Category</label>
                   <select 
                     className="input-field"
                     value={feedbackForm.category} onChange={e => setFeedbackForm({...feedbackForm, category: e.target.value})}
                   >
                     <option>General Experience</option>
                     <option>Professional Service Quality</option>
                     <option>App Navigation & Booking</option>
                     <option>Pricing & Payments</option>
                   </select>
                 </div>

                 <div className="input-group">
                   <label>Comments & Suggestions</label>
                   <textarea 
                     required className="input-field text-area-large" placeholder="Tell us what you loved or what we can do better..."
                     value={feedbackForm.comments} onChange={e => setFeedbackForm({...feedbackForm, comments: e.target.value})}
                   ></textarea>
                 </div>
                 
                 <button type="submit" className="btn-secondary w-full mt-2" disabled={feedbackState === 'loading'}>
                   {feedbackState === 'loading' ? <Loader size={18} className="spin-icon" /> : <Star size={18} />}
                   {feedbackState === 'loading' ? 'Submitting...' : 'Submit Feedback'}
                 </button>
                 {feedbackState === 'success' && (
                   <div className="form-state-box success-box"><CheckCircle size={20} /> Feedback saved. Thank you!</div>
                 )}
              </form>
           </div>

        </div>

        {/* Quick Info Bar */}
        <div className="quick-info-bar mt-big">
          <div className="info-item">
             <Phone className="text-accent" size={28} />
             <div>
                <h4>Call Center</h4>
                <p className="text-muted">+1 (555) 123-4567</p>
             </div>
          </div>
          <div className="info-item">
             <Mail className="text-accent" size={28} />
             <div>
                <h4>Email Support</h4>
                <p className="text-muted">support@fixit.com</p>
             </div>
          </div>
          <div className="info-item">
             <MapPin className="text-accent" size={28} />
             <div>
                <h4>Headquarters</h4>
                <p className="text-muted">123 Service Blvd, NY 10001</p>
             </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .contact-page-wrapper {
           min-height: 100vh;
           background: var(--background);
           padding-top: 60px;
           padding-bottom: 100px;
        }

        .m-b-big { margin-bottom: 60px; }
        .hero-heading { font-size: 3rem; color: var(--text-primary); margin-bottom: 16px; letter-spacing: -1px; }

        .contact-grid {
           display: grid;
           grid-template-columns: 1fr 1fr;
           gap: 40px;
        }

        .form-box-ui {
           padding: 48px;
        }

        .card-header-ui {
           text-align: center;
           margin-bottom: 32px;
        }

        .icon-rounded {
           width: 64px; height: 64px; border-radius: 20px; background: rgba(255,122,0,0.1); color: var(--primary-accent); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
        }
        .icon-rounded.green {
           background: rgba(76, 175, 80, 0.1); color: var(--secondary-accent);
        }

        .card-header-ui h2 { font-size: 1.8rem; margin-bottom: 8px; color: var(--text-primary); }

        .form-layout-ui {
           display: flex;
           flex-direction: column;
           gap: 24px;
        }

        .input-group {
           display: flex;
           flex-direction: column;
           gap: 10px;
        }
        .input-group label {
           font-size: 0.95rem; font-weight: 600; color: var(--text-primary);
        }

        .text-area-large {
           min-height: 140px; resize: vertical;
        }

        .w-full { width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px; padding: 16px; font-size: 1.05rem; }
        .mt-2 { margin-top: 12px; }
        .mt-4 { margin-top: 24px; }

        .stars-interactive {
           display: flex; gap: 8px;
        }
        .star-btn {
           background: none; border: none; cursor: pointer; color: var(--border-light); transition: all 0.2s; padding: 0;
        }
        .star-btn.active {
           color: #F59E0B; fill: #F59E0B;
        }
        .star-btn:hover { transform: scale(1.1); }

        .form-state-box { display: flex; align-items: center; gap: 10px; padding: 14px 20px; border-radius: 14px; font-weight: 600; font-size: 0.95rem; }
        .success-box { background: #D1FAE5; color: #065F46; }
        .error-box { background: #FEE2E2; color: #991B1B; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin-icon { animation: spin 1s linear infinite; }

        .mt-big { margin-top: 80px; }
        .quick-info-bar {
           display: flex; justify-content: space-between; background: white; padding: 40px 60px; border-radius: var(--radius-card); border: 1px solid var(--border-light); box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }
        .info-item {
           display: flex; align-items: center; gap: 20px;
        }
        .info-item h4 { font-size: 1.1rem; color: var(--text-primary); margin-bottom: 4px; }

        @media (max-width: 1024px) {
           .contact-grid { grid-template-columns: 1fr; }
           .quick-info-bar { flex-direction: column; gap: 32px; padding: 32px; }
        }
      `}</style>
    </div>
  );
};

export default Contact;
