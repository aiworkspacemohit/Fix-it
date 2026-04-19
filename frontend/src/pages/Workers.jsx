import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Star, Filter, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/workers`);
        setWorkers(data);
      } catch (err) {
        toast.error('Failed to fetch professionals');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  const filteredWorkers = workers.filter(worker => 
    worker.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    worker.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="workers-page section">
      <div className="container">
        
        {/* Search Header */}
        <div className="search-header-ui">
          <div className="search-text">
             <h1 style={{fontSize: '2.5rem', marginBottom: '12px', color: 'var(--text-primary)'}}>Find a Professional</h1>
             <p className="text-muted" style={{fontSize: '1.1rem'}}>Browse our network of trusted, verified home service experts.</p>
          </div>
          
          <div className="search-bar-wrap">
             <Search className="search-icon-left" size={24} />
             <input 
               type="text" 
               className="input-field search-input" 
               placeholder="Search by name or category (e.g., Plumbing, Electrical)..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
             <button className="btn-primary search-btn">Search</button>
          </div>
        </div>

        {/* Results Grid */}
        <div className="results-container">
          {loading ? (
             <div className="loading-state text-center text-muted" style={{padding: '100px'}}>Loading professionals...</div>
          ) : filteredWorkers.length > 0 ? (
             <div className="grid grid-3">
               {filteredWorkers.map(worker => {
                 const displayImg = worker.profileImage?.startsWith('http') 
                    ? worker.profileImage 
                    : worker.profileImage ? `${import.meta.env.VITE_BACKEND_URL}${worker.profileImage}` 
                    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.userId?.name}`;
                 return (
                  <div className="worker-card card" key={worker._id}>
                     <div className="w-header">
                        <img src={displayImg} alt="Avatar" className="w-avatar" />
                        <div>
                           <h3>{worker.userId?.name}</h3>
                           <p className="text-muted" style={{fontWeight: 600}}>{worker.category} Specialist</p>
                        </div>
                     </div>
                     
                     <div className="w-body mt-4">
                        <p className="text-muted" style={{fontSize: '0.95rem', minHeight: '44px'}}>
                          "{worker.bio || 'Experienced professional ready to assist with your custom project requirements.'}"
                        </p>
                     </div>

                     <div className="w-stats mt-4">
                        <div className="rating"><Star size={16} fill="var(--primary-accent)" color="var(--primary-accent)" /> 4.9 (12+ jobs)</div>
                        <div className="price">${worker.hourlyRate}<span style={{fontSize:'0.8rem', color:'var(--text-secondary)'}}>/hr</span></div>
                     </div>
                     <Link to={`/worker/${worker.userId?._id}`} className="btn-primary mt-4" style={{width:'100%', padding: '14px'}}>View Profile & Book</Link>
                  </div>
               ); })}
             </div>
          ) : (
             <div className="empty-state text-center">
               <Search size={48} color="var(--border-light)" style={{marginBottom: '16px'}} />
               <h3>No professionals found</h3>
               <p className="text-muted">Try adjusting your search terminology.</p>
             </div>
          )}
        </div>

      </div>

      <style jsx>{`
        .workers-page {
          min-height: calc(100vh - 80px); /* Minus navbar */
          background: var(--background);
        }
        
        .search-header-ui {
          display: flex;
          flex-direction: column;
          gap: 32px;
          margin-bottom: 60px;
          background: var(--card-bg);
          padding: 48px;
          border-radius: var(--radius-card);
          box-shadow: var(--shadow-main);
          border: 1px solid var(--border-light);
        }
        
        .search-bar-wrap {
          display: flex;
          align-items: center;
          position: relative;
          background: var(--input-bg);
          border-radius: var(--radius-pill);
          border: 1px solid var(--border-light);
          padding: 6px;
          transition: all 0.3s;
        }
        .search-bar-wrap:focus-within {
          border-color: var(--primary-accent);
          box-shadow: 0 0 0 4px rgba(255, 122, 0, 0.1);
          background: white;
        }
        
        .search-icon-left {
          position: absolute;
          left: 24px;
          color: var(--text-secondary);
        }
        
        .search-input {
          flex: 1;
          border: none;
          background: transparent !important;
          box-shadow: none !important;
          padding: 16px 20px 16px 60px;
          font-size: 1.1rem;
        }
        
        .search-btn {
          padding: 16px 40px;
          font-size: 1.05rem;
          height: auto;
        }

        .worker-card { display: flex; flex-direction: column; }
        .w-header { display: flex; align-items: center; gap: 16px; }
        .w-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; background: #EEE; }
        
        .w-stats { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid var(--border-light); font-weight: 700; color: var(--text-primary); }
        .rating { display: flex; align-items: center; gap: 6px; }
        .price { color: var(--text-primary); font-size: 1.2rem;}

        .mt-4 { margin-top: 20px; }
        
        .empty-state {
          padding: 80px 20px;
          background: var(--card-bg);
          border-radius: var(--radius-card);
          border: 1px dashed var(--border-light);
        }
        .empty-state h3 { color: var(--text-primary); margin-bottom: 8px; }

        @media (max-width: 768px) {
          .search-bar-wrap { flex-direction: column; border-radius: var(--radius-card); background: transparent; padding: 0; border: none; }
          .search-icon-left { top: 20px; }
          .search-input { width: 100%; border-radius: var(--radius-input); background: var(--input-bg) !important; border: 1px solid var(--border-light); margin-bottom: 12px; }
          .search-btn { width: 100%; border-radius: var(--radius-pill); }
        }
      `}</style>
    </div>
  );
};

export default Workers;
