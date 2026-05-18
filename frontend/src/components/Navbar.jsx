import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => setMobileOpen(false);

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
          align-items: center;
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

        .user-name {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #2d3436;
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
        }

        .logout-btn:hover {
          color: #c0392b;
          transform: translateX(2px);
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
          .nav-links.open li:nth-child(1) {
            transition-delay: 0.05s;
          }

          .nav-links.open li:nth-child(2) {
            transition-delay: 0.1s;
          }

          .nav-links.open li:nth-child(3) {
            transition-delay: 0.15s;
          }

          .nav-links.open li:nth-child(4) {
            transition-delay: 0.2s;
          }

          .nav-links.open li:nth-child(5) {
            transition-delay: 0.25s;
          }

          .nav-links.open li:nth-child(6) {
            transition-delay: 0.3s;
          }

          .nav-links.open li:nth-child(7) {
            transition-delay: 0.35s;
          }

          .nav-links.open li:nth-child(8) {
            transition-delay: 0.4s;
          }

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

          .nav-cta {
            text-align: center;
            margin-top: 1rem;
          }

          .user-name {
            padding: 1rem 0;
            font-size: 1rem;
            border-bottom: 1px solid #f1f5f9;
            color: #1a5f2a;
            font-weight: 600;
          }

          .logout-btn {
            padding: 1rem 0;
            font-size: 1.1rem;
            width: 100%;
            justify-content: flex-start;
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
            <div className="logo-icon">GB</div>
            GO BARAKAH
          </Link>

          <ul className={`nav-links ${mobileOpen ? 'open' : ''}`}>

            <li>
              <Link to="/" onClick={closeMenu}>
                Home
              </Link>
            </li>

            {user && (
              <>
                <li>
                  <Link to="/donate" onClick={closeMenu}>
                    Donate
                  </Link>
                </li>

                <li>
                  <Link to="/vendors" onClick={closeMenu}>
                    Vendors
                  </Link>
                </li>

                {user.role === 'admin' && (
                  <li>
                    <Link to="/admin" onClick={closeMenu}>
                      Admin
                    </Link>
                  </li>
                )}

                {user.role === 'beneficiary' && (
                  <li>
                    <Link to="/beneficiary" onClick={closeMenu}>
                      My Aid
                    </Link>
                  </li>
                )}

                {user.role === 'vendor' && (
                  <li>
                    <Link to="/vendor" onClick={closeMenu}>
                      Vendor Portal
                    </Link>
                  </li>
                )}

                {(user.role === 'donor' ||
                  user.role === 'corporate') && (
                  <li>
                    <Link to="/dashboard" onClick={closeMenu}>
                      Dashboard
                    </Link>
                  </li>
                )}
              </>
            )}

            {user ? (
              <>
                <li>
                  <span className="user-name">
                    <FaUser /> {user.name}
                  </span>
                </li>

                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="logout-btn"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="nav-cta"
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