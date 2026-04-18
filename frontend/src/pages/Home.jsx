import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Star, Sparkles, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('New York');
  const [aiRecs, setAiRecs] = useState(null);
  const [matching, setMatching] = useState(false);
  const { user } = useAuth();

  const fetchWorkers = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/workers?category=${search}&city=${city}`);
      setWorkers(data);
    } catch (err) {
      toast.error('Failed to fetch workers');
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, [city]);

  const handleAiMatch = async () => {
    if (!user) {
      toast.error('Please login to use AI matching');
      return;
    }
    if (!search) {
      toast.error('Please describe your problem in the search bar');
      return;
    }

    setMatching(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/ai/match', {
        problem: search,
        userLocation: user.city || city,
        workers: workers
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAiRecs(data);
      toast.success('AI Matching Complete!');
    } catch (err) {
      toast.error('AI Matching failed');
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="h-64 w-64 text-primary" />
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
          Reliable Repairs, <br /><span className="text-primary">Right at Your Doorstep.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Find and book verified local experts for any home repair task in minutes.
        </p>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4 px-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
            <input 
              type="text" 
              placeholder="What do you need fixed? (e.g. leaking pipe, AC repair)"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-primary outline-none text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative sm:w-48">
            <MapPin className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
            <input 
              type="text" 
              placeholder="City"
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-primary outline-none text-lg"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <button onClick={fetchWorkers} className="btn-primary py-4 px-8 rounded-2xl text-lg flex items-center justify-center">
            Search
          </button>
        </div>

        <div className="mt-8 flex justify-center">
          <button 
            onClick={handleAiMatch}
            disabled={matching}
            className="flex items-center space-x-2 text-primary font-bold hover:bg-orange-50 px-6 py-2 rounded-full transition"
          >
            <Sparkles className={matching ? 'animate-spin' : ''} />
            <span>{matching ? 'Matching with AI...' : 'Try AI Expert Matchmaker'}</span>
          </button>
        </div>
      </section>

      {/* AI Recommendations */}
      {aiRecs && (
        <section className="bg-orange-50 border border-orange-200 rounded-3xl p-8">
          <div className="flex items-center space-x-2 mb-6">
            <Sparkles className="text-primary h-6 w-6" />
            <h2 className="text-2xl font-bold">Top AI Recommendations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiRecs.map((rec) => (
              <div key={rec.workerId} className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{rec.name}</h3>
                  <span className="bg-orange-100 text-primary text-xs font-bold px-2 py-1 rounded-full">{rec.score}% Match</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 italic">"{rec.reason}"</p>
                <Link to={`/worker/${rec.workerId}`} className="text-primary font-bold hover:underline">View Profile →</Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Workers Grid */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Available Experts</h2>
          <button className="flex items-center space-x-2 text-gray-600 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm hover:bg-gray-50">
            <SlidersHorizontal className="h-5 w-5" />
            <span>Filters</span>
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {workers.map((worker) => (
            <div key={worker._id} className="card-repair">
              <div className="h-48 bg-gray-200 relative">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.userId.name}`} alt={worker.userId.name} className="w-full h-full object-cover" />
                 <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
                   <Star className="h-4 w-4 text-primary fill-current" />
                   <span className="text-sm font-bold">{worker.rating.toFixed(1)}</span>
                 </div>
              </div>
              <div className="p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1 block">{worker.category}</span>
                <h3 className="text-xl font-bold mb-2">{worker.userId.name}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  {worker.userId.location.city}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">${worker.hourlyRate}</span>
                    <span className="text-gray-500 text-sm">/hr</span>
                  </div>
                  <Link to={`/worker/${worker.userId._id}`} className="btn-primary py-2 px-4 rounded-xl">Book</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {workers.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No workers found for this category/city. Try searching for something else.
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
