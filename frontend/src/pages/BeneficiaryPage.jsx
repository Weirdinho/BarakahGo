import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FaHandHoldingHeart, FaClipboardList, FaTicketAlt, 
  FaCheckCircle, FaClock, FaTimesCircle, FaPlus, FaCopy,
  FaPaperPlane, FaStore, FaCheck
} from 'react-icons/fa';
import api from '../services/api';

const categories = [
  { id: 'food', label: 'Food Aid' },
  { id: 'education', label: 'Education' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'general-fund', label: 'General Fund' }
];

const BeneficiaryPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [formData, setFormData] = useState({
    category: 'general-fund',
    amount: '',
    reason: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Redeem modal state
  const [redeemModal, setRedeemModal] = useState({ open: false, voucher: null, applicationId: null });
  const [redeemForm, setRedeemForm] = useState({ vendorEmail: '', amount: '' });
  const [redeeming, setRedeeming] = useState(false);
  const [redeemMessage, setRedeemMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const appsRes = await api.get('/donations/applications');
      setApplications(appsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/donations/apply', formData);
      setShowApplyForm(false);
      setFormData({ category: 'general-fund', amount: '', reason: '' });
      fetchData();
      alert('Application submitted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const copyVoucherCode = (code) => {
    navigator.clipboard.writeText(code);
    alert('Voucher code copied to clipboard!');
  };

  // Open redeem modal
  const openRedeemModal = (voucher, applicationId) => {
    setRedeemModal({ open: true, voucher, applicationId });
    setRedeemForm({ vendorEmail: '', amount: '' });
    setRedeemMessage('');
  };

  // Close redeem modal
  const closeRedeemModal = () => {
    setRedeemModal({ open: false, voucher: null, applicationId: null });
    setRedeemForm({ vendorEmail: '', amount: '' });
    setRedeemMessage('');
  };

  // Handle automatic redemption
  const handleAutoRedeem = async (e) => {
    e.preventDefault();
    if (!redeemForm.vendorEmail || !redeemForm.amount) {
      setRedeemMessage('Please enter vendor email and amount');
      return;
    }

    const amount = parseFloat(redeemForm.amount);
    if (isNaN(amount) || amount <= 0) {
      setRedeemMessage('Please enter a valid amount');
      return;
    }

    const remaining = redeemModal.voucher.amount - (redeemModal.voucher.redeemedAmount || 0);
    if (amount > remaining) {
      setRedeemMessage(`Amount exceeds remaining balance of ₦${remaining.toLocaleString()}`);
      return;
    }

    setRedeeming(true);
    setRedeemMessage('');

    try {
      const response = await api.post('/vouchers/auto-redeem', {
        voucherCode: redeemModal.voucher.code,
        vendorEmail: redeemForm.vendorEmail,
        amount: amount
      });

      setRedeemMessage(response.data.message);
      setRedeemForm({ vendorEmail: '', amount: '' });
      fetchData(); // Refresh data to show updated voucher status

      // Close modal after 2 seconds on success
      setTimeout(() => {
        closeRedeemModal();
      }, 2000);
    } catch (err) {
      setRedeemMessage(err.response?.data?.message || 'Failed to redeem voucher');
    } finally {
      setRedeeming(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <FaCheckCircle style={{ color: '#2d8a3e' }} />;
      case 'pending': return <FaClock style={{ color: '#f4a261' }} />;
      case 'rejected': return <FaTimesCircle style={{ color: '#e76f51' }} />;
      case 'fulfilled': return <FaCheckCircle style={{ color: '#1a5f2a' }} />;
      default: return null;
    }
  };

  // Count stats
  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const approvedCount = applications.filter(a => a.status === 'approved' || a.status === 'fulfilled').length;
  const voucherCount = applications.filter(a => a.voucher).length;

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading"><div className="spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <style>{`
        .redeem-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .redeem-modal {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          animation: slideUp 0.3s ease-out;
        }
        .redeem-modal h3 {
          margin-bottom: 0.5rem;
          color: #1e293b;
          font-size: 1.2rem;
        }
        .redeem-modal p {
          color: #636e72;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }
        .redeem-form-group {
          margin-bottom: 1rem;
        }
        .redeem-form-group label {
          display: block;
          margin-bottom: 0.4rem;
          font-size: 0.85rem;
          font-weight: 600;
          color: #2d3436;
        }
        .redeem-form-group input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #dfe6e9;
          border-radius: 10px;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .redeem-form-group input:focus {
          border-color: #1a5f2a;
        }
        .redeem-balance {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.85rem;
          color: #166534;
        }
        .redeem-message {
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .redeem-message.success {
          background: #dcfce7;
          color: #166534;
        }
        .redeem-message.error {
          background: #fee2e2;
          color: #991b1b;
        }
        .redeem-actions {
          display: flex;
          gap: 0.75rem;
        }
        .redeem-actions button {
          flex: 1;
          padding: 0.75rem;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-redeem-submit {
          background: #1a5f2a;
          color: white;
          border: none;
        }
        .btn-redeem-submit:hover {
          background: #2d8a3e;
        }
        .btn-redeem-cancel {
          background: #f1f5f9;
          color: #64748b;
          border: none;
        }
        .btn-redeem-cancel:hover {
          background: #e2e8f0;
        }
        .btn-send-vendor {
          background: linear-gradient(135deg, #1a5f2a, #2d8a3e);
          color: white;
          border: none;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.75rem;
          transition: all 0.2s ease;
        }
        .btn-send-vendor:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(26, 95, 42, 0.3);
        }
        .btn-send-vendor:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="dashboard-inner">
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user?.name?.split(' ')[0]}</h1>
            <p style={{ color: '#636e72' }}>Your aid portal</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowApplyForm(!showApplyForm)}
          >
            <FaPlus /> Apply for Aid
          </button>
        </div>

        {/* Apply Form */}
        {showApplyForm && (
          <div className="dashboard-card" style={{ marginBottom: '2rem' }}>
            <h3>Apply for Aid</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Amount Needed (₦)</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                    min="100"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Reason / Description</label>
                <textarea
                  rows="3"
                  placeholder="Explain why you need this aid..."
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowApplyForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Applications</h4>
            <div className="value">{applications.length}</div>
          </div>
          <div className="stat-card">
            <h4>Pending</h4>
            <div className="value">{pendingCount}</div>
          </div>
          <div className="stat-card">
            <h4>Approved</h4>
            <div className="value">{approvedCount}</div>
          </div>
          <div className="stat-card">
            <h4>My Vouchers</h4>
            <div className="value">{voucherCount}</div>
          </div>
        </div>

        {/* My Applications */}
        <div className="dashboard-card" style={{ marginTop: '2rem' }}>
          <h3><FaClipboardList /> My Applications</h3>
          {applications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#636e72' }}>
              <FaHandHoldingHeart style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }} />
              <p>No applications yet. Click "Apply for Aid" to get started.</p>
            </div>
          ) : (
            applications.map(app => (
              <div key={app._id} style={{
                padding: '1.25rem',
                borderBottom: '1px solid #dfe6e9',
                background: app.status === 'approved' ? '#f0fdf4' : 'transparent'
              }}>
                {/* Application Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>
                      {categories.find(c => c.id === app.category)?.label || app.category}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#636e72' }}>₦{app.amount.toLocaleString()}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getStatusIcon(app.status)}
                    <span style={{ 
                      fontSize: '0.8rem', 
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      color: app.status === 'approved' ? '#2d8a3e' : app.status === 'rejected' ? '#e76f51' : '#f4a261'
                    }}>
                      {app.status}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#636e72', marginBottom: '0.75rem' }}>
                  {app.reason}
                </p>

                {/* Voucher Section - Only shown when approved */}
                {app.voucher && (
                  <div style={{
                    background: '#1a5f2a',
                    borderRadius: '10px',
                    padding: '1rem',
                    color: 'white',
                    marginTop: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', opacity: 0.9 }}><FaTicketAlt /> Your Voucher</span>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.25rem 0.5rem',
                        background: app.voucher.status === 'active' ? '#22c55e' : app.voucher.status === 'redeemed' ? '#6b7280' : '#f4a261',
                        borderRadius: '4px'
                      }}>
                        {app.voucher.status}
                      </span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.15)',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      marginBottom: '0.5rem'
                    }}>
                      <code style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '2px' }}>
                        {app.voucher.code}
                      </code>
                      <button 
                        onClick={() => copyVoucherCode(app.voucher.code)}
                        style={{
                          background: 'rgba(255,255,255,0.2)',
                          border: 'none',
                          color: 'white',
                          padding: '0.4rem 0.75rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <FaCopy /> Copy
                      </button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span>Amount: ₦{app.voucher.amount.toLocaleString()}</span>
                      {app.voucher.redeemedAmount > 0 && (
                        <span>Used: ₦{app.voucher.redeemedAmount.toLocaleString()}</span>
                      )}
                    </div>
                    
                    {/* Send to Vendor Button */}
                    {app.voucher.status === 'active' && (
                      <button 
                        className="btn-send-vendor"
                        onClick={() => openRedeemModal(app.voucher, app._id)}
                      >
                        <FaPaperPlane /> Send to Vendor for Redemption
                      </button>
                    )}

                    {app.voucher.status === 'redeemed' && (
                      <div style={{ 
                        marginTop: '0.75rem', 
                        padding: '0.5rem', 
                        background: 'rgba(255,255,255,0.15)', 
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}>
                        <FaCheckCircle /> Fully redeemed on {new Date(app.voucher.redeemedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}

                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                  Applied on {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Redeem Modal */}
      {redeemModal.open && (
        <div className="redeem-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) closeRedeemModal();
        }}>
          <div className="redeem-modal">
            <h3><FaStore /> Send to Vendor</h3>
            <p>Enter the vendor's email and the amount to redeem from your voucher.</p>
            
            <div className="redeem-balance">
              <strong>Voucher:</strong> {redeemModal.voucher.code}<br />
              <strong>Balance:</strong> ₦{(redeemModal.voucher.amount - (redeemModal.voucher.redeemedAmount || 0)).toLocaleString()} remaining
            </div>

            {redeemMessage && (
              <div className={`redeem-message ${redeemMessage.includes('success') ? 'success' : 'error'}`}>
                {redeemMessage}
              </div>
            )}

            <form onSubmit={handleAutoRedeem}>
              <div className="redeem-form-group">
                <label>Vendor Email</label>
                <input
                  type="email"
                  placeholder="vendor@example.com"
                  value={redeemForm.vendorEmail}
                  onChange={(e) => setRedeemForm({...redeemForm, vendorEmail: e.target.value})}
                  required
                />
              </div>
              <div className="redeem-form-group">
                <label>Amount to Redeem (₦)</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={redeemForm.amount}
                  onChange={(e) => setRedeemForm({...redeemForm, amount: e.target.value})}
                  min="1"
                  max={redeemModal.voucher.amount - (redeemModal.voucher.redeemedAmount || 0)}
                  required
                />
              </div>
              <div className="redeem-actions">
                <button 
                  type="submit" 
                  className="btn-redeem-submit"
                  disabled={redeeming}
                >
                  {redeeming ? 'Processing...' : <><FaPaperPlane /> Send & Redeem</>}
                </button>
                <button 
                  type="button" 
                  className="btn-redeem-cancel"
                  onClick={closeRedeemModal}
                  disabled={redeeming}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeneficiaryPage;