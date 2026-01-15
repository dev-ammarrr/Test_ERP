import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const register = (data) => api.post('/auth/register/', data);
export const login = (data) => api.post('/auth/login/', data);
export const getCurrentUser = () => api.get('/auth/me/');
export const debugUsers = () => api.get('/auth/debug/users/');

export const getDashboardStats = () => api.get('/dashboard-stats/');

export const getFlights = (params) => api.get('/flights/', { params });
export const getFlightById = (id) => api.get(`/flights/${id}/`);
export const createFlight = (data) => api.post('/flights/', data);
export const updateFlight = (id, data) => api.put(`/flights/${id}/`, data);
export const deleteFlight = (id) => api.delete(`/flights/${id}/`);

export const getHotels = (params) => api.get('/hotels/', { params });
export const getHotelById = (id) => api.get(`/hotels/${id}/`);
export const createHotel = (data) => api.post('/hotels/', data);
export const updateHotel = (id, data) => api.put(`/hotels/${id}/`, data);
export const deleteHotel = (id) => api.delete(`/hotels/${id}/`);

export const getEvents = (params) => api.get('/events/', { params });
export const getEventById = (id) => api.get(`/events/${id}/`);
export const createEvent = (data) => api.post('/events/', data);
export const updateEvent = (id, data) => api.put(`/events/${id}/`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}/`);

export const getBookings = () => api.get('/bookings/');
export const getBookingById = (id) => api.get(`/bookings/${id}/`);
export const createBooking = (data) => api.post('/bookings/', data);
export const updateBooking = (id, data) => api.put(`/bookings/${id}/`, data);
export const cancelBooking = (id) => api.post(`/bookings/${id}/cancel/`);

export const getDeals = () => api.get('/deals/');
export const getDealById = (id) => api.get(`/deals/${id}/`);
export const createDeal = (data) => api.post('/deals/', data);
export const updateDeal = (id, data) => api.put(`/deals/${id}/`, data);
export const deleteDeal = (id) => api.delete(`/deals/${id}/`);

export const getSupportTickets = () => api.get('/support-tickets/');
export const getSupportTicketById = (id) => api.get(`/support-tickets/${id}/`);
export const createSupportTicket = (data) => api.post('/support-tickets/', data);
export const resolveSupportTicket = (id, data) => api.post(`/support-tickets/${id}/resolve/`, data);

export default api;
