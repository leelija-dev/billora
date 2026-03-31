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
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all product fields to FormData
      if (productData.user_id) formData.append('user_id', productData.user_id);
      if (productData.sku) formData.append('sku', productData.sku);
      if (productData.name) formData.append('name', productData.name);
      if (productData.brand_id) formData.append('brand_id', productData.brand_id);
      if (productData.category_id) formData.append('category_id', productData.category_id);
      if (productData.unit_amount) formData.append('unit_amount', productData.unit_amount);
      if (productData.unit_id) formData.append('unit_id', productData.unit_id);
      if (productData.selling_price) formData.append('selling_price', productData.selling_price);
      if (productData.purchase_price) formData.append('purchase_price', productData.purchase_price);
      if (productData.gst_percentage) formData.append('gst_percentage', productData.gst_percentage);
      if (productData.discount_percentage) formData.append('discount_percentage', productData.discount_percentage);
      if (productData.description) formData.append('description', productData.description);
      if (productData.created_by) formData.append('created_by', productData.created_by);
      
      // Add image file if present
      if (productData.image) {
        formData.append('image', productData.image);
      }
      
      // Add QR code image file if present
      if (productData.qr_code) {
        formData.append('qr_code', productData.qr_code);
      }
      
      // Set is_active default to true if not provided
      formData.append('is_active', productData.is_active ?? true);
      
      const response = await apiClient.post('/products/store', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all product fields to FormData
      if (productData.user_id) formData.append('user_id', productData.user_id);
      if (productData.name) formData.append('name', productData.name);
      if (productData.brand_id) formData.append('brand_id', productData.brand_id);
      if (productData.category_id) formData.append('category_id', productData.category_id);
      if (productData.unit_amount) formData.append('unit_amount', productData.unit_amount);
      if (productData.unit_id) formData.append('unit_id', productData.unit_id);
      if (productData.selling_price) formData.append('selling_price', productData.selling_price);
      if (productData.purchase_price) formData.append('purchase_price', productData.purchase_price);
      if (productData.gst_percentage) formData.append('gst_percentage', productData.gst_percentage);
      if (productData.discount_percentage) formData.append('discount_percentage', productData.discount_percentage);
      if (productData.description) formData.append('description', productData.description);
      if (productData.created_by) formData.append('created_by', productData.created_by);
      
      // Add image file if present
      if (productData.image) {
        formData.append('image', productData.image);
      }
      
      // Add QR code image file if present
      if (productData.qr_code) {
        formData.append('qr_code', productData.qr_code);
      }
      
      // Set is_active default to true if not provided
      if (productData.is_active !== undefined) {
        formData.append('is_active', true);
      } else {
        formData.append('is_active', productData.is_active);
      }
      
      const response = await apiClient.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
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
