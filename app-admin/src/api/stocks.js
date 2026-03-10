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
      return await api.get('/brands/stocks/', { params });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single stock
  getById: async (id) => {
    try {
      const api = getStocksData();
      return await api.get(`/brands/stocks/${id}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create stock
  create: async (stockData) => {
    try {
      const api = getStocksData();
      return await api.post('/brands/stocks/store', {
        user_id: stockData.userId,
        product_id: stockData.productId,
        quantity: stockData.quantity,
        selling_price: stockData.sellingPrice,
        product_package_id: stockData.productPackageId,
        purchase_price: stockData.purchasePrice,
        unit_id: stockData.unitId,
        created_by: stockData.createdBy,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update stock
  update: async (id, stockData) => {
    try {
      const api = getStocksData();
      return await api.put(`/brands/stocks/${id}`, {
        product_id: stockData.productId,
        quantity: stockData.quantity,
        selling_price: stockData.sellingPrice,
        product_package_id: stockData.productPackageId,
        purchase_price: stockData.purchasePrice,
        unit_id: stockData.unitId,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete stock
  delete: async (id) => {
    try {
      const api = getStocksData();
      return await api.delete(`/brands/stocks/${id}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add stock / Update stock quantity
  addStock: async (id, quantity, price = null) => {
    try {
      const api = getStocksData();
      return await api.post(`/brands/stocks/add-stock/${id}`, {
        quantity,
        selling_price: price,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get stock by product
  getByProduct: async (productId) => {
    try {
      const api = getStocksData();
      return await api.get(`/brands/stocks/product/${productId}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get low stock items
  getLowStock: async (threshold = 10) => {
    try {
      const api = getStocksData();
      return await api.get('/brands/stocks/low-stock', {
        params: { threshold }
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get stock movements
  getMovements: async (stockId, params = {}) => {
    try {
      const api = getStocksData();
      return await api.get(`/brands/stocks/${stockId}/movements`, { params });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Stock transfer between locations
  transfer: async (fromStockId, toStockId, quantity) => {
    try {
      const api = getStocksData();
      return await api.post('/brands/stocks/transfer', {
        from_stock_id: fromStockId,
        to_stock_id: toStockId,
        quantity,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
