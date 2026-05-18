import React from 'react';
import VendorLocator from '../components/VendorLocator';

const Vendors = () => {
  return (
    <div className="dashboard">
      <div className="dashboard-inner">
        <div className="dashboard-header">
          <div>
            <h1>Find Vendors</h1>
            <p style={{ color: '#636e72' }}>Locate approved vendors near you to redeem vouchers</p>
          </div>
        </div>
        <VendorLocator />
      </div>
    </div>
  );
};

export default Vendors;