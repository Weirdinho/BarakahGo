import React from 'react';

const Privacy = () => {
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
          max-width: 800px;
          margin: 0 auto;
          padding: 60px 2rem;
        }
        .page-content h2 {
          font-size: 1.5rem;
          color: #1a5f2a;
          margin-bottom: 1rem;
          margin-top: 2.5rem;
        }
        .page-content h2:first-child {
          margin-top: 0;
        }
        .page-content p {
          color: #636e72;
          line-height: 1.8;
          margin-bottom: 1rem;
          font-size: 1rem;
        }
        .page-content ul {
          color: #636e72;
          line-height: 1.8;
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .page-content li {
          margin-bottom: 0.5rem;
        }
        .last-updated {
          background: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          font-size: 0.9rem;
          color: #636e72;
        }
        @media (max-width: 768px) {
          .page-hero h1 { font-size: 2rem; }
        }
      `}</style>

      <section className="page-hero">
        <h1>Privacy Policy</h1>
        <p>How we collect, use, and protect your personal information.</p>
      </section>

      <div className="page-content">
        <div className="last-updated">
          <strong>Last Updated:</strong> May 1, 2024
        </div>

        <h2>1. Introduction</h2>
        <p>
          Amanah Charity Foundation ("we," "our," or "us") is committed to protecting your privacy. 
          This Privacy Policy explains how we collect, use, disclose, and safeguard your 
          information when you use our platform.
        </p>

        <h2>2. Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul>
          <li><strong>Personal Information:</strong> Name, email address, phone number, and address</li>
          <li><strong>Payment Information:</strong> Transaction details processed through Paystack</li>
          <li><strong>Usage Data:</strong> How you interact with our platform</li>
          <li><strong>Device Information:</strong> IP address, browser type, and operating system</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Process donations and generate e-vouchers</li>
          <li>Verify vendor and beneficiary identities</li>
          <li>Improve our platform and user experience</li>
          <li>Communicate important updates and notifications</li>
          <li>Comply with legal and regulatory requirements</li>
        </ul>

        <h2>4. Information Sharing</h2>
        <p>
          We do not sell your personal information. We may share data with:
        </p>
        <ul>
          <li>Payment processors (Paystack) to complete transactions</li>
          <li>Verified vendors to process voucher redemptions</li>
          <li>Law enforcement when required by law</li>
        </ul>

        <h2>5. Data Security</h2>
        <p>
          We implement industry-standard security measures including encryption, 
          secure servers, and regular security audits to protect your data.
        </p>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Opt out of marketing communications</li>
        </ul>

        <h2>7. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at 
          privacy@gobarakah.com.
        </p>
      </div>
    </>
  );
};

export default Privacy;