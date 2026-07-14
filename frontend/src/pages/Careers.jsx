import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaDonate, FaCreditCard, FaQrcode, FaStore, 
  FaUserCheck, FaChartLine, FaShieldAlt, FaHandshake,
  FaArrowRight, FaCheckCircle
} from 'react-icons/fa';

const steps = [
  {
    number: '01',
    title: 'Choose & Donate',
    description: 'Select a cause close to your heart — zakat, sadaqah, waqf. Enter your donation amount and pay securely via Paystack. Every donation is tracked from the moment it leaves your account.',
    icon: <FaDonate />,
    color: '#1a5f2a',
    details: [
      'Browse categories: Zakat, Sadaqah, Waqf, General Fund',
      'Select preset amounts or enter a custom donation',
      'Pay with card, bank transfer, or USSD via Paystack',
      'Receive instant confirmation and tax-deductible receipt'
    ]
  },
  {
    number: '02',
    title: 'E-Voucher Generated',
    description: 'Our system instantly converts your donation into unique, secure e-vouchers. Each voucher has a QR code and alphanumeric code, making it impossible to counterfeit or duplicate.',
    icon: <FaCreditCard />,
    color: '#2d8a3e',
    details: [
      'Unique voucher codes generated with cryptographic security',
      'QR codes for quick scanning at vendor locations',
      'Vouchers tied to specific categories (zakat, sadaqah, etc.)',
      '90-day expiry with automatic renewal options'
    ]
  },
  {
    number: '03',
    title: 'Beneficiary Receives',
    description: 'Approved beneficiaries receive vouchers via SMS or email. No bank account required — making aid accessible to the unbanked and underserved communities.',
    icon: <FaQrcode />,
    color: '#f4a261',
    details: [
      'SMS delivery to any mobile phone',
      'Email delivery with printable voucher',
      'No smartphone or bank account needed',
      'Beneficiaries can check balance anytime'
    ]
  },
  {
    number: '04',
    title: 'Redeem at Vendor',
    description: 'Beneficiaries visit any approved vendor near them, present their voucher (QR code or code), and receive goods or services instantly. Vendors get paid within 2-3 business days.',
    icon: <FaStore />,
    color: '#e76f51',
    details: [
      'Find nearest vendor via in-app locator',
      'Show QR code or enter voucher code',
      'Vendor verifies and processes redemption',
      'Beneficiary receives goods/services immediately'
    ]
  }
];

const features = [
  {
    icon: <FaUserCheck />,
    title: 'For Donors',
    points: [
      'Track every naira from donation to redemption',
      'Choose exactly where your money goes — zakat, sadaqah, waqf, and more',
      'Receive impact reports and success stories',
      'Option to donate anonymously'
    ]
  },
  {
    icon: <FaChartLine />,
    title: 'For Beneficiaries',
    points: [
      'Apply for aid online or via SMS',
      'Receive vouchers without a bank account',
      'Choose nearest vendor for convenience',
      'Dignity of choice — pick what you need'
    ]
  },
  {
    icon: <FaShieldAlt />,
    title: 'For Vendors',
    points: [
      'Join verified network to grow customer base',
      'Get paid directly to your bank account',
      'Simple QR code scanning for redemptions',
      'Real-time dashboard of all transactions'
    ]
  },
  {
    icon: <FaHandshake />,
    title: 'For Partners',
    points: [
      'Launch branded CSR campaigns',
      'Full transparency and audit trails',
      'API integration for bulk operations',
      'Custom reporting and analytics'
    ]
  }
];

const HowItWorksPage = () => {
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
          max-width: 1100px;
          margin: 0 auto;
          padding: 60px 2rem;
        }
        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .section-header h2 {
          font-size: 2rem;
          color: #1a5f2a;
          margin-bottom: 0.5rem;
        }
        .section-header p {
          color: #636e72;
        }
        .step-card {
          display: flex;
          grid-template-columns: 80px 1fr;
          gap: 2rem;
          background: white;
          border: 1px solid #dfe6e9;
          border-radius: 16px;
          padding: 2.5rem;
          margin-bottom: 2rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .step-card:hover {
          border-color: #1a5f2a;
          box-shadow: 0 10px 40px rgba(26, 95, 42, 0.1);
          transform: translateY(-3px);
        }
        .step-number {
          font-size: 3rem;
          font-weight: 800;
          color: rgba(26, 95, 42, 0.1);
          line-height: 1;
          display:none;
        }
        .step-icon {
          width: 50px;
          height: 50px;
          
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          color: white;
          margin-bottom: 1rem;
        }
        .step-content h3 {
          font-size: 1.4rem;
          color: #2d3436;
          margin-bottom: 0.75rem;
        }
          .step-content{
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .step-content p {
          color: #636e72;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }
        .step-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #636e72;
          font-size: 0.9rem;
        }
        .detail-icon {
          color: #1a5f2a;
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          margin-top: 2rem;
        }
        .feature-card {
          background: #f8f9fa;
          border-radius: 16px;
          padding: 2rem;
        }
        .feature-card h3 {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #1a5f2a;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }
        .feature-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .feature-card li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #636e72;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }
        .cta-section {
          background: linear-gradient(135deg, #1a5f2a 0%, #2d8a3e 100%);
          border-radius: 16px;
          padding: 3rem;
          text-align: center;
          color: white;
          margin-top: 3rem;
        }
        .cta-section h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        .cta-section p {
          opacity: 0.9;
          margin-bottom: 1.5rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }
        .cta-btn {
          background: white;
          color: #1a5f2a;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }
        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        @media (max-width: 768px) {
          .step-card { grid-template-columns: 1fr; }
          .features-grid { grid-template-columns: 1fr; }
          .page-hero h1 { font-size: 2rem; }
        }
      `}</style>

      <section className="page-hero">
        <h1>How Amanah and Ikhlas Initiative Works</h1>
        <p>From your generous donation to a beneficiary's essential needs — see the journey every contribution takes.</p>
      </section>

      <div className="page-content">
        <div className="section-header">
          <h2>The Journey of a Donation</h2>
          <p>Four simple steps that create lasting impact</p>
        </div>

        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <div className="step-card">
              <div>
                <div className="step-number">{step.number}</div>
              </div>
              <div className="step-content">
                <div 
                  className="step-icon" 
                  style={{ background:"#1a5f2a" }}
                >
                  {step.icon}
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <div className="step-details">
                  {step.details.map((detail, j) => (
                    <div className="detail-item" key={j}>
                      <FaCheckCircle className="detail-icon" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
           
          </React.Fragment>
        ))}

        <div className="section-header" style={{ marginTop: '4rem' }}>
          <h2>Built for Everyone</h2>
          <p>How different users benefit from our platform</p>
        </div>

        <div className="features-grid">
          {features.map((feature, i) => (
            <div className="feature-card" key={i}>
              <h3>{feature.icon} {feature.title}</h3>
              <ul>
                {feature.points.map((point, j) => (
                  <li key={j}>
                    <FaCheckCircle style={{ color: '#1a5f2a', fontSize: '0.75rem' }} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="cta-section">
          <h2>Ready to Make a Difference?</h2>
          <p>Join thousands of donors who are changing lives through smart giving.</p>
          <Link to="/donateGateway" className="cta-btn">
            Start Giving Now <FaArrowRight />
          </Link>
        </div>
      </div>
    </>
  );
};

export default HowItWorksPage;