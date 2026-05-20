import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaUser, FaPhone, FaBuilding } from 'react-icons/fa';

const Login = () => {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'donor',
    companyName: ''
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/portal');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let userData;
      if (isLogin) {
        userData = await login(formData.email, formData.password);
      } else {
        userData = await register(formData);
      }

      console.log('Login successful, user role:', userData.role);
      navigate('/portal');
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>{isLogin ? 'Welcome Back' : 'Get Started'}</h2>
        <p>{isLogin ? 'Sign in to your account' : 'Create your Amanah Charity Foundation account'}</p>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group" style={{ position: 'relative' }}>
                <FaUser style={{ position: 'absolute', left: '1rem', top: '2.7rem', color: '#636e72' }} />
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
              <div className="form-group" style={{ position: 'relative' }}>
                <FaPhone style={{ position: 'absolute', left: '1rem', top: '2.7rem', color: '#636e72' }} />
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+234 800 000 0000"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
              <div className="form-group">
                <label>I am a</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="donor">Individual Donor</option>
                  <option value="corporate">Corporate Organization</option>
                  <option value="beneficiary">Beneficiary</option>
                  <option value="vendor">Vendor</option>
                </select>
              </div>
              {formData.role === 'corporate' && (
                <div className="form-group" style={{ position: 'relative' }}>
                  <FaBuilding style={{ position: 'absolute', left: '1rem', top: '2.7rem', color: '#636e72' }} />
                  <label>Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Ltd"
                    value={formData.companyName}
                    onChange={handleChange}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              )}
            </>
          )}

          <div className="form-group" style={{ position: 'relative' }}>
            <FaEnvelope style={{ position: 'absolute', left: '1rem', top: '2.7rem', color: '#636e72' }} />
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <FaLock style={{ position: 'absolute', left: '1rem', top: '2.7rem', color: '#636e72' }} />
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Min 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="switch-mode">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;