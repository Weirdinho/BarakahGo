import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaLock, FaExclamationCircle, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import api from '../services/api';

const FormField = ({ label, name, type = 'text', placeholder, icon: Icon, required = false, value, onChange, error, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = !!error;

  const inputStyles = {
    width: '100%',
    padding: Icon ? '0.85rem 1rem 0.85rem 2.8rem' : '0.85rem 1rem',
    border: `2px solid ${hasError ? '#e74c3c' : isFocused ? '#4CAF50' : '#dfe6e9'}`,
    borderRadius: '10px',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: hasError ? '#fdf2f2' : '#fff',
    boxSizing: 'border-box'
  };

  return (
    <div className="form-group" style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#2d3436', fontSize: '0.9rem' }}>
        {label}
        {required && <span style={{ color: '#e74c3c', marginLeft: '4px' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: hasError ? '#e74c3c' : isFocused ? '#1a5f2a' : '#636e72', fontSize: '1rem', transition: 'color 0.2s ease', zIndex: 1 }} />
        )}
        <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} style={inputStyles} {...props} />
      </div>
      {hasError && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: '#e74c3c', fontSize: '0.82rem', fontWeight: '500' }}>
          <FaExclamationCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });

  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !email) {
        setError('Invalid reset link. Please request a new one.');
        setVerifying(false);
        return;
      }
      try {
        await api.post('/auth/verify-reset-token', { token, email });
        setVerifying(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Invalid or expired reset link.');
        setVerifying(false);
      }
    };
    verifyToken();
  }, [token, email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: '' }));
    if (error) setError('');
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/reset-password', { token, email, password: formData.password });
      setSuccess(response.data.message);
      setFieldErrors({});
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a5f2a 0%, #0d3d18 100%)' }}>
        <div style={{ background: '#fff', borderRadius: '20px', padding: '2.5rem', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #1a5f2a', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: '#636e72', fontWeight: '500' }}>Verifying your reset link...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a5f2a 0%, #0d3d18 100%)', padding: '2rem 1rem' }}>
      <div style={{ background: '#fff', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', padding: '2.5rem', width: '100%', maxWidth: '480px', animation: 'slideUp 0.5s ease-out' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#2d3436', marginBottom: '0.5rem' }}>
            {success ? 'Success!' : 'Set New Password'}
          </h2>
          <p style={{ color: '#636e72', fontSize: '0.95rem', lineHeight: '1.5' }}>
            {success ? 'Your password has been reset successfully.' : 'Create a new password for your account'}
          </p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626', padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px', animation: 'shake 0.5s ease-in-out' }}>
            <FaExclamationCircle size={18} style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: '500' }}>{error}</span>
          </div>
        )}

        {success && (
          <div style={{ background: '#e8f5e9', border: '1px solid #c8e6c9', color: '#1a5f2a', padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaCheckCircle size={18} style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: '500' }}>{success}</span>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} noValidate>
            <FormField label="New Password" name="password" type="password" placeholder="Min 6 characters" icon={FaLock} required minLength="6" value={formData.password} onChange={handleChange} error={fieldErrors.password} />
            <FormField label="Confirm New Password" name="confirmPassword" type="password" placeholder="Re-enter your new password" icon={FaLock} required value={formData.confirmPassword} onChange={handleChange} error={fieldErrors.confirmPassword} />
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '1rem', background: loading ? '#4CAF50' : '#1a5f2a', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: loading ? 'none' : '0 4px 15px rgba(26, 95, 42, 0.4)' }} onMouseEnter={(e) => { if (!loading) { e.target.style.background = '#2d8a3e'; e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(26, 95, 42, 0.5)'; } }} onMouseLeave={(e) => { if (!loading) { e.target.style.background = '#1a5f2a'; e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(26, 95, 42, 0.4)'; } }}>
              {loading ? (
                <>
                  <span style={{ width: '18px', height: '18px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  <span>Please wait...</span>
                </>
              ) : (
                <span>Reset Password</span>
              )}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #dfe6e9' }}>
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#1a5f2a', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem', padding: '0', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'underline', textUnderlineOffset: '3px' }} onMouseEnter={(e) => e.target.style.color = '#2d8a3e'} onMouseLeave={(e) => e.target.style.color = '#1a5f2a'}>
            <FaArrowLeft size={14} />
            Back to Sign In
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); } 20%, 40%, 60%, 80% { transform: translateX(4px); } }
      `}</style>
    </div>
  );
};

export default ResetPassword;