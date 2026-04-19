import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Star, MapPin, Calendar, Clock, MessageSquare, ShieldCheck, CheckCircle2, ChevronLeft, Award, Heart } from 'lucide-react';

const WorkerProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({ date: '', timeSlot: '10:00 AM', problemDescription: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/workers/${id}`);
        setWorker(res.data);
        const revRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/${id}`);
        setReviews(res.data.length ? [] : revRes.data); // Null-safe check
        setReviews(revRes.data);
      } catch (err) {
        toast.error('Could not load profile');
      }
    };
    fetchData();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/bookings`, {
        workerId: id,
        ...bookingData
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Booking requested successfully!');
      setShowBooking(false);
      navigate('/dashboard');
    } catch (err) {
      toast.error('Booking failed');
    }
  };

  if (!worker) return <div className="loading-ui">Assembling Expert Profile...</div>;

  return (
    <div className="container professional-profile-wrap section">
      <div className="profile-header-navigation">
        <button onClick={() => navigate(-1)} className="back-link-ui">
          <ChevronLeft size={18} />
          <span>Professional Directory</span>
        </button>
      </div>

      <div className="profile-main-grid-ui">
        <div className="profile-content-ui">
          <div className="card expert-header-card">
             <div className="expert-trust-tag">
               <ShieldCheck size={16} />
               <span>PREMIUM EXPERT</span>
             </div>
             
             <div className="expert-top-row">
                <div className="expert-avatar-wrap">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.userId.name}`} alt={worker.userId.name} />
                </div>
                <div className="expert-essential-info">
                   <h1 className="expert-name-ui">{worker.userId.name}</h1>
                   <div className="expert-meta-data">
                      <div className="meta-pill"><Star size={16} className="star-fill" /> {worker.rating.toFixed(1)} <small>Rating</small></div>
                      <div className="meta-pill"><Award size={16} /> {worker.totalJobs} <small>Jobs</small></div>
                      <div className="meta-pill"><MapPin size={16} /> {worker.userId.location.city}</div>
                   </div>
                   <div className="expert-skill-cloud">
                      {worker.skills.map(s => <span key={s} className="skill-pill-ui">{s}</span>)}
                   </div>
                </div>
             </div>

             <div className="expert-bio-ui">
                <h2>About the Professional</h2>
                <p>{worker.bio}</p>
             </div>
          </div>

          <div className="card expert-reviews-section">
             <h2 className="profile-section-title">Client Testimonials</h2>
             <div className="expert-reviews-list">
                {reviews.map(r => (
                  <div key={r._id} className="expert-review-item">
                    <div className="review-top-ui">
                      <strong>{r.customerId.name}</strong>
                      <div className="review-rating-ui">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < r.rating ? 'active' : ''} />)}
                      </div>
                    </div>
                    <p className="review-msg-ui">"{r.comment}"</p>
                  </div>
                ))}
                {reviews.length === 0 && <div className="no-reviews-ui">This expert is new to the platform and awaiting their first review.</div>}
             </div>
          </div>
        </div>

        <aside className="profile-booking-sidebar">
          <div className="card booking-premium-card sticky-sidebar-ui">
             <div className="pricing-ui">
               <span className="price-primary">${worker.hourlyRate}</span>
               <span className="price-secondary">/hour</span>
             </div>
             
             <div className="benefits-ui">
                <div className="benefit-item">
                  <CheckCircle2 size={18} />
                  <span>Verified Identity & Background</span>
                </div>
                <div className="benefit-item">
                  <CheckCircle2 size={18} />
                  <span>Licensed Home Professional</span>
                </div>
                <div className="benefit-item">
                  <CheckCircle2 size={18} />
                  <span>Insurance & Bonded Service</span>
                </div>
             </div>

             {!showBooking ? (
               <button onClick={() => setShowBooking(true)} className="btn-primary large-action-btn">
                 Request Service
               </button>
             ) : (
               <form onSubmit={handleBooking} className="booking-panel-ui">
                 <div className="input-group-ui">
                    <label>Preferred Date</label>
                    <div className="icon-input-ui">
                      <Calendar className="f-icon" size={18} />
                      <input type="date" required className="input-field-ui" onChange={e => setBookingData({...bookingData, date: e.target.value})} />
                    </div>
                 </div>
                 <div className="input-group-ui">
                    <label>Select Arrival Window</label>
                    <select className="input-field-ui" onChange={e => setBookingData({...bookingData, timeSlot: e.target.value})}>
                      <option>10:00 AM - 12:00 PM</option>
                      <option>12:00 PM - 02:00 PM</option>
                      <option>02:00 PM - 04:00 PM</option>
                    </select>
                 </div>
                 <div className="input-group-ui">
                    <label>Job Description</label>
                    <textarea required className="input-field-ui area-ui" placeholder="Briefly explain the issue..." onChange={e => setBookingData({...bookingData, problemDescription: e.target.value})} />
                 </div>
                 <div className="booking-actions-ui">
                    <button type="button" onClick={() => setShowBooking(false)} className="btn-secondary">Back</button>
                    <button type="submit" className="btn-primary">Book Now</button>
                 </div>
               </form>
             )}

             <div className="expert-meta-actions">
                <button className="favorite-btn"><Heart size={18} /> Save Expert</button>
                <div className="expert-divider-ui"></div>
                <button className="chat-start-btn"><MessageSquare size={18} /> Message</button>
             </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .professional-profile-wrap { padding-top: 150px; }
        .back-link-ui { display: flex; align-items: center; gap: 8px; background: none; border: none; color: var(--text-secondary); font-weight: 700; cursor: pointer; margin-bottom: 32px; transition: color 0.2s; }
        .back-link-ui:hover { color: var(--primary-green); }
        
        .profile-main-grid-ui { display: grid; grid-template-columns: 1fr 400px; gap: 48px; }
        .expert-header-card { position: relative; padding: 48px; margin-bottom: 32px; overflow: hidden; }
        .expert-trust-tag { position: absolute; top: 0; right: 0; background: var(--deep-green); color: white; padding: 10px 24px; border-radius: 0 0 0 30px; font-size: 0.75rem; font-weight: 800; letter-spacing: 1px; display: flex; align-items: center; gap: 8px; }
        
        .expert-top-row { display: flex; gap: 40px; align-items: center; margin-bottom: 40px; }
        .expert-avatar-wrap { width: 160px; height: 160px; border-radius: 40px; background: var(--light-green); border: 6px solid white; box-shadow: var(--shadow-soft); overflow: hidden; }
        .expert-avatar-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .expert-name-ui { font-size: 3.2rem; line-height: 1; margin-bottom: 16px; letter-spacing: -2px; }
        .expert-meta-data { display: flex; gap: 20px; align-items: center; margin-bottom: 24px; }
        .meta-pill { display: flex; align-items: center; gap: 8px; color: var(--text-secondary); font-weight: 600; font-size: 0.9rem; }
        .meta-pill small { opacity: 0.6; font-size: 0.7rem; text-transform: uppercase; font-weight: 800; }
        .star-fill { color: #F59E0B; fill: #F59E0B; }
        
        .expert-skill-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill-pill-ui { background: var(--background); color: var(--deep-green); padding: 8px 16px; border-radius: 12px; font-size: 0.85rem; font-weight: 700; }
        
        .expert-bio-ui h2 { font-size: 1.6rem; margin-bottom: 16px; }
        .expert-bio-ui p { color: var(--text-secondary); font-size: 1.15rem; line-height: 1.8; }
        
        .expert-reviews-section { padding: 48px; }
        .profile-section-title { font-size: 1.6rem; margin-bottom: 40px; }
        .expert-reviews-list { display: flex; flex-direction: column; gap: 40px; }
        .expert-review-item { border-bottom: 1px solid var(--border-color); padding-bottom: 32px; }
        .expert-review-item:last-child { border-bottom: none; }
        .review-top-ui { display: flex; justify-content: space-between; margin-bottom: 12px; }
        .review-rating-ui { display: flex; gap: 4px; color: #E5E7EB; }
        .review-rating-ui .active { color: #F59E0B; fill: #F59E0B; }
        .review-msg-ui { font-style: italic; color: var(--text-secondary); font-size: 1.05rem; }
        
        .booking-premium-card { padding: 40px; position: sticky; top: 130px; border: 1px solid var(--accent); }
        .pricing-ui { margin-bottom: 32px; font-family: var(--font-display); }
        .price-primary { font-size: 3.5rem; font-weight: 800; color: var(--text-primary); }
        .price-secondary { font-size: 1.2rem; color: var(--text-secondary); font-weight: 500; }
        
        .benefits-ui { display: flex; flex-direction: column; gap: 16px; margin-bottom: 40px; }
        .benefit-item { display: flex; align-items: center; gap: 12px; font-weight: 600; color: #4B5563; font-size: 0.95rem; }
        .benefit-item svg { color: #059669; }
        
        .large-action-btn { width: 100%; padding: 20px; font-size: 1.15rem; border-radius: 20px; box-shadow: 0 15px 30px rgba(76, 175, 80, 0.2); }
        .booking-panel-ui { display: flex; flex-direction: column; gap: 20px; }
        .input-group-ui label { display: block; font-size: 0.85rem; font-weight: 800; margin-bottom: 8px; color: var(--text-secondary); }
        .icon-input-ui { position: relative; }
        .f-icon { position: absolute; left: 16px; top: 18px; color: var(--text-secondary); }
        .icon-input-ui input { padding-left: 48px; }
        .area-ui { min-height: 100px; resize: none; }
        .booking-actions-ui { display: flex; gap: 12px; }
        .booking-actions-ui .btn-secondary { flex: 1; }
        .booking-actions-ui .btn-primary { flex: 2; }
        
        .expert-meta-actions { display: flex; align-items: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border-color); }
        .favorite-btn, .chat-start-btn { flex: 1; background: none; border: none; font-weight: 800; color: var(--text-secondary); font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .favorite-btn:hover { color: #EF4444; }
        .chat-start-btn:hover { color: var(--primary-green); }
        .expert-divider-ui { width: 1px; height: 24px; background: var(--border-color); }
        
        .loading-ui { text-align: center; padding: 150px; font-size: 1.5rem; font-weight: 800; color: var(--deep-green); }

        @media (max-width: 1100px) {
          .profile-main-grid-ui { grid-template-columns: 1fr; }
          .profile-booking-sidebar { display: none; }
        }
      `}</style>
    </div>
  );
};

export default WorkerProfile;
