import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Flights from './pages/Flights';
import Hotels from './pages/Hotels';
import Events from './pages/Events';
import Bookings from './pages/Bookings';
import Deals from './pages/Deals';
import Support from './pages/Support';
import Profile from './pages/Profile';
import Navigation from './components/Navigation';
import { getCurrentUser } from './services/api';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [navOpen, setNavOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser()
        .then(res => {
          setUser(res.data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading Bookme...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Router>
        <div className="auth-container">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <Navigation 
          isOpen={navOpen} 
          onToggle={() => setNavOpen(!navOpen)}
          user={user}
          onLogout={handleLogout}
        />
        <main className={`main-content ${navOpen ? 'nav-open' : 'nav-closed'}`}>
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/events" element={<Events />} />
            <Route path="/bookings" element={<Bookings user={user} />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/support" element={<Support user={user} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
