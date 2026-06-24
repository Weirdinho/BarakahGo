import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaUser, FaEnvelope, FaPhone, FaBuilding,
  FaEdit, FaSave, FaTimes, FaTrashAlt,
  FaExclamationTriangle, FaCheckCircle, FaSpinner,
  FaLock, FaEye, FaEyeSlash
} from 'react-icons/fa';

const EditProfile = () => {
  const { user, loading: authLoading, updateUser, logout, api } = useAuth();
  const navigate = useNavigate();

  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', companyName: '' });
  const [originalData, setOriginalData] = useState({});

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      const data = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        companyName: user.companyName || ''
      };
      setFormData(data);
      setOriginalData(data);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [authLoading, user, navigate]);

  const openEditModal = () => {
    setFormData(originalData);
    setErrors({});
    setShowEditModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) setPasswordErrors(prev => { const n = { ...prev }; delete n[name]; return n; });
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (formData.phone && !/^\+?[\d\s-]{8,}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
    return newErrors;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Required';
    if (!passwordData.newPassword) newErrors.newPassword = 'Required';
    else if (passwordData.newPassword.length < 6) newErrors.newPassword = 'Min 6 characters';
    if (passwordData.newPassword !== passwordData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationErrors = validateProfile();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    setSaving(true); setMessage({ type: '', text: '' });
    try {
      const res = await api.put('/auth/profile', formData);
      updateUser(res.data.user);
      setOriginalData(formData);
      setShowEditModal(false);
      setMessage({ type: 'success', text: 'Profile updated!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const validationErrors = validatePassword();
    if (Object.keys(validationErrors).length > 0) { setPasswordErrors(validationErrors); return; }

    setChangingPassword(true); setMessage({ type: '', text: '' });
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
      setMessage({ type: 'success', text: 'Password changed!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    } finally {
      setChangingPassword(false);
    }
  };

  const closeEditModal = () => {
    setFormData(originalData);
    setErrors({});
    setShowEditModal(false);
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!deletePassword) return;
    setDeleting(true);
    try {
      await api.delete('/auth/profile', { data: { password: deletePassword } });
      logout();
      navigate('/');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete account' });
      setDeleting(false);
    }
  };

  if (authLoading) return (
    <div className="edit-profile-page">
      <div className="loading-container"><FaSpinner className="spinner" /><p>Loading...</p></div>
    </div>
  );
  if (!user) return null;

  const roleLabels = { admin: 'Administrator', donor: 'Donor', corporate: 'Corporate Partner', vendor: 'Vendor', beneficiary: 'Beneficiary' };

  return (
    <>
      <style>{`
        .edit-profile-page { min-height: 100vh; background: #f8f9fa; padding: 100px 1.5rem 3rem; }
        .profile-container { max-width: 700px; margin: 0 auto; }
        .profile-header { text-align: center; margin-bottom: 2rem; }
        .profile-header h1 { color: #1a5f2a; font-size: 2rem; margin-bottom: 0.5rem; }
        .profile-header p { color: #636e72; font-size: 1rem; }
        .profile-card { background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); overflow: hidden; margin-bottom: 1.5rem; }
        .profile-avatar-section { background: linear-gradient(135deg, #1a5f2a 0%, #2d8a3e 100%); padding: 2.5rem; text-align: center; color: white; }
        .avatar-circle { width: 90px; height: 90px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; font-size: 2.5rem; border: 3px solid rgba(255,255,255,0.3); }
        .avatar-circle span { font-weight: 700; font-size: 2rem; }
        .user-name { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.25rem; }
        .user-role { display: inline-block; background: rgba(255,255,255,0.2); padding: 0.3rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 500; }
        .profile-body { padding: 2rem; }
        .section-title { display: flex; align-items: center; gap: 0.5rem; font-size: 1.1rem; font-weight: 700; color: #2d3436; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 2px solid #f1f5f9; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-group.full-width { grid-column: 1 / -1; }
        .form-label { font-size: 0.85rem; font-weight: 600; color: #636e72; display: flex; align-items: center; gap: 0.4rem; }
        .form-input { padding: 0.85rem 1rem; border: 2px solid #e9ecef; border-radius: 10px; font-size: 0.95rem; font-family: inherit; transition: all 0.2s ease; background: #fff; width: 100%; box-sizing: border-box; }
        .form-input:focus { outline: none; border-color: #1a5f2a; box-shadow: 0 0 0 3px rgba(26,95,42,0.1); }
        .form-input.error { border-color: #e76f51; }
        .error-text { color: #e76f51; font-size: 0.8rem; }
        .info-value { padding: 0.85rem 1rem; background: #f8f9fa; border-radius: 10px; font-size: 0.95rem; color: #2d3436; display: flex; align-items: center; gap: 0.5rem; min-height: 48px; box-sizing: border-box; }
        .info-value .empty { color: #b2bec3; font-style: italic; }
        .password-input-wrapper { position: relative; }
        .password-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #636e72; cursor: pointer; font-size: 1rem; padding: 0.25rem; }
        .password-toggle:hover { color: #1a5f2a; }
        .action-buttons { display: flex; gap: 0.75rem; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px solid #f1f5f9; flex-wrap: wrap; }
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.85rem 1.5rem; border-radius: 10px; font-size: 0.95rem; font-weight: 600; font-family: inherit; cursor: pointer; border: none; transition: all 0.2s ease; }
        .btn-primary { background: #1a5f2a; color: white; }
        .btn-primary:hover:not(:disabled) { background: #0f3d1a; transform: translateY(-1px); }
        .btn-secondary { background: #f1f5f9; color: #2d3436; }
        .btn-secondary:hover:not(:disabled) { background: #e9ecef; }
        .btn-outline { background: transparent; color: #1a5f2a; border: 2px solid #1a5f2a; }
        .btn-outline:hover:not(:disabled) { background: #1a5f2a; color: white; }
        .btn-danger { background: transparent; color: #e76f51; border: 2px solid #e76f51; }
        .btn-danger:hover:not(:disabled) { background: #e76f51; color: white; }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .alert { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.25rem; border-radius: 10px; margin-bottom: 1.5rem; font-size: 0.95rem; font-weight: 500; }
        .alert-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .alert-error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .password-section { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px solid #f1f5f9; }
        .danger-zone { padding: 1.5rem; }
        .danger-zone-title { color: #e76f51; font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem; }
        .danger-zone p { color: #636e72; font-size: 0.9rem; margin-bottom: 1rem; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 1rem; backdrop-filter: blur(4px); }
        .modal-content { background: white; border-radius: 16px; max-width: 450px; width: 100%; padding: 2rem; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
        .edit-modal-content { max-width: 560px; text-align: left; }
        .edit-modal-content .modal-header { text-align: left; }
        .edit-modal-content .form-grid { margin-top: 0.5rem; }
        .modal-header { text-align: center; margin-bottom: 1.5rem; }
        .modal-icon { width: 60px; height: 60px; background: #fff3f3; color: #e76f51; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin: 0 auto 1rem; }
        .modal-header h3 { color: #2d3436; margin-bottom: 0.5rem; }
        .modal-header p { color: #636e72; font-size: 0.9rem; }
        .modal-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
        .modal-actions .btn { flex: 1; }
        .loading-container { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: #636e72; }
        .spinner { animation: spin 1s linear infinite; font-size: 2rem; color: #1a5f2a; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } .profile-body { padding: 1.5rem; } .action-buttons { flex-direction: column; } .btn { width: 100%; } }
      `}</style>

      <div className="edit-profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <h1>Your Profile</h1>
            <p>Manage your account information</p>
          </div>

          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
              {message.text}
            </div>
          )}

          <div className="profile-card">
            <div className="profile-avatar-section">
              <div className="avatar-circle"><span>{user.name?.charAt(0).toUpperCase()}</span></div>
              <div className="user-name">{user.name}</div>
              <span className="user-role">{roleLabels[user.role] || user.role}</span>
            </div>

            <div className="profile-body">
              <div className="section-title"><FaUser /> Personal Information</div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label"><FaUser /> Full Name</label>
                  <div className="info-value"><FaUser /> {user.name}</div>
                </div>

                <div className="form-group">
                  <label className="form-label"><FaEnvelope /> Email</label>
                  <div className="info-value"><FaEnvelope /> {user.email}</div>
                </div>

                <div className="form-group">
                  <label className="form-label"><FaPhone /> Phone</label>
                  <div className="info-value"><FaPhone /> {user.phone || <span className="empty">Not provided</span>}</div>
                </div>

                <div className="form-group">
                  <label className="form-label"><FaBuilding /> Company</label>
                  <div className="info-value"><FaBuilding /> {user.companyName || <span className="empty">Not provided</span>}</div>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Role</label>
                  <div className="info-value" style={{ background: '#f1f5f9' }}>{roleLabels[user.role] || user.role}</div>
                </div>
              </div>

              <div className="action-buttons">
                <button type="button" className="btn btn-primary" onClick={openEditModal}>
                  <FaEdit /> Edit Profile
                </button>
                <button type="button" className="btn btn-outline" onClick={() => setShowPasswordSection(!showPasswordSection)}>
                  <FaLock /> {showPasswordSection ? 'Hide' : 'Change Password'}
                </button>
              </div>

              {showPasswordSection && (
                <div className="password-section">
                  <div className="section-title"><FaLock /> Change Password</div>
                  <form onSubmit={handleChangePassword}>
                    <div className="form-grid">
                      <div className="form-group full-width">
                        <label className="form-label">Current Password</label>
                        <div className="password-input-wrapper">
                          <input type={showPasswords.current ? 'text' : 'password'} name="currentPassword" className={`form-input ${passwordErrors.currentPassword ? 'error' : ''}`} value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder="Current password" />
                          <button type="button" className="password-toggle" onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))}>
                            {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                        {passwordErrors.currentPassword && <span className="error-text">{passwordErrors.currentPassword}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">New Password</label>
                        <div className="password-input-wrapper">
                          <input type={showPasswords.new ? 'text' : 'password'} name="newPassword" className={`form-input ${passwordErrors.newPassword ? 'error' : ''}`} value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="Min 6 characters" />
                          <button type="button" className="password-toggle" onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}>
                            {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                        {passwordErrors.newPassword && <span className="error-text">{passwordErrors.newPassword}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <div className="password-input-wrapper">
                          <input type={showPasswords.confirm ? 'text' : 'password'} name="confirmPassword" className={`form-input ${passwordErrors.confirmPassword ? 'error' : ''}`} value={passwordData.confirmPassword} onChange={handlePasswordChange} placeholder="Re-enter password" />
                          <button type="button" className="password-toggle" onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}>
                            {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                        {passwordErrors.confirmPassword && <span className="error-text">{passwordErrors.confirmPassword}</span>}
                      </div>
                    </div>

                    <div className="action-buttons">
                      <button type="submit" className="btn btn-primary" disabled={changingPassword}>
                        {changingPassword ? <FaSpinner className="spinner" /> : <FaLock />}
                        {changingPassword ? 'Updating...' : 'Update Password'}
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => { setShowPasswordSection(false); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); setPasswordErrors({}); }}>
                        <FaTimes /> Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          <div className="profile-card">
            <div className="profile-body">
              <div className="danger-zone">
                <div className="danger-zone-title"><FaExclamationTriangle /> Danger Zone</div>
                <p>Once deleted, your account cannot be recovered.</p>
                <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
                  <FaTrashAlt /> Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon"><FaExclamationTriangle /></div>
              <h3>Delete Account?</h3>
              <p>This cannot be undone. All data will be removed.</p>
            </div>
            <form onSubmit={handleDeleteAccount}>
              <div className="form-group">
                <label className="form-label">Enter password to confirm</label>
                <input type="password" className="form-input" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} placeholder="Your password" autoFocus required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowDeleteModal(false); setDeletePassword(''); }}>Cancel</button>
                <button type="submit" className="btn btn-danger" disabled={deleting || !deletePassword}>
                  {deleting ? <FaSpinner className="spinner" /> : <FaTrashAlt />}
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content edit-modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <p>Update your account information</p>
            </div>
            <form onSubmit={handleSave}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label"><FaUser /> Full Name *</label>
                  <input type="text" name="name" className={`form-input ${errors.name ? 'error' : ''}`} value={formData.name} onChange={handleChange} placeholder="Your full name" autoFocus />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group full-width">
                  <label className="form-label"><FaEnvelope /> Email *</label>
                  <input type="email" name="email" className={`form-input ${errors.email ? 'error' : ''}`} value={formData.email} onChange={handleChange} placeholder="your@email.com" />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label"><FaPhone /> Phone</label>
                  <input type="tel" name="phone" className={`form-input ${errors.phone ? 'error' : ''}`} value={formData.phone} onChange={handleChange} placeholder="+1 234 567 890" />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label"><FaBuilding /> Company</label>
                  <input type="text" name="companyName" className="form-input" value={formData.companyName} onChange={handleChange} placeholder="Company name" />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeEditModal} disabled={saving}>
                  <FaTimes /> Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <FaSpinner className="spinner" /> : <FaSave />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;