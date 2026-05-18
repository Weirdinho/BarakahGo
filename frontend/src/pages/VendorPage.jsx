import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FaQrcode, FaCheckCircle, FaHistory, FaStore,
  FaDollarSign, FaUsers 
} from 'react-icons/fa';
import api from '../services/api';

const VendorPage = () => {
  const { user } = useAuth();
  const [voucherCode, setVoucherCode] = useState('');
  const [redemptionAmount, setRedemptionAmount] = useState('');
  const [voucherDetails, setVoucherDetails] = useState(null);
  const [redemptions, setRedemptions] = useState([]);
  const [stats, setStats] = useState({ totalRedemptions: 0, totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchRedemptions();
  }, []);

  const fetchRedemptions = async () => {
    try {
      const res = await api.get('/vouchers');
      const redeemed = res.data.filter(v => v.status === 'redeemed');
      setRedemptions(redeemed);
      setStats({
        totalRedemptions: redeemed.length,
        totalAmount: redeemed.reduce((sum, v) => sum + v.redeemedAmount, 0)
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await api.get(`/vouchers/${voucherCode}`);
      setVoucherDetails(res.data);
    } catch (err) {
      setMessage('Voucher not found or invalid');
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
    setLoading(true);
    try {
      await api.post(`/vouchers/${voucherCode}/redeem`, { 
        amount: parseFloat(redemptionAmount) 
      });
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
          <div className="dashboard-card">
            <h3><FaQrcode /> Redeem Voucher</h3>
            
            <form onSubmit={handleLookup} style={{ marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label>Voucher Code</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Enter voucher code (e.g., GBK-FOO-12345678-AB12CD)"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                    style={{ flex: 1, textTransform: 'uppercase' }}
                  />
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    Lookup
                  </button>
                </div>
              </div>
            </form>

            {message && (
              <div style={{
                padding: '0.75rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.9rem',
                background: message.includes('success') ? '#d4edda' : '#fee2e2',
                color: message.includes('success') ? '#155724' : '#dc2626'
              }}>
                {message}
              </div>
            )}

            {voucherDetails && (
              <div style={{
                background: '#f8f9fa',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '2px solid #1a5f2a'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ color: '#1a5f2a', marginBottom: '0.25rem' }}>{voucherDetails.code}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#636e72' }}>Category: {voucherDetails.category}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h3 style={{ color: '#1a5f2a' }}>₦{voucherDetails.amount.toLocaleString()}</h3>
                    <p style={{ fontSize: '0.75rem', color: '#636e72' }}>
                      Remaining: ₦{(voucherDetails.amount - voucherDetails.redeemedAmount).toLocaleString()}
                    </p>
                  </div>
                </div>

                {voucherDetails.status === 'active' && (
                  <>
                    <div className="form-group">
                      <label>Redemption Amount (₦)</label>
                      <input
                        type="number"
                        placeholder="Enter amount to redeem"
                        value={redemptionAmount}
                        onChange={(e) => setRedemptionAmount(e.target.value)}
                        max={voucherDetails.amount - voucherDetails.redeemedAmount}
                      />
                    </div>
                    <button 
                      onClick={handleRedeem} 
                      className="btn btn-primary"
                      disabled={loading}
                      style={{ width: '100%' }}
                    >
                      {loading ? 'Processing...' : 'Confirm Redemption'}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Recent Redemptions */}
          <div className="dashboard-card">
            <h3><FaHistory /> Recent Redemptions</h3>
            {redemptions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#636e72' }}>
                <FaStore style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }} />
                <p>No redemptions yet.</p>
              </div>
            ) : (
              redemptions.map(r => (
                <div key={r._id} style={{
                  padding: '1rem',
                  borderBottom: '1px solid #dfe6e9',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem' }}>{r.code}</h4>
                    <p style={{ fontSize: '0.75rem', color: '#636e72' }}>
                      {new Date(r.redeemedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ color: '#1a5f2a', fontWeight: 700 }}>
                    ₦{r.redeemedAmount.toLocaleString()}
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