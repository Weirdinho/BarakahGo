import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>GO BARAKAH</h3>
          <p>
            Smart Giving E-Voucher Platform. Experience a smarter, targeted way of giving.
            Aid access for everyone, even the unbanked and underserved.
          </p>
        </div>
        <div className="footer-links">
          <h4>Platform</h4>
          <ul>
            <li><Link to="/donate">Donate</Link></li>
            <li><Link to="/vendors">Find Vendors</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/login">Get Started</Link></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/press">Press</Link></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/security">Security</Link></li>
            <li><Link to="/compliance">Compliance</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 Go Barakah. All rights reserved.</p>
        <div className="social-links">
          <a href="#facebook"><FaFacebookF /></a>
          <a href="#twitter"><FaTwitter /></a>
          <a href="#linkedin"><FaLinkedinIn /></a>
          <a href="#instagram"><FaInstagram /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;