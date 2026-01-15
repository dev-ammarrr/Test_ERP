import React, { useState, useEffect } from 'react';
import { getFlights, createBooking } from '../services/api';
import { FaPlane, FaCalendarAlt, FaClock, FaChair } from 'react-icons/fa';
import './Flights.css';

function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ origin: '', destination: '' });
  const [bookingModal, setBookingModal] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    quantity: 1,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    payment_method: 'card'
  });

  useEffect(() => {
    loadFlights();
  }, [filters]);

  const loadFlights = async () => {
    try {
      const response = await getFlights(filters);
      setFlights(response.data);
    } catch (err) {
      setError('Failed to load flights');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const bookingData = {
        ...bookingForm,
        booking_type: 'flight',
        flight: bookingModal.id,
        total_price_sar: bookingModal.price_sar * bookingForm.quantity,
        total_price_usd: bookingModal.price_usd * bookingForm.quantity,
        currency: 'SAR'
      };
      await createBooking(bookingData);
      alert('Flight booked successfully!');
      setBookingModal(null);
      setBookingForm({ quantity: 1, customer_name: '', customer_email: '', customer_phone: '', payment_method: 'card' });
    } catch (err) {
      alert('Booking failed: ' + (err.response?.data?.error || 'Please try again'));
    }
  };

  if (loading) return <div className="loading">Loading flights...</div>;

  return (
    <div className="flights-page">
      <div className="page-header">
        <h1>Search Flights</h1>
        <p>Find and book the best flights across Saudi Arabia</p>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Origin city"
          value={filters.origin}
          onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
        />
        <input
          type="text"
          placeholder="Destination city"
          value={filters.destination}
          onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
        />
        <button onClick={loadFlights}>Search</button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="flights-grid">
        {flights.map((flight) => (
          <div key={flight.id} className="flight-card">
            <div className="flight-header">
              <h3>{flight.airline}</h3>
              <span className="flight-number">{flight.flight_number}</span>
            </div>
            <div className="flight-route">
              <div className="route-point">
                <FaPlane />
                <div>
                  <p className="city">{flight.origin}</p>
                  <p className="time">{new Date(flight.departure_time).toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="route-line"></div>
              <div className="route-point">
                <FaPlane style={{ transform: 'rotate(90deg)' }} />
                <div>
                  <p className="city">{flight.destination}</p>
                  <p className="time">{new Date(flight.arrival_time).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
            <div className="flight-details">
              <div className="detail-item">
                <FaCalendarAlt />
                <span>{new Date(flight.departure_time).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <FaClock />
                <span>{Math.round((new Date(flight.arrival_time) - new Date(flight.departure_time)) / 3600000)}h</span>
              </div>
              <div className="detail-item">
                <FaChair />
                <span>{flight.available_seats} seats</span>
              </div>
            </div>
            <div className="flight-footer">
              <div className="price">
                <span className="currency">SAR</span>
                <span className="amount">{flight.price_sar}</span>
              </div>
              <button className="book-btn" onClick={() => setBookingModal(flight)}>Book Now</button>
            </div>
          </div>
        ))}
      </div>

      {bookingModal && (
        <div className="modal-overlay" onClick={() => setBookingModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Book Flight</h2>
            <p className="modal-subtitle">{bookingModal.airline} {bookingModal.flight_number} - {bookingModal.origin} to {bookingModal.destination}</p>
            <form onSubmit={handleBooking}>
              <div className="form-group">
                <label>Number of Passengers</label>
                <input
                  type="number"
                  min="1"
                  max={bookingModal.available_seats}
                  value={bookingForm.quantity}
                  onChange={(e) => setBookingForm({ ...bookingForm, quantity: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={bookingForm.customer_name}
                  onChange={(e) => setBookingForm({ ...bookingForm, customer_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={bookingForm.customer_email}
                  onChange={(e) => setBookingForm({ ...bookingForm, customer_email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={bookingForm.customer_phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, customer_phone: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select
                  value={bookingForm.payment_method}
                  onChange={(e) => setBookingForm({ ...bookingForm, payment_method: e.target.value })}
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="amex">American Express</option>
                </select>
              </div>
              <div className="total-price">
                <span>Total:</span>
                <span>SAR {(bookingModal.price_sar * bookingForm.quantity).toFixed(2)}</span>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Confirm Booking</button>
                <button type="button" onClick={() => setBookingModal(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Flights;
