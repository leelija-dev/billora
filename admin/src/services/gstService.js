import { apiClient } from './apiClient';

export const gstAPI = {
  // Get GST collection details for a registered user
  getGstCollection: async (userId) => {
    try {
      console.log('📊 Fetching GST collection for user:', userId);
      const response = await apiClient.get(`/gst-collection/${userId}`);
      console.log('📊 GST collection fetched successfully:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch GST collection:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get all products for GST collection
  getAllProducts: async (productId) => {
    try {
      console.log('📦 Fetching all products for GST:', productId);
      const response = await apiClient.get(`/gst-collection/all-products/${productId}`);
      console.log('📦 Products fetched successfully:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch products:', error);
      throw error.response?.data || error.message;
    }
  },

  // Update government GST payment status
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
