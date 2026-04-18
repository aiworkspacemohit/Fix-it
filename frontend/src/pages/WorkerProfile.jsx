import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Star, MapPin, Calendar, Clock, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';

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
        const res = await axios.get(`http://localhost:5000/api/workers/${id}`);
        setWorker(res.data);
        const revRes = await axios.get(`http://localhost:5000/api/reviews/${id}`);
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
      await axios.post('http://localhost:5000/api/bookings', {
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

  if (!worker) return <div className="text-center py-20">Loading profile...</div>;

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Worker Description */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary/10 px-6 py-2 rounded-bl-3xl flex items-center space-x-2">
            <ShieldCheck className="text-primary h-5 w-5" />
            <span className="text-primary font-bold">Verified Expert</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.userId.name}`} 
              alt={worker.userId.name} 
              className="w-32 h-32 rounded-full border-4 border-primary/20 p-1"
            />
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{worker.userId.name}</h1>
              <div className="flex items-center justify-center md:justify-start space-x-4 text-gray-600 mb-4">
                <span className="flex items-center"><Star className="h-5 w-5 text-primary fill-current mr-1" /> {worker.rating.toFixed(1)} ({worker.totalJobs} jobs)</span>
                <span className="flex items-center"><MapPin className="h-5 w-5 mr-1" /> {worker.userId.location.city}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {worker.skills.map(skill => (
                  <span key={skill} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-8">
            <h2 className="text-2xl font-bold mb-4">About Me</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {worker.bio}
            </p>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6">Recent Reviews</h2>
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review._id} className="border-b border-gray-50 pb-6 last:border-0">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-bold text-gray-900">{review.customerId.name}</div>
                  <div className="flex text-primary">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                </div>
                <p className="text-gray-600 italic">"{review.comment}"</p>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
          </div>
        </div>
      </div>

      {/* Right Column: Booking Card */}
      <div className="lg:col-span-1">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
          <div className="text-3xl font-bold text-gray-900 mb-6">${worker.hourlyRate}<span className="text-gray-500 text-lg font-normal">/hr</span></div>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3 text-gray-700">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Background checked</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>FixIt Guaranteed service</span>
            </div>
          </div>

          {!showBooking ? (
            <button 
              onClick={() => setShowBooking(true)}
              className="w-full btn-primary py-4 rounded-2xl text-lg flex items-center justify-center"
            >
              <Calendar className="mr-2 h-6 w-6" /> Book Now
            </button>
          ) : (
            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input 
                    type="date" 
                    required 
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Slot</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary"
                  onChange={(e) => setBookingData({...bookingData, timeSlot: e.target.value})}
                >
                  <option>10:00 AM</option>
                  <option>12:00 PM</option>
                  <option>02:00 PM</option>
                  <option>04:00 PM</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Problem Description</label>
                <textarea 
                  required
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
                  placeholder="Describe what needs fixing..."
                  onChange={(e) => setBookingData({...bookingData, problemDescription: e.target.value})}
                ></textarea>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowBooking(false)} className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl">Cancel</button>
                <button type="submit" className="flex-[2] btn-primary py-3 rounded-xl font-bold">Confirm</button>
              </div>
            </form>
          )}

          <button className="w-full mt-4 flex items-center justify-center space-x-2 text-gray-600 font-bold hover:text-primary transition py-2">
            <MessageSquare className="h-5 w-5" />
            <span>Chat with Expert</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
