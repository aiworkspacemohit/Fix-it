import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Chat from '../components/Chat';
import { CheckCircle, XCircle, Clock, Star, MessageSquare, AlertCircle, Calendar, User as UserIcon } from 'lucide-react';

const CATEGORIES = [
  'Plumbing', 'Electrical', 'AC Repair', 'Carpenter',
  'Painter', 'Cleaning', 'Appliance Repair', 'Pest Control',
  'Masonry', 'General Handyman'
];

const WorkerSetupBanner = ({ onComplete }) => {
  const [form, setForm] = useState({ category: 'Plumbing', skills: '', hourlyRate: '30', bio: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.hourlyRate) { toast.error('Please enter your hourly rate'); return; }
    setSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/workers/setup', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Profile created! You now appear in search results.');
      onComplete();
    } catch (err) {
      toast.error('Failed to create profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card dashboard-professional-banner">
      <div className="banner-visual-ui">
        <AlertCircle size={40} color="var(--primary-accent)" />
      </div>
      <div className="banner-content-ui">
        <h2>Expert Profile Incomplete</h2>
        <p className="text-muted">You registered as a professional but haven't set up your public profile yet. Fill in the details to start receiving job requests.</p>
        
        <form onSubmit={handleSubmit} className="setup-grid-ui">
          <div className="field-row-ui">
            <div className="field-group-ui">
              <label>Service Category</label>
              <select className="input-field" onChange={e => setForm({...form, category: e.target.value})}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="field-group-ui">
              <label>Hourly Rate ($)</label>
              <input type="number" className="input-field" placeholder="45" onChange={e => setForm({...form, hourlyRate: e.target.value})} />
            </div>
          </div>
          <div className="field-group-ui">
            <label>Professional Bio</label>
            <textarea className="input-field text-area-compact" placeholder="Describe your experience..." onChange={e => setForm({...form, bio: e.target.value})}></textarea>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary" style={{marginTop: '10px'}}>
            {submitting ? 'Activating...' : 'Activate Professional Profile'}
          </button>
        </form>
      </div>
      <style jsx>{`
        .dashboard-professional-banner { 
          display: flex; gap: 40px; border: 2px dashed rgba(255, 122, 0, 0.5); margin-bottom: 48px; padding: 48px; background: rgba(255, 122, 0, 0.05); box-shadow: none;
        }
        .banner-content-ui h2 { font-size: 1.8rem; margin-bottom: 12px; color: var(--text-primary); }
        .banner-content-ui p { margin-bottom: 32px; max-width: 600px; }
        .setup-grid-ui { display: flex; flex-direction: column; gap: 24px; }
        .field-row-ui { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .field-group-ui label { font-size: 0.85rem; font-weight: 700; margin-bottom: 8px; display: block; color: var(--text-primary); }
        .text-area-compact { min-height: 80px; resize: none; }
        @media (max-width: 768px) {
          .dashboard-professional-banner { flex-direction: column; padding: 24px; gap: 24px; }
          .field-row-ui { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [showRateModal, setShowRateModal] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hasProfile, setHasProfile] = useState(true);
  const [profileChecked, setProfileChecked] = useState(false);

  const authHeader = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  useEffect(() => {
    if (user?.role === 'worker') {
      axios.get(`http://localhost:5000/api/workers/${user.id}`)
        .then(() => setHasProfile(true))
        .catch(() => setHasProfile(false))
        .finally(() => setProfileChecked(true));
    } else {
      setProfileChecked(true);
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/bookings', { headers: authHeader });
      setBookings(data);
    } catch (err) {
      toast.error('Failed to load bookings');
    }
  };

  useEffect(() => {
    if (profileChecked) fetchBookings();
  }, [profileChecked]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}/status`, { status }, { headers: authHeader });
      toast.success(`Booking ${status}`);
      fetchBookings();
    } catch (err) {
      toast.error('Status update failed');
    }
  };

  const handleRate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/reviews', {
        bookingId: showRateModal._id,
        workerId: showRateModal.workerId?._id,
        rating,
        comment
      }, { headers: authHeader });
      toast.success('Rating submitted!');
      setShowRateModal(null);
      fetchBookings();
    } catch (err) {
      toast.error('Failed to submit rating');
    }
  };

  if (!profileChecked) return <div className="loading-ui">Loading Profile...</div>;

  return (
    <div className="container dashboard-professional-wrap section">
      
      <div className="card user-profile-banner">
        <div className="profile-info">
          <div className="profile-avatar">
            <UserIcon size={40} color="var(--primary-accent)" />
          </div>
          <div className="profile-text">
            <h2>{user?.name}</h2>
            <p className="text-muted">{user?.email}</p>
            <span className="profile-role-badge">{user?.role === 'worker' ? 'Professional Partner' : 'Customer Account'}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid-ui">
        <div className="dashboard-main-area">
          <header className="dash-header-ui">
            <h1>{user?.role === 'worker' ? 'Job Management' : 'Booking History'}</h1>
            <p className="text-muted">Manage your active jobs, communications, and upcoming service requests.</p>
          </header>

          {user?.role === 'worker' && !hasProfile && (
            <WorkerSetupBanner onComplete={() => { setHasProfile(true); fetchBookings(); }} />
          )}

          <div className="bookings-scroll-area">
            {bookings.length === 0 ? (
              <div className="card empty-dash-card">
                <Calendar size={48} color="var(--border-light)" />
                <h3 className="mt-4">No Active Requests</h3>
                <p className="text-muted">When you have service requests, they will appear here for management.</p>
              </div>
            ) : (
              bookings.map(booking => {
                const workerName = booking.workerId?.name ?? 'Unknown Provider';
                const customerName = booking.customerId?.name ?? 'Unknown Client';
                const displayName = user?.role === 'worker' ? customerName : workerName;
                const receiverId = user?.role === 'worker' ? booking.customerId?._id : booking.workerId?._id;

                return (
                  <div key={booking._id} className="card booking-entry-ui">
                    <div className="entry-status">
                      <span className={`badge-ui status-${booking.status}`}>{booking.status}</span>
                      <span className="entry-time"><Clock size={14} /> {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}</span>
                    </div>
                    <div className="entry-details">
                      <h3>{displayName}</h3>
                      <p className="text-muted">"{booking.problemDescription}"</p>
                    </div>
                    <div className="entry-actions">
                      <div className="status-flow-btns">
                        {user?.role === 'worker' && booking.status === 'pending' && (
                          <>
                            <button onClick={() => updateStatus(booking._id, 'accepted')} className="action-btn success"><CheckCircle size={18} /></button>
                            <button onClick={() => updateStatus(booking._id, 'cancelled')} className="action-btn danger"><XCircle size={18} /></button>
                          </>
                        )}
                        {user?.role === 'worker' && booking.status === 'accepted' && (
                          <button onClick={() => updateStatus(booking._id, 'completed')} className="btn-primary" style={{padding: '10px 20px', fontSize: '0.9rem'}}>Mark Done</button>
                        )}
                        {user?.role === 'customer' && booking.status === 'pending' && (
                          <button onClick={() => updateStatus(booking._id, 'cancelled')} className="btn-secondary" style={{padding: '10px 20px', fontSize: '0.9rem'}}>Cancel</button>
                        )}
                        {user?.role === 'customer' && booking.status === 'completed' && (
                          <button onClick={() => setShowRateModal(booking)} className="btn-rate-ui"><Star size={16} /> Rate</button>
                        )}
                      </div>
                      <div className="action-divider"></div>
                      <button onClick={() => setActiveChat({ id: booking._id, receiver: receiverId })} className={`msg-trigger ${activeChat?.id === booking._id ? 'active' : ''}`}>
                        <MessageSquare size={20} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <aside className="dashboard-sidebar-ui">
          {activeChat ? (
            <div className="chat-sticky-wrap">
              <Chat bookingId={activeChat.id} receiverId={activeChat.receiver} />
            </div>
          ) : (
            <div className="card chat-helper-card">
              <MessageSquare size={40} color="var(--border-light)" style={{marginBottom: '16px'}} />
              <h3>Direct Liaison</h3>
              <p className="text-muted">Select any service request to initiate a real-time secure communication thread.</p>
            </div>
          )}
        </aside>
      </div>

      {showRateModal && (
        <div className="modal-overlay">
          <div className="card modal-content-ui">
            <h2>Experience Rating</h2>
            <form onSubmit={handleRate} className="rating-form-ui">
              <div className="stars-ui">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} type="button" onClick={() => setRating(s)}><Star size={36} className={rating >= s ? 'active' : ''} /></button>
                ))}
              </div>
              <textarea className="input-field" style={{minHeight: '100px'}} placeholder="How was the professional service?" onChange={e => setComment(e.target.value)} />
              <div className="modal-actions-ui">
                 <button type="button" onClick={() => setShowRateModal(null)} className="btn-text">Cancel</button>
                 <button type="submit" className="btn-primary">Post Review</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .dashboard-professional-wrap { padding-top: 60px; }
        
        .user-profile-banner {
           margin-bottom: 48px;
        }
        .profile-info {
           display: flex;
           align-items: center;
           gap: 24px;
        }
        .profile-avatar {
           width: 80px; height: 80px; background: rgba(255, 122, 0, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;
        }
        .profile-role-badge {
           display: inline-block; background: var(--secondary-accent); color: white; padding: 6px 14px; border-radius: 99px; font-size: 0.8rem; font-weight: 700; margin-top: 8px;
        }
        
        .dashboard-grid-ui { display: grid; grid-template-columns: 1fr 420px; gap: 48px; }
        .dash-header-ui { margin-bottom: 48px; }
        .dash-header-ui h1 { font-size: 2.8rem; margin-bottom: 8px; color: var(--text-primary); }
        
        .bookings-scroll-area { display: flex; flex-direction: column; gap: 24px; }
        .booking-entry-ui { display: flex; align-items: center; justify-content: space-between; padding: 24px 32px; border: 1px solid var(--border-light); box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
        .booking-entry-ui:hover { border-color: var(--primary-accent); }

        .entry-status { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; }
        
        .badge-ui { padding: 6px 14px; border-radius: 99px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
        .status-pending { background: #FFF3CD; color: #856404; border: 1px solid #FFEEBA; }
        .status-accepted { background: #D1ECF1; color: #0C5460; border: 1px solid #BEE5EB; }
        .status-completed { background: #D4EDDA; color: #155724; border: 1px solid #C3E6CB; }
        .status-cancelled { background: #F8D7DA; color: #721C24; border: 1px solid #F5C6CB; }
        
        .entry-time { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: var(--text-secondary); font-weight: 600; }
        
        .entry-details h3 { font-size: 1.2rem; margin-bottom: 4px; color: var(--text-primary); }
        .entry-details p { font-size: 0.95rem; max-width: 400px; }
        
        .entry-actions { display: flex; align-items: center; gap: 20px; }
        .status-flow-btns { display: flex; gap: 10px; }
        .action-btn { width: 44px; height: 44px; border-radius: 14px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .action-btn.success { background: #D4EDDA; color: #155724; }
        .action-btn.danger { background: #F8D7DA; color: #721C24; }
        .btn-rate-ui { background: var(--border-light); color: var(--text-primary); border: none; padding: 10px 20px; border-radius: 14px; font-weight: 800; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s;}
        .btn-rate-ui:hover { background: #D1D5DB; }
        
        .action-divider { width: 1px; height: 32px; background: var(--border-light); }
        .msg-trigger { background: var(--input-bg); color: var(--text-primary); border: none; width: 48px; height: 48px; border-radius: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; border: 1px solid var(--border-light); }
        .msg-trigger:hover, .msg-trigger.active { background: rgba(255, 122, 0, 0.1); color: var(--primary-accent); border-color: var(--primary-accent); }
        
        .chat-helper-card { text-align: center; padding: 60px 40px; border: 1px dashed var(--border-light); background: var(--input-bg); box-shadow: none; }
        .chat-sticky-wrap { position: sticky; top: 100px; }
        
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 3000; }
        .modal-content-ui { width: 100%; max-width: 480px; padding: 48px; text-align: center; }
        .stars-ui { display: flex; justify-content: center; gap: 12px; margin: 32px 0; }
        .stars-ui button { background: none; border: none; cursor: pointer; color: var(--border-light); transition: color 0.2s; }
        .stars-ui .active { color: #F59E0B; fill: #F59E0B; }
        .modal-actions-ui { display: flex; gap: 16px; margin-top: 32px; }
        .btn-text { flex: 1; background: none; border: none; font-weight: 700; color: var(--text-secondary); cursor: pointer; transition: color 0.2s; }
        .btn-text:hover { color: var(--text-primary); }
        
        .loading-ui { text-align: center; padding: 150px; font-size: 1.2rem; font-weight: 700; color: var(--primary-accent); }
        .empty-dash-card { text-align: center; padding: 100px; border: 1px dashed var(--border-light); box-shadow: none; background: var(--input-bg); }
        
        .mt-4 { margin-top: 16px; }

        @media (max-width: 1024px) {
          .dashboard-grid-ui { grid-template-columns: 1fr; }
          .booking-entry-ui { flex-direction: column; align-items: flex-start; gap: 20px; }
          .entry-actions { width: 100%; justify-content: flex-end; }
          .chat-sticky-wrap { position: relative; top: 0; }
          .profile-info { flex-direction: column; text-align: center; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
