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
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#press">Press</a></li>
          </ul>
        </div>
        <div className="footer-links">
          <h4>Legal</h4>
          <ul>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#security">Security</a></li>
            <li><a href="#compliance">Compliance</a></li>
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