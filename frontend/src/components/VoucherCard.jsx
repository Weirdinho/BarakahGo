import React from 'react';
import QRCode from 'react-qr-code';
import { FaCopy, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const VoucherCard = ({ voucher }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#1a5f2a';
      case 'redeemed': return '#2d8a3e';
      case 'expired': return '#e76f51';
      case 'cancelled': return '#dc2626';
      default: return '#636e72';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <FaClock />;
      case 'redeemed': return <FaCheckCircle />;
      case 'expired': return <FaTimesCircle />;
      case 'cancelled': return <FaTimesCircle />;
      default: return null;
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(voucher.code);
  };

  return (
    <div className="voucher-card" style={{ background: `linear-gradient(135deg, ${getStatusColor(voucher.status)} 0%, #0f3d1a 100%)` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8, marginBottom: '0.25rem' }}>VOUCHER CODE</div>
          <div className="code" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {voucher.code}
            <button 
              onClick={copyCode}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.7 }}
            >
              <FaCopy />
            </button>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="amount">₦{voucher.amount.toLocaleString()}</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>
            {voucher.category.toUpperCase()}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
        <div className="status" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {getStatusIcon(voucher.status)}
          {voucher.status.toUpperCase()}
        </div>
        {voucher.status === 'active' && (
          <div style={{ width: '60px', height: '60px', background: 'white', padding: '4px', borderRadius: '4px' }}>
            <QRCode value={voucher.code} size={52} />
          </div>
        )}
      </div>

      {voucher.expiryDate && (
        <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.5rem' }}>
          Expires: {new Date(voucher.expiryDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default VoucherCard;