import api from './api';

const bookingService = {
  // Create new booking with Midtrans payment
  createBooking: async (bookingData) => {
    try {
      const response = await api.post('/booking', bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all bookings (admin)
  getAllBookings: async () => {
    try {
      const response = await api.get('/booking');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get booking by ID
  getBookingById: async (id) => {
    try {
      const response = await api.get(`/booking/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get bookings by user (phone/email)
  getBookingsByUser: async (identifier) => {
    try {
      const response = await api.get(`/booking/user/${identifier}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update booking
  updateBooking: async (id, bookingData) => {
    try {
      const response = await api.put(`/booking/${id}`, bookingData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete booking
  deleteBooking: async (id) => {
    try {
      const response = await api.delete(`/booking/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update payment status
  updatePaymentStatus: async (paymentData) => {
    try {
      const response = await api.post('/booking/update-payment', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cancel expired bookings
  cancelExpiredBookings: async () => {
    try {
      const response = await api.post('/booking/cancel-expired');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default bookingService;
