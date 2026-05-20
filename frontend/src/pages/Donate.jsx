import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaAppleAlt, FaGraduationCap, FaHandHoldingUsd, FaMedkit, FaCheckCircle } from 'react-icons/fa';
import api from '../services/api';

const categories = [
  { id: 'food', label: 'Food', icon: <FaAppleAlt />, desc: 'Nutritional support for families' },
  { id: 'education', label: 'Education', icon: <FaGraduationCap />, desc: 'School supplies and fees' },
  { id: 'healthcare', label: 'Healthcare', icon: <FaMedkit />, desc: 'Medical aid and supplies' },
  { id: 'financial', label: 'Financial', icon: <FaHandHoldingUsd />, desc: 'Direct cash assistance' },
  { id: 'general', label: 'General', icon: <FaHeart />, desc: 'Where needed most' }
];

const amounts = [500, 1000, 5000, 10000, 20000, 50000];

const Donate = ({ verifyMode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('general');
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [verificationData, setVerificationData] = useState(null);

  useEffect(() => {
    if (verifyMode) {
      const reference = searchParams.get('reference');
      if (reference) {
        verifyPayment(reference);
      }
    }
  }, [verifyMode, searchParams]);

  const verifyPayment = async (reference) => {
    setLoading(true);
    try {
      const res = await api.get(`/donations/verify/${reference}`);
      if (res.data.success) {
        setSuccess(true);
        setVerificationData(res.data);
      } else {
        setError('Payment verification failed');
      }
    } catch (err) {
      setError('Failed to verify payment');
    } finally {
      setLoading(false);
    }
  };

  const handleAmountSelect = (amt) => {
    setAmount(amt);
    setCustomAmount('');
  };

  const handleCustomAmount = (e) => {
    setCustomAmount(e.target.value);
    setAmount(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (!amount || amount < 100) {
      setError('Minimum donation amount is ₦100');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/donations/initialize', {
        amount: parseFloat(amount),
        category,
        message,
        isAnonymous,
        beneficiariesCount: 1
      });

      window.location.href = response.data.authorization_url;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize payment');
      setLoading(false);
    }
  };

  if (verifyMode && success) {
    return (
      <div className="donate-page">
        <div className="donate-container">
          <div className="donate-card" style={{ textAlign: 'center' }}>
            <FaCheckCircle style={{ fontSize: '4rem', color: '#1a5f2a', marginBottom: '1rem' }} />
            <h2>Payment Successful!</h2>
            <p style={{ color: '#636e72', marginBottom: '2rem' }}>
              Thank you for your donation. Your e-vouchers have been generated.
            </p>
            {verificationData?.vouchers && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Your Vouchers</h3>
                {verificationData.vouchers.map(v => (
                  <div key={v._id} style={{
                    background: '#f8f9fa',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '0.5rem',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: '#1a5f2a'
                  }}>
                    {v.code}
                  </div>
                ))}
              </div>
            )}
            <div className="hero-btns" style={{ justifyContent: 'center' }}>
              <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                View Dashboard
              </button>
              <button onClick={() => navigate('/')} className="btn btn-secondary">
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="donate-page">
      <div className="donate-container">
        <div className="donate-card">
          <h2>Make a Donation</h2>
          <p>Choose an amount and category to give smart with Amanah Charity Foundation</p>

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
            <div className="form-group">
              <label>Select Amount (₦)</label>
              <div className="amount-presets">
                {amounts.map(amt => (
                  <button
                    key={amt}
                    type="button"
                    className={`amount-btn ${amount == amt ? 'active' : ''}`}
                    onClick={() => handleAmountSelect(amt)}
                  >
                    ₦{amt.toLocaleString()}
                  </button>
                ))}
              </div>
              <input
                type="number"
                placeholder="Or enter custom amount"
                value={customAmount}
                onChange={handleCustomAmount}
                min="100"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <div className="category-grid">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`category-btn ${category === cat.id ? 'active' : ''}`}
                    onClick={() => setCategory(cat.id)}
                  >
                    <span className="icon">{cat.icon}</span>
                    <span>{cat.label}</span>
                    <span style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.25rem' }}>{cat.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Message (Optional)</label>
              <textarea
                rows="3"
                placeholder="Add a message with your donation..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                style={{ width: 'auto' }}
              />
              <label htmlFor="anonymous" style={{ marginBottom: 0 }}>Make this donation anonymous</label>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? 'Processing...' : `Donate ₦${amount ? parseFloat(amount).toLocaleString() : '0'}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Donate;