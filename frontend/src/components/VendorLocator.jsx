import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhone, FaStar, FaSearch } from 'react-icons/fa';
import api from '../services/api';

const VendorLocator = () => {
  const [vendors, setVendors] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const categories = ['food', 'Sadaqat', 'Zakat', 'Waqf', 'general'];

  useEffect(() => {
    fetchVendors();
  }, [category]);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const params = category ? { category } : {};
      const res = await api.get('/vendors', { params });
      setVendors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.address.city?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
          <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#636e72' }} />
          <input
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: 'auto', minWidth: '150px' }}
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredVendors.map(vendor => (
            <div key={vendor._id} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid #dfe6e9',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: '#f8f9fa',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                flexShrink: 0
              }}>
                {vendor.logo || '🏪'}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ marginBottom: '0.25rem' }}>{vendor.name}</h4>
                <p style={{ fontSize: '0.85rem', color: '#636e72', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <FaMapMarkerAlt /> {vendor.address.street}, {vendor.address.city}
                </p>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#636e72' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <FaPhone /> {vendor.phone}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <FaStar style={{ color: '#f4a261' }} /> {vendor.rating || 'N/A'}
                  </span>
                </div>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {vendor.categories.map(cat => (
                    <span key={cat} style={{
                      background: 'rgba(26, 95, 42, 0.1)',
                      color: '#1a5f2a',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '50px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {filteredVendors.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#636e72' }}>
              No vendors found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VendorLocator;