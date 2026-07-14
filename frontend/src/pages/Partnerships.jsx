import React from 'react';

const Partnerships = () => {
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
        .partner-type {
          background: white;
          border: 1px solid #dfe6e9;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 1.5rem;
        }
        .partner-type h3 {
          color: #2d3436;
          margin-bottom: 0.75rem;
        }
        .partner-type p {
          margin-bottom: 0;
        }
        .contact-box {
          background: #f8f9fa;
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
          margin-top: 3rem;
        }
        .contact-box h3 {
          color: #2d3436;
          margin-bottom: 1rem;
        }
        @media (max-width: 768px) {
          .page-hero h1 { font-size: 2rem; }
        }
      `}</style>

      <section className="page-hero">
        <h1>Partnerships</h1>
        <p>Join us in transforming aid distribution across Africa.</p>
      </section>

      <div className="page-content">
        <h2>Why Partner With Us?</h2>
        <p>
          Amanah and Ikhlas Initiative partners with corporations, NGOs, government agencies, and 
          retail networks to create a seamless ecosystem for aid distribution. 
          Together, we can reach more people, more efficiently.
        </p>

        <div className="partner-type">
          <h3>Corporate Partners</h3>
          <p>
            Launch branded CSR campaigns with full transparency. Track every naira 
            from donation to redemption with real-time dashboards and impact reports.
          </p>
        </div>

        <div className="partner-type">
          <h3>NGO & Non-Profit Partners</h3>
          <p>
            Distribute aid digitally without the overhead of physical vouchers or cash. 
            Our platform handles verification, tracking, and reporting automatically.
          </p>
        </div>

        <div className="partner-type">
          <h3>Vendor Partners</h3>
          <p>
            Join our network of approved vendors to accept e-vouchers and grow your 
            customer base while serving your community.
          </p>
        </div>

        <div className="partner-type">
          <h3>Government & Institutional Partners</h3>
          <p>
            Integrate Amanah and Ikhlas Initiative into social welfare programs for transparent, 
            efficient distribution of subsidies and emergency relief.
          </p>
        </div>

        <div className="contact-box">
          <h3>Interested in Partnering?</h3>
          <p>
            Reach out to our partnerships team at <strong>partnerships@Amanah and Ikhlas Initiative.com</strong>
          </p>
        </div>
      </div>
    </>
  );
};

export default Partnerships;