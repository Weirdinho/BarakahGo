import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaUsers, FaDonate, FaTicketAlt, FaStore, FaClipboardList,
  FaTrash, FaEdit, FaCheck, FaTimes, FaChartBar, FaSignOutAlt,
  FaBars, FaTimes as FaClose, FaFilter
} from 'react-icons/fa';
import api from '../services/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // User filter state
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, donationsRes, appsRes, vouchersRes, vendorsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/admin/donations'),
        api.get('/admin/applications'),
        api.get('/admin/vouchers'),
        api.get('/admin/vendors/pending')
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setDonations(donationsRes.data);
      setApplications(appsRes.data);
      setVouchers(vouchersRes.data);
      setPendingVendors(vendorsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleUpdateRole = async (id, newRole) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role: newRole });
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const handleApproveApplication = async (id, status) => {
    try {
      await api.put(`/admin/applications/${id}`, { status });
      setApplications(apps => apps.map(a => a._id === id ? { ...a, status } : a));
    } catch (err) {
      alert('Failed to update application');
    }
  };

  const handleApproveVendor = async (id) => {
    try {
      await api.put(`/vendors/${id}/approve`);
      setPendingVendors(vendors => vendors.filter(v => v._id !== id));
    } catch (err) {
      alert('Failed to approve vendor');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaChartBar /> },
    { id: 'users', label: 'Users', icon: <FaUsers /> },
    { id: 'donations', label: 'Donations', icon: <FaDonate /> },
    { id: 'applications', label: 'Applications', icon: <FaClipboardList /> },
    { id: 'vouchers', label: 'Vouchers', icon: <FaTicketAlt /> },
    { id: 'vendors', label: 'Vendors', icon: <FaStore /> },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  // Filter users based on role and search query
  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch = !searchQuery || 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Count users by role for filter badges
  const roleCounts = {
    all: users.length,
    donor: users.filter(u => u.role === 'donor').length,
    corporate: users.filter(u => u.role === 'corporate').length,
    beneficiary: users.filter(u => u.role === 'beneficiary').length,
    vendor: users.filter(u => u.role === 'vendor').length,
    admin: users.filter(u => u.role === 'admin').length,
  };

  const renderOverview = () => (
    <div>
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(26, 95, 42, 0.1)', color: '#1a5f2a' }}>
            <FaUsers />
          </div>
          <div>
            <h3>{stats.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(244, 162, 97, 0.1)', color: '#f4a261' }}>
            <FaDonate />
          </div>
          <div>
            <h3>₦{(stats.totalAmount || 0).toLocaleString()}</h3>
            <p>Total Donated</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(231, 111, 81, 0.1)', color: '#e76f51' }}>
            <FaClipboardList />
          </div>
          <div>
            <h3>{stats.pendingApplications || 0}</h3>
            <p>Pending Applications</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(45, 138, 62, 0.1)', color: '#2d8a3e' }}>
            <FaTicketAlt />
          </div>
          <div>
            <h3>{stats.totalVouchers || 0}</h3>
            <p>Total Vouchers</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Recent Activity</h3>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Recent Donations</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {donations.slice(0, 5).map(d => (
                <tr key={d._id}>
                  <td>{d.donor?.name || 'Anonymous'}</td>
                  <td>₦{d.amount.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge ${d.status}`}>{d.status}</span>
                  </td>
                  <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>All Users</h3>
      
      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <FaFilter className="filter-icon" />
          <div className="filter-buttons">
            {[
              { id: 'all', label: 'All', count: roleCounts.all },
              { id: 'donor', label: 'Donors', count: roleCounts.donor },
              { id: 'corporate', label: 'Corporate', count: roleCounts.corporate },
              { id: 'beneficiary', label: 'Beneficiaries', count: roleCounts.beneficiary },
              { id: 'vendor', label: 'Vendors', count: roleCounts.vendor },
              { id: 'admin', label: 'Admins', count: roleCounts.admin },
            ].map(role => (
              <button
                key={role.id}
                className={`filter-btn ${roleFilter === role.id ? 'active' : ''}`}
                onClick={() => setRoleFilter(role.id)}
              >
                {role.label}
                <span className="filter-count">{role.count}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="search-group">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="results-info">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  No users found matching your filters.
                </td>
              </tr>
            ) : (
              filteredUsers.map(u => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select 
                      value={u.role} 
                      onChange={(e) => handleUpdateRole(u._id, e.target.value)}
                      className="role-select"
                    >
                      <option value="donor">Donor</option>
                      <option value="corporate">Corporate</option>
                      <option value="beneficiary">Beneficiary</option>
                      <option value="vendor">Vendor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleDeleteUser(u._id)} className="action-btn delete">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDonations = () => (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>All Donations ({donations.length})</h3>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {donations.map(d => (
              <tr key={d._id}>
                <td>{d.donor?.name || 'Anonymous'}</td>
                <td>₦{d.amount.toLocaleString()}</td>
                <td>{d.category}</td>
                <td>
                  <span className={`status-badge ${d.status}`}>{d.status}</span>
                </td>
                <td>{new Date(d.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderApplications = () => (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>Aid Applications ({applications.length})</h3>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app._id}>
                <td>{app.applicant?.name}</td>
                <td>{app.category}</td>
                <td>₦{app.amount.toLocaleString()}</td>
                <td>{app.reason.substring(0, 50)}...</td>
                <td>
                  <span className={`status-badge ${app.status}`}>{app.status}</span>
                </td>
                <td>
                  {app.status === 'pending' && (
                    <>
                      <button onClick={() => handleApproveApplication(app._id, 'approved')} className="action-btn approve">
                        <FaCheck />
                      </button>
                      <button onClick={() => handleApproveApplication(app._id, 'rejected')} className="action-btn reject">
                        <FaTimes />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderVouchers = () => (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>All Vouchers ({vouchers.length})</h3>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {vouchers.map(v => (
              <tr key={v._id}>
                <td><code>{v.code}</code></td>
                <td>₦{v.amount.toLocaleString()}</td>
                <td>{v.category}</td>
                <td>
                  <span className={`status-badge ${v.status}`}>{v.status}</span>
                </td>
                <td>{new Date(v.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderVendors = () => (
    <div>
      <h3 style={{ marginBottom: '1rem' }}>Pending Vendor Approvals ({pendingVendors.length})</h3>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Categories</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingVendors.map(v => (
              <tr key={v._id}>
                <td>{v.name}</td>
                <td>{v.email}</td>
                <td>{v.phone}</td>
                <td>{v.categories?.join(', ')}</td>
                <td>
                  <button onClick={() => handleApproveVendor(v._id)} className="action-btn approve">
                    <FaCheck /> Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <style>{`
        * {
          -webkit-tap-highlight-color: transparent;
          box-sizing: border-box;
        }

        .admin-dashboard {
          display: flex;
          min-height: 100vh;
          background: #f5f7fa;
        }

        .admin-sidebar {
          width: 260px;
          background: #1a5f2a;
          color: white;
          padding: 1rem;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          overflow-y: auto;
          z-index: 1000;
          transition: transform 0.3s ease;
        }

       

        .admin-brand h2 {
          font-size: 1.25rem;
          font-weight: 700;
        }

        .admin-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .admin-nav-item {
          background: none;
          border: none;
          color: white;
          padding: 0.8rem;
          text-align: left;
          cursor: pointer;
          display: flex;
          gap: 10px;
          border-radius: 6px;
          font-size: 0.9rem;
          align-items: center;
          transition: background 0.2s ease;
          min-height: 44px;
        }

        .admin-nav-item:active {
          background: rgba(255,255,255,0.15);
        }

        .admin-nav-item.active {
          background: rgba(255,255,255,0.2);
        }

        .admin-main {
          flex: 1;
          padding: 1.5rem;
          margin-left: 260px;
          min-width: 0;
        }

        .admin-header {
          margin-top: 70px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .admin-header h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
        }

        .menu-toggle {
          display: none;
          position: fixed;
          top: 15px;
          left: 15px;
          background: #1a5f2a;
          color: white;
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 10px;
          z-index: 2000;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          z-index: 999;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .admin-stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.875rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          min-width: 0;
        }

        .admin-stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .admin-stat-card h3 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #1e293b;
          line-height: 1.2;
        }

        .admin-stat-card p {
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 2px;
        }

        /* FILTER BAR STYLES */
        .filter-bar {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
          justify-content: space-between;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          flex: 1;
          min-width: 0;
        }

        .filter-icon {
          color: #1a5f2a;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .filter-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          background: #f1f5f9;
          border: 2px solid transparent;
          color: #64748b;
          padding: 0.5rem 0.875rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          min-height: 36px;
          white-space: nowrap;
        }

        .filter-btn:hover {
          background: #e2e8f0;
          color: #334155;
        }

        .filter-btn.active {
          background: #1a5f2a;
          color: white;
          border-color: #1a5f2a;
        }

        .filter-count {
          background: rgba(255,255,255,0.2);
          padding: 0.15rem 0.5rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .filter-btn.active .filter-count {
          background: rgba(255,255,255,0.3);
        }

        .search-group {
          flex: 1;
          min-width: 200px;
          max-width: 300px;
        }

        .search-input {
          width: 100%;
          padding: 0.6rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          min-height: 40px;
        }

        .search-input:focus {
          outline: none;
          border-color: #1a5f2a;
        }

        .results-info {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .admin-table-container {
          background: white;
          border-radius: 12px;
          overflow-x: auto;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          -webkit-overflow-scrolling: touch;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }

        .admin-table th {
          background: #f8fafc;
          padding: 0.875rem 1rem;
          text-align: left;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
          font-weight: 600;
          border-bottom: 1px solid #e2e8f0;
          white-space: nowrap;
        }

        .admin-table td {
          padding: 0.875rem 1rem;
          border-bottom: 1px solid #f1f5f9;
          font-size: 0.85rem;
          color: #334155;
        }

        .admin-table tr:hover {
          background: #f8fafc;
        }

        .status-badge {
          padding: 0.25rem 0.625rem;
          border-radius: 50px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          white-space: nowrap;
          display: inline-block;
        }

        .status-badge.success,
        .status-badge.approved,
        .status-badge.active {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.failed,
        .status-badge.rejected,
        .status-badge.cancelled {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-badge.redeemed,
        .status-badge.fulfilled {
          background: #dbeafe;
          color: #1e40af;
        }

        .role-select {
          padding: 0.4rem 0.6rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.8rem;
          background: white;
          min-height: 36px;
          min-width: 120px;
        }

        .action-btn {
          padding: 0.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          margin-right: 0.5rem;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          min-height: 36px;
          min-width: 36px;
          justify-content: center;
        }

        .action-btn.delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .action-btn.approve {
          background: #dcfce7;
          color: #166534;
        }

        .action-btn.reject {
          background: #fee2e2;
          color: #dc2626;
        }

        /* ========== TABLET (iPad) ========== */
        @media (max-width: 1024px) {
          .admin-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* ========== MOBILE (iPhone 16 & smaller) ========== */
        @media (max-width: 768px) {
          
          .menu-toggle {
            display: flex;
          }

          .admin-sidebar {
            transform: translateX(-100%);
            width: 50%;
          }

          .admin-sidebar.open {
            transform: translateX(0);
          }

          .sidebar-overlay.open {
            display: block;
            opacity: 1;
          }

          .admin-main {
            margin-left: 0;
            padding: 1rem;
            padding-top: 70px;
          }

          .admin-header {
            margin-top: 0;
          }

          .admin-header h2 {
            font-size: 1.25rem;
          }

          .admin-stats-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }

          .admin-stat-card {
            padding: 1rem;
          }

          .admin-stat-icon {
            width: 44px;
            height: 44px;
            font-size: 1.1rem;
          }

          .admin-stat-card h3 {
            font-size: 1.2rem;
          }

          .filter-bar {
            flex-direction: column;
            align-items: stretch;
            padding: 0.875rem;
          }

          .filter-group {
            width: 100%;
          }

          .filter-buttons {
            overflow-x: auto;
            flex-wrap: nowrap;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 4px;
          }

          .search-group {
            max-width: 100%;
            min-width: 100%;
          }

          .admin-table {
            min-width: 500px;
          }

          .admin-table th,
          .admin-table td {
            padding: 0.75rem 0.625rem;
            font-size: 0.8rem;
          }

          .action-btn {
            min-height: 32px;
            min-width: 32px;
            padding: 0.4rem;
          }
        }

        /* ========== SMALL PHONES (iPhone SE, mini) ========== */
        @media (max-width: 375px) {
          .admin-main {
            padding: 0.75rem;
            padding-top: 65px;
          }

          .admin-stat-card h3 {
            font-size: 1.1rem;
          }

          .filter-btn {
            padding: 0.4rem 0.7rem;
            font-size: 0.75rem;
          }

          .admin-table th,
          .admin-table td {
            padding: 0.625rem 0.5rem;
            font-size: 0.75rem;
          }
        }

        /* Safe area for notched iPhones */
        @supports (padding-top: env(safe-area-inset-top)) {
          .menu-toggle {
            top: max(15px, env(safe-area-inset-top));
          }
        }
      `}</style>

      <button
        className="menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <FaClose /> : <FaBars />}
      </button>

      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={closeSidebar}
      />

      <div className="admin-dashboard">
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="admin-brand">
            <h2>Admin Panel</h2>
          </div>

          <nav className="admin-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  closeSidebar();
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="admin-main">
          <header className="admin-header">
            <h2>{tabs.find(t => t.id === activeTab)?.label}</h2>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {user?.name} ({user?.role})
            </div>
          </header>

          <div className="admin-content">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'donations' && renderDonations()}
            {activeTab === 'applications' && renderApplications()}
            {activeTab === 'vouchers' && renderVouchers()}
            {activeTab === 'vendors' && renderVendors()}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;