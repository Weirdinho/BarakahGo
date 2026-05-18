import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">
          <div className="logo-icon">GB</div>
          GO BARAKAH
        </Link>

        <ul className="nav-links" style={{ display: mobileOpen ? 'flex' : undefined }}>
          <li><Link to="/">Home</Link></li>
          
          {user && (
            <>
              <li><Link to="/donate">Donate</Link></li>
              <li><Link to="/vendors">Vendors</Link></li>
              
              {user.role === 'admin' && (
                <li><Link to="/admin">Admin</Link></li>
              )}
              {user.role === 'beneficiary' && (
                <li><Link to="/beneficiary">My Aid</Link></li>
              )}
              {user.role === 'vendor' && (
                <li><Link to="/vendor">Vendor Portal</Link></li>
              )}
              {(user.role === 'donor' || user.role === 'corporate') && (
                <li><Link to="/dashboard">Dashboard</Link></li>
              )}
            </>
          )}
          
          {user ? (
            <>
              <li>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <FaUser /> {user.name}
                </span>
              </li>
              <li>
                <button 
                  onClick={handleLogout}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    color: '#e76f51',
                    fontWeight: 600
                  }}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </li>
            </>
          ) : (
            <li><Link to="/login" className="nav-cta">Get Started</Link></li>
          )}
        </ul>

        <button 
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ display: 'none', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          {mobileOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;