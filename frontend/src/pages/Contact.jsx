import React, { useState } from 'react';
import api from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    subject: 'General Inquiry', 
    message: '' 
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');

    try {
      const response = await api.post('/contact', formData);

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('❌ Error:', err.message);
      console.error('❌ Status:', err.response?.status);
      console.error('❌ Data:', err.response?.data);
      console.error('❌ URL:', err.config?.url);
      console.error('❌ BaseURL:', err.config?.baseURL);
      
      // Better error message for 404
      if (err.response?.status === 404) {
        setError('Server route not found. Please check backend deployment.');
      } else {
        setError(err.response?.data?.message || 'Failed to send message. Please try again.');
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <style>{`
        .page-hero {
          padding: 120px 2rem 60px;
          background: linear-gradient(135deg, #1a5f2a 0%, #0f3d1a 100%);
          color: white;
          text-align: center;
        }
        .page-hero h1 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }
        .page-hero p {
          font-size: 1.2rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }
        .contact-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 60px 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
        }
        .contact-info h2 {
          font-size: 2rem;
          color: #1a5f2a;
          margin-bottom: 1.5rem;
        }
        .contact-info p {
          color: #636e72;
          line-height: 1.8;
          margin-bottom: 2rem;
        }
        .contact-detail {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .contact-detail h4 {
          color: #2d3436;
          margin-bottom: 0.25rem;
        }
        .contact-detail p {
          color: #636e72;
          margin-bottom: 0;
          font-size: 0.95rem;
        }
        .contact-form {
          background: #f8f9fa;
          padding: 2.5rem;
          border-radius: 16px;
        }
        .contact-form h2 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: #2d3436;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: #2d3436;
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #dfe6e9;
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
          transition: all 0.3s ease;
          background: white;
        }
        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #1a5f2a;
        }
        .success-message {
          background: #dcfce7;
          color: #166534;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }
        .error-message {
          background: #fee2e2;
          color: #991b1b;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }
        .submit-btn {
          width: 100%;
          padding: 0.875rem;
          background: #1a5f2a;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .submit-btn:hover:not(:disabled) {
          background: #145022;
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .icon {
          font-size: 1.25rem;
          min-width: 24px;
          text-align: center;
        }
        @media (max-width: 768px) {
          .contact-container { grid-template-columns: 1fr; gap: 2rem; }
          .page-hero h1 { font-size: 2rem; }
        }
      `}</style>

      <section className="page-hero">
        <h1>Contact Us</h1>
        <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </section>

      <div className="contact-container">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>
            Whether you're a donor, beneficiary, vendor, or partner, our team is here to help. 
            Reach out through any of the channels below.
          </p>

          <div className="contact-detail">
            <span className="icon">📧</span>
            <div>
              <h4>Email</h4>
              <p>amanahcharity822@gmail.com</p>
            </div>
          </div>

          <div className="contact-detail">
            <span className="icon">📞</span>
            <div>
              <h4>Phone</h4>
              <p>+234 806 542 8153</p>
              <p>+234 703 817 7123</p>
            </div>
          </div>

          <div className="contact-detail">
            <span className="icon">📍</span>
            <div>
              <h4>Address</h4>
              <p>No 120 Abdu Road Kaura Zaria City Kaduna</p>
            </div>
          </div>

          <div className="contact-detail">
            <span className="icon">🕐</span>
            <div>
              <h4>Office Hours</h4>
              <p>Monday - Friday: 9:00 AM - 6:00 PM WAT</p>
              <p>Saturday: 10:00 AM - 2:00 PM WAT</p>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <h2>Send a Message</h2>
          
          {submitted && (
            <div className="success-message">
              Thank you! Your message has been sent successfully.
            </div>
          )}
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input 
                type="text" 
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <select 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              >
                <option>General Inquiry</option>
                <option>Donation Support</option>
                <option>Vendor Application</option>
                <option>Partnership</option>
                <option>Technical Issue</option>
              </select>
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea 
                rows="5" 
                placeholder="How can we help you?"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
              />
            </div>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={sending}
            >
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Contact;
