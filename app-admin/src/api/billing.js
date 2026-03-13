import { apiClient } from './client';

export const billingAPI = {
  // Get all bills with optional search
  getAll: async (searchParams = {}) => {
    try {
      let url = '/invoice/bill-history';
      const queryParams = new URLSearchParams();
      
      if (searchParams.search) {
        queryParams.append('search', searchParams.search);
      }
      
      if (searchParams.start_date) {
        queryParams.append('start_date', searchParams.start_date);
      }
      
      if (searchParams.end_date) {
        queryParams.append('end_date', searchParams.end_date);
      }
      
      if (queryParams.toString()) {
        url += '?' + queryParams.toString();
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching bills:', error);
      throw error;
    }
  },

  // Get single bill by ID
  getById: async (billId) => {
    try {
      const response = await apiClient.get(`/invoice/${billId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bill:', error);
      throw error;
    }
  },

  // Create new bill
  create: async (billData) => {
    try {
      const response = await apiClient.post('/invoice/store', billData);
      return response.data;
    } catch (error) {
      console.error('Error creating bill:', error);
      throw error;
    }
  },

  // Update existing bill
  update: async (billId, billData) => {
    try {
      const response = await apiClient.put(`/invoice/${billId}`, billData);
      return response.data;
    } catch (error) {
      console.error('Error updating bill:', error);
      throw error;
    }
  },

  // Delete bill
  delete: async (billId) => {
    try {
      const response = await apiClient.delete(`/invoice/${billId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting bill:', error);
      throw error;
    }
  },

  // Print bill (A4 or Thermal)
  print: async (billId, printerType = 'a4') => {
    try {
      const response = await apiClient.post(`/invoice/print/${billId}`, {
        printer_type: printerType,
        format: printerType === 'a4' ? 'pdf' : 'thermal'
      });
      return response.data;
    } catch (error) {
      console.error('Error printing bill:', error);
      throw error;
    }
  },

  // Add payment to bill
  addPayment: async (billId, paymentData) => {
    try {
      const response = await apiClient.post(`/invoice/${billId}/payment`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error adding payment:', error);
      throw error;
    }
  },

  // Get payment history for bill
  getPaymentHistory: async (billId) => {
    try {
      const response = await apiClient.get(`/invoice/${billId}/payments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  },

  // Get bill statistics
  getStats: async (dateFilter = null) => {
    try {
      let url = '/invoice/stats';
      if (dateFilter) {
        url += `?start_date=${dateFilter.start}&end_date=${dateFilter.end}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching bill stats:', error);
      throw error;
    }
  },

  // Send bill via email
  sendEmail: async (billId, emailData) => {
    try {
      const response = await apiClient.post(`/invoice/${billId}/email`, emailData);
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },

  // Send bill via WhatsApp
  sendWhatsApp: async (billId, phoneData) => {
    try {
      const response = await apiClient.post(`/invoice/${billId}/whatsapp`, phoneData);
      return response.data;
    } catch (error) {
      console.error('Error sending WhatsApp:', error);
      throw error;
    }
  }
};

export default billingAPI;
