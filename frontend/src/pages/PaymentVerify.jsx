// src/pages/PaymentVerify.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSpinner, 
  FaHome,
  FaRedo,
  FaDownload,
  FaPrint
} from 'react-icons/fa';

const PaymentVerify = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');
  const receiptRef = useRef(null);

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

  const handlePrintReceipt = () => {
    const printContent = receiptRef.current.innerHTML;
    const printWindow = window.open('', '_blank', 'width=600,height=700');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Donation Receipt - ${paymentData?.reference || ''}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
              background: #f8f9fa; 
              padding: 40px 20px;
              color: #2d3436;
            }
            .receipt-container {
              max-width: 400px;
              margin: 0 auto;
              background: white;
              border-radius: 16px;
              padding: 40px 32px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }
            .receipt-header {
              text-align: center;
              border-bottom: 2px dashed #e9ecef;
              padding-bottom: 24px;
              margin-bottom: 24px;
            }
            .receipt-logo {
              width: 60px;
              height: 60px;
              background: linear-gradient(135deg, #1a5f2a 0%, #2d8a3e 100%);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 16px;
              color: white;
              font-size: 28px;
              font-weight: 700;
            }
            .receipt-title {
              font-size: 20px;
              font-weight: 700;
              color: #1a5f2a;
              margin-bottom: 4px;
            }
            .receipt-subtitle {
              font-size: 13px;
              color: #636e72;
            }
            .receipt-status {
              display: inline-block;
              background: #d4edda;
              color: #1a5f2a;
              padding: 6px 16px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-top: 12px;
            }
            .receipt-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 14px 0;
              border-bottom: 1px solid #f1f3f5;
            }
            .receipt-row:last-child {
              border-bottom: none;
            }
            .receipt-label {
              font-size: 13px;
              color: #636e72;
              font-weight: 500;
            }
            .receipt-value {
              font-size: 14px;
              color: #2d3436;
              font-weight: 600;
              text-align: right;
            }
            .receipt-value.amount {
              color: #1a5f2a;
              font-size: 18px;
              font-weight: 700;
            }
            .receipt-value.ref {
              font-family: 'SF Mono', Monaco, monospace;
              font-size: 12px;
              background: #f8f9fa;
              padding: 4px 10px;
              border-radius: 6px;
            }
            .receipt-footer {
              text-align: center;
              margin-top: 24px;
              padding-top: 24px;
              border-top: 2px dashed #e9ecef;
            }
            .receipt-footer p {
              font-size: 12px;
              color: #b2bec3;
              line-height: 1.6;
            }
            .receipt-footer .brand {
              color: #1a5f2a;
              font-weight: 700;
              font-size: 14px;
              margin-bottom: 4px;
            }
            @media print {
              body { background: white; padding: 0; }
              .receipt-container { box-shadow: none; max-width: 100%; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            ${printContent}
          </div>
          <div class="no-print" style="text-align:center;margin-top:30px;">
            <button onclick="window.print()" style="background:#1a5f2a;color:white;border:none;padding:12px 32px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;">
              Print / Save as PDF
            </button>
          </div>
          <script>
            window.onload = function() { document.title = 'Receipt - ${paymentData?.reference || ''}'; };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
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

              {/* Hidden receipt template for printing */}
              <div style={{ display: 'none' }}>
                <div ref={receiptRef}>
                  <div className="receipt-header">
                    <div className="receipt-logo">ACF</div>
                    <div className="receipt-title">Amanah and Ikhlas Initiative</div>
                    <div className="receipt-subtitle">Official Donation Receipt</div>
                    <div className="receipt-status">Payment Successful</div>
                  </div>
                  
                  <div className="receipt-row">
                    <span className="receipt-label">Amount</span>
                    <span className="receipt-value amount">{formatAmount(paymentData?.amount)}</span>
                  </div>
                  <div className="receipt-row">
                    <span className="receipt-label">Reference</span>
                    <span className="receipt-value ref">{paymentData?.reference}</span>
                  </div>
                  <div className="receipt-row">
                    <span className="receipt-label">Date</span>
                    <span className="receipt-value">{formatDate(paymentData?.paid_at)}</span>
                  </div>
                  <div className="receipt-row">
                    <span className="receipt-label">Channel</span>
                    <span className="receipt-value">{paymentData?.channel || 'Card'}</span>
                  </div>
                  <div className="receipt-row">
                    <span className="receipt-label">Transaction ID</span>
                    <span className="receipt-value ref">{paymentData?.id}</span>
                  </div>
                  
                  <div className="receipt-footer">
                    <div className="brand">Amanah and Ikhlas Initiative</div>
                    <p>Thank you for your generosity!</p>
                    <p>For questions, contact us at support@barakahgo.com</p>
                    <p style={{marginTop:'8px',fontSize:'11px',color:'#b2bec3'}}>This is an official receipt for your donation.</p>
                  </div>
                </div>
              </div>

              {/* Visible receipt preview */}
              {paymentData && (
                <div className="receipt-box">
                  <div className="receipt-row">
                    <span className="receipt-label">Amount</span>
                    <span className="receipt-value amount">{formatAmount(paymentData.amount)}</span>
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
                <button 
                  onClick={handlePrintReceipt}
                  className="verify-btn verify-btn-secondary"
                >
                  <FaPrint /> Download Receipt
                </button>
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