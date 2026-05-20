import React from 'react';

const Compliance = () => {
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
        .compliance-card {
          background: white;
          border: 1px solid #dfe6e9;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 1.5rem;
        }
        .compliance-card h3 {
          color: #2d3436;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .compliance-card p {
          margin-bottom: 0;
        }
        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .status-badge.compliant {
          background: #dcfce7;
          color: #166534;
        }
        .cert-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .cert-card {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 12px;
          text-align: center;
        }
        .cert-card h4 {
          color: #1a5f2a;
          margin-bottom: 0.5rem;
        }
        .cert-card p {
          font-size: 0.9rem;
          margin-bottom: 0;
        }
        @media (max-width: 768px) {
          .cert-grid { grid-template-columns: 1fr; }
          .page-hero h1 { font-size: 2rem; }
        }
      `}</style>

      <section className="page-hero">
        <h1>Compliance</h1>
        <p>Our commitment to regulatory standards and ethical operations.</p>
      </section>

      <div className="page-content">
        <h2>Regulatory Framework</h2>
        <p>
          Go Barakah operates in full compliance with Nigerian financial regulations 
          and international standards for fintech and charitable operations.
        </p>

        <div className="compliance-card">
          <h3>
            <span className="status-badge compliant">Compliant</span>
            Central Bank of Nigeria (CBN)
          </h3>
          <p>
            Registered as a payment solution service provider. All fund movements 
            comply with CBN guidelines for electronic payments and mobile money.
          </p>
        </div>

        <div className="compliance-card">
          <h3>
            <span className="status-badge compliant">Compliant</span>
            Anti-Money Laundering (AML)
          </h3>
          <p>
            We implement Know Your Customer (KYC) verification for all users, 
            transaction monitoring, and suspicious activity reporting as required 
            by the Money Laundering (Prohibition) Act.
          </p>
        </div>

        <div className="compliance-card">
          <h3>
            <span className="status-badge compliant">Compliant</span>
            Data Protection (NDPR)
          </h3>
          <p>
            Fully compliant with the Nigeria Data Protection Regulation. We maintain 
            a Data Protection Officer and conduct regular privacy impact assessments.
          </p>
        </div>

        <div className="compliance-card">
          <h3>
            <span className="status-badge compliant">Compliant</span>
            Counter-Terrorism Financing (CTF)
          </h3>
          <p>
            Our platform includes screening against international sanctions lists and 
            terrorist financing watchlists. Suspicious transactions are reported to 
            the Nigerian Financial Intelligence Unit (NFIU).
          </p>
        </div>

        <h2>Certifications & Partnerships</h2>
        <div className="cert-grid">
          <div className="cert-card">
            <h4>PCI-DSS</h4>
            <p>Payment Card Industry Data Security Standard compliance through Paystack.</p>
          </div>
          <div className="cert-card">
            <h4>ISO 27001</h4>
            <p>Information Security Management certification in progress.</p>
          </div>
          <div className="cert-card">
            <h4>SOC 2 Type II</h4>
            <p>Service Organization Control audit scheduled for Q3 2024.</p>
          </div>
        </div>

        <h2>Audit Reports</h2>
        <p>
          Annual audit reports are available upon request for partners and regulators. 
          Contact compliance@gobarakah.com for more information.
        </p>
      </div>
    </>
  );
};

export default Compliance;