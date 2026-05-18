import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaUsers, FaDonate, FaTicketAlt, FaStore, FaClipboardList,
  FaTrash, FaEdit, FaCheck, FaTimes, FaChartBar, FaSignOutAlt
} from 'react-icons/fa';
import api from '../services/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [donations, setDonations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <h3 style={{ marginBottom: '1rem' }}>All Users ({users.length})</h3>
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
            {users.map(u => (
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
            ))}
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
    return (
      <div className="admin-dashboard">
        <div className="loading"><div className="spinner"></div></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h3>GO BARAKAH</h3>
          <p>Admin Panel</p>
        </div>
        <nav className="admin-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="admin-logout">
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h2>{tabs.find(t => t.id === activeTab)?.label}</h2>
          <div className="admin-user">
            <span>{user?.name}</span>
            <span className="admin-role">{user?.role}</span>
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
  );
};

export default AdminDashboard;