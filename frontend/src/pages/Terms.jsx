import React from 'react';

const Terms = () => {
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
        @media (max-width: 768px) {
          .page-hero h1 { font-size: 2rem; }
        }
      `}</style>

      <section className="page-hero">
        <h1>Terms of Service</h1>
        <p>Please read these terms carefully before using Amanah Charity Foundation.</p>
      </section>

      <div className="page-content">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Amanah Charity Foundation, you agree to be bound by these Terms of Service. 
          If you disagree with any part of the terms, you may not access the service.
        </p>

        <h2>2. Definitions</h2>
        <ul>
          <li><strong>"Platform"</strong> refers to the Amanah Charity Foundation website and services</li>
          <li><strong>"User"</strong> refers to donors, beneficiaries, vendors, and visitors</li>
          <li><strong>"Voucher"</strong> refers to digital aid credits distributed through our platform</li>
          <li><strong>"Vendor"</strong> refers to approved merchants who accept vouchers</li>
        </ul>

        <h2>3. Donor Responsibilities</h2>
        <p>As a donor, you agree to:</p>
        <ul>
          <li>Provide accurate and complete information</li>
          <li>Use legitimate payment methods</li>
          <li>Not use the platform for money laundering or illegal activities</li>
          <li>Understand that donations are generally non-refundable</li>
        </ul>

        <h2>4. Beneficiary Responsibilities</h2>
        <p>As a beneficiary, you agree to:</p>
        <ul>
          <li>Provide truthful information in aid applications</li>
          <li>Use vouchers only for their intended purpose</li>
          <li>Not sell, transfer, or exchange vouchers for cash</li>
          <li>Report lost or stolen vouchers promptly</li>
        </ul>

        <h2>5. Vendor Responsibilities</h2>
        <p>As a vendor, you agree to:</p>
        <ul>
          <li>Maintain accurate business information</li>
          <li>Accept vouchers as full payment for eligible goods/services</li>
          <li>Not discriminate against voucher holders</li>
          <li>Comply with all applicable laws and regulations</li>
        </ul>

        <h2>6. Platform Limitations</h2>
        <p>
          Amanah Charity Foundation is not responsible for:
        </p>
        <ul>
          <li>The quality of goods/services provided by vendors</li>
          <li>Technical issues beyond our reasonable control</li>
          <li>Actions of users that violate these terms</li>
        </ul>

        <h2>7. Termination</h2>
        <p>
          We reserve the right to terminate or suspend access to our service immediately, 
          without prior notice, for conduct that we believe violates these terms.
        </p>

        <h2>8. Changes to Terms</h2>
        <p>
          We may update these terms at any time. Continued use of the platform after changes 
          constitutes acceptance of the new terms.
        </p>

        <h2>9. Contact</h2>
        <p>
          Questions about the Terms of Service should be sent to legal@Amanah Charity Foundation.com.
        </p>
      </div>
    </>
  );
};

export default Terms;