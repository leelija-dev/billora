import { apiClient } from './client';
import { mockCustomers } from './mock/customers';

// Get customers data based on project mode
const getCustomersData = () => {
  const projectMode = process.env.EXPO_PUBLIC_PROJECT_MODE || 'mock';
  return projectMode === 'mock' ? mockCustomers : apiClient;
};

export const customersAPI = {
  // Get all customers for an admin user
  getAll: async (adminId, params = {}) => {
    try {
      const api = getCustomersData();
      return await api.get(`/customer/${adminId}`, { params });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single customer
  getById: async (id) => {
    try {
      const api = getCustomersData();
      return await api.get(`/customer/${id}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new customer
  create: async (customerData) => {
    try {
      const api = getCustomersData();
      return await api.post('/customer/store', {
        admin_id: customerData.adminId,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city,
        created_by: customerData.createdBy,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update customer
  update: async (id, customerData) => {
    try {
      const api = getCustomersData();
      return await api.put(`/customer/${id}`, {
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete customer
  delete: async (id) => {
    try {
      const api = getCustomersData();
      return await api.delete(`/customer/${id}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search customers
  search: async (adminId, query, filters = {}) => {
    try {
      const api = getCustomersData();
      return await api.get(`/customer/${adminId}/search`, {
        params: { q: query, ...filters }
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get customer orders
  getOrders: async (customerId, params = {}) => {
    try {
      const api = getCustomersData();
      return await api.get(`/customer/${customerId}/orders`, { params });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get customer invoices
  getInvoices: async (customerId, params = {}) => {
    try {
      const api = getCustomersData();
      return await api.get(`/customer/${customerId}/invoices`, { params });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get customer statistics
  getStats: async (customerId) => {
    try {
      const api = getCustomersData();
      return await api.get(`/customer/${customerId}/stats`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get customer outstanding balance
  getOutstandingBalance: async (customerId) => {
    try {
      const api = getCustomersData();
      return await api.get(`/customer/${customerId}/balance`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add payment to customer account
  addPayment: async (customerId, paymentData) => {
    try {
      const api = getCustomersData();
      return await api.post(`/customer/${customerId}/payment`, {
        amount: paymentData.amount,
        payment_method: paymentData.paymentMethod,
        payment_date: paymentData.paymentDate,
        notes: paymentData.notes,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get customer payment history
  getPaymentHistory: async (customerId, params = {}) => {
    try {
      const api = getCustomersData();
      return await api.get(`/customer/${customerId}/payments`, { params });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update customer status
  updateStatus: async (customerId, status) => {
    try {
      const api = getCustomersData();
      return await api.patch(`/customer/${customerId}/status`, {
        status,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Bulk import customers
  bulkImport: async (adminId, customersData) => {
    try {
      const api = getCustomersData();
      return await api.post(`/customer/${adminId}/bulk-import`, {
        customers: customersData,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Export customers
  export: async (adminId, format = 'csv', filters = {}) => {
    try {
      const api = getCustomersData();
      return await api.get(`/customer/${adminId}/export`, {
        params: { format, ...filters },
        responseType: 'blob',
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Legacy methods for backward compatibility
  getCustomers: async (params = {}) => {
    try {
      const api = getCustomersData();
      return await api.get('/customers', { params });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCustomer: async (id) => {
    return await customersAPI.getById(id);
  },

  createCustomer: async (customerData) => {
    return await customersAPI.create(customerData);
  },

  updateCustomer: async (id, customerData) => {
    return await customersAPI.update(id, customerData);
  },

  deleteCustomer: async (id) => {
    return await customersAPI.delete(id);
  },

  searchCustomers: async (query, filters = {}) => {
    try {
      const api = getCustomersData();
      return await api.get('/customers/search', {
        params: { q: query, ...filters },
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCustomerOrders: async (id, params = {}) => {
    return await customersAPI.getOrders(id, params);
  },

  getCustomerStats: async (id) => {
    return await customersAPI.getStats(id);
  },
};
