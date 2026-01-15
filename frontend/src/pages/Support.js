import React, { useState, useEffect } from 'react';
import { getSupportTickets, createSupportTicket } from '../services/api';
import { FaHeadset, FaTicketAlt, FaClock } from 'react-icons/fa';
import './Support.css';

function Support() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium'
  });

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await getSupportTickets();
      setTickets(response.data);
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSupportTicket(formData);
      alert('Support ticket created successfully!');
      setShowForm(false);
      setFormData({ subject: '', description: '', priority: 'medium' });
      loadTickets();
    } catch (err) {
      alert('Failed to create ticket');
    }
  };

  if (loading) return <div className="loading">Loading support tickets...</div>;

  return (
    <div className="support-page">
      <div className="page-header">
        <div>
          <h1>Customer Support</h1>
          <p>We're here to help 24/7</p>
        </div>
        <button className="new-ticket-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Ticket'}
        </button>
      </div>

      {showForm && (
        <div className="ticket-form-card">
          <h2>Create Support Ticket</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief description of your issue"
                required
              />
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide detailed information about your issue"
                rows="6"
                required
              />
            </div>
            <button type="submit" className="submit-btn">Submit Ticket</button>
          </form>
        </div>
      )}

      <div className="tickets-section">
        <h2>My Support Tickets</h2>
        {tickets.length === 0 ? (
          <div className="empty-state">
            <FaHeadset className="empty-icon" />
            <h3>No support tickets</h3>
            <p>Create a ticket if you need assistance</p>
          </div>
        ) : (
          <div className="tickets-list">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <div className="ticket-header">
                  <div className="ticket-number">
                    <FaTicketAlt />
                    <span>{ticket.ticket_number}</span>
                  </div>
                  <span className={`priority-badge priority-${ticket.priority}`}>
                    {ticket.priority}
                  </span>
                </div>
                
                <h3>{ticket.subject}</h3>
                <p className="ticket-description">{ticket.description}</p>

                <div className="ticket-footer">
                  <span className={`status-badge status-${ticket.status}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                  <div className="ticket-date">
                    <FaClock />
                    <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Support;
