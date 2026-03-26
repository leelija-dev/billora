import { apiClient } from './apiClient'

export const plansAPI = {
  // Get all plans
  getAll: async () => {
    try {
      console.log('📋 Fetching all plans');
      const response = await apiClient.get('/plans');
      console.log('📋 Plans fetched successfully:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch plans:', error);
      throw error.response?.data || error.message;
    }
  },
}

export const dashboardAPI = {
  // Get dashboard overview by user ID
  getOverview: async (userId) => {
    try {
      console.log(`📊 Fetching dashboard overview for user: ${userId}`);
      const response = await apiClient.get(`/dashboard/overview/${userId}`);
      console.log('📊 Dashboard overview fetched:', response.data);
      return response;
    } catch (error) {
      console.error(`❌ Failed to fetch dashboard overview for user ${userId}:`, error);
      throw error.response?.data || error.message;
    }
  },
}

export const cartAPI = {
  // Get all cart products
  getAll: async () => {
    try {
      console.log('🛒 Fetching all cart products');
      const response = await apiClient.get('/carts');
      console.log('🛒 Cart products fetched:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch cart products:', error);
      throw error.response?.data || error.message;
    }
  },

  // Add product to cart
  create: async (cartData) => {
    try {
      console.log('🛒 Adding product to cart:', cartData);
      const response = await apiClient.post('/carts/store', cartData);
      console.log('🛒 Product added to cart:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Failed to add product to cart:', error);
      throw error.response?.data || error.message;
    }
  },

  // Update cart
  update: async (id, cartData) => {
    try {
      console.log(`🛒 Updating cart item ${id}:`, cartData);
      const response = await apiClient.put(`/carts/${id}`, cartData);
      console.log('🛒 Cart item updated:', response.data);
      return response;
    } catch (error) {
      console.error(`❌ Failed to update cart item ${id}:`, error);
      throw error.response?.data || error.message;
    }
  },

  // Delete from cart
  delete: async (id, deleteData) => {
    try {
      console.log(`🛒 Deleting cart item ${id}:`, deleteData);
      const response = await apiClient.delete(`/carts/${id}`, { data: deleteData });
      console.log('🛒 Cart item deleted');
      return response;
    } catch (error) {
      console.error(`❌ Failed to delete cart item ${id}:`, error);
      throw error.response?.data || error.message;
    }
  },
}

export const reportsAPI = {
  // Get reports (default today's data)
  getAll: async (startDate = '', endDate = '') => {
    try {
      const params = {}
      if (startDate) params.start_date = startDate
      if (endDate) params.end_date = endDate
      
      console.log('📈 Fetching reports with params:', params);
      const response = await apiClient.get('/reports', { params });
      console.log('📈 Reports fetched:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch reports:', error);
      throw error.response?.data || error.message;
    }
  },
}

export const billingAPI = {
  // Get user plan purchase history
  getPlanPurchaseHistory: async (userId) => {
    try {
      console.log(`💳 Fetching plan purchase history for user: ${userId}`);
      const response = await apiClient.get(`/plans-purchase-history/${userId}`);
      console.log('💳 Plan purchase history fetched:', response.data);
      return response;
    } catch (error) {
      console.error(`❌ Failed to fetch plan purchase history for user ${userId}:`, error);
      throw error.response?.data || error.message;
    }
  },

  // Create Cashfree order for plan purchase
  createCashfreeOrder: async (orderData) => {
    try {
      console.log('💳 Creating Cashfree order:', orderData);
      const response = await apiClient.post('/cashfree/create-order', orderData);
      console.log('💳 Cashfree order created:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Failed to create Cashfree order:', error);
      throw error.response?.data || error.message;
    }
  },
}
