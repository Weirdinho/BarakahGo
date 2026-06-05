import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FaHandHoldingHeart, FaClipboardList, FaTicketAlt, 
  FaCheckCircle, FaClock, FaTimesCircle, FaPlus 
} from 'react-icons/fa';
import VoucherCard from '../components/VoucherCard';
import api from '../services/api';

const categories = [
  { id: 'zakat', label: 'Zakat' },
  { id: 'sadaqah', label: 'Sadaqah' },
  { id: 'waqf', label: 'Waqf Support' },
  { id: 'food-aid', label: 'Food Aid' },
  { id: 'education', label: 'Education' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'general-fund', label: 'General Fund' }
];

const BeneficiaryPage = () => {
  const { user } = useAuth();
  const [vouchers, setVouchers] = useState([]);
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
      const [vouchersRes, appsRes] = await Promise.all([
        api.get('/vouchers'),
        api.get('/donations/applications')
      ]);
      setVouchers(vouchersRes.data);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <FaCheckCircle style={{ color: '#2d8a3e' }} />;
      case 'pending': return <FaClock style={{ color: '#f4a261' }} />;
      case 'rejected': return <FaTimesCircle style={{ color: '#e76f51' }} />;
      case 'fulfilled': return <FaCheckCircle style={{ color: '#1a5f2a' }} />;
      default: return null;
    }
  };

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
            <h4>My Vouchers</h4>
            <div className="value">{vouchers.length}</div>
          </div>
          <div className="stat-card">
            <h4>Applications</h4>
            <div className="value">{applications.length}</div>
          </div>
          <div className="stat-card">
            <h4>Pending</h4>
            <div className="value">{applications.filter(a => a.status === 'pending').length}</div>
          </div>
          <div className="stat-card">
            <h4>Approved</h4>
            <div className="value">{applications.filter(a => a.status === 'approved' || a.status === 'fulfilled').length}</div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* My Vouchers */}
          <div className="dashboard-card">
            <h3><FaTicketAlt /> My Vouchers</h3>
            {vouchers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#636e72' }}>
                <FaHandHoldingHeart style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }} />
                <p>No vouchers yet. Apply for aid to receive vouchers.</p>
              </div>
            ) : (
              vouchers.map(voucher => (
                <VoucherCard key={voucher._id} voucher={voucher} />
              ))
            )}
          </div>

          {/* My Applications */}
          <div className="dashboard-card">
            <h3><FaClipboardList /> My Applications</h3>
            {applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#636e72' }}>
                <p>No applications yet. Click "Apply for Aid" to get started.</p>
              </div>
            ) : (
              applications.map(app => (
                <div key={app._id} style={{
                  padding: '1rem',
                  borderBottom: '1px solid #dfe6e9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem' }}>{categories.find(c => c.id === app.category)?.label || app.category}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#636e72' }}>₦{app.amount.toLocaleString()}</p>
                    <p style={{ fontSize: '0.75rem', color: '#636e72' }}>{app.reason.substring(0, 40)}...</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getStatusIcon(app.status)}
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      color: app.status === 'approved' ? '#2d8a3e' : app.status === 'rejected' ? '#e76f51' : '#f4a261'
                    }}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryPage;