import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaUser, FaPhone, FaBuilding, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// ============================================
// FormField Component - DEFINED OUTSIDE Login
// ============================================
const FormField = ({ label, name, type = 'text', placeholder, icon: Icon, required = false, value, onChange, error, children, ...props }) => {
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
      <label style={{ 
        display: 'block', 
        marginBottom: '0.5rem', 
        fontWeight: '500', 
        color: '#2d3436',
        fontSize: '0.9rem'
      }}>
        {label}
        {required && <span style={{ color: '#e74c3c', marginLeft: '4px' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon style={{ 
            position: 'absolute', 
            left: '1rem', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: hasError ? '#e74c3c' : isFocused ? '#1a5f2a' : '#636e72',
            fontSize: '1rem',
            transition: 'color 0.2s ease',
            zIndex: 1
          }} />
        )}
        {children || (
          <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={inputStyles}
            {...props}
          />
        )}
      </div>
      {hasError && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '6px',
          color: '#e74c3c',
          fontSize: '0.82rem',
          fontWeight: '500'
        }}>
          <FaExclamationCircle size={12} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

// ============================================
// Main Login Component
// ============================================
const Login = () => {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

  const validateForm = () => {
    const errors = {};

    if (!isLogin) {
      // Name validation
      if (!formData.name.trim()) {
        errors.name = 'Full name is required';
      } else if (formData.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters';
      }

      // Phone validation (optional but must be valid if provided)
      if (formData.phone && !/^\+?[\d\s-]{8,}$/.test(formData.phone)) {
        errors.phone = 'Please enter a valid phone number';
      }

      // Company name validation for corporate users
      if (formData.role === 'corporate' && !formData.companyName.trim()) {
        errors.companyName = 'Company name is required for corporate accounts';
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    // Email validation (applies to both login and signup)
    if (!formData.email) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation (applies to both login and signup)
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (!isLogin && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear field-specific error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear general error when user makes any change
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      let userData;
      if (isLogin) {
        userData = await login(formData.email, formData.password);
      } else {
        // Remove confirmPassword before sending to API
        const { confirmPassword, ...registrationData } = formData;
        userData = await register(registrationData);
      }

      console.log('Login successful, user role:', userData.role);
      navigate('/portal');
    } catch (err) {
      console.error('Auth error:', err);

      // Handle different types of errors
      let errorMessage;
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      } else {
        errorMessage = 'An unexpected error occurred. Please try again.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(prev => !prev);
    setError('');
    setFieldErrors({});
    // Reset form data when switching modes
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      role: 'donor',
      companyName: ''
    });

    // Scroll to top of the card smoothly
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="login-page" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a5f2a 0%, #0d3d18 100%)',
      padding: '2rem 1rem'
    }}>
      <div 
        ref={cardRef}
        className="login-card" 
        style={{
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '480px',
          animation: 'slideUp 0.5s ease-out'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: '700', 
            color: '#2d3436',
            marginBottom: '0.5rem'
          }}>
            {isLogin ? 'Welcome Back' : 'Get Started'}
          </h2>
          <p style={{ 
            color: '#636e72', 
            fontSize: '0.95rem',
            lineHeight: '1.5'
          }}>
            {isLogin 
              ? 'Sign in to your account to continue' 
              : 'Create your Amanah Charity Foundation account'}
          </p>
        </div>

        {/* General Error Alert */}
        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'shake 0.5s ease-in-out'
          }}>
            <FaExclamationCircle size={18} style={{ flexShrink: 0 }} />
            <span style={{ fontWeight: '500' }}>{error}</span>
          </div>
        )}

        {/* Info banner for signup */}
        {!isLogin && (
          <div style={{
            background: '#e8f5e9',
            border: '1px solid #c8e6c9',
            color: '#1a5f2a',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaCheckCircle size={16} />
            <span>All fields marked with <span style={{ color: '#e74c3c' }}>*</span> are required</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Signup Fields */}
          {!isLogin && (
            <>
              <FormField 
                label="Full Name" 
                name="name" 
                placeholder="John Doe" 
                icon={FaUser}
                required={!isLogin}
                value={formData.name}
                onChange={handleChange}
                error={fieldErrors.name}
              />

              <FormField 
                label="Phone Number" 
                name="phone" 
                type="tel"
                placeholder="+234 800 000 0000" 
                icon={FaPhone}
                value={formData.phone}
                onChange={handleChange}
                error={fieldErrors.phone}
              />

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500', 
                  color: '#2d3436',
                  fontSize: '0.9rem'
                }}>
                  I am a<span style={{ color: '#e74c3c', marginLeft: '4px' }}>*</span>
                </label>
                <select 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange}
                  style={{ 
                    width: '100%',
                    padding: '0.85rem 1rem',
                    border: '2px solid #dfe6e9',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                  onBlur={(e) => e.target.style.borderColor = '#dfe6e9'}
                >
                  <option value="donor">Individual Donor</option>
                  <option value="corporate">Corporate Organization</option>
                  <option value="beneficiary">Beneficiary</option>
                  <option value="vendor">Vendor</option>
                </select>
              </div>

              {formData.role === 'corporate' && (
                <FormField 
                  label="Company Name" 
                  name="companyName" 
                  placeholder="Company Ltd" 
                  icon={FaBuilding}
                  required={formData.role === 'corporate'}
                  value={formData.companyName}
                  onChange={handleChange}
                  error={fieldErrors.companyName}
                />
              )}
            </>
          )}

          {/* Common Fields */}
          <FormField 
            label="Email Address" 
            name="email" 
            type="email"
            placeholder="you@example.com" 
            icon={FaEnvelope}
            required
            value={formData.email}
            onChange={handleChange}
            error={fieldErrors.email}
          />

          <FormField 
            label="Password" 
            name="password" 
            type="password"
            placeholder={isLogin ? "Enter your password" : "Min 6 characters"} 
            icon={FaLock}
            required
            minLength={!isLogin ? "6" : undefined}
            value={formData.password}
            onChange={handleChange}
            error={fieldErrors.password}
          />

          {/* Confirm Password - Only for Signup */}
          {!isLogin && (
            <FormField 
              label="Confirm Password" 
              name="confirmPassword" 
              type="password"
              placeholder="Re-enter your password" 
              icon={FaLock}
              required={!isLogin}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={fieldErrors.confirmPassword}
            />
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%',
              padding: '1rem',
              background: loading ? '#4CAF50' : '#1a5f2a',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: loading ? 'none' : '0 4px 15px rgba(26, 95, 42, 0.4)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.background = '#2d8a3e';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(26, 95, 42, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.background = '#1a5f2a';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(26, 95, 42, 0.4)';
              }
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: '18px',
                  height: '18px',
                  border: '2px solid #fff',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  display: 'inline-block'
                }} />
                <span>Please wait...</span>
              </>
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              </>
            )}
          </button>
        </form>

        {/* Switch Mode */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #dfe6e9'
        }}>
          <p style={{ color: '#636e72', fontSize: '0.9rem' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={switchMode}
              style={{
                background: 'none',
                border: 'none',
                color: '#1a5f2a',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.9rem',
                padding: '0',
                textDecoration: 'underline',
                textUnderlineOffset: '3px'
              }}
              onMouseEnter={(e) => e.target.style.color = '#2d8a3e'}
              onMouseLeave={(e) => e.target.style.color = '#1a5f2a'}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;