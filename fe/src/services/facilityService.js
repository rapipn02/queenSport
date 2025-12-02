import api from './api';

// Get all facilities/lapangan
export const getAllFacilities = async () => {
  try {
    const response = await api.get('/lapangan');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get facility by ID
export const getFacilityById = async (id) => {
  try {
    const response = await api.get(`/lapangan/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Get facility statistics
export const getFacilityStats = async () => {
  try {
    const response = await api.get('/lapangan/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Create new facility
export const createFacility = async (data) => {
  try {
    const response = await api.post('/lapangan', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Update facility
export const updateFacility = async (id, data) => {
  try {
    const response = await api.put(`/lapangan/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Delete facility
export const deleteFacility = async (id) => {
  try {
    const response = await api.delete(`/lapangan/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
