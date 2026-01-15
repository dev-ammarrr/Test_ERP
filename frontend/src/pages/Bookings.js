import React, { useState, useEffect } from 'react';
import { getBookings, cancelBooking } from '../services/api';
import { FaPlane, FaHotel, FaTicketAlt, FaCalendarAlt, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import './Bookings.css';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await getBookings();
      setBookings(response.data);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id, reference) => {
    if (window.confirm(`Are you sure you want to cancel booking ${reference}?`)) {
      try {
        await cancelBooking(id);
        alert('Booking cancelled successfully');
        loadBookings();
      } catch (err) {
        alert('Failed to cancel booking');
      }
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'flight': return <FaPlane />;
      case 'hotel': return <FaHotel />;
      case 'event': return <FaTicketAlt />;
      default: return <FaCalendarAlt />;
    }
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="bookings-page">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>View and manage all your bookings</p>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <FaCalendarAlt className="empty-icon" />
          <h3>No bookings yet</h3>
          <p>Start exploring and book your next adventure!</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <div className="booking-type">
                  {getIcon(booking.booking_type)}
                  <span>{booking.booking_type}</span>
                </div>
                <span className={`status-badge status-${booking.status}`}>
                  {booking.status}
                </span>
              </div>
              
              <div className="booking-reference">
                <strong>Reference:</strong> {booking.booking_reference}
              </div>

              <div className="booking-details">
                <div className="detail-row">
                  <FaUser />
                  <span>{booking.customer_name}</span>
                </div>
                <div className="detail-row">
                  <FaEnvelope />
                  <span>{booking.customer_email}</span>
                </div>
                <div className="detail-row">
                  <FaPhone />
                  <span>{booking.customer_phone}</span>
                </div>
              </div>

              {booking.check_in_date && (
                <div className="booking-dates">
                  <div>
                    <strong>Check-in:</strong> {new Date(booking.check_in_date).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Check-out:</strong> {new Date(booking.check_out_date).toLocaleDateString()}
                  </div>
                </div>
              )}

              <div className="booking-footer">
                <div className="booking-price">
                  <span className="label">Total Amount:</span>
                  <span className="amount">SAR {booking.total_price_sar}</span>
                </div>
                {booking.status === 'confirmed' && (
                  <button 
                    className="cancel-btn"
                    onClick={() => handleCancel(booking.id, booking.booking_reference)}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>

              <div className="booking-meta">
                <span>Booked on: {new Date(booking.created_at).toLocaleDateString()}</span>
                <span>Payment: {booking.payment_method.replace('_', ' ')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookings;
