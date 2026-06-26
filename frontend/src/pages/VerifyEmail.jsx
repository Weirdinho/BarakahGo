import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';

// ============================================
// VerifyEmail Page
// Handles links like /verify-email?token=...&email=...
// that arrive from the verification email.
// ============================================
const VerifyEmail = () => {
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ranOnce = useRef(false); // guards against double-fire in React 18 StrictMode

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error' | 'already'
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      setStatus('error');
      setMessage('This verification link is missing required information.');
      return;
    }

    (async () => {
      try {
        const result = await verifyEmail(token, email);
        if (result.alreadyVerified) {
          setStatus('already');
        } else {
          setStatus('success');
        }
        setMessage(result.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || err.message || 'Something went wrong verifying your email.');
      }
    })();
  }, [searchParams, verifyEmail]);

  useEffect(() => {
    // Once verified (or already verified), send them on to the portal/login shortly after.
    if (status === 'success') {
      const t = setTimeout(() => navigate('/portal'), 2000);
      return () => clearTimeout(t);
    }
  }, [status, navigate]);

  const iconFor = {
    verifying: <FaSpinner size={28} color="#fff" style={{ animation: 'spin 1s linear infinite' }} />,
    success: <FaCheckCircle size={28} color="#fff" />,
    already: <FaCheckCircle size={28} color="#fff" />,
    error: <FaExclamationCircle size={28} color="#fff" />
  };

  const bgFor = {
    verifying: 'linear-gradient(135deg, #1a5f2a, #2d8a3e)',
    success: 'linear-gradient(135deg, #1a5f2a, #2d8a3e)',
    already: 'linear-gradient(135deg, #1a5f2a, #2d8a3e)',
    error: 'linear-gradient(135deg, #e74c3c, #c0392b)'
  };

  const titleFor = {
    verifying: 'Verifying Your Email...',
    success: 'Email Verified!',
    already: 'Already Verified',
    error: 'Verification Failed'
  };

  return (
    <div className="login-page" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a5f2a 0%, #0d3d18 100%)', padding: '2rem 1rem'
    }}>
      <div className="login-card" style={{
        background: '#fff', borderRadius: '20px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '2.5rem', width: '100%', maxWidth: '480px', animation: 'slideUp 0.5s ease-out',
        textAlign: 'center'
      }}>
        <div style={{
          width: '60px', height: '60px', background: bgFor[status],
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem'
        }}>
          {iconFor[status]}
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#2d3436', marginBottom: '0.75rem' }}>
          {titleFor[status]}
        </h2>

        <p style={{ color: '#636e72', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
          {message || (status === 'verifying' ? 'Hang on a moment while we confirm your account.' : '')}
        </p>

        {status === 'success' && (
          <p style={{ color: '#1a5f2a', fontSize: '0.85rem', fontWeight: '500' }}>
            Redirecting you to your account...
          </p>
        )}

        {(status === 'already') && (
          <Link to="/login" style={{
            display: 'inline-block', background: '#1a5f2a', color: '#fff', padding: '0.85rem 2rem',
            borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem'
          }}>
            Go to Sign In
          </Link>
        )}

        {status === 'error' && (
          <Link to="/login" style={{
            display: 'inline-block', background: '#1a5f2a', color: '#fff', padding: '0.85rem 2rem',
            borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem'
          }}>
            Back to Sign In
          </Link>
        )}
      </div>

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default VerifyEmail;