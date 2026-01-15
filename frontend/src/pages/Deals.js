import React, { useState, useEffect } from 'react';
import { getDeals } from '../services/api';
import { FaPercent, FaCalendarAlt, FaTag } from 'react-icons/fa';
import './Deals.css';

function Deals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const response = await getDeals();
      setDeals(response.data);
    } catch (err) {
      console.error('Failed to load deals:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading deals...</div>;

  return (
    <div className="deals-page">
      <div className="page-header">
        <h1>Special Deals & Offers</h1>
        <p>Save big on flights, hotels, and events</p>
      </div>

      <div className="deals-grid">
        {deals.map((deal) => (
          <div key={deal.id} className="deal-card">
            <div className="deal-badge">
              <FaPercent />
              <span>{deal.discount_percentage}% OFF</span>
            </div>
            
            <div className="deal-type">
              <FaTag />
              <span>{deal.deal_type.replace('_', ' ')}</span>
            </div>

            <h3>{deal.title}</h3>
            <p className="deal-description">{deal.description}</p>

            <div className="deal-pricing">
              <div className="original-price">
                <span className="label">Original Price:</span>
                <span className="price strikethrough">SAR {deal.original_price_sar}</span>
              </div>
              <div className="discounted-price">
                <span className="label">Deal Price:</span>
                <span className="price">SAR {deal.discounted_price_sar}</span>
              </div>
            </div>

            <div className="deal-validity">
              <FaCalendarAlt />
              <span>Valid until: {new Date(deal.valid_until).toLocaleDateString()}</span>
            </div>

            <div className="deal-terms">
              <strong>Terms & Conditions:</strong>
              <p>{deal.terms_conditions}</p>
            </div>

            <button 
              className="claim-btn"
              onClick={() => {
                alert(`Deal "${deal.title}" - ${deal.discount_percentage}% off! Visit Flights, Hotels, or Events to book with this discount.`);
              }}
            >
              Claim Deal
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Deals;
