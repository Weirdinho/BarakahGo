import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaTimes, 
  FaHeart, 
  FaUtensils, 
  FaGraduationCap, 
  FaHandHoldingUsd, 
  FaMedkit,
  FaMosque,
  FaHandHoldingHeart
} from 'react-icons/fa';
import api from '../services/api';

const categories = [
  { id: 'zakat', label: 'Zakat', icon: <FaHandHoldingUsd />, desc: 'Obligatory alms for the poor and needy' },
  { id: 'sadaqah', label: 'Sadaqah', icon: <FaHeart />, desc: 'Voluntary charity for those in need' },
  { id: 'waqf', label: 'Waqf', icon: <FaMosque />, desc: 'Endowment for lasting community benefit' },
  { id: 'food-aid', label: 'Food Aid', icon: <FaUtensils />, desc: 'Feed the hungry and provide meals' },
  { id: 'education', label: 'Education', icon: <FaGraduationCap />, desc: 'School fees, supplies, and scholarships' },
  { id: 'healthcare', label: 'Healthcare', icon: <FaMedkit />, desc: 'Medical treatment and hospital bills' },
  { id: 'general-fund', label: 'General Fund', icon: <FaHandHoldingHeart />, desc: 'Where needed most — urgent causes' }
];

const amounts = [500, 1000, 5000, 10000, 20000, 50000];

const DonateModal = ({ onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('general-fund');
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '2rem',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#636e72'
          }}
        >
          <FaTimes />
        </button>

        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Make a Donation</h2>
        <p style={{ color: '#636e72', marginBottom: '1.5rem' }}>Choose an amount and category to give smart</p>

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
                  title={cat.desc}
                >
                  <span className="icon">{cat.icon}</span>
                  {cat.label}
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
  );
};

export default DonateModal;