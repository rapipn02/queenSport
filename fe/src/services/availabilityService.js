import api from './api';

const availabilityService = {
  // Check availability for specific date and facility
  checkAvailability: async (id_lapangan, tanggal) => {
    try {
      const response = await api.get('/availability/check', {
        params: { id_lapangan, tanggal }
      });
      return response.data;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  }
};

export default availabilityService;
