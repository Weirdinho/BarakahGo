import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <>
      <style>{`
        .footer {
          background: #1a1a2e;
          color: #ffffff;
          padding: 60px 2rem 30px;
        }
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
        }
        .footer-brand h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #ffffff;
        }
        .footer-brand p {
          color: rgba(255,255,255,0.7);
          font-size: 0.9rem;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }
        .footer-links h4 {
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          color: #f4a261;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 700;
        }
        .footer-links ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .footer-links li {
          margin-bottom: 0.75rem;
        }
        .footer-links a {
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          display: block;
        }
        .footer-links a:hover {
          color: #f4a261;
          padding-left: 4px;
        }
        .footer-bottom {
          max-width: 1200px;
          margin: 0 auto;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .footer-bottom p {
          color: rgba(255,255,255,0.5);
          font-size: 0.85rem;
        }
        .social-links {
          display: flex;
          gap: 1rem;
        }
        .social-links a {
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .social-links a:hover {
          background: #1a5f2a;
          transform: translateY(-3px);
        }
        @media (max-width: 768px) {
          .footer-inner {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <h3>Amanah and Ikhlas Charitable Initiative</h3>
            <p>
              Smart Giving E-Voucher Platform. Experience a smarter, targeted way of giving.
              Aid access for everyone, even the unbanked and underserved.
            </p>
            <div className="social-links">
              <a href="#facebook"><FaFacebookF /></a>
              <a href="#twitter"><FaTwitter /></a>
              <a href="#linkedin"><FaLinkedinIn /></a>
              <a href="#instagram"><FaInstagram /></a>
            </div>
          </div>

          <div className="footer-links">
            <h4>About Us</h4>
            <ul>
              <li><Link to="/about">Amanah and Ikhlas Charitable Initiative-Smart Giving</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/partnerships">Partnerships</Link></li>
              <li><a href="https://prof-mustapha-abubakar-e-library.netlify.app">Waqf Link</a></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Links</h4>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">PDPA/Privacy Notice</Link></li>
              <li><Link to="/press">Events/Media</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Amanah and Ikhlas Charitable Initiative. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;