import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaHome, FaPlane, FaHotel, FaTicketAlt, FaCalendarAlt, FaPercent, FaHeadset, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Navigation.css';

function Navigation({ isOpen, onToggle, user, onLogout }) {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: <FaHome />, label: 'Dashboard' },
    { path: '/flights', icon: <FaPlane />, label: 'Flights' },
    { path: '/hotels', icon: <FaHotel />, label: 'Hotels' },
    { path: '/events', icon: <FaTicketAlt />, label: 'Events' },
    { path: '/bookings', icon: <FaCalendarAlt />, label: 'My Bookings' },
    { path: '/deals', icon: <FaPercent />, label: 'Deals' },
    { path: '/support', icon: <FaHeadset />, label: 'Support' },
    { path: '/profile', icon: <FaUser />, label: 'Profile' },
  ];

  return (
    <aside className={`navigation ${isOpen ? 'open' : 'closed'}`}>
      <div className="nav-header">
        <button 
          className="hamburger-btn"
          onClick={onToggle}
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        {isOpen && (
          <div className="nav-brand">
            <h1 className="brand-title">Bookme</h1>
            <p className="brand-subtitle">Saudi Arabia</p>
          </div>
        )}
      </div>

      {isOpen && user && (
        <div className="user-info">
          <div className="user-avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-details">
            <p className="user-name">{user.name || user.username}</p>
            <p className="user-role">{user.role || 'Customer'}</p>
          </div>
        </div>
      )}

      <nav className="nav-menu">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            title={!isOpen ? item.label : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            {isOpen && <span className="nav-label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {isOpen && (
        <div className="nav-footer">
          <button className="logout-btn" onClick={onLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
}

export default Navigation;
