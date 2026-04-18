import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', form);
      login(data);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card card">
        <div className="auth-header text-center">
           <div className="icon-badge">
             <LogIn size={28} color="var(--primary-accent)" />
           </div>
           <h2>Welcome Back</h2>
           <p className="text-muted">Enter your details to access your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group-ui">
            <label>Email Address</label>
            <div className="field-inner">
              <Mail className="inner-icon" size={18} />
              <input type="email" required className="input-field pl-icon" placeholder="name@email.com" onChange={e => setForm({...form, email: e.target.value})} />
            </div>
          </div>

          <div className="form-group-ui">
            <label>Password</label>
            <div className="field-inner">
              <Lock className="inner-icon" size={18} />
              <input type="password" required className="input-field pl-icon" placeholder="••••••••" onChange={e => setForm({...form, password: e.target.value})} />
            </div>
          </div>

          <button type="submit" className="btn-primary auth-submit-btn">
            Log In Securely
          </button>

          <div className="form-footer-ui text-center">
             <span className="text-muted">Don't have an account?</span> <Link to="/register" className="text-accent link-bold">Sign Up Here</Link>
          </div>
        </form>
      </div>

      <style jsx>{`
        .auth-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--background);
          padding: 80px 24px;
        }
        .auth-card {
           width: 100%;
           max-width: 480px;
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
           margin: 0 auto 20px;
        }
        .auth-header h2 { margin-bottom: 8px; color: var(--text-primary); }
        .auth-header p { margin-bottom: 32px; }

        .auth-form { display: flex; flex-direction: column; gap: 20px; }
        .form-group-ui { display: flex; flex-direction: column; gap: 8px; }
        .form-group-ui label { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
        
        .field-inner { position: relative; }
        .inner-icon { position: absolute; left: 16px; top: 16px; color: var(--text-secondary); }
        .pl-icon { padding-left: 48px !important; }

        .auth-submit-btn { width: 100%; padding: 16px; margin-top: 10px; font-size: 1.05rem; }
        
        .form-footer-ui { margin-top: 24px; }
        .link-bold { font-weight: 700; text-decoration: none; margin-left: 6px; hover: underline; }
        .text-center { text-align: center; }
      `}</style>
    </div>
  );
};

export default Login;
