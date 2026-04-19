import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';
import { Star, MapPin, Calendar, ShieldCheck, CheckCircle2, ChevronLeft, Award, Heart } from 'lucide-react';

const WorkerProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingData, setBookingData] = useState({ date: '', timeSlot: '10:00 AM - 12:00 PM', problemDescription: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/workers/${id}`);
        setWorker(res.data);
        const revRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/${id}`);
        setReviews(revRes.data);
      } catch (err) {
        toast.error('Could not load profile');
      }
    };
    fetchData();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to book'); navigate('/login'); return; }
    if (!bookingData.date) { toast.error('Please select a date'); return; }
    setSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/bookings`,
        { workerId: id, ...bookingData },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      socket?.emit('booking_updated');
      toast.success('Booking requested! Check your dashboard.');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!worker) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '16px' }}>
      <div style={{ width: '40px', height: '40px', border: '4px solid #eee', borderTop: '4px solid var(--primary-accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Loading expert profile...</p>
    </div>
  );

  const avatarSrc = worker.profileImage?.startsWith('http')
    ? worker.profileImage
    : worker.profileImage
      ? `${import.meta.env.VITE_BACKEND_URL}${worker.profileImage}`
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.userId?.name}`;

  return (
    <div className="wp-page">
      {/* Back nav */}
      <div className="wp-container">
        <button onClick={() => navigate(-1)} className="wp-back-btn">
          <ChevronLeft size={18} /> Professional Directory
        </button>
      </div>

      <div className="wp-container wp-grid">

        {/* ── LEFT COLUMN: Profile Info ── */}
        <div className="wp-left">

          {/* Hero card */}
          <div className="wp-card wp-hero-card">
            <div className="wp-trust-badge">
              <ShieldCheck size={14} /> PREMIUM EXPERT
            </div>
            <div className="wp-hero-body">
              <img src={avatarSrc} alt={worker.userId?.name} className="wp-avatar" />
              <div className="wp-hero-info">
                <h1 className="wp-name">{worker.userId?.name}</h1>
                <p className="wp-category">{worker.category} Specialist</p>
                <div className="wp-meta-row">
                  <span className="wp-badge"><Star size={14} className="star-gold" /> {worker.rating?.toFixed(1)} Rating</span>
                  <span className="wp-badge"><Award size={14} /> {worker.totalJobs} Jobs</span>
                  <span className="wp-badge"><MapPin size={14} /> {worker.userId?.location?.city}</span>
                </div>
                <div className="wp-skills">
                  {worker.skills?.map(s => <span key={s} className="wp-skill-chip">{s}</span>)}
                </div>
              </div>
            </div>
            <div className="wp-bio">
              <h2>About the Professional</h2>
              <p>{worker.bio || 'Experienced professional ready to assist you.'}</p>
            </div>
          </div>

          {/* ── BOOKING CARD shown inline on mobile, hidden on desktop sidebar ── */}
          <div className="wp-card wp-booking-inline">
            <BookingCard
              worker={worker}
              showBooking={showBooking}
              setShowBooking={setShowBooking}
              bookingData={bookingData}
              setBookingData={setBookingData}
              handleBooking={handleBooking}
              submitting={submitting}
            />
          </div>

          {/* Reviews */}
          <div className="wp-card wp-reviews-card">
            <h2 className="wp-section-title">Client Testimonials</h2>
            <div className="wp-reviews-list">
              {reviews.length === 0
                ? <p className="wp-empty-text">This expert is new and awaiting their first review.</p>
                : reviews.map(r => (
                  <div key={r._id} className="wp-review-item">
                    <div className="wp-review-top">
                      <strong>{r.customerId?.name}</strong>
                      <div className="wp-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} className={i < r.rating ? 'star-gold' : 'star-empty'} />
                        ))}
                      </div>
                    </div>
                    <p className="wp-review-text">"{r.comment}"</p>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Booking Sidebar (desktop only) ── */}
        <aside className="wp-sidebar">
          <div className="wp-card wp-booking-card">
            <BookingCard
              worker={worker}
              showBooking={showBooking}
              setShowBooking={setShowBooking}
              bookingData={bookingData}
              setBookingData={setBookingData}
              handleBooking={handleBooking}
              submitting={submitting}
            />
          </div>
        </aside>
      </div>

      <style jsx>{`
        /* ── Base ── */
        .wp-page { background: var(--background); min-height: 100vh; padding-top: 120px; padding-bottom: 80px; }
        .wp-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .wp-back-btn { display: inline-flex; align-items: center; gap: 6px; background: none; border: none; color: var(--text-secondary); font-weight: 700; cursor: pointer; margin-bottom: 24px; font-size: 0.95rem; transition: color 0.2s; }
        .wp-back-btn:hover { color: var(--primary-accent); }

        /* ── Grid: mobile first (single col) → desktop 2-col ── */
        .wp-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        .wp-left { display: flex; flex-direction: column; gap: 24px; min-width: 0; }

        /* Hide sidebar on mobile, show inline booking card */
        .wp-sidebar { display: none; }
        .wp-booking-inline { display: block; }

        /* ── Card ── */
        .wp-card { background: white; border-radius: 20px; border: 1px solid var(--border-light); padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }

        /* ── Hero ── */
        .wp-hero-card { position: relative; overflow: hidden; padding: 24px; }
        .wp-trust-badge { position: absolute; top: 0; right: 0; background: var(--secondary-accent, #2d6a4f); color: white; padding: 8px 18px; border-radius: 0 16px 0 20px; font-size: 0.72rem; font-weight: 800; letter-spacing: 1px; display: flex; align-items: center; gap: 6px; }
        .wp-hero-body { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; }
        .wp-avatar { width: 90px; height: 90px; border-radius: 20px; object-fit: cover; flex-shrink: 0; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .wp-hero-info { flex: 1; min-width: 0; }
        .wp-name { font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin: 0 0 4px; line-height: 1.2; word-break: break-word; }
        .wp-category { color: var(--primary-accent); font-weight: 700; font-size: 0.95rem; margin-bottom: 12px; }
        .wp-meta-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
        .wp-badge { display: inline-flex; align-items: center; gap: 5px; background: var(--background, #f5f0eb); color: var(--text-secondary); font-weight: 600; font-size: 0.82rem; padding: 5px 12px; border-radius: 999px; }
        .wp-skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .wp-skill-chip { background: rgba(255,122,0,0.08); color: var(--primary-accent); padding: 5px 14px; border-radius: 10px; font-size: 0.82rem; font-weight: 700; }
        .wp-bio h2 { font-size: 1.1rem; font-weight: 800; margin-bottom: 8px; color: var(--text-primary); }
        .wp-bio p { color: var(--text-secondary); line-height: 1.7; font-size: 0.95rem; }
        .star-gold { color: #F59E0B; fill: #F59E0B; }
        .star-empty { color: #E5E7EB; }

        /* ── Reviews ── */
        .wp-reviews-card { padding: 24px; }
        .wp-section-title { font-size: 1.3rem; font-weight: 800; margin-bottom: 24px; color: var(--text-primary); }
        .wp-reviews-list { display: flex; flex-direction: column; gap: 20px; }
        .wp-review-item { border-bottom: 1px solid var(--border-light); padding-bottom: 20px; }
        .wp-review-item:last-child { border-bottom: none; padding-bottom: 0; }
        .wp-review-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .wp-stars { display: flex; gap: 3px; }
        .wp-review-text { font-style: italic; color: var(--text-secondary); font-size: 0.95rem; }
        .wp-empty-text { color: var(--text-secondary); font-size: 0.95rem; text-align: center; padding: 20px 0; }

        /* ── Booking (inline on mobile) ── */
        .wp-price-row { margin-bottom: 24px; }
        .wp-price-big { font-size: 2.8rem; font-weight: 800; color: var(--text-primary); }
        .wp-price-unit { font-size: 1rem; color: var(--text-secondary); font-weight: 500; }
        .wp-benefits { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
        .wp-benefit { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; color: #4B5563; font-weight: 600; }
        .wp-benefit svg { color: #059669; flex-shrink: 0; }
        .wp-book-btn { width: 100%; padding: 16px; font-size: 1.05rem; border-radius: 16px; margin-bottom: 0; }
        .wp-form { display: flex; flex-direction: column; gap: 16px; }
        .wp-form label { font-size: 0.85rem; font-weight: 700; display: block; margin-bottom: 6px; color: var(--text-secondary); }
        .wp-input { width: 100%; padding: 12px 16px; border: 1px solid var(--border-light); border-radius: 12px; font-size: 0.95rem; background: var(--input-bg, #f9f9f7); color: var(--text-primary); font-family: inherit; box-sizing: border-box; }
        .wp-input:focus { outline: none; border-color: var(--primary-accent); box-shadow: 0 0 0 3px rgba(255,122,0,0.1); }
        .wp-textarea { min-height: 90px; resize: vertical; }
        .wp-form-actions { display: flex; gap: 10px; }
        .wp-form-actions .btn-secondary { flex: 1; }
        .wp-form-actions .btn-primary { flex: 2; }

        /* ── Desktop: 2-col grid, show sidebar, hide inline ── */
        @media (min-width: 1024px) {
          .wp-page { padding-top: 150px; }
          .wp-grid { grid-template-columns: 1fr 380px; gap: 40px; }
          .wp-sidebar { display: block; }
          .wp-booking-inline { display: none; }
          .wp-booking-card { position: sticky; top: 120px; }
          .wp-name { font-size: 2.8rem; }
          .wp-avatar { width: 140px; height: 140px; border-radius: 32px; }
          .wp-hero-body { flex-wrap: nowrap; }
          .wp-card { padding: 40px; }
        }

        @media (min-width: 640px) and (max-width: 1023px) {
          .wp-page { padding-top: 130px; }
          .wp-name { font-size: 2.2rem; }
          .wp-avatar { width: 110px; height: 110px; }
          .wp-price-big { font-size: 2.2rem; }
        }
      `}</style>
    </div>
  );
};

/* ── Booking card extracted as sub-component ── */
const BookingCard = ({ worker, showBooking, setShowBooking, bookingData, setBookingData, handleBooking, submitting }) => (
  <div>
    <div className="wp-price-row">
      <span className="wp-price-big">${worker.hourlyRate}</span>
      <span className="wp-price-unit"> / hour</span>
    </div>
    <div className="wp-benefits">
      <div className="wp-benefit"><CheckCircle2 size={17} /><span>Verified Identity & Background</span></div>
      <div className="wp-benefit"><CheckCircle2 size={17} /><span>Licensed Home Professional</span></div>
      <div className="wp-benefit"><CheckCircle2 size={17} /><span>Insurance & Bonded Service</span></div>
    </div>

    {!showBooking ? (
      <button onClick={() => setShowBooking(true)} className="btn-primary wp-book-btn">
        Request Service
      </button>
    ) : (
      <form onSubmit={handleBooking} className="wp-form">
        <div>
          <label>Preferred Date</label>
          <input
            type="date" required className="wp-input"
            min={new Date().toISOString().split('T')[0]}
            onChange={e => setBookingData({ ...bookingData, date: e.target.value })}
          />
        </div>
        <div>
          <label>Arrival Window</label>
          <select className="wp-input" onChange={e => setBookingData({ ...bookingData, timeSlot: e.target.value })}>
            <option>10:00 AM - 12:00 PM</option>
            <option>12:00 PM - 02:00 PM</option>
            <option>02:00 PM - 04:00 PM</option>
            <option>04:00 PM - 06:00 PM</option>
          </select>
        </div>
        <div>
          <label>Describe the Issue</label>
          <textarea
            required className="wp-input wp-textarea"
            placeholder="Briefly explain what needs to be fixed..."
            onChange={e => setBookingData({ ...bookingData, problemDescription: e.target.value })}
          />
        </div>
        <div className="wp-form-actions">
          <button type="button" onClick={() => setShowBooking(false)} className="btn-secondary">Back</button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    )}
  </div>
);

export default WorkerProfile;
