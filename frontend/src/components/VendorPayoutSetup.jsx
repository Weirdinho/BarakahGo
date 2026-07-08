import React, { useState, useEffect } from 'react';
import { FaUniversity, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import api from '../services/api';

const VendorPayoutSetup = () => {
  const [banks, setBanks] = useState([]);
  const [bankCode, setBankCode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/payouts/banks')
      .then(res => setBanks(res.data))
      .catch(() => setError('Could not load bank list'));
  }, []);

  // Reset verification if account number or bank changes
  useEffect(() => {
    setAccountName('');
  }, [accountNumber, bankCode]);

  const handleVerify = async () => {
    if (!bankCode || accountNumber.length < 10) {
      setError('Select a bank and enter a valid account number');
      return;
    }
    setVerifying(true);
    setError('');
    try {
      const res = await api.post('/payouts/verify-account', { accountNumber, bankCode });
      setAccountName(res.data.accountName);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not verify account');
    } finally {
      setVerifying(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await api.post('/payouts/setup-recipient', { accountNumber, bankCode, accountName });
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save bank details');
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <div className="dashboard-card" style={{ textAlign: 'center', padding: '2rem' }}>
        <FaCheckCircle style={{ fontSize: '2.5rem', color: '#1a5f2a', marginBottom: '0.75rem' }} />
        <h3>Payout account saved</h3>
        <p style={{ color: '#636e72' }}>
          {accountName} · {banks.find(b => b.code === bankCode)?.name}
        </p>
        <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setSaved(false)}>
          Change account
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <h3><FaUniversity /> Payout Account</h3>
      <p style={{ color: '#636e72', fontSize: '0.85rem', marginBottom: '1rem' }}>
        Add the bank account where you'll receive redemption payouts.
      </p>

      {error && (
        <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}

      <div className="form-group">
        <label>Bank</label>
        <select value={bankCode} onChange={(e) => setBankCode(e.target.value)}>
          <option value="">Select your bank</option>
          {banks.map(b => (
            <option key={b.code} value={b.code}>{b.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Account Number</label>
        <input
          type="text"
          placeholder="0123456789"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
          maxLength={10}
        />
      </div>

      {!accountName ? (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleVerify}
          disabled={verifying || !bankCode || accountNumber.length < 10}
        >
          {verifying ? <><FaSpinner className="spin" /> Verifying...</> : 'Verify Account'}
        </button>
      ) : (
        <>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem', color: '#166534' }}>
            <strong>{accountName}</strong> — confirm this is correct before saving.
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Payout Account'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setAccountName('')}>
              Re-verify
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VendorPayoutSetup;