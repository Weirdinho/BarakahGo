import React from 'react';
import { FaDonate, FaCreditCard, FaQrcode, FaStore } from 'react-icons/fa';

const steps = [
  {
    number: 1,
    title: 'Choose & Donate',
    description: 'Select a category and amount. Pay securely via Paystack.',
    icon: <FaDonate />
  },
  {
    number: 2,
    title: 'E-Voucher Generated',
    description: 'System generates unique e-vouchers with QR codes.',
    icon: <FaCreditCard />
  },
  {
    number: 3,
    title: 'Beneficiary Receives',
    description: 'Vouchers sent to beneficiaries via SMS or email.',
    icon: <FaQrcode />
  },
  {
    number: 4,
    title: 'Redeem at Vendor',
    description: 'Beneficiary visits nearest approved vendor and redeems.',
    icon: <FaStore />
  }
];

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <div className="section-header">
        <h2>How It Works</h2>
        <p>Simple, transparent, and effective aid distribution in 4 easy steps</p>
      </div>
      <div className="steps-grid">
        {steps.map((step, index) => (
          <div className="step-card" key={index}>
            <div className="step-number">{step.number}</div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;