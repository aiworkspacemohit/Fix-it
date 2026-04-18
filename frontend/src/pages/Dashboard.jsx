import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Chat from '../components/Chat';
import { CheckCircle, XCircle, Clock, Star, MessageSquare, AlertCircle, Tag, DollarSign, Briefcase } from 'lucide-react';

const CATEGORIES = [
  'Plumbing', 'Electrician', 'AC Repair', 'Carpenter',
  'Painter', 'Cleaning', 'Appliance Repair', 'Pest Control',
  'Masonry', 'General Handyman'
];

// Worker profile setup form for existing workers without a profile
const WorkerSetupBanner = ({ onComplete }) => {
  const [form, setForm] = useState({ category: 'Plumbing', skills: '', hourlyRate: '', bio: '' });
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
    <div className="bg-orange-50 border-2 border-dashed border-primary rounded-3xl p-8 mb-8">
      <div className="flex items-start gap-4 mb-6">
        <AlertCircle className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">Complete Your Worker Profile</h2>
          <p className="text-gray-600 mt-1">You registered as a worker but don't have a profile yet. Fill in your details to start appearing in search results and receiving bookings.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
          <div className="relative">
            <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate ($)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="number" min="1" required
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="e.g. 50"
              onChange={e => setForm({ ...form, hourlyRate: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              placeholder="Pipe fitting, Leak repair..."
              onChange={e => setForm({ ...form, skills: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <input
            type="text"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder="Briefly describe your experience..."
            onChange={e => setForm({ ...form, bio: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <button type="submit" disabled={submitting} className="btn-primary py-3 px-8 rounded-xl font-bold disabled:opacity-60">
            {submitting ? 'Saving...' : 'Save Profile & Go Live 🚀'}
          </button>
        </div>
      </form>
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

  // For workers: check if they have a profile
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':   return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'accepted':  return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default:          return 'bg-gray-100 text-gray-700';
    }
  };

  if (!profileChecked) {
    return <div className="text-center py-20 text-gray-400">Loading dashboard...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Bookings List */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold mb-2">
          {user?.role === 'worker' ? 'Incoming Jobs' : 'My Bookings'}
        </h1>

        {/* Show profile setup banner for workers without a profile */}
        {user?.role === 'worker' && !hasProfile && (
          <WorkerSetupBanner onComplete={() => { setHasProfile(true); fetchBookings(); }} />
        )}

        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl text-gray-400 font-medium border border-dashed border-gray-200">
            {user?.role === 'worker'
              ? 'No job requests yet. Make sure your profile is complete and visible.'
              : 'No bookings yet. Browse workers on the home page and book one!'}
          </div>
        ) : (
          bookings.map(booking => {
            // Null-safe access to populated fields
            const workerName = booking.workerId?.name ?? 'Unknown Worker';
            const customerName = booking.customerId?.name ?? 'Unknown Customer';
            const displayName = user?.role === 'worker' ? customerName : workerName;
            const receiverId = user?.role === 'worker'
              ? booking.customerId?._id
              : booking.workerId?._id;

            return (
              <div key={booking._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)} uppercase`}>
                      {booking.status}
                    </span>
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {booking.date ? new Date(booking.date).toLocaleDateString() : '—'}
                      {booking.timeSlot ? ` at ${booking.timeSlot}` : ''}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{displayName}</h3>
                  <p className="text-gray-600 text-sm max-w-md">"{booking.problemDescription}"</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 h-fit md:self-center">
                  {user?.role === 'worker' && booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(booking._id, 'accepted')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition"
                        title="Accept"
                      >
                        <CheckCircle />
                      </button>
                      <button
                        onClick={() => updateStatus(booking._id, 'cancelled')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition"
                        title="Reject"
                      >
                        <XCircle />
                      </button>
                    </>
                  )}
                  {user?.role === 'worker' && booking.status === 'accepted' && (
                    <button
                      onClick={() => updateStatus(booking._id, 'completed')}
                      className="btn-primary py-2 px-4 rounded-xl text-sm"
                    >
                      Mark Done
                    </button>
                  )}
                  {user?.role === 'customer' && booking.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(booking._id, 'cancelled')}
                      className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold"
                    >
                      Cancel
                    </button>
                  )}
                  {user?.role === 'customer' && booking.status === 'completed' && (
                    <button
                      onClick={() => setShowRateModal(booking)}
                      className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center space-x-1"
                    >
                      <Star className="h-4 w-4 fill-current" />
                      <span>Rate</span>
                    </button>
                  )}
                  {receiverId && (
                    <button
                      onClick={() => setActiveChat({ id: booking._id, receiver: receiverId })}
                      className="p-2 text-primary hover:bg-orange-50 rounded-xl transition"
                      title="Chat"
                    >
                      <MessageSquare />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Chat Sidebar */}
      <div className="lg:col-span-1">
        {activeChat ? (
          <div className="sticky top-24">
            <Chat bookingId={activeChat.id} receiverId={activeChat.receiver} />
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-dashed border-gray-300 flex flex-col items-center text-center text-gray-400 sticky top-24">
            <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
            <p>Click the chat icon on any booking to start a conversation.</p>
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {showRateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">
              Rate {showRateModal.workerId?.name ?? 'Worker'}
            </h2>
            <form onSubmit={handleRate} className="space-y-6">
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button" onClick={() => setRating(star)}>
                    <Star className={`h-10 w-10 ${rating >= star ? 'text-primary fill-current' : 'text-gray-200'}`} />
                  </button>
                ))}
              </div>
              <textarea
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary"
                placeholder="Leave a comment about the service..."
                rows="4"
                onChange={e => setComment(e.target.value)}
              />
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowRateModal(null)} className="flex-1 py-3 font-bold text-gray-500">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary py-3 rounded-2xl">
                  Submit Rating
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
