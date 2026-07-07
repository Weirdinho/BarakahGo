import React from 'react';
import { Link } from 'react-router-dom';
import MA from "../images/ma.jpg";
import RM from "../images/rm.jpg";
import MS from "../images/ms.jpg";
import IK from "../images/ik.jpg";
import SS from "../images/ss.jpg";
import AY from "../images/ay.jpg";

const About = () => {
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
        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 2rem;
        }
        .value-card {
          background: #f8f9fa;
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
        }
        .value-card h3 {
          color: #1a5f2a;
          margin-bottom: 0.5rem;
        }
        .value-card p {
          font-size: 0.95rem;
          margin-bottom: 0;
        }
        .team-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 2rem;
        }
        .team-member {
          text-align: center;
        }
        .team-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 3px solid #ddd;
}
        .team-member h4 {
          color: #2d3436;
          margin-bottom: 0.25rem;
        }
        .team-member p {
          color: #636e72;
          font-size: 0.9rem;
          margin-bottom: 0;
        }
        @media (max-width: 768px) {
          .values-grid { grid-template-columns: 1fr; }
          .team-grid { grid-template-columns: repeat(2, 1fr); }
          .page-hero h1 { font-size: 2rem; }
        }
      `}</style>

      <section className="page-hero">
        <h1>About Amanah Charitable and Ikhlas Initiative</h1>
        <p>Smart giving for a better world. We're on a mission to make aid distribution transparent, efficient, and accessible to everyone.</p>
      </section>

      <div className="page-content">
        <h2>Our Story</h2>
        <p>
          Amanah Charitable and Ikhlas Initiative was founded with a simple belief: everyone deserves access to help when they need it most. 
          In a world where billions of dollars in aid go to waste due to inefficiency, corruption, and lack of transparency, 
          we saw an opportunity to do things differently.
        </p>
        <p>
          Our e-voucher platform connects donors directly with beneficiaries through a network of verified vendors, 
          ensuring that every donation reaches its intended destination.
        </p>

        <h2>Our Mission</h2>
        <p>
          To democratize access to aid by leveraging technology to create a transparent, efficient, and dignified 
          giving ecosystem that serves the unbanked and underserved communities across Africa and beyond.
        </p>

        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <h3>Transparency</h3>
            <p>Every donation is traceable from donor to beneficiary. No hidden fees, no lost funds.</p>
          </div>
          <div className="value-card">
            <h3>Dignity</h3>
            <p>Beneficiaries choose what they need, when they need it. Aid with autonomy.</p>
          </div>  
          <div className="value-card">
            <h3>Innovation</h3> 
            <p>Using technology to solve age-old problems in aid distribution.</p>
          </div>
        </div>

        <h2>Our Team</h2>
       <div className="team-grid">

  <div className="team-member">
    <img className="team-avatar" src={MA} alt="Prof Mustapha Abubakar" />
    <h4>Prof Mustapha Abubakar</h4>
    <p>Founder & Chairman</p>
  </div>

  <div className="team-member">
    <img className="team-avatar" src={RM} alt="Engr Ramalan Musa" />
    <h4>Engr Ramalan Musa</h4>
    <p>Deputy Chairman</p>
  </div>

  <div className="team-member">
    <img className="team-avatar" src={MS} alt="Mustapha Sani" />
    <h4>Mustapha Sani</h4>
    <p>Secretary</p>
  </div>

  <div className="team-member">
    <img className="team-avatar" src={IK} alt="Prof Ibrahim Usman Kusfa" />
    <h4>Prof Ibrahim Usman Kusfa</h4>
    <p>BOT member</p>
  </div>

  <div className="team-member">
    <img className="team-avatar" src={SS} alt="Dr Sulaiman D. Sani" />
    <h4>Dr Sulaiman D. Sani</h4>
    <p>Shari'a Advisor</p>
  </div>

  <div className="team-member">
    <img className="team-avatar" src={AY} alt="Alhaji Abbas Yusuf" />
    <h4>Alhaji Abbas Yusuf</h4>
    <p>BOT member</p>
  </div>

</div>

        <h2>Join Us</h2>
        <p>
          Whether you're a donor looking to make an impact, a vendor wanting to serve your community, 
          or an organization seeking a better way to distribute aid, we'd love to hear from you.
        </p>
        <p>
          <Link to="/contact" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
            Get in Touch
          </Link>
        </p>
      </div>
    </>
  );
};

export default About;