import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Lock, MapPin, Briefcase, Tag, DollarSign, FileText } from 'lucide-react';

const CATEGORIES = [
  'Plumbing', 'Electrician', 'AC Repair', 'Carpenter',
  'Painter', 'Cleaning', 'Appliance Repair', 'Pest Control',
  'Masonry', 'General Handyman'
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'customer',
    city: '', address: '',
    // Worker-specific
    category: 'Plumbing', skills: '', hourlyRate: '', bio: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.role === 'worker' && !formData.hourlyRate) {
      toast.error('Please enter your hourly rate');
      return;
    }
    setIsSubmitting(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', formData);
      login(data);
      toast.success('Account created! Welcome to FixIt 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isWorker = formData.role === 'worker';

  return (
    <div className="max-w-xl mx-auto mt-8 mb-16">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Join FixIt</h2>
          <p className="text-gray-500 mt-1">Create your account in seconds</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'customer' })}
              className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                !isWorker
                  ? 'border-primary bg-orange-50 text-primary'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              👤 I need repairs
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'worker' })}
              className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                isWorker
                  ? 'border-primary bg-orange-50 text-primary'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              🔧 I'm a worker
            </button>
          </div>

          {/* Base fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text" name="name" required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="John Doe"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email" name="email" required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="john@example.com"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password" name="password" required minLength={6}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text" name="city" required
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="New York"
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Worker-specific fields */}
          {isWorker && (
            <div className="border-t border-dashed border-orange-200 pt-5 mt-2 space-y-5">
              <p className="text-sm font-semibold text-primary flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Worker Profile Details
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Specialization / Category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    name="category"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none appearance-none bg-white"
                    onChange={handleChange}
                    value={formData.category}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills <span className="text-gray-400 font-normal">(comma separated)</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text" name="skills"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="e.g. Pipe fitting, Leak repair, Drain cleaning"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (₹ or $)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="number" name="hourlyRate" min="1" required={isWorker}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    placeholder="50"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio / About You</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <textarea
                    name="bio" rows="3"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
                    placeholder="Tell customers about your experience and expertise..."
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-3 mt-2 rounded-xl text-lg font-bold disabled:opacity-60"
          >
            {isSubmitting ? 'Creating account...' : isWorker ? 'Join as Worker 🔧' : 'Get Started 🚀'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
