import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaCheckCircle, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import api from '../services/api';

const AdminPayoutsTable = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await api.get('/payouts/pending');
      setVouchers(res.data);
    } catch (err) {
      setError('Could not load pending payouts');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (voucherId) => {
    if (!window.confirm('Send this payout? This cannot be undone.')) return;
    setPayingId(voucherId);
    setError('');
    try {
      await api.post(`/payouts/vouchers/${voucherId}`);
      fetchPending(); // refresh list — status moves to 'pending' until webhook confirms
    } catch (err) {
      setError(err.response?.data?.message || 'Payout failed');
    } finally {
      setPayingId(null);
    }
  };

  const statusBadge = (status) => {
    const map = {
      none: { color: '#f4a261', label: 'Awaiting Payout' },
      pending: { color: '#4a90d9', label: 'Processing' },
      failed: { color: '#e76f51', label: 'Failed — Retry' }
    };
    const s = map[status] || map.none;
    return (
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: s.color, textTransform: 'uppercase' }}>
        {s.label}
      </span>
    );
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="dashboard-card">
      <h3><FaMoneyBillWave /> Vendor Payouts</h3>

      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', margin: '1rem 0', fontSize: '0.9rem' }}>
          <FaExclamationTriangle /> {error}
        </div>
      )}

      {vouchers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#636e72' }}>
          <FaCheckCircle style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }} />
          <p>No pending payouts.</p>
        </div>
      ) : (
        vouchers.map(v => (
          <div key={v._id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            borderBottom: '1px solid #dfe6e9'
          }}>
            <div>
              <div style={{ fontWeight: 600 }}>{v.vendor?.name || 'Unknown vendor'}</div>
              <div style={{ fontSize: '0.85rem', color: '#636e72' }}>
                Voucher {v.code} · ₦{v.redeemedAmount?.toLocaleString()}
              </div>
              <div style={{ marginTop: '0.25rem' }}>{statusBadge(v.payoutStatus)}</div>
            </div>

            <button
              className="btn btn-primary"
              disabled={payingId === v._id || v.payoutStatus === 'pending' || !v.vendor?.bankDetails?.recipientCode}
              onClick={() => handlePay(v._id)}
              title={!v.vendor?.bankDetails?.recipientCode ? 'Vendor has not set up a payout account' : ''}
            >
              {payingId === v._id ? <><FaSpinner className="spin" /> Sending...</> : 'Pay Now'}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminPayoutsTable;