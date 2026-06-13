// src/pages/PaymentVerify.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSpinner, 
  FaReceipt, 
  FaHome,
  FaRedo,
  FaDownload
} from 'react-icons/fa';

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying | success | failed
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');

  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const API_URL = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      setError('No transaction reference found');
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(`${API_URL}/payments/verify/${reference}`);
        const data = await response.json();

        if (data.status && data.data?.status === 'success') {
          setStatus('success');
          setPaymentData(data.data);
        } else {
          setStatus('failed');
          setError(data.message || 'Payment verification failed');
        }
      } catch (err) {
        setStatus('failed');
        setError('Unable to verify payment. Please contact support.');
      }
    };

    verifyPayment();
  }, [reference, API_URL]);

  const formatAmount = (amount) => {
    if (!amount) return '₦0';
    return `₦${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-NG', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <>
      <style>{`
        .verify-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6rem 1.5rem 3rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .verify-card {
          background: white;
          border-radius: 24px;
          padding: 3rem 2.5rem;
          max-width: 480px;
          width: 100%;
          text-align: center;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.08);
          border: 1px solid #e9ecef;
        }

        .verify-icon {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 2.5rem;
        }

        .verify-icon.success {
          background: #d4edda;
          color: #1a5f2a;
        }

        .verify-icon.failed {
          background: #f8d7da;
          color: #dc2626;
        }

        .verify-icon.loading {
          background: #e9ecef;
          color: #636e72;
        }

        .verify-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #2d3436;
          margin-bottom: 0.5rem;
        }

        .verify-message {
          font-size: 1rem;
          color: #636e72;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .receipt-box {
          background: #f8f9fa;
          border-radius: 16px;
          padding: 1.5rem;
          margin: 1.5rem 0;
          text-align: left;
          border: 1px solid #e9ecef;
        }

        .receipt-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e9ecef;
        }

        .receipt-row:last-child {
          border-bottom: none;
        }

        .receipt-label {
          font-size: 0.9rem;
          color: #636e72;
          font-weight: 500;
        }

        .receipt-value {
          font-size: 0.95rem;
          color: #2d3436;
          font-weight: 600;
        }

        .receipt-value.amount {
          color: #1a5f2a;
          font-size: 1.1rem;
        }

        .receipt-value.ref {
          font-family: monospace;
          font-size: 0.85rem;
          background: #e9ecef;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
        }

        .verify-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .verify-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          font-family: inherit;
        }

        .verify-btn-primary {
          background: linear-gradient(135deg, #1a5f2a 0%, #2d8a3e 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(26, 95, 42, 0.25);
        }

        .verify-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(26, 95, 42, 0.35);
        }

        .verify-btn-secondary {
          background: white;
          color: #2d3436;
          border: 2px solid #e9ecef;
        }

        .verify-btn-secondary:hover {
          border-color: #1a5f2a;
          color: #1a5f2a;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .support-text {
          margin-top: 1.5rem;
          font-size: 0.85rem;
          color: #b2bec3;
        }

        .support-text a {
          color: #1a5f2a;
          font-weight: 600;
          text-decoration: none;
        }

        @media (max-width: 480px) {
          .verify-card {
            padding: 2rem 1.5rem;
          }
          
          .verify-title {
            font-size: 1.4rem;
          }
        }
      `}</style>

      <div className="verify-page">
        <div className="verify-card">
          {status === 'verifying' && (
            <>
              <div className="verify-icon loading">
                <FaSpinner className="spinner" />
              </div>
              <h1 className="verify-title">Verifying Payment...</h1>
              <p className="verify-message">
                Please wait while we confirm your transaction.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="verify-icon success">
                <FaCheckCircle />
              </div>
              <h1 className="verify-title">Thank You! ❤️</h1>
              <p className="verify-message">
                Your donation has been received successfully. You are making a real difference!
              </p>

              {paymentData && (
                <div className="receipt-box">
                  <div className="receipt-row">
                    <span className="receipt-label">Amount</span>
                    <span className="receipt-value amount">{formatAmount(paymentData.amount / 100)}</span>
                  </div>
                  <div className="receipt-row">
                    <span className="receipt-label">Reference</span>
                    <span className="receipt-value ref">{paymentData.reference}</span>
                  </div>
                  <div className="receipt-row">
                    <span className="receipt-label">Date</span>
                    <span className="receipt-value">{formatDate(paymentData.paid_at)}</span>
                  </div>
                  <div className="receipt-row">
                    <span className="receipt-label">Channel</span>
                    <span className="receipt-value">{paymentData.channel || 'Card'}</span>
                  </div>
                </div>
              )}

              <div className="verify-actions">
                {paymentData?.receipt_url && (
                  <a 
                    href={paymentData.receipt_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="verify-btn verify-btn-secondary"
                  >
                    <FaDownload /> Download Receipt
                  </a>
                )}
                <Link to="/" className="verify-btn verify-btn-primary">
                  <FaHome /> Back to Home
                </Link>
              </div>

              <p className="support-text">
                Questions? <Link to="/contact">Contact us</Link>
              </p>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="verify-icon failed">
                <FaTimesCircle />
              </div>
              <h1 className="verify-title">Payment Failed</h1>
              <p className="verify-message">
                {error || 'We could not verify your payment. Please try again or contact support.'}
              </p>

              <div className="verify-actions">
                <Link to="/donateGateway/guest" className="verify-btn verify-btn-primary">
                  <FaRedo /> Try Again
                </Link>
                <Link to="/" className="verify-btn verify-btn-secondary">
                  <FaHome /> Back to Home
                </Link>
              </div>

              <p className="support-text">
                Need help? <Link to="/contact">Contact support</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentVerify;