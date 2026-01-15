import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaUserTag, FaLanguage } from 'react-icons/fa';
import { getDashboardStats } from '../services/api';
import './Profile.css';

function Profile({ user }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account information</p>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>

        <div className="profile-info">
          <div className="info-row">
            <div className="info-label">
              <FaUser />
              <span>Full Name</span>
            </div>
            <div className="info-value">{user?.name || user?.username}</div>
          </div>

          <div className="info-row">
            <div className="info-label">
              <FaEnvelope />
              <span>Email</span>
            </div>
            <div className="info-value">{user?.email}</div>
          </div>

          <div className="info-row">
            <div className="info-label">
              <FaUserTag />
              <span>Role</span>
            </div>
            <div className="info-value">
              <span className="role-badge">{user?.role || 'Customer'}</span>
            </div>
          </div>

          <div className="info-row">
            <div className="info-label">
              <FaLanguage />
              <span>Preferred Language</span>
            </div>
            <div className="info-value">English</div>
          </div>
        </div>

        <div className="profile-actions">
          <button 
            className="btn-primary"
            onClick={() => alert('Profile editing feature coming soon!')}
          >
            Edit Profile
          </button>
          <button 
            className="btn-secondary"
            onClick={() => alert('Password change feature coming soon!')}
          >
            Change Password
          </button>
        </div>
      </div>

      <div className="account-stats">
        <h2>Account Statistics</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{stats?.totalBookings || 0}</div>
            <div className="stat-label">Total Bookings</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">SAR {stats?.totalSpent?.toFixed(2) || '0.00'}</div>
            <div className="stat-label">Total Spent</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats?.confirmedBookings || 0}</div>
            <div className="stat-label">Confirmed Bookings</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
