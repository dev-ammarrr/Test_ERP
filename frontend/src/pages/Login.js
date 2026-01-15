import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../services/api';
import './Login.css';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(formData);
      localStorage.setItem('token', response.data.token);
      onLogin(response.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Bookme</h1>
          <p>E-Ticketing Platform for Saudi Arabia</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>Welcome Back</h2>
          <p className="login-subtitle">Sign in to continue booking</p>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username or Email</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Enter your username or email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="login-footer">
            <p>Don't have an account? <Link to="/register">Sign up</Link></p>
          </div>

          <div className="test-credentials">
            <p><strong>Test Credentials:</strong></p>
            <p>Username: <code>testuser</code> | Password: <code>password123</code></p>
            <p>Admin: <code>admin</code> | Password: <code>admin123</code></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
