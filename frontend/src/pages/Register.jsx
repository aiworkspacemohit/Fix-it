import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { User, Mail, Lock, MapPin, Phone, Briefcase, Award, DollarSign, Image as ImageIcon, UserPlus } from 'lucide-react';

const CATEGORIES = [
  'Plumbing', 'Electrical', 'AC Repair', 'Carpentry',
  'Cleaning', 'Painting', 'Appliance Repair', 'Pest Control',
  'Masonry', 'General Handyman'
];

const Register = () => {
  const [role, setRole] = useState('customer');
  const [form, setForm] = useState({ 
    name: '', email: '', password: '', role: 'customer', city: 'New York',
    phone: '', category: 'Plumbing', experience: '1', hourlyRate: '30', bio: '', profileImage: null
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setForm({...form, role: newRole});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (form[key] !== null) {
          formData.append(key, form[key]);
        }
      });

      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      login(data);
      toast.success('Registration successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="registration-wrapper">
      <div className="card register-card">
        <div className="reg-header text-center">
           <div className="icon-badge">
             <UserPlus size={32} color="var(--primary-accent)" />
           </div>
           <h2>{role === 'customer' ? 'Create Account' : 'Partner with Us'}</h2>
           <p className="text-muted">Join the platform redefining home services.</p>
        </div>

        <div className="role-toggle-ui">
           <button 
              className={`type-btn ${role === 'customer' ? 'active' : ''}`}
              onClick={() => handleRoleChange('customer')}
           >
             <User size={18} />
             <span>Customer</span>
           </button>
           <button 
              className={`type-btn ${role === 'worker' ? 'active' : ''}`}
              onClick={() => handleRoleChange('worker')}
           >
             <Briefcase size={18} />
             <span>Professional</span>
           </button>
        </div>

        <form onSubmit={handleSubmit} className={`actual-form-ui ${role === 'worker' ? 'is-worker' : ''}`}>
          <div className="form-fields-grid">
            <div className="form-group-ui">
              <label>Full Name</label>
              <div className="field-inner">
                <User className="inner-icon" size={18} />
                <input type="text" required className="input-field pl-icon" placeholder="e.g. Michael Smith" onChange={e => setForm({...form, name: e.target.value})} />
              </div>
            </div>

            <div className="form-group-ui">
              <label>Email Address</label>
              <div className="field-inner">
                <Mail className="inner-icon" size={18} />
                <input type="email" required className="input-field pl-icon" placeholder="name@email.com" onChange={e => setForm({...form, email: e.target.value})} />
              </div>
            </div>

            <div className="form-group-ui">
              <label>City / Location</label>
              <div className="field-inner">
                <MapPin className="inner-icon" size={18} />
                <input type="text" required className="input-field pl-icon" placeholder="e.g. Miami, FL" onChange={e => setForm({...form, city: e.target.value})} />
              </div>
            </div>

            <div className="form-group-ui">
              <label>Secure Password</label>
              <div className="field-inner">
                <Lock className="inner-icon" size={18} />
                <input type="password" required className="input-field pl-icon" placeholder="••••••••" onChange={e => setForm({...form, password: e.target.value})} />
              </div>
            </div>

            {/* Worker Specific Fields */}
            {role === 'worker' && (
              <>
                <div className="form-group-ui">
                  <label>Phone Number</label>
                  <div className="field-inner">
                    <Phone className="inner-icon" size={18} />
                    <input type="tel" className="input-field pl-icon" placeholder="+1 (555) 000-0000" onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                </div>

                <div className="form-group-ui">
                  <label>Expertise Category</label>
                  <div className="field-inner">
                    <Briefcase className="inner-icon" size={18} />
                    <select className="input-field pl-icon" onChange={e => setForm({...form, category: e.target.value})}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group-ui">
                  <label>Experience (Years)</label>
                  <div className="field-inner">
                    <Award className="inner-icon" size={18} />
                    <input type="number" min="0" className="input-field pl-icon" placeholder="5" onChange={e => setForm({...form, experience: e.target.value})} />
                  </div>
                </div>

                <div className="form-group-ui">
                  <label>Hourly Rate ($)</label>
                  <div className="field-inner">
                    <DollarSign className="inner-icon" size={18} />
                    <input type="number" min="1" className="input-field pl-icon" placeholder="45" onChange={e => setForm({...form, hourlyRate: e.target.value})} />
                  </div>
                </div>

                <div className="form-group-ui full-span">
                  <label>Professional Bio</label>
                  <textarea 
                    className="input-field text-area-ui" 
                    placeholder="Tell customers about your skills and experience..."
                    onChange={e => setForm({...form, bio: e.target.value})}
                  ></textarea>
                </div>
                
                <div className="form-group-ui full-span">
                   <label htmlFor="profileImageUpload" className="avatar-upload-placeholder" style={{cursor: 'pointer', display: 'flex'}}>
                      <ImageIcon size={24} />
                      <span>{form.profileImage ? form.profileImage.name : 'Upload Profile Photo / ID (Required for Professionals)'}</span>
                   </label>
                   <input 
                      type="file" 
                      id="profileImageUpload" 
                      style={{display: 'none'}} 
                      accept="image/*"
                      onChange={e => setForm({...form, profileImage: e.target.files[0]})} 
                   />
                </div>
              </>
            )}
          </div>

          <div className="terms-row-ui">
             <input type="checkbox" id="terms" required />
             <label htmlFor="terms">I agree to the <Link to="/">Terms of Service</Link> and <Link to="/">Privacy Policy</Link></label>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.05rem', marginTop: '10px' }}>
            {role === 'customer' ? 'Create User Account' : 'Apply as Professional'}
          </button>

          <div className="form-footer-ui text-center mt-6">
             <span className="text-muted">Already a member?</span> <Link to="/login" className="text-accent link-bold">Sign In Here</Link>
          </div>
        </form>
      </div>

      <style jsx>{`
        .registration-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--background);
          padding: 80px 24px;
        }
        
        .register-card {
           width: 100%;
           max-width: 800px;
           padding: 48px;
        }
        .icon-badge {
           background: rgba(255,122,0,0.1);
           width: 64px;
           height: 64px;
           border-radius: 20px;
           display: flex;
           align-items: center;
           justify-content: center;
           margin: 0 auto 24px;
        }
        .reg-header h2 { color: var(--text-primary); margin-bottom: 8px; }
        .reg-header p { margin-bottom: 40px; }

        .role-toggle-ui {
           display: flex; gap: 12px; background: var(--input-bg); padding: 8px; border-radius: var(--radius-pill); margin-bottom: 40px; border: 1px solid var(--border-light);
        }
        .type-btn {
           flex: 1; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 14px; border: none; border-radius: var(--radius-pill); font-weight: 700; cursor: pointer; background: transparent; color: var(--text-secondary); transition: all 0.3s ease;
        }
        .type-btn.active {
           background: white; color: var(--primary-accent); box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        
        .form-fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .form-group-ui { display: flex; flex-direction: column; gap: 8px; }
        .full-span { grid-column: span 2; }
        .form-group-ui label { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
        .field-inner { position: relative; }
        .inner-icon { position: absolute; left: 16px; top: 16px; color: var(--text-secondary); }
        .pl-icon { padding-left: 48px !important; }
        
        .text-area-ui { min-height: 120px; resize: none; }
        
        .avatar-upload-placeholder {
           cursor: pointer; border: 2px dashed var(--border-light); padding: 32px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 12px; color: var(--text-secondary); font-weight: 600; transition: all 0.2s; background: var(--input-bg);
        }
        .avatar-upload-placeholder:hover {
           border-color: var(--primary-accent); color: var(--primary-accent); background: rgba(255,122,0,0.02);
        }
        
        .terms-row-ui { display: flex; align-items: center; gap: 12px; margin: 32px 0; font-size: 0.9rem; color: var(--text-secondary); }
        .terms-row-ui a { color: var(--primary-accent); font-weight: 600; text-decoration: none; }
        
        .form-footer-ui { margin-top: 32px; }
        .form-footer-ui .link-bold { font-weight: 700; margin-left: 6px; text-decoration: none; }
        
        .text-center { text-align: center; }
        
        @media (max-width: 768px) {
           .form-fields-grid { grid-template-columns: 1fr; }
           .full-span { grid-column: span 1; }
           .register-card { padding: 32px; }
        }
      `}</style>
    </div>
  );
};

export default Register;
