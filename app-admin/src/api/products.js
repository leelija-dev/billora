import { apiClient } from './client';
import { mockProducts } from './mock/products';

// Get products data based on project mode
const getProductsData = () => {
  const projectMode = process.env.EXPO_PUBLIC_PROJECT_MODE || 'mock';
  return projectMode === 'mock' ? mockProducts : apiClient;
};

export const productsAPI = {
  // Get all products
  getAll: async (params = {}) => {
    try {
      const api = getProductsData();
      return await api.get('/products', { params });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get single product
  getById: async (id) => {
    try {
      const api = getProductsData();
      return await api.get(`/products/${id}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new product
  create: async (productData) => {
    try {
      const api = getProductsData();
      return await api.post('/products/store', {
        user_id: productData.userId,
        sku: productData.sku,
        name: productData.name,
        brand_id: productData.brandId,
        category_id: productData.categoryId,
        unit_amount: productData.unitAmount,
        unit_id: productData.unitId,
        selling_price: productData.sellingPrice,
        purchase_price: productData.purchasePrice,
        gst_percentage: productData.gstPercentage,
        discount_percentage: productData.discountPercentage,
        description: productData.description,
        is_active: productData.isActive ?? true,
        created_by: productData.createdBy,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update product
  update: async (id, productData) => {
    try {
      const api = getProductsData();
      return await api.put(`/products/${id}`, {
        sku: productData.sku,
        name: productData.name,
        brand_id: productData.brandId,
        category_id: productData.categoryId,
        unit_amount: productData.unitAmount,
        unit_id: productData.unitId,
        selling_price: productData.sellingPrice,
        purchase_price: productData.purchasePrice,
        gst_percentage: productData.gstPercentage,
        discount_percentage: productData.discountPercentage,
        description: productData.description,
        is_active: productData.isActive,
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete product
  delete: async (id) => {
    try {
      const api = getProductsData();
      return await api.delete(`/products/${id}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search products
  search: async (query, filters = {}) => {
    try {
      const api = getProductsData();
      return await api.get('/products/search', {
        params: { q: query, ...filters }
      });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get products by category
  getByCategory: async (categoryId) => {
    try {
      const api = getProductsData();
      return await api.get(`/products/category/${categoryId}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get products by brand
  getByBrand: async (brandId) => {
    try {
      const api = getProductsData();
      return await api.get(`/products/brand/${brandId}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Legacy methods for backward compatibility
  getProducts: async (params = {}) => {
    try {
      const api = getProductsData();
      return await api.get('/products', { params });
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getProduct: async (id) => {
    try {
      const api = getProductsData();
      return await api.get(`/products/${id}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createProduct: async (productData) => {
    return await productsAPI.create(productData);
  },

  updateProduct: async (id, productData) => {
    return await productsAPI.update(id, productData);
  },

  deleteProduct: async (id) => {
    return await productsAPI.delete(id);
  },

  searchProducts: async (query, filters = {}) => {
    return await productsAPI.search(query, filters);
  },

  getProductCategories: async () => {
    try {
      const api = getProductsData();
      return await api.get('/products/categories');
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateStock: async (id, stockData) => {
    try {
      const api = getProductsData();
      return await api.patch(`/products/${id}/stock`, stockData);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};
