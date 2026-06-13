import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FaQrcode, FaCheckCircle, FaHistory, FaStore,
  FaDollarSign, FaUsers, FaUser, FaCalendarAlt
} from 'react-icons/fa';
import api from '../services/api';

const VendorPage = () => {
  const { user } = useAuth();
  const [voucherCode, setVoucherCode] = useState('');
  const [redemptionAmount, setRedemptionAmount] = useState('');
  const [voucherDetails, setVoucherDetails] = useState(null);
  const [redemptions, setRedemptions] = useState([]);
  const [stats, setStats] = useState({ totalRedemptions: 0, totalAmount: 0, pendingCount: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRedemptions();
  }, []);

  const fetchRedemptions = async () => {
    try {
      // Use the vendor-specific endpoint
      const res = await api.get('/vouchers/vendor/redemptions');
      const redeemed = res.data;
      
      setRedemptions(redeemed);
      setStats({
        totalRedemptions: redeemed.length,
        totalAmount: redeemed.reduce((sum, v) => sum + (v.redeemedAmount || 0), 0),
        pendingCount: redeemed.filter(v => v.status === 'active').length
      });
    } catch (err) {
      console.error('Fetch redemptions error:', err);
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!voucherCode.trim()) {
      setMessage('Please enter a voucher code');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const res = await api.get(`/vouchers/${voucherCode}`);
      setVoucherDetails(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Voucher not found or invalid');
      setVoucherDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!redemptionAmount || redemptionAmount <= 0) {
      setMessage('Please enter a valid amount');
      return;
    }
    
    const amount = parseFloat(redemptionAmount);
    const remaining = voucherDetails.amount - (voucherDetails.redeemedAmount || 0);
    
    if (amount > remaining) {
      setMessage(`Amount exceeds remaining balance of ₦${remaining.toLocaleString()}`);
      return;
    }

    setLoading(true);
    try {
      await api.post(`/vouchers/${voucherCode}/redeem`, { amount });
      setMessage('Voucher redeemed successfully!');
      setVoucherCode('');
      setRedemptionAmount('');
      setVoucherDetails(null);
      fetchRedemptions();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to redeem voucher');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-inner">
        <div className="dashboard-header">
          <div>
            <h1>Vendor Portal</h1>
            <p style={{ color: '#636e72' }}>Manage voucher redemptions</p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Redemptions</h4>
            <div className="value">{stats.totalRedemptions}</div>
          </div>
          <div className="stat-card">
            <h4>Total Value</h4>
            <div className="value">₦{stats.totalAmount.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <h4>Status</h4>
            <div className="value" style={{ fontSize: '1rem', color: '#2d8a3e' }}>
              <FaCheckCircle /> Active
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Redeem Voucher */}
          

          {/* Recent Redemptions */}
          <div className="dashboard-card">
            <h3><FaHistory /> Recent Redemptions</h3>
            {redemptions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#636e72' }}>
                <FaStore style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }} />
                <p>No redemptions yet.</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                  Use the lookup form to redeem vouchers from beneficiaries.
                </p>
              </div>
            ) : (
              redemptions.map(r => (
                <div key={r._id} style={{
                  padding: '1rem',
                  borderBottom: '1px solid #dfe6e9',
                  background: r.status === 'redeemed' ? '#f0fdf4' : 'transparent'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '0.5rem'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                        {r.code}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: '#636e72', marginTop: '0.25rem' }}>
                        <FaUser style={{ marginRight: '0.25rem' }} />
                        {r.beneficiary?.name || 'Unknown'}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#1a5f2a', fontWeight: 700, fontSize: '1rem' }}>
                        ₦{(r.redeemedAmount || 0).toLocaleString()}
                      </div>
                      <span style={{ 
                        fontSize: '0.7rem', 
                        padding: '0.2rem 0.5rem',
                        background: r.status === 'redeemed' ? '#dcfce7' : '#fef3c7',
                        color: r.status === 'redeemed' ? '#166534' : '#92400e',
                        borderRadius: '4px',
                        fontWeight: 600
                      }}>
                        {r.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: '#94a3b8'
                  }}>
                    <span>
                      <FaCalendarAlt style={{ marginRight: '0.25rem' }} />
                      {r.redeemedAt ? new Date(r.redeemedAt).toLocaleDateString() : 'Pending'}
                    </span>
                    <span>Category: {r.category}</span>
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

export default VendorPage;