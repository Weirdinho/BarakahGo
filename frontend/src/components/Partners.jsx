import React from 'react';

const Partners = () => {
  return (
    <section className="partners">
      <div className="section-header">
        <h2>Our Partners</h2>
        <p>Trusted by leading organizations</p>
      </div>
      <div className="partners-grid">
        <div className="partner-logo" style={{ 
          background: '#e63946', 
          color: 'white', 
          padding: '0.5rem 1.5rem', 
          borderRadius: '8px',
          fontWeight: 800,
          fontSize: '1.2rem',
          display: 'flex',
          alignItems: 'center',
          height: '50px'
        }}>
          Outpost
        </div>
        <div className="partner-logo" style={{ 
          background: '#c1121f', 
          color: 'white', 
          padding: '0.5rem 1.5rem', 
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          height: '50px'
        }}>
          <span style={{background:'white', color:'#c1121f', padding:'2px 6px', borderRadius:'4px', fontWeight:800}}>AEON</span>
          <span style={{background:'#ff6b35', color:'white', padding:'2px 6px', borderRadius:'4px', fontWeight:800}}>BiG</span>
        </div>
        <div className="partner-logo" style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          height: '50px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #2d8a3e, #1a5f2a)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.7rem',
            fontWeight: 700
          }}>
            QH
          </div>
          <div>
            <div style={{fontWeight:700, color:'#2d8a3e', fontSize:'0.9rem'}}>QUALITAS</div>
            <div style={{fontSize:'0.75rem', color:'var(--text-light)'}}>health</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;