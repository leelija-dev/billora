import { apiClient } from './client';
import { mockStocks } from './mock/stocks';

// Get stocks data based on project mode
const getStocksData = () => {
  const projectMode = process.env.EXPO_PUBLIC_PROJECT_MODE || 'mock';
  return projectMode === 'mock' ? mockStocks : apiClient;
};

export const stocksAPI = {
  // Get all stocks
  getAll: async (params = {}) => {
    try {
      const api = getStocksData();
      const response = await api.get('/stocks/', { params });
      console.log('Stocks API Response:', response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single stock
  getById: async (id) => {
    try {
      const api = getStocksData();
      const response = await api.get(`/stocks/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new stock
  create: async (stockData) => {
    try {
      const api = getStocksData();
      
      // Map frontend field names to API expected field names
      const payload = {
        user_id: stockData.userId || stockData.user_id,
        product_id: stockData.productId,
        quantity: parseInt(stockData.quantity) || 0,
        selling_price: parseFloat(stockData.sellingPrice) || 0,
        product_package_id: stockData.productPackageId || null,
        purchase_price: parseFloat(stockData.purchasePrice) || null,
        unit_id: stockData.unitId || null,
        created_by: stockData.createdBy || stockData.userId || stockData.user_id,
      };
      
      console.log('Create Stock API payload:', payload);
      const response = await api.post('/stocks/store', payload);
      return response.data;
    } catch (error) {
      console.error('Create Stock API error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update stock
  update: async (id, stockData) => {
    try {
      const api = getStocksData();
      
      // Map frontend field names to API expected field names
      const payload = {
        quantity: parseInt(stockData.quantity) || 0,
        selling_price: parseFloat(stockData.sellingPrice) || 0,
        product_package_id: stockData.productPackageId || null,
        purchase_price: parseFloat(stockData.purchasePrice) || null,
        unit_id: stockData.unitId || null,
      };
      
      console.log('Update Stock API payload:', payload);
      const response = await api.put(`/stocks/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Update Stock API error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Delete stock
  delete: async (id) => {
    try {
      const api = getStocksData();
      const response = await api.delete(`/stocks/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add stock (increment quantity)
  addStock: async (id, stockData) => {
    try {
      const api = getStocksData();
      const response = await api.post(`/stocks/add-stock/${id}`, {
        quantity: parseInt(stockData.quantity) || 0,
        user_id: stockData.userId || stockData.user_id,
      });
      return response.data;
    } catch (error) {
      console.error('Add Stock API error:', error.response?.data || error.message);
      throw error;
    }
  },

  // Search stocks
  search: async (query, filters = {}) => {
    try {
      const api = getStocksData();
      const response = await api.get('/stocks/', {
        params: { search: query, ...filters }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get stocks by product
  getByProduct: async (productId) => {
    try {
      const api = getStocksData();
      const response = await api.get(`/stocks/product/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};