import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Partners from '../components/Partners';

const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      
      
      {/* Get Started CTA Section */}
      <section style={{
        textAlign: 'center',
        padding: '4rem 2rem',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#2d3436',
          marginBottom: '1rem'
        }}>
          Ready to Make a Difference?
        </h2>
        <p style={{
          fontSize: '1.1rem',
          color: '#636e72',
          marginBottom: '2rem',
          maxWidth: '500px',
          margin: '0 auto 2rem'
        }}>
          Join Amanah Charitable and Ikhlas Initiative today and start your journey of giving.
        </p>
        <Link
          to="/donateGateway"
          style={{
            display: 'inline-block',
            background: '#1a5f2a',
            color: 'white',
            padding: '0.85rem 2.5rem',
            borderRadius: '50px',
            fontWeight: '600',
            fontSize: '1.05rem',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(26, 95, 42, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#0f3d1a';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(26, 95, 42, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#1a5f2a';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(26, 95, 42, 0.3)';
          }}
        >
          Get Started
        </Link>
      </section>
      <Partners />
    </>
  );
};

export default Home;