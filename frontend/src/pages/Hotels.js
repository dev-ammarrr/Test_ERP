import React, { useState, useEffect } from 'react';
import { getHotels, createBooking } from '../services/api';
import { FaHotel, FaStar, FaMapMarkerAlt, FaBed } from 'react-icons/fa';
import './Hotels.css';

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: '' });
  const [bookingModal, setBookingModal] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    quantity: 1,
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    check_in_date: '',
    check_out_date: '',
    payment_method: 'card'
  });

  useEffect(() => {
    loadHotels();
  }, [filters]);

  const loadHotels = async () => {
    try {
      const response = await getHotels(filters);
      setHotels(response.data);
    } catch (err) {
      console.error('Failed to load hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const nights = Math.ceil((new Date(bookingForm.check_out_date) - new Date(bookingForm.check_in_date)) / (1000 * 60 * 60 * 24));
      const bookingData = {
        ...bookingForm,
        booking_type: 'hotel',
        hotel: bookingModal.id,
        total_price_sar: bookingModal.price_per_night_sar * nights * bookingForm.quantity,
        total_price_usd: bookingModal.price_per_night_usd * nights * bookingForm.quantity,
        currency: 'SAR'
      };
      await createBooking(bookingData);
      alert('Hotel booked successfully!');
      setBookingModal(null);
      setBookingForm({ quantity: 1, customer_name: '', customer_email: '', customer_phone: '', check_in_date: '', check_out_date: '', payment_method: 'card' });
    } catch (err) {
      alert('Booking failed: ' + (err.response?.data?.error || 'Please try again'));
    }
  };

  if (loading) return <div className="loading">Loading hotels...</div>;

  return (
    <div className="hotels-page">
      <div className="page-header">
        <h1>Find Hotels</h1>
        <p>Discover luxury accommodations across Saudi Arabia</p>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search by city"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        />
        <button onClick={loadHotels}>Search</button>
      </div>

      <div className="hotels-grid">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="hotel-card">
            <div className="hotel-header">
              <FaHotel className="hotel-icon" />
              <div className="hotel-rating">
                {[...Array(hotel.star_rating)].map((_, i) => (
                  <FaStar key={i} className="star" />
                ))}
              </div>
            </div>
            <h3>{hotel.name}</h3>
            <div className="hotel-location">
              <FaMapMarkerAlt />
              <span>{hotel.city}</span>
            </div>
            <p className="hotel-description">{hotel.description.substring(0, 120)}...</p>
            <div className="hotel-amenities">
              {hotel.amenities.split(',').slice(0, 3).map((amenity, i) => (
                <span key={i} className="amenity-tag">{amenity.trim()}</span>
              ))}
            </div>
            <div className="hotel-footer">
              <div className="price">
                <span className="amount">SAR {hotel.price_per_night_sar}</span>
                <span className="per-night">/night</span>
              </div>
              <button className="book-btn" onClick={() => setBookingModal(hotel)}>Book Now</button>
            </div>
          </div>
        ))}
      </div>

      {bookingModal && (
        <div className="modal-overlay" onClick={() => setBookingModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Book Hotel</h2>
            <p className="modal-subtitle">{bookingModal.name} - {bookingModal.city}</p>
            <form onSubmit={handleBooking}>
              <div className="form-group">
                <label>Number of Rooms</label>
                <input
                  type="number"
                  min="1"
                  max={bookingModal.available_rooms}
                  value={bookingForm.quantity}
                  onChange={(e) => setBookingForm({ ...bookingForm, quantity: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Check-in Date</label>
                  <input
                    type="date"
                    value={bookingForm.check_in_date}
                    onChange={(e) => setBookingForm({ ...bookingForm, check_in_date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Check-out Date</label>
                  <input
                    type="date"
                    value={bookingForm.check_out_date}
                    onChange={(e) => setBookingForm({ ...bookingForm, check_out_date: e.target.value })}
                    required
                  />
                </div>
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
              {bookingForm.check_in_date && bookingForm.check_out_date && (
                <div className="total-price">
                  <span>Total ({Math.ceil((new Date(bookingForm.check_out_date) - new Date(bookingForm.check_in_date)) / (1000 * 60 * 60 * 24))} nights):</span>
                  <span>SAR {(bookingModal.price_per_night_sar * Math.ceil((new Date(bookingForm.check_out_date) - new Date(bookingForm.check_in_date)) / (1000 * 60 * 60 * 24)) * bookingForm.quantity).toFixed(2)}</span>
                </div>
              )}
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

export default Hotels;
