import { apiClient } from './client';
import { mockBills } from './mock/bills';

// Get bills data based on project mode
const getBillsData = () => {
  const projectMode = process.env.EXPO_PUBLIC_PROJECT_MODE || 'mock';
  return projectMode === 'mock' ? mockBills : apiClient;
};

export const billsAPI = {
  // Get all bills history
  getAll: async (params = {}) => {
    try {
      const api = getBillsData();
      const response = await api.get('/invoice/bill-history', { params });
      console.log('Bills API Response:', response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search bills
  search: async (query, params = {}) => {
    try {
      const api = getBillsData();
      const response = await api.get('/invoice/bill-history', {
        params: { search: query, ...params }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single bill
  getById: async (id) => {
    try {
      const api = getBillsData();
      const response = await api.get(`/invoice/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get bills by date range
  getByDateRange: async (startDate, endDate, params = {}) => {
    try {
      const api = getBillsData();
      const response = await api.get('/invoice/bill-history', {
        params: { start_date: startDate, end_date: endDate, ...params }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new bill
  create: async (billData) => {
    try {
      const api = getBillsData();
      
      // Map frontend field names to API expected field names
      const payload = {
        user_id: billData.userId || billData.user_id,
        customer_id: billData.customerId,
        store_id: billData.storeId,
        paid_amount: parseFloat(billData.paidAmount) || 0,
        created_by: billData.createdBy || billData.userId || billData.user_id,
        items: billData.items.map(item => ({
          product_id: item.productId,
          quantity: parseInt(item.quantity),
          item_count: parseInt(item.quantity),
          unit_id: item.unitId,
          price: parseFloat(item.price),
          gst: parseFloat(item.gst) || 0,
          discount: parseFloat(item.discount) || 0,
          total_price: parseFloat(item.totalPrice),
          status: 'completed'
        }))
      };
      
      console.log('Create Bill API payload:', payload);
      const response = await api.post('/invoice/store', payload);
      return response.data;
    } catch (error) {
      console.error('Create Bill API error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update bill
  update: async (id, billData) => {
    try {
      const api = getBillsData();
      
      const payload = {
        customer_id: billData.customerId,
        store_id: billData.storeId,
        paid_amount: parseFloat(billData.paidAmount) || 0,
        items: billData.items.map(item => ({
          product_id: item.productId,
          quantity: parseInt(item.quantity),
          item_count: parseInt(item.quantity),
          unit_id: item.unitId,
          price: parseFloat(item.price),
          gst: parseFloat(item.gst) || 0,
          discount: parseFloat(item.discount) || 0,
          total_price: parseFloat(item.totalPrice),
          status: 'completed'
        }))
      };
      
      console.log('Update Bill API payload:', payload);
      const response = await api.put(`/invoice/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Update Bill API error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Delete bill
  delete: async (id) => {
    try {
      const api = getBillsData();
      const response = await api.delete(`/invoice/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Print bill (get formatted bill data)
  printBill: async (id, format = 'a4') => {
    try {
      const api = getBillsData();
      const response = await api.get(`/invoice/print/${id}`, {
        params: { format }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get customer list for dropdown
  getCustomers: async () => {
    try {
      const api = getBillsData();
      const response = await api.get('/customer/1'); // Use admin_id = 1 for now
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new customer
  createCustomer: async (customerData) => {
    try {
      const api = getBillsData();
      const response = await api.post('/bill-customer/store', customerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};