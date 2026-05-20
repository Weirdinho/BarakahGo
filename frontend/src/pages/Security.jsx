import React from 'react';

const Security = () => {
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
        .page-content {
          max-width: 900px;
          margin: 0 auto;
          padding: 60px 2rem;
        }
        .page-content h2 {
          font-size: 2rem;
          color: #1a5f2a;
          margin-bottom: 1.5rem;
          margin-top: 3rem;
        }
        .page-content h2:first-child {
          margin-top: 0;
        }
        .page-content p {
          color: #636e72;
          line-height: 1.8;
          margin-bottom: 1.5rem;
          font-size: 1.05rem;
        }
        .security-card {
          background: white;
          border: 1px solid #dfe6e9;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 1.5rem;
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }
        .security-icon {
          width: 60px;
          height: 60px;
          background: rgba(26, 95, 42, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: #1a5f2a;
          flex-shrink: 0;
        }
        .security-card h3 {
          color: #2d3436;
          margin-bottom: 0.5rem;
        }
        .security-card p {
          margin-bottom: 0;
          font-size: 0.95rem;
        }
        .report-section {
          background: #f8f9fa;
          padding: 2.5rem;
          border-radius: 16px;
          text-align: center;
          margin-top: 3rem;
        }
        .report-section h2 {
          margin-top: 0;
        }
        .report-btn {
          background: #1a5f2a;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1rem;
          transition: all 0.3s ease;
        }
        .report-btn:hover {
          background: #0f3d1a;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .security-card { flex-direction: column; }
          .page-hero h1 { font-size: 2rem; }
        }
      `}</style>

      <section className="page-hero">
        <h1>Security</h1>
        <p>How we protect your data, transactions, and trust.</p>
      </section>

      <div className="page-content">
        <h2>Our Security Commitment</h2>
        <p>
          Security is at the core of everything we do at Go Barakah. We employ 
          industry-leading practices to ensure your data and transactions are protected.
        </p>

        <div className="security-card">
          <div className="security-icon">🔒</div>
          <div>
            <h3>End-to-End Encryption</h3>
            <p>
              All data transmitted between your device and our servers is encrypted using 
              TLS 1.3. Sensitive information is encrypted at rest using AES-256.
            </p>
          </div>
        </div>

        <div className="security-card">
          <div className="security-icon">💳</div>
          <div>
            <h3>Secure Payments</h3>
            <p>
              All payments are processed through Paystack, a PCI-DSS Level 1 certified 
              payment processor. We never store your full card details on our servers.
            </p>
          </div>
        </div>

        <div className="security-card">
          <div className="security-icon">🛡️</div>
          <div>
            <h3>Fraud Prevention</h3>
            <p>
              Our systems monitor transactions in real-time for suspicious activity. 
              Unusual patterns trigger automatic review and potential account holds.
            </p>
          </div>
        </div>

        <div className="security-card">
          <div className="security-icon">🔐</div>
          <div>
            <h3>Multi-Factor Authentication</h3>
            <p>
              We support and encourage MFA for all account types. Admin and vendor 
              accounts require MFA by default.
            </p>
          </div>
        </div>

        <div className="security-card">
          <div className="security-icon">📋</div>
          <div>
            <h3>Regular Audits</h3>
            <p>
              We conduct quarterly security audits and penetration testing by 
              independent third-party firms to identify and address vulnerabilities.
            </p>
          </div>
        </div>

        <div className="report-section">
          <h2>Report a Security Issue</h2>
          <p>
            Found a vulnerability? We appreciate responsible disclosure. 
            Contact our security team and we'll respond within 24 hours.
          </p>
          <button className="report-btn">security@gobarakah.com</button>
        </div>
      </div>
    </>
  );
};

export default Security;