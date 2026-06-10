import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FaHandHoldingHeart, FaClipboardList, FaTicketAlt, 
  FaCheckCircle, FaClock, FaTimesCircle, FaPlus, FaCopy
} from 'react-icons/fa';
import api from '../services/api';

const categories = [
  { id: 'zakat', label: 'Zakat' },
  { id: 'sadaqah', label: 'Sadaqah' },
  { id: 'sadaqah-jariyah', label: 'Sadaqah Jariyah' },
  { id: 'waqf', label: 'Waqf Support' },
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
                        background: app.voucher.status === 'active' ? '#22c55e' : '#6b7280',
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
                    {app.voucher.status === 'active' && (
                      <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.8 }}>
                        Present this code to any authorized vendor to redeem your aid.
                      </p>
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
    </div>
  );
};

export default BeneficiaryPage;