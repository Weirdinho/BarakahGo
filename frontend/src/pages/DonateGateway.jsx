// src/pages/DonateGateway.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaUserSecret, FaHandHoldingHeart } from 'react-icons/fa';

const DonateGateway = () => {
  return (
    <>
      <style>{`
        .gateway-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .gateway-card {
          background: white;
          border-radius: 20px;
          padding: 3rem 2.5rem;
          max-width: 480px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
          border: 1px solid #dfe6e9;
        }

        .gateway-icon {
          width: 70px;
          height: 70px;
          background: #1a5f2a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: white;
          font-size: 1.8rem;
        }

        .gateway-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #2d3436;
          margin-bottom: 0.5rem;
        }

        .gateway-subtitle {
          font-size: 1rem;
          color: #636e72;
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }

        .gateway-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .gateway-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          border: 2px solid transparent;
        }

        .gateway-btn-primary {
          background: #1a5f2a;
          color: white;
          border-color: #1a5f2a;
        }

        .gateway-btn-primary:hover {
          background: #0f3d1a;
          border-color: #0f3d1a;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(26, 95, 42, 0.25);
        }

        .gateway-btn-secondary {
          background: white;
          color: #2d3436;
          border-color: #dfe6e9;
        }

        .gateway-btn-secondary:hover {
          border-color: #1a5f2a;
          color: #1a5f2a;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
        }

        .gateway-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.5rem 0;
          color: #b2bec3;
          font-size: 0.9rem;
        }

        .gateway-divider::before,
        .gateway-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #dfe6e9;
        }

        .gateway-footer {
          margin-top: 2rem;
          font-size: 0.9rem;
          color: #636e72;
        }

        .gateway-footer a {
          color: #1a5f2a;
          font-weight: 600;
          text-decoration: none;
        }

        .gateway-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .gateway-card {
            padding: 2rem 1.5rem;
          }
          
          .gateway-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="gateway-container">
        <div className="gateway-card">
          <div className="gateway-icon">
            <FaHandHoldingHeart />
          </div>
          
          <h1 className="gateway-title">Make a Donation</h1>
          <p className="gateway-subtitle">
            Choose how you'd like to proceed with your contribution to Amanah and Ikhlas Charitable Initiative.
          </p>

          <div className="gateway-options">
            <Link to="/login" className="gateway-btn gateway-btn-primary">
              <FaUser /> Log In to Donate
            </Link>

            <div className="gateway-divider">or</div>

            <Link to="/donateGateway/guest" className="gateway-btn gateway-btn-secondary">
              <FaUserSecret /> Donate as Guest
            </Link>
          </div>

          <p className="gateway-footer">
            Don't have an account?{' '}
            <Link to="/login">Create one</Link> to track your donations.
          </p>
        </div>
      </div>
    </>
  );
};

export default DonateGateway;