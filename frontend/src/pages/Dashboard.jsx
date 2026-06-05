import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaDonate, FaTicketAlt, FaStore, FaHeart, FaPlus, FaHandHoldingHeart } from 'react-icons/fa';
import VoucherCard from '../components/VoucherCard';
import DonateModal from '../components/DonateModal';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDonateModal, setShowDonateModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [donationsRes, vouchersRes] = await Promise.all([
        api.get('/donations'),
        api.get('/vouchers')
      ]);
      setDonations(donationsRes.data);
      setVouchers(vouchersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalDonated = donations.reduce((sum, d) => d.status === 'success' ? sum + d.amount : sum, 0);
  const activeVouchers = vouchers.filter(v => v.status === 'active');
  const redeemedVouchers = vouchers.filter(v => v.status === 'redeemed');

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
            <h1>Welcome back, {user?.name?.split(' ')[0]}</h1>
            <p style={{ color: '#636e72' }}>Track your donations and vouchers</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowDonateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              fontWeight: '600'
            }}
          >
            <FaPlus /> Donate Now
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Donated</h4>
            <div className="value">₦{totalDonated.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <h4>Donations Made</h4>
            <div className="value">{donations.filter(d => d.status === 'success').length}</div>
          </div>
          <div className="stat-card">
            <h4>Active Vouchers</h4>
            <div className="value">{activeVouchers.length}</div>
          </div>
          <div className="stat-card">
            <h4>Redeemed</h4>
            <div className="value">{redeemedVouchers.length}</div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>Recent Donations</h3>
            {donations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#636e72' }}>
                <FaDonate style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }} />
                <p>No donations yet. Start giving today!</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowDonateModal(true)}
                  style={{ marginTop: '1rem' }}
                >
                  <FaHandHoldingHeart /> Make Your First Donation
                </button>
              </div>
            ) : (
              donations.slice(0, 5).map(donation => (
                <div className="donation-item" key={donation._id}>
                  <div className="donation-info">
                    <h4>{donation.category.charAt(0).toUpperCase() + donation.category.slice(1)} Support</h4>
                    <p>{new Date(donation.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="donation-amount">₦{donation.amount.toLocaleString()}</div>
                    <span style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '50px',
                      background: donation.status === 'success' ? 'rgba(26, 95, 42, 0.1)' : '#fee2e2',
                      color: donation.status === 'success' ? '#1a5f2a' : '#dc2626'
                    }}>
                      {donation.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="dashboard-card">
            <h3>My Vouchers</h3>
            {vouchers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#636e72' }}>
                <FaTicketAlt style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.5 }} />
                <p>No vouchers yet</p>
              </div>
            ) : (
              vouchers.slice(0, 3).map(voucher => (
                <VoucherCard key={voucher._id} voucher={voucher} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Donate Modal */}
      {showDonateModal && (
        <DonateModal onClose={() => setShowDonateModal(false)} />
      )}
    </div>
  );
};

export default Dashboard;