import React, { useState } from 'react';

const faqs = [
  {
    question: 'What is Amanah and Ikhlas Charitable Initiative?',
    answer: 'Amanah and Ikhlas Charitable Initiative is a smart giving e-voucher platform that enables transparent, efficient aid distribution. Donors contribute funds that are converted to digital vouchers, which beneficiaries can redeem at approved vendors.'
  },
  {
    question: 'How do I make a donation?',
    answer: 'Simply create an account, click "Donate", choose a category (zakat, sadaqah, waqf, General Fund), select an amount, and pay securely via Paystack. Your donation is instantly converted to e-vouchers.'
  },
  {
    question: 'What is the difference between Zakat, Sadaqah, and Waqf?',
    answer: 'Zakat is obligatory alms (2.5% of wealth) given to specific categories of needy people. Sadaqah is voluntary charity given at any time and amount. Waqf is a permanent endowment where the principal is preserved and only the returns are used for charitable purposes.'
  },
  {
    question: 'Who can receive aid?',
    answer: 'Anyone in need can apply as a beneficiary. Applications are reviewed and approved by our team. Once approved, beneficiaries receive e-vouchers via SMS or email.'
  },
  {
    question: 'How do vendors get paid?',
    answer: 'Vendors redeem vouchers through our platform. Funds are transferred to their registered bank accounts within 2-3 business days after redemption.'
  },
  {
    question: 'Is my donation tax-deductible?',
    answer: 'This depends on your local tax laws. We provide donation receipts for all contributions, which you can use for tax purposes where applicable.'
  },
  {
    question: 'Can I track my donation?',
    answer: 'Yes! Your dashboard shows exactly when your donation was made, when vouchers were generated, and when they were redeemed by beneficiaries.'
  },
  {
    question: 'What happens to unused vouchers?',
    answer: 'Vouchers expire after 90 days if unused. The remaining value is returned to the donor or redirected to the general fund based on donor preference.'
  },
  {
    question: 'How do I become a vendor?',
    answer: 'Register as a vendor on our platform, submit your business details, and pass our verification process. Once approved, you can start accepting e-vouchers.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

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
        .faq-item {
          background: white;
          border: 1px solid #dfe6e9;
          border-radius: 12px;
          margin-bottom: 1rem;
          overflow: hidden;
        }
        .faq-question {
          padding: 1.5rem;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
          color: #2d3436;
          transition: all 0.3s ease;
        }
        .faq-question:hover {
          background: #f8f9fa;
        }
        .faq-question.active {
          color: #1a5f2a;
        }
        .faq-icon {
          font-size: 1.5rem;
          transition: transform 0.3s ease;
        }
        .faq-icon.open {
          transform: rotate(45deg);
        }
        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, padding 0.3s ease;
        }
        .faq-answer.open {
          max-height: 500px;
          padding: 0 1.5rem 1.5rem;
        }
        .faq-answer p {
          color: #636e72;
          line-height: 1.7;
          margin: 0;
        }
        @media (max-width: 768px) {
          .page-hero h1 { font-size: 2rem; }
        }
      `}</style>

      <section className="page-hero">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about Amanah and Ikhlas Charitable Initiative.</p>
      </section>

      <div className="page-content">
        {faqs.map((faq, i) => (
          <div className="faq-item" key={i}>
            <div 
              className={`faq-question ${openIndex === i ? 'active' : ''}`}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              {faq.question}
              <span className={`faq-icon ${openIndex === i ? 'open' : ''}`}>+</span>
            </div>
            <div className={`faq-answer ${openIndex === i ? 'open' : ''}`}>
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FAQ;