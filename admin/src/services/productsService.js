import { apiClient } from './apiClient';

export const productsAPI = {
  // Get all products
  getAll: async (search = '') => {
    try {
      const params = search ? { search } : {};
      console.log('📦 Fetching all products with params:', params);
      const response = await apiClient.get('/products', { params });
      console.log('📦 Products fetched successfully:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch products:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get single product
  getById: async (id) => {
    try {
      console.log(`📦 Fetching product with ID: ${id}`);
      const response = await apiClient.get(`/products/${id}`);
      console.log('📦 Product fetched successfully:', response.data);
      return response;
    } catch (error) {
      console.error(`❌ Failed to fetch product ${id}:`, error);
      throw error.response?.data || error.message;
    }
  },

  // Create product
  create: async (productData) => {
    try {
      console.log('📦 Creating product with data:', productData);
      const response = await apiClient.post('/products/store', {
        user_id: productData.user_id,
        sku: productData.sku,
        name: productData.name,
        brand_id: productData.brand_id,
        category_id: productData.category_id,
        unit_amount: productData.unit_amount,
        unit_id: productData.unit_id,
        selling_price: productData.selling_price,
        purchase_price: productData.purchase_price,
        gst_percentage: productData.gst_percentage,
        discount_percentage: productData.discount_percentage,
        description: productData.description,
        is_active: productData.is_active ?? true,
        created_by: productData.created_by,
      });
      console.log('📦 Product created successfully:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Failed to create product:', error);
      throw error.response?.data || error.message;
    }
  },

  // Update product
  update: async (id, productData) => {
    try {
      console.log(`📦 Updating product ${id} with data:`, productData);
      const response = await apiClient.put(`/products/${id}`, {
        user_id: productData.user_id,
        name: productData.name,
        brand_id: productData.brand_id,
        category_id: productData.category_id,
        unit_amount: productData.unit_amount,
        unit_id: productData.unit_id,
        selling_price: productData.selling_price,
        purchase_price: productData.purchase_price,
        gst_percentage: productData.gst_percentage,
        discount_percentage: productData.discount_percentage,
        description: productData.description,
        is_active: productData.is_active,
        created_by: productData.created_by,
      });
      console.log('📦 Product updated successfully:', response.data);
      return response;
    } catch (error) {
      console.error(`❌ Failed to update product ${id}:`, error);
      throw error.response?.data || error.message;
    }
  },

  // Delete product (soft delete)
  delete: async (id) => {
    try {
      console.log(`📦 Deleting product with ID: ${id}`);
      const response = await apiClient.delete(`/products/${id}`);
      console.log('📦 Product deleted successfully');
      return response;
    } catch (error) {
      console.error(`❌ Failed to delete product ${id}:`, error);
      throw error.response?.data || error.message;
    }
  },

  // Restore product (soft delete undo)
  restore: async (id) => {
    try {
      console.log(`📦 Restoring product with ID: ${id}`);
      const response = await apiClient.patch(`/products/${id}`);
      console.log('📦 Product restored successfully');
      return response;
    } catch (error) {
      console.error(`❌ Failed to restore product ${id}:`, error);
      throw error.response?.data || error.message;
    }
  },

  // Permanently delete product
  forceDelete: async (id) => {
    try {
      console.log(`📦 Permanently deleting product with ID: ${id}`);
      const response = await apiClient.delete(`/products/${id}/force`);
      console.log('📦 Product permanently deleted');
      return response;
    } catch (error) {
      console.error(`❌ Failed to permanently delete product ${id}:`, error);
      throw error.response?.data || error.message;
    }
  },

  // Search products
  search: async (query, filters = {}) => {
    try {
      console.log('📦 Searching products with query:', query, filters);
      const response = await apiClient.get('/products', {
        params: { search: query, ...filters }
      });
      console.log('📦 Products search results:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Failed to search products:', error);
      throw error.response?.data || error.message;
    }
  },
};
