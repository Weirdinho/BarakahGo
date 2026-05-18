import React from 'react';
import { FaShieldAlt, FaHandHoldingHeart, FaUsers, FaChartLine, FaMobileAlt, FaGlobe } from 'react-icons/fa';

const features = [
  {
    icon: <FaShieldAlt />,
    title: 'Transparency & Traceability',
    description: 'Our robust, end-to-end mechanics ensure every donation is verifiable and traceable to the last cent, preventing misuse of funds.'
  },
  {
    icon: <FaHandHoldingHeart />,
    title: 'Choice & Dignity',
    description: 'Gobarakah matches donor intent with beneficiary needs with our vendor network, preventing waste of donations while giving purposeful choice.'
  },
  {
    icon: <FaShieldAlt />,
    title: 'Security',
    description: 'Your donations won\'t be diverted to support activities that risk you as a donor (money laundering, terrorist financing, misuse of data).'
  },
  {
    icon: <FaUsers />,
    title: 'Collaborative Platform',
    description: 'The public, corporates, and charitable organizations use Gobarakah to manage their donations and aid programmes in real time.'
  },
  {
    icon: <FaMobileAlt />,
    title: 'E-Voucher Technology',
    description: 'Our e-voucher tech enables secure yet economical distribution. Not linked to a specific vendor — beneficiaries choose the nearest registered one.'
  },
  {
    icon: <FaGlobe />,
    title: 'Unbanked Access',
    description: 'Even those without bank accounts can receive and redeem aid through our vendor network and QR code system.'
  }
];

const Features = () => {
  return (
    <section className="features">
      <div className="section-header">
        <h2>Why Choose Gobarakah?</h2>
        <p>
          Whether food, education, or financial support, give smart with Gobarakah!
          Corporate giving with your own branded aid e-vouchers? Talk to us!
        </p>
      </div>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;