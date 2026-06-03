// src/pages/GuestDonate.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaLock, 
  FaEnvelope, 
  FaUser, 
  FaCoins, 
  FaCreditCard,
  FaSpinner,
  FaCheckCircle,
  FaArrowLeft
} from 'react-icons/fa';

const GuestDonate = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const API_URL = process.env.REACT_APP_API_URL || '';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (parseFloat(formData.amount) < 1) {
      newErrors.amount = 'Minimum donation is ₦1';
    }
    return newErrors;
  };

  const handlePresetAmount = (amt) => {
    setFormData({ ...formData, amount: amt });
    if (errors.amount) setErrors({ ...errors, amount: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/payments/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          amount: parseFloat(formData.amount) * 100,
          metadata: {
            custom_fields: [
              {
                display_name: "Donor Name",
                variable_name: "donor_name",
                value: formData.name
              },
              {
                display_name: "Phone Number",
                variable_name: "phone",
                value: formData.phone || 'N/A'
              },
              {
                display_name: "Donation Type",
                variable_name: "donation_type",
                value: "Guest Donation"
              }
            ]
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment initialization failed');
      }

      if (data.status && data.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
      } else {
        throw new Error('Invalid response from payment gateway');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setErrors({ submit: error.message || 'Unable to initialize payment. Please try again.' });
      setLoading(false);
    }
  };

  const presets = ['1000', '5000', '10000', '25000', '50000', '100000'];

  return (
    <>
      <style>{`
        .guest-donate-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6rem 1.5rem 3rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .guest-donate-card {
          background: white;
          border-radius: 24px;
          padding: 2.5rem;
          max-width: 520px;
          width: 100%;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.08);
          border: 1px solid #e9ecef;
          position: relative;
        }

        .back-nav {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
        }

        .back-nav a {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #636e72;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .back-nav a:hover {
          color: #1a5f2a;
        }

        .guest-donate-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-top: 1rem;
        }

        .guest-donate-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #1a5f2a 0%, #2d8a3e 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
          color: white;
          font-size: 1.8rem;
          box-shadow: 0 8px 25px rgba(26, 95, 42, 0.3);
        }

        .guest-donate-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #2d3436;
          margin-bottom: 0.5rem;
        }

        .guest-donate-subtitle {
          font-size: 0.95rem;
          color: #636e72;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .guest-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #2d3436;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .form-input {
          padding: 0.95rem 1.1rem;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          font-family: inherit;
          background: #fafbfc;
        }

        .form-input:focus {
          outline: none;
          border-color: #1a5f2a;
          background: white;
          box-shadow: 0 0 0 4px rgba(26, 95, 42, 0.08);
        }

        .form-input.error {
          border-color: #e76f51;
          background: #fff5f5;
        }

        .form-input::placeholder {
          color: #b2bec3;
        }

        .error-message {
          font-size: 0.85rem;
          color: #e76f51;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-weight: 500;
        }

        .amount-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .amount-presets {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }

        .preset-btn {
          padding: 0.85rem 0.5rem;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          background: white;
          color: #2d3436;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .preset-btn:hover {
          border-color: #1a5f2a;
          color: #1a5f2a;
          background: #f8fff9;
        }

        .preset-btn.active {
          background: #1a5f2a;
          border-color: #1a5f2a;
          color: white;
          box-shadow: 0 4px 15px rgba(26, 95, 42, 0.2);
        }

        .paystack-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 1rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%);
          border-radius: 12px;
          font-size: 0.9rem;
          color: #636e72;
          border: 1px solid #e9ecef;
        }

        .paystack-badge strong {
          color: #1a5f2a;
        }

        .submit-btn {
          background: linear-gradient(135deg, #1a5f2a 0%, #2d8a3e 100%);
          color: white;
          border: none;
          padding: 1.1rem;
          border-radius: 14px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          margin-top: 0.5rem;
          box-shadow: 0 8px 25px rgba(26, 95, 42, 0.25);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(26, 95, 42, 0.35);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .submit-error {
          background: #fff5f5;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 1rem;
          border-radius: 12px;
          font-size: 0.9rem;
          text-align: center;
          font-weight: 500;
        }

        .guest-footer {
          text-align: center;
          margin-top: 1.75rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e9ecef;
          font-size: 0.9rem;
          color: #636e72;
        }

        .guest-footer a {
          color: #1a5f2a;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .guest-footer a:hover {
          text-decoration: underline;
        }

        .optional-tag {
          font-weight: 400;
          color: #b2bec3;
          font-size: 0.8rem;
        }

        @media (max-width: 480px) {
          .guest-donate-card {
            padding: 1.75rem;
            border-radius: 20px;
          }
          
          .guest-donate-title {
            font-size: 1.5rem;
          }
          
          .amount-presets {
            gap: 0.5rem;
          }
          
          .preset-btn {
            padding: 0.7rem 0.3rem;
            font-size: 0.8rem;
          }
        }
      `}</style>

      <div className="guest-donate-page">
        <div className="guest-donate-card">
          <div className="back-nav">
            <Link to="/donate">
              <FaArrowLeft /> Back
            </Link>
          </div>

          <div className="guest-donate-header">
            <div className="guest-donate-icon">
              <FaCoins />
            </div>
            <h1 className="guest-donate-title">Guest Donation</h1>
            <p className="guest-donate-subtitle">
              <FaLock /> Secure & Anonymous — No account needed
            </p>
          </div>

          <form className="guest-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label">
                <FaUser /> Full Name
              </label>
              <input
                type="text"
                name="name"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaEnvelope /> Email Address
              </label>
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group amount-section">
              <label className="form-label">
                <FaCoins /> Donation Amount (₦)
              </label>
              <div className="amount-presets">
                {presets.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    className={`preset-btn ${formData.amount === amt ? 'active' : ''}`}
                    onClick={() => handlePresetAmount(amt)}
                    disabled={loading}
                  >
                    ₦{parseInt(amt).toLocaleString()}
                  </button>
                ))}
              </div>
              <input
                type="number"
                name="amount"
                className={`form-input ${errors.amount ? 'error' : ''}`}
                placeholder="Or enter custom amount (₦)"
                value={formData.amount}
                onChange={handleChange}
                min="1"
                disabled={loading}
              />
              {errors.amount && <span className="error-message">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Phone Number <span className="optional-tag">(Optional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                placeholder="08012345678"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="paystack-badge">
              <FaCreditCard /> Secured by <strong>Paystack</strong> — Card, Bank, USSD
            </div>

            {errors.submit && (
              <div className="submit-error">
                <FaCheckCircle style={{ marginRight: '0.5rem' }} />
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="spin" /> Processing...
                </>
              ) : (
                <>
                  <FaCoins /> Donate {formData.amount ? `₦${parseInt(formData.amount).toLocaleString()}` : 'Now'}
                </>
              )}
            </button>
          </form>

          <div className="guest-footer">
            Want to track your donations?{' '}
            <Link to="/login">Log in</Link> or <Link to="/register">Create account</Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </>
  );
};

export default GuestDonate;