// services/gstService.js
import { apiClient } from './apiClient';

export const gstAPI = {
  getGstCollection: async (userId, params = {}) => {
    try {
      console.log('📊 Fetching GST collection for user:', userId, params);
      const response = await apiClient.get(`/gst-collection/${userId}`, { params });
      console.log('📊 GST collection fetched successfully:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch GST collection:', error);
      throw error.response?.data || error.message;
    }
  },

  updateGstPaymentStatus: async (collectionId, statusData) => {
    try {
      console.log('💰 Updating GST payment status for collection:', collectionId);
      const response = await apiClient.put(`/gst-collection/update-status/${collectionId}`, statusData);
      console.log('💰 GST payment status updated successfully:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Failed to update GST payment status:', error);
      throw error.response?.data || error.message;
    }
  }
};