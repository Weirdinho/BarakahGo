import React from 'react';

const openings = [
  {
    title: 'Senior Full-Stack Developer',
    department: 'Engineering',
    location: 'Lagos, Nigeria (Remote)',
    type: 'Full-time'
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Lagos, Nigeria (Remote)',
    type: 'Full-time'
  },
  {
    title: 'Partnerships Manager',
    department: 'Business Development',
    location: 'Lagos, Nigeria',
    type: 'Full-time'
  },
  {
    title: 'Customer Success Specialist',
    department: 'Operations',
    location: 'Remote',
    type: 'Full-time'
  },
  {
    title: 'Data Analyst',
    department: 'Engineering',
    location: 'Remote',
    type: 'Contract'
  }
];

const Careers = () => {
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
        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin: 2rem 0;
        }
        .benefit-card {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 12px;
        }
        .benefit-card h4 {
          color: #1a5f2a;
          margin-bottom: 0.5rem;
        }
        .benefit-card p {
          font-size: 0.9rem;
          margin-bottom: 0;
        }
        .job-listing {
          background: white;
          border: 1px solid #dfe6e9;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }
        .job-listing:hover {
          border-color: #1a5f2a;
          box-shadow: 0 4px 12px rgba(26, 95, 42, 0.1);
        }
        .job-info h3 {
          color: #2d3436;
          margin-bottom: 0.5rem;
        }
        .job-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          color: #636e72;
        }
        .job-meta span {
          background: #f8f9fa;
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
        }
        .apply-btn {
          background: #1a5f2a;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .apply-btn:hover {
          background: #0f3d1a;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .benefits-grid { grid-template-columns: 1fr; }
          .job-listing { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .page-hero h1 { font-size: 2rem; }
        }
      `}</style>

      <section className="page-hero">
        <h1>Careers at Amanah Charity Foundation</h1>
        <p>Join us in building technology that makes a real difference in people's lives.</p>
      </section>

      <div className="page-content">
        <h2>Why Work With Us?</h2>
        <p>
          At Amanah Charity Foundation, we're not just building software — we're building a movement. 
          Every line of code, every design decision, and every partnership we forge 
          directly impacts communities in need across Africa.
        </p>

        <div className="benefits-grid">
          <div className="benefit-card">
            <h4>Meaningful Impact</h4>
            <p>Your work directly helps people access food, Sadaqat, and healthcare.</p>
          </div>
          <div className="benefit-card">
            <h4>Remote First</h4>
            <p>Work from anywhere. We believe great talent isn't bound by location.</p>
          </div>
          <div className="benefit-card">
            <h4>Growth & Learning</h4>
            <p>Annual learning budget, mentorship, and clear career progression paths.</p>
          </div>
          <div className="benefit-card">
            <h4>Health & Wellness</h4>
            <p>Comprehensive health insurance and mental health support.</p>
          </div>
          <div className="benefit-card">
            <h4>Competitive Pay</h4>
            <p>Salary benchmarks against global standards, not just local markets.</p>
          </div>
          <div className="benefit-card">
            <h4>Flexible Time Off</h4>
            <p>Unlimited PTO policy. We trust you to manage your time.</p>
          </div>
        </div>

        <h2>Open Positions</h2>
        {openings.map((job, i) => (
          <div className="job-listing" key={i}>
            <div className="job-info">
              <h3>{job.title}</h3>
              <div className="job-meta">
                <span>{job.department}</span>
                <span>{job.location}</span>
                <span>{job.type}</span>
              </div>
            </div>
            <button className="apply-btn">Apply Now</button>
          </div>
        ))}

        <h2>Don't See Your Role?</h2>
        <p>
          We're always looking for exceptional talent. Send your resume and a note about 
          what you'd like to work on to careers@Amanah Charity Foundation.com.
        </p>
      </div>
    </>
  );
};

export default Careers;