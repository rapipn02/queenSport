import api from './api';

export const paymentService = {
  // Create payment & get Midtrans Snap token
  createPayment: async (bookingId) => {
    const response = await api.post('/payments/create', { bookingId });
    return response.data; // { snapToken, orderId }
  },

  // Verify payment status
  verifyPayment: async (orderId) => {
    const response = await api.get(`/payments/verify/${orderId}`);
    return response.data;
  },

  // Get payment history
  getPaymentHistory: async () => {
    const response = await api.get('/payments/history');
    return response.data;
  },

  // Open Midtrans Snap payment popup
  openSnapPayment: (snapToken, onSuccess, onPending, onError, onClose) => {
    window.snap.pay(snapToken, {
      onSuccess: (result) => {
        console.log('Payment success:', result);
        if (onSuccess) onSuccess(result);
      },
      onPending: (result) => {
        console.log('Payment pending:', result);
        if (onPending) onPending(result);
      },
      onError: (result) => {
        console.log('Payment error:', result);
        if (onError) onError(result);
      },
      onClose: () => {
        console.log('Payment popup closed');
        if (onClose) onClose();
      },
    });
  },
};
