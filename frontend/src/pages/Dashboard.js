import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../services/api';
import { FaPlane, FaHotel, FaTicketAlt, FaCalendarAlt, FaDollarSign, FaUsers } from 'react-icons/fa';
import './Dashboard.css';

function Dashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (err) {
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!stats) return null;

  const isCustomer = user?.role === 'customer';

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name || user?.username}!</h1>
        <p>Here's what's happening with your bookings today</p>
      </div>

      <div className="stats-grid">
        {isCustomer ? (
          <>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                <FaCalendarAlt />
              </div>
              <div className="stat-content">
                <h3>Total Bookings</h3>
                <p className="stat-value">{stats.totalBookings}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                <FaCalendarAlt />
              </div>
              <div className="stat-content">
                <h3>Confirmed</h3>
                <p className="stat-value">{stats.confirmedBookings}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                <FaCalendarAlt />
              </div>
              <div className="stat-content">
                <h3>Pending</h3>
                <p className="stat-value">{stats.pendingBookings}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                <FaDollarSign />
              </div>
              <div className="stat-content">
                <h3>Total Spent</h3>
                <p className="stat-value">SAR {stats.totalSpent?.toFixed(2)}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
                <FaCalendarAlt />
              </div>
              <div className="stat-content">
                <h3>Total Bookings</h3>
                <p className="stat-value">{stats.totalBookings}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                <FaDollarSign />
              </div>
              <div className="stat-content">
                <h3>Total Revenue</h3>
                <p className="stat-value">SAR {stats.totalRevenue?.toFixed(2)}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                <FaPlane />
              </div>
              <div className="stat-content">
                <h3>Active Flights</h3>
                <p className="stat-value">{stats.totalFlights}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                <FaHotel />
              </div>
              <div className="stat-content">
                <h3>Active Hotels</h3>
                <p className="stat-value">{stats.totalHotels}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' }}>
                <FaTicketAlt />
              </div>
              <div className="stat-content">
                <h3>Active Events</h3>
                <p className="stat-value">{stats.totalEvents}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' }}>
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>Total Users</h3>
                <p className="stat-value">{stats.totalUsers}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {stats.recentBookings && stats.recentBookings.length > 0 && (
        <div className="recent-bookings">
          <h2>Recent Bookings</h2>
          <div className="bookings-table">
            <table>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Type</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td><span className="booking-ref">{booking.booking_reference}</span></td>
                    <td><span className="booking-type">{booking.booking_type}</span></td>
                    <td>{booking.customer_name}</td>
                    <td>SAR {booking.total_price_sar}</td>
                    <td>
                      <span className={`status-badge status-${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
