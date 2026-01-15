import React, { useState, useEffect } from 'react';
import { getEvents, createBooking } from '../services/api';
import { FaTicketAlt, FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';
import './Events.css';

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: '', category: '' });
  const [bookingModal, setBookingModal] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    quantity: 1,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    payment_method: 'card'
  });

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const loadEvents = async () => {
    try {
      const response = await getEvents(filters);
      setEvents(response.data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const bookingData = {
        ...bookingForm,
        booking_type: 'event',
        event: bookingModal.id,
        total_price_sar: bookingModal.price_sar * bookingForm.quantity,
        total_price_usd: bookingModal.price_usd * bookingForm.quantity,
        currency: 'SAR'
      };
      await createBooking(bookingData);
      alert('Event tickets booked successfully!');
      setBookingModal(null);
      setBookingForm({ quantity: 1, customer_name: '', customer_email: '', customer_phone: '', payment_method: 'card' });
    } catch (err) {
      alert('Booking failed: ' + (err.response?.data?.error || 'Please try again'));
    }
  };

  if (loading) return <div className="loading">Loading events...</div>;

  return (
    <div className="events-page">
      <div className="page-header">
        <h1>Discover Events</h1>
        <p>Book tickets for the best events in Saudi Arabia</p>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search by city"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        />
        <button onClick={loadEvents}>Search</button>
      </div>

      <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-category">{event.category}</div>
            <h3>{event.name}</h3>
            <div className="event-details">
              <div className="detail-item">
                <FaMapMarkerAlt />
                <span>{event.venue}, {event.city}</span>
              </div>
              <div className="detail-item">
                <FaCalendarAlt />
                <span>{new Date(event.event_date).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <FaClock />
                <span>{event.duration_hours}h duration</span>
              </div>
            </div>
            <p className="event-description">{event.description.substring(0, 150)}...</p>
            <div className="event-footer">
              <div className="price">
                <span className="amount">SAR {event.price_sar}</span>
                <span className="per-ticket">/ticket</span>
              </div>
              <button className="book-btn" onClick={() => setBookingModal(event)}>Book Tickets</button>
            </div>
          </div>
        ))}
      </div>

      {bookingModal && (
        <div className="modal-overlay" onClick={() => setBookingModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Book Event Tickets</h2>
            <p className="modal-subtitle">{bookingModal.name} - {bookingModal.city}</p>
            <form onSubmit={handleBooking}>
              <div className="form-group">
                <label>Number of Tickets</label>
                <input
                  type="number"
                  min="1"
                  max={bookingModal.available_tickets}
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

export default Events;
