import React from 'react';

const pressReleases = [
  {
    date: 'May 15, 2024',
    title: 'Go Barakah Raises $2M Seed Round to Expand E-Voucher Platform Across Africa',
    source: 'TechCrunch',
    excerpt: 'The Lagos-based fintech startup plans to use the funding to expand its operations to 5 new countries by 2025.'
  },
  {
    date: 'April 3, 2024',
    title: 'How Go Barakah is Revolutionizing Aid Distribution in Nigeria',
    source: 'TechCabal',
    excerpt: 'An in-depth look at how the platform has helped over 50,000 families access food and healthcare vouchers.'
  },
  {
    date: 'March 12, 2024',
    title: 'Go Barakah Partners with AEON BiG to Expand Vendor Network',
    source: 'BusinessDay',
    excerpt: 'The partnership will enable beneficiaries to redeem vouchers at over 50 retail locations nationwide.'
  },
  {
    date: 'February 28, 2024',
    title: 'Founder Ahmad Bello Named in Forbes Africa 30 Under 30',
    source: 'Forbes Africa',
    excerpt: 'Recognition for innovation in fintech and social impact across the continent.'
  }
];

const Press = () => {
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
        .press-kit {
          background: #f8f9fa;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 3rem;
        }
        .press-kit h3 {
          color: #2d3436;
          margin-bottom: 1rem;
        }
        .press-kit-btn {
          background: #1a5f2a;
          color: white;
          border: none;
          padding: 0.875rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          margin-right: 1rem;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }
        .press-kit-btn:hover {
          background: #0f3d1a;
          transform: translateY(-2px);
        }
        .press-release {
          background: white;
          border: 1px solid #dfe6e9;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
        }
        .press-release:hover {
          border-color: #1a5f2a;
          box-shadow: 0 4px 12px rgba(26, 95, 42, 0.08);
        }
        .press-date {
          font-size: 0.85rem;
          color: #636e72;
          margin-bottom: 0.5rem;
        }
        .press-release h3 {
          color: #2d3436;
          margin-bottom: 0.75rem;
          font-size: 1.25rem;
        }
        .press-source {
          display: inline-block;
          background: rgba(26, 95, 42, 0.1);
          color: #1a5f2a;
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        .press-excerpt {
          color: #636e72;
          line-height: 1.7;
          margin-bottom: 1rem;
        }
        .read-more {
          color: #1a5f2a;
          font-weight: 600;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        .read-more:hover {
          text-decoration: underline;
        }
        .media-contact {
          background: #f8f9fa;
          padding: 2rem;
          border-radius: 12px;
          margin-top: 3rem;
        }
        .media-contact h3 {
          color: #2d3436;
          margin-bottom: 1rem;
        }
        @media (max-width: 768px) {
          .page-hero h1 { font-size: 2rem; }
        }
      `}</style>

      <section className="page-hero">
        <h1>Press & Media</h1>
        <p>Latest news, press releases, and media resources about Go Barakah.</p>
      </section>

      <div className="page-content">
        <div className="press-kit">
          <h3>Media Resources</h3>
          <p style={{ marginBottom: '1.5rem' }}>
            Download our brand assets, fact sheet, and founder bios for media use.
          </p>
          <button className="press-kit-btn">Download Press Kit</button>
          <button className="press-kit-btn">Brand Guidelines</button>
          <button className="press-kit-btn">Founder Bios</button>
        </div>

        <h2>Latest News</h2>
        {pressReleases.map((item, i) => (
          <div className="press-release" key={i}>
            <div className="press-date">{item.date}</div>
            <span className="press-source">{item.source}</span>
            <h3>{item.title}</h3>
            <p className="press-excerpt">{item.excerpt}</p>
            <a href="#" className="read-more">Read Full Story →</a>
          </div>
        ))}

        <div className="media-contact">
          <h3>Media Inquiries</h3>
          <p>
            For press inquiries, interview requests, or speaking opportunities, 
            please contact our communications team at <strong>press@gobarakah.com</strong>.
          </p>
        </div>
      </div>
    </>
  );
};

export default Press;