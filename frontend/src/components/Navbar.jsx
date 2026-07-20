import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaBars,
  FaTimes,
  FaUser,
  FaUserEdit,
  FaChevronDown,
  FaSignOutAlt,
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaQuestionCircle
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => setMobileOpen(false);
  const closeProfileMenu = () => setProfileMenuOpen(false);

  // Close the profile dropdown when clicking anywhere outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close the profile dropdown whenever the route changes
  useEffect(() => {
    setProfileMenuOpen(false);
  }, [location.pathname]);

  // Get the dashboard path based on user role
  const getDashboardPath = () => {
    if (!user) return '/login';

    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'vendor':
        return '/vendor';
      case 'beneficiary':
        return '/beneficiary';
      case 'donor':
      case 'corporate':
        return '/dashboard';
      default:
        return '/';
    }
  };

  // Check if a path is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Check if user is currently on their dashboard page
  const isOnDashboard = () => {
    const dashboardPath = getDashboardPath();
    return location.pathname === dashboardPath || location.pathname.startsWith(dashboardPath + '/');
  };

  return (
    <>
      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #dfe6e9;
          padding: 0 2rem;
        }

        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 70px;
        }

        .logo {
          display: flex;
          align-items: left;
          gap: 0.5rem;
          text-decoration: none;
          font-weight: 800;
          font-size: 1.5rem;
          color: #1a5f2a;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: #1a5f2a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.2rem;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-links a {
          text-decoration: none;
          color: #2d3436;
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .nav-links a:hover {
          color: #1a5f2a;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: #1a5f2a;
          transition: width 0.3s ease;
        }

        .nav-links a:hover::after {
          width: 100%;
        }

        /* ACTIVE STATE */
        .nav-links a.active {
          color: #1a5f2a;
          font-weight: 700;
        }

        .nav-links a.active::after {
          width: 100%;
        }

        .nav-cta {
          background: #1a5f2a;
          color: white !important;
          padding: 0.6rem 1.5rem;
          border-radius: 50px;
          font-weight: 600 !important;
        }

        .nav-cta:hover {
          background: #0f3d1a;
          transform: translateY(-2px);
        }

        .nav-cta::after {
          display: none !important;
        }

        .nav-cta.active {
          background: #0f3d1a;
          box-shadow: 0 4px 15px rgba(26, 95, 42, 0.3);
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #2d3436;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .mobile-toggle:hover {
          background: #f8f9fa;
          color: #1a5f2a;
        }

        .mobile-toggle:active {
          transform: scale(0.95);
        }

        .hamburger-icon {
          transition: transform 0.3s ease, opacity 0.3s ease;
        }

        .hamburger-icon.open {
          transform: rotate(90deg);
        }

        .logout-btn {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #e76f51;
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0;
          transition: all 0.3s ease;
          width: 100%;
          text-align: left;
        }

        .logout-btn:hover {
          color: #c0392b;
          transform: translateX(2px);
        }

        /* =========================
           PROFILE DROPDOWN
        ========================== */
        .profile-menu-wrapper {
          position: relative;
        }

        .profile-trigger {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.85rem;
          font-family: inherit;
          color: #2d3436;
          padding: 0;
          transition: color 0.2s ease;
        }

        .profile-trigger:hover,
        .profile-trigger.active {
          color: #1a5f2a;
          font-weight: 700;
        }

        .profile-trigger .chevron {
          font-size: 0.7rem;
          transition: transform 0.25s ease;
        }

        .profile-trigger .chevron.open {
          transform: rotate(180deg);
        }

        .profile-dropdown {
          position: absolute;
          top: calc(100% + 14px);
          right: 0;
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
          border: 1px solid #f1f5f9;
          min-width: 210px;
          list-style: none;
          margin: 0;
          padding: 0.5rem;
          opacity: 0;
          transform: translateY(-8px);
          pointer-events: none;
          transition: all 0.2s ease;
        }

        .profile-dropdown.open {
          opacity: 1;
          transform: translateY(0);
          pointer-events: all;
        }

        .profile-dropdown li {
          margin: 0;
          padding: 0;
        }

        .profile-dropdown a,
        .profile-dropdown .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.7rem 0.8rem;
          border-radius: 9px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .profile-dropdown a::after {
          display: none;
        }

        .profile-dropdown a:hover,
        .profile-dropdown .logout-btn:hover {
          background: rgba(26, 95, 42, 0.08);
          transform: none;
        }

        .profile-dropdown a.active {
          background: rgba(26, 95, 42, 0.1);
          font-weight: 700;
        }

        .profile-dropdown .logout-btn:hover {
          background: rgba(231, 111, 81, 0.1);
        }

        .profile-divider {
          height: 1px;
          background: #f1f5f9;
          margin: 0.35rem 0.4rem;
        }

        /* =========================
           MOBILE STYLES
        ========================== */
        @media (max-width: 768px) {

          .navbar {
            padding: 0 1rem;
          }
          .logo {
            margin-left: 70px;
          }
          .mobile-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1002;
          }

          .nav-links {
            position: fixed;
            top: 70px;
            right: 0;
            bottom: 0;
            width: 75%;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);

            flex-direction: column;
            align-items: flex-start;
            gap: 0;
            padding: 2rem;

            transform: translateX(100%);
            opacity: 0;
            pointer-events: none;

            overflow-y: auto;

            box-shadow: -5px 0 20px rgba(0,0,0,0.1);

            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .nav-links.open {
            transform: translateX(0);
            opacity: 1;
            height: calc(100vh - 70px);
            pointer-events: all;
            width: 45%;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
          }

          .nav-links li {
            width: 100%;
            opacity: 0;
            transform: translateX(20px);
            transition: all 0.3s ease;
          }

          .nav-links.open li {
            opacity: 1;
            transform: translateX(0);
          }

          /* stagger animation */
          .nav-links.open li:nth-child(1) { transition-delay: 0.05s; }
          .nav-links.open li:nth-child(2) { transition-delay: 0.1s; }
          .nav-links.open li:nth-child(3) { transition-delay: 0.15s; }
          .nav-links.open li:nth-child(4) { transition-delay: 0.2s; }
          .nav-links.open li:nth-child(5) { transition-delay: 0.25s; }
          .nav-links.open li:nth-child(6) { transition-delay: 0.3s; }
          .nav-links.open li:nth-child(7) { transition-delay: 0.35s; }
          .nav-links.open li:nth-child(8) { transition-delay: 0.4s; }

          .nav-links a,
          .nav-links span,
          .logout-btn {
            display: block;
            width: 100%;
            padding: 1rem 0;
            font-size: 1.1rem;
            border-bottom: 1px solid #f1f5f9;
          }

          .nav-links a::after {
            display: none;
          }

          .nav-links a.active {
            background: rgba(26, 95, 42, 0.08);
            border-radius: 8px;
            padding-left: 1rem;
            padding-right: 1rem;
            margin-left: -1rem;
            margin-right: -1rem;
          }

          .nav-cta {
            text-align: center;
            margin-top: 1rem;
          }

          .nav-cta.active {
            background: #0f3d1a;
          }

          /* On mobile, the dropdown becomes an inline expanding section
             instead of a floating box, so it fits naturally in the slide-out panel */
          .profile-trigger {
            width: 100%;
            justify-content: space-between;
            padding: 1rem 0;
            font-size: 1rem;
            border-bottom: 1px solid #f1f5f9;
            color: #1a5f2a;
            font-weight: 600;
          }

          .profile-dropdown {
            position: static;
            box-shadow: none;
            border: none;
            background: transparent;
            padding: 0;
            margin: 0;
            min-width: 0;
            max-height: 0;
            overflow: hidden;
            opacity: 1;
            transform: none;
            transition: max-height 0.3s ease;
          }

          .profile-dropdown.open {
            max-height: 260px;
          }

          .profile-dropdown a,
          .profile-dropdown .logout-btn {
            padding: 0.85rem 0 0.85rem 1rem;
            border-bottom: 1px solid #f1f5f9;
            border-radius: 0;
            font-size: 1rem;
          }

          .profile-dropdown a:hover,
          .profile-dropdown .logout-btn:hover {
            background: rgba(26, 95, 42, 0.05);
          }

          .profile-divider {
            display: none;
          }
        }

        body.menu-open {
          overflow: hidden;
        }
      `}</style>

      <nav className="navbar">
        <div className="navbar-inner">

          <Link
            to="/"
            className="logo"
            onClick={closeMenu}
          >
            <div className="logo-icon">ACI</div>
        
          </Link>

          <ul className={`nav-links ${mobileOpen ? 'open' : ''}`}>

            {/* Public Links - Always Visible */}
            <li>
              <Link 
                to="/" 
                onClick={closeMenu}
                className={isActive('/') ? 'active' : ''}
              >
                <FaHome /> Home
              </Link>
            </li>

            <li>
              <Link 
                to="/about" 
                onClick={closeMenu}
                className={isActive('/about') ? 'active' : ''}
              >
                <FaInfoCircle /> About
              </Link>
            </li>

            <li>
              <Link 
                to="/contact" 
                onClick={closeMenu}
                className={isActive('/contact') ? 'active' : ''}
              >
                <FaEnvelope /> Contact
              </Link>
            </li>

            <li>
              <Link 
                to="/faq" 
                onClick={closeMenu}
                className={isActive('/faq') ? 'active' : ''}
              >
                <FaQuestionCircle /> FAQ
              </Link>
            </li>

            {/* Role-based Links - Hidden when on dashboard */}
            {/* {user?.role === 'admin' && !isOnDashboard() && (
              <li>
                <Link 
                  to="/admin" 
                  onClick={closeMenu}
                  className={isActive('/admin') ? 'active' : ''}
                >
                  Admin
                </Link>
              </li>
            )}

            {user?.role === 'vendor' && !isOnDashboard() && (
              <li>
                <Link 
                  to="/vendor" 
                  onClick={closeMenu}
                  className={isActive('/vendor') ? 'active' : ''}
                >
                  Vendor Portal
                </Link>
              </li>
            )}

            {(user?.role === 'donor' || user?.role === 'corporate') && !isOnDashboard() && (
              <li>
                <Link 
                  to="/dashboard" 
                  onClick={closeMenu}
                  className={isActive('/dashboard') ? 'active' : ''}
                >
                  Dashboard
                </Link>
              </li>
            )} */}

            {/* User Section - Name now opens a dropdown */}
            {user ? (
              <li className="profile-menu-wrapper" ref={profileMenuRef}>
                <button
                  type="button"
                  className={`profile-trigger ${(isOnDashboard() || isActive('/edit-profile')) ? 'active' : ''}`}
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  aria-expanded={profileMenuOpen}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaUser /> {user.name}
                  </span>
                  <FaChevronDown className={`chevron ${profileMenuOpen ? 'open' : ''}`} />
                </button>

                <ul className={`profile-dropdown ${profileMenuOpen ? 'open' : ''}`}>
                  <li>
                    <Link
                      to={getDashboardPath()}
                      onClick={() => { closeProfileMenu(); closeMenu(); }}
                      className={isActive(getDashboardPath()) ? 'active' : ''}
                    >
                      <FaHome /> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/edit-profile"
                      onClick={() => { closeProfileMenu(); closeMenu(); }}
                      className={isActive('/edit-profile') ? 'active' : ''}
                    >
                      <FaUserEdit /> Edit Profile
                    </Link>
                  </li>
                  <li className="profile-divider" />
                  <li>
                    <button
                      type="button"
                      className="logout-btn"
                      onClick={() => {
                        handleLogout();
                        closeProfileMenu();
                        closeMenu();
                      }}
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li>
                <Link
                  to="/donateGateway"
                  className={`nav-cta ${isActive('/donateGateway') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  Get Started
                </Link>
              </li>
            )}
          </ul>

          <button
            className={`mobile-toggle ${
              mobileOpen ? 'open' : ''
            }`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`hamburger-icon ${
                mobileOpen ? 'open' : ''
              }`}
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;