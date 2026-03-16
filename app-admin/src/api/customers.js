import { apiClient } from './client';
import { mockCustomers } from './mock/customers';

// Get customers data based on project mode
const getCustomersData = () => {
  const projectMode = process.env.EXPO_PUBLIC_PROJECT_MODE || 'mock';
  return projectMode === 'mock' ? mockCustomers : apiClient;
};

export const customersAPI = {
  // Get all customers for a user
  getAll: async (userId, params = {}) => {
    try {
      const api = getCustomersData();
      const response = await api.get(`/customer/${userId}`, { params });
      console.log('Customers API Response:', response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search customers
  search: async (userId, query, params = {}) => {
    try {
      const api = getCustomersData();
      const response = await api.get(`/customer/${userId}`, {
        params: { search: query, ...params }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single customer
  getById: async (id) => {
    try {
      const api = getCustomersData();
      const response = await api.get(`/customer/show/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get Customer API error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get customer payment history with date filter
  getPaymentHistory: async (id, startDate, endDate) => {
    try {
      const api = getCustomersData();
      const response = await api.get(`/customer/show/${id}`, {
        params: { 
          start_date: startDate,
          end_date: endDate 
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new customer
  create: async (customerData) => {
    try {
      const api = getCustomersData();
      
      // Map frontend field names to API expected field names
      const payload = {
        admin_id: customerData.adminId || customerData.admin_id,
        name: customerData.name,
        email: customerData.email || '',
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city || '',
        created_by: customerData.createdBy || customerData.adminId || customerData.admin_id,
      };
      
      console.log('Create Customer API payload:', payload);
      const response = await api.post('/customer/store', payload);
      return response.data;
    } catch (error) {
      console.error('Create Customer API error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update customer
  update: async (id, customerData) => {
    try {
      const api = getCustomersData();
      
      // Map frontend field names to API expected field names
      const payload = {
        user_id: customerData.userId || customerData.user_id || customerData.adminId || customerData.admin_id,
        name: customerData.name,
        email: customerData.email || '',
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city || '',
      };
      
      console.log('Update Customer API payload:', payload);
      const response = await api.put(`/customer/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Update Customer API error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Add due payment
  addDuePayment: async (id, paymentData) => {
    try {
      const api = getCustomersData();
      const response = await api.put(`/customer/due-payment/${id}`, {
        due_payment: paymentData.duePayment || paymentData.due_payment
      });
      return response.data;
    } catch (error) {
      console.error('Due Payment API error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Delete customer (soft delete)
  delete: async (id) => {
    try {
      const api = getCustomersData();
      const response = await api.delete(`/customer/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get trashed (soft deleted) customers
  getTrashed: async () => {
    try {
      const api = getCustomersData();
      const response = await api.get('/customer/trashed');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Restore soft deleted customer
  restore: async (id) => {
    try {
      const api = getCustomersData();
      const response = await api.patch(`/customer/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Permanently delete customer
  forceDelete: async (id) => {
    try {
      const api = getCustomersData();
      const response = await api.delete(`/customer/${id}/force`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};