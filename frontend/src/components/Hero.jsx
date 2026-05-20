import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaPlay } from 'react-icons/fa';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-content">
          <h1>
            Experience a smarter, <span>targeted way</span> of giving!
          </h1>
          <p>
            Aid access for everyone, even the unbanked and underserved. 
            Amanah Charity Foundation sends your donations as e-vouchers to ensure that even 
            the unbanked can access aid.
          </p>
          <div className="hero-btns">
            <Link to="/donate" className="btn btn-primary">
              Start Giving <FaArrowRight />
            </Link>
            <Link to="/how-it-works" className="btn btn-secondary">
              <FaPlay /> How It Works
            </Link>
          </div>
        </div>

        <div className="hero-phones">
          <div className="phone-mockup">
            <div className="phone-screen">
              <div className="phone-header">
                <h4>Amanah Charity Foundation</h4>
              </div>
              <div className="phone-body">
                <div className="phone-card">
                  <h5>NOURISH NIGERIA</h5>
                  <div className="amount">₦ 5000</div>
                  <p style={{fontSize:'0.75rem', color:'var(--text-light)', marginTop:'0.5rem'}}>
                    Nutritional Food Programme for B40 Primary School Students
                  </p>
                </div>
                <button className="phone-btn">Donate Now</button>
              </div>
            </div>
          </div>
          <div className="phone-mockup">
            <div className="phone-screen">
              <div className="phone-header">
                <h4>Select Voucher Type</h4>
              </div>
              <div className="phone-body">
                <div className="phone-card">
                  <h5>Categories</h5>
                  <p style={{fontSize:'0.8rem', marginTop:'0.5rem'}}>🍎 Supermarket/Grocery</p>
                  <p style={{fontSize:'0.8rem'}}>💰 Cash</p>
                </div>
                <button className="phone-btn">Show Locations</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;