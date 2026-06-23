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
  FaHandHoldingHeart,
  FaLock,
  FaSpinner,
  FaCheckCircle
} from 'react-icons/fa';
import api from '../services/api';

const categories = [
  { id: 'zakat', label: 'Zakat', icon: <FaHandHoldingUsd />, desc: 'Obligatory alms for the poor and needy', color: '#1a5f2a' },
  { id: 'sadaqah', label: 'Sadaqah', icon: <FaHeart />, desc: 'Voluntary charity for those in need', color: '#e76f51' },
  { id: 'waqf', label: 'Waqf', icon: <FaMosque />, desc: 'Endowment for lasting community benefit', color: '#2d8a3e' },

  { id: 'general-fund', label: 'General Fund', icon: <FaHandHoldingHeart />, desc: 'Where needed most — urgent causes', color: '#6c5ce7' }
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
  const [step, setStep] = useState(1);

  const handleAmountSelect = (amt) => {
    setAmount(amt);
    setCustomAmount('');
    setError('');
  };

  const handleCustomAmount = (e) => {
    const val = e.target.value;
    setCustomAmount(val);
    setAmount(val);
    setError('');
  };

  const handleNext = () => {
    if (!amount || parseFloat(amount) < 100) {
      setError('Minimum donation amount is ₦100');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/login');
      return;
    }

    if (!amount || parseFloat(amount) < 100) {
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
        beneficiariesCount: 1,
        callback_url: window.location.origin + '/donate/verify',
      });

      if (response.data?.data?.authorization_url) {
        window.location.href = response.data.data.authorization_url;
      } else if (response.data?.authorization_url) {
        window.location.href = response.data.authorization_url;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.response?.data?.message || 'Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(c => c.id === category);

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1rem;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-container {
          background: white;
          border-radius: 24px;
          width: 100%;
          max-width: 560px;
          max-height: 90vh;
          overflow: hidden;
          position: relative;
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
        }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
          background: linear-gradient(135deg, #1a5f2a 0%, #2d8a3e 100%);
          color: white;
          padding: 2rem;
          position: relative;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .modal-header p {
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .close-btn {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .modal-body {
          padding: 1.5rem 2rem;
          overflow-y: auto;
          max-height: calc(90vh - 120px);
        }

        .step-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .step-dot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .step-dot.active {
          background: #1a5f2a;
          color: white;
        }

        .step-dot.inactive {
          background: #e9ecef;
          color: #636e72;
        }

        .step-line {
          flex: 1;
          height: 2px;
          background: #e9ecef;
          transition: all 0.3s ease;
        }

        .step-line.completed {
          background: #1a5f2a;
        }

        .section-title {
          font-size: 1rem;
          font-weight: 600;
          color: #2d3436;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .amount-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .amount-btn {
          padding: 1rem;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          background: white;
          color: #2d3436;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .amount-btn:hover {
          border-color: #1a5f2a;
          color: #1a5f2a;
          background: #f8fff9;
        }

        .amount-btn.active {
          background: #1a5f2a;
          border-color: #1a5f2a;
          color: white;
          box-shadow: 0 4px 15px rgba(26, 95, 42, 0.2);
        }

        .custom-amount {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .custom-amount .currency {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #636e72;
          font-weight: 600;
        }

        .custom-amount input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 2.5rem;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.3s ease;
        }

        .custom-amount input:focus {
          outline: none;
          border-color: #1a5f2a;
          box-shadow: 0 0 0 4px rgba(26, 95, 42, 0.08);
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .category-btn {
          padding: 1rem;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          background: white;
          color: #2d3436;
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          text-align: center;
        }

        .category-btn .icon {
          font-size: 1.5rem;
          transition: transform 0.3s ease;
        }

        .category-btn:hover {
          border-color: #1a5f2a;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }

        .category-btn:hover .icon {
          transform: scale(1.1);
        }

        .category-btn.active {
          border-color: #1a5f2a;
          background: #f8fff9;
          color: #1a5f2a;
          box-shadow: 0 4px 15px rgba(26, 95, 42, 0.1);
        }

        .category-btn.active .icon {
          color: #1a5f2a;
        }

        .category-desc {
          font-size: 0.7rem;
          color: #636e72;
          font-weight: 400;
        }

        .selected-summary {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .selected-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
        }

        .selected-info h4 {
          font-size: 1rem;
          color: #2d3436;
          margin-bottom: 0.25rem;
        }

        .selected-info p {
          font-size: 0.85rem;
          color: #636e72;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          font-size: 0.9rem;
          color: #2d3436;
          margin-bottom: 0.5rem;
        }

        .form-group textarea {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 0.95rem;
          font-family: inherit;
          resize: vertical;
          transition: all 0.3s ease;
        }

        .form-group textarea:focus {
          outline: none;
          border-color: #1a5f2a;
          box-shadow: 0 0 0 4px rgba(26, 95, 42, 0.08);
        }

        .checkbox-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 10px;
          margin-bottom: 1.5rem;
        }

        .checkbox-group input[type="checkbox"] {
          width: 20px;
          height: 20px;
          accent-color: #1a5f2a;
          cursor: pointer;
        }

        .checkbox-group label {
          font-size: 0.9rem;
          color: #2d3436;
          cursor: pointer;
          margin: 0;
        }

        .error-message {
          background: #fff5f5;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 0.875rem 1rem;
          border-radius: 10px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .modal-footer {
          padding: 1.5rem 2rem;
          border-top: 1px solid #e9ecef;
          display: flex;
          gap: 1rem;
        }

        .btn {
          flex: 1;
          padding: 1rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #1a5f2a 0%, #2d8a3e 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(26, 95, 42, 0.25);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(26, 95, 42, 0.35);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #f8f9fa;
          color: #2d3436;
          border: 2px solid #e9ecef;
        }

        .btn-secondary:hover {
          background: #e9ecef;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .secure-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          font-size: 0.8rem;
          color: #636e72;
        }

        @media (max-width: 480px) {
          .amount-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .category-grid {
            grid-template-columns: 1fr;
          }
          .modal-body {
            padding: 1.25rem;
          }
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Make a Donation</h2>
            <p>Choose an amount and category to give smart</p>
            <button className="close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <div className="modal-body">
            <div className="step-indicator">
              <div className={`step-dot ${step >= 1 ? 'active' : 'inactive'}`}>1</div>
              <div className={`step-line ${step >= 2 ? 'completed' : ''}`}></div>
              <div className={`step-dot ${step >= 2 ? 'active' : 'inactive'}`}>2</div>
            </div>

            {error && (
              <div className="error-message">
                <FaTimes /> {error}
              </div>
            )}

            {step === 1 && (
              <>
                <div className="section-title">
                  <FaHandHoldingHeart /> Select Amount
                </div>
                
                <div className="amount-grid">
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

                <div className="custom-amount">
                  <span className="currency">₦</span>
                  <input
                    type="number"
                    placeholder="Or enter custom amount"
                    value={customAmount}
                    onChange={handleCustomAmount}
                    min="100"
                  />
                </div>

                <div className="section-title">
                  <FaHeart /> Select Category
                </div>

                <div className="category-grid">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`category-btn ${category === cat.id ? 'active' : ''}`}
                      onClick={() => setCategory(cat.id)}
                    >
                      <span className="icon" style={{ color: cat.color }}>{cat.icon}</span>
                      <span>{cat.label}</span>
                      <span className="category-desc">{cat.desc}</span>
                    </button>
                  ))}
                </div>

                <button className="btn btn-primary" onClick={handleNext}>
                  Continue <FaCheckCircle />
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="selected-summary">
                  <div 
                    className="selected-icon" 
                    style={{ background: selectedCategory?.color || '#1a5f2a' }}
                  >
                    {selectedCategory?.icon}
                  </div>
                  <div className="selected-info">
                    <h4>{selectedCategory?.label}</h4>
                    <p>₦{parseFloat(amount).toLocaleString()}</p>
                  </div>
                </div>

                <div className="form-group">
                  <label>Message (Optional)</label>
                  <textarea
                    rows="3"
                    placeholder="Add a personal message with your donation..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  <label htmlFor="anonymous">Make this donation anonymous</label>
                </div>

                <div className="modal-footer" style={{ padding: 0, border: 'none' }}>
                  <button className="btn btn-secondary" onClick={handleBack}>
                    Back
                  </button>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="spinner" /> Processing...
                      </>
                    ) : (
                      <>
                        <FaLock /> Donate ₦{parseFloat(amount).toLocaleString()}
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {step === 1 && (
            <div className="secure-badge">
              <FaLock /> Secured by Paystack — Card, Bank Transfer, USSD
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DonateModal;