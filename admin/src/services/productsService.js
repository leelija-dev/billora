import { apiClient } from './apiClient';

export const productsAPI = {
  // Get create page data (brands, categories, units, input permissions)
  getCreatePage: async (userId) => {
    try {
      console.log(`Fetching create page data for user: ${userId}`);
      const response = await apiClient.get(`/products/create/${userId}`);
      console.log('Create page data fetched successfully:', response.data);
      return response;
    } catch (error) {
      console.error('Failed to fetch create page data:', error);
      throw error.response?.data || error.message;
    }
  },

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
      console.log('Creating product with data:', productData);
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Core required fields
      if (productData.user_id) formData.append('user_id', productData.user_id);
      if (productData.sku) formData.append('sku', productData.sku);
      if (productData.name) formData.append('name', productData.name);
      if (productData.category_id) formData.append('category_id', productData.category_id);
      if (productData.unit_amount) formData.append('unit_amount', productData.unit_amount);
      if (productData.unit_id) formData.append('unit_id', productData.unit_id);
      if (productData.is_active !== undefined) formData.append('is_active', productData.is_active);
      if (productData.created_by) formData.append('created_by', productData.created_by);
      
      // Optional fields
      if (productData.brand_id) formData.append('brand_id', productData.brand_id);
      if (productData.selling_price) formData.append('selling_price', productData.selling_price);
      if (productData.purchase_price) formData.append('purchase_price', productData.purchase_price);
      if (productData.gst_percentage) formData.append('gst_percentage', productData.gst_percentage);
      if (productData.discount_percentage) formData.append('discount_percentage', productData.discount_percentage);
      if (productData.description) formData.append('description', productData.description);
      
      // Additional optional fields
      if (productData.conversion_factor) formData.append('conversion_factor', productData.conversion_factor);
      if (productData.minimum_stock_quantity) formData.append('minimum_stock_quantity', productData.minimum_stock_quantity);
      if (productData.maximum_stock_quantity) formData.append('maximum_stock_quantity', productData.maximum_stock_quantity);
      if (productData.current_stock) formData.append('current_stock', productData.current_stock);
      if (productData.mrp) formData.append('mrp', productData.mrp);
      if (productData.wholesale_price) formData.append('wholesale_price', productData.wholesale_price);
      if (productData.gst_hsn_code) formData.append('gst_hsn_code', productData.gst_hsn_code);
      if (productData.discount_amount) formData.append('discount_amount', productData.discount_amount);
      if (productData.cess_percentage) formData.append('cess_percentage', productData.cess_percentage);
      if (productData.attributes) formData.append('attributes', productData.attributes);
      if (productData.medicine_type) formData.append('medicine_type', productData.medicine_type);
      if (productData.other_medicine_type) formData.append('other_medicine_type', productData.other_medicine_type);
      if (productData.expiry_date) formData.append('expiry_date', productData.expiry_date);
      if (productData.batch_number) formData.append('batch_number', productData.batch_number);
      if (productData.manufacturer_name) formData.append('manufacturer_name', productData.manufacturer_name);
      if (productData.prescription_required) formData.append('prescription_required', productData.prescription_required);
      if (productData.schedule_type) formData.append('schedule_type', productData.schedule_type);
      if (productData.salt_composition) formData.append('salt_composition', productData.salt_composition);
      if (productData.perishable) formData.append('perishable', productData.perishable);
      if (productData.organic_certified) formData.append('organic_certified', productData.organic_certified);
      if (productData.harvest_date) formData.append('harvest_date', productData.harvest_date);
      if (productData.storage_instructions) formData.append('storage_instructions', productData.storage_instructions);
      if (productData.short_description) formData.append('short_description', productData.short_description);
      if (productData.is_featured) formData.append('is_featured', productData.is_featured);
      if (productData.is_returnable) formData.append('is_returnable', productData.is_returnable);
      if (productData.is_refundable) formData.append('is_refundable', productData.is_refundable);
      if (productData.warranty_months) formData.append('warranty_months', productData.warranty_months);
      if (productData.warehouse_location) formData.append('warehouse_location', productData.warehouse_location);
      if (productData.supplier_id) formData.append('supplier_id', productData.supplier_id);
      if (productData.updated_by) formData.append('updated_by', productData.updated_by);
      
      // Handle images (multiple)
      if (productData.images && Array.isArray(productData.images)) {
        productData.images.forEach((image, index) => {
          if (image instanceof File) {
            formData.append(`images[${index}]`, image);
          }
        });
      }
      
      // Handle QR code (backend will generate, but allow upload if needed)
      if (productData.qr_code instanceof File) {
        formData.append('qr_code', productData.qr_code);
      }
      
      // Handle variants (array)
      if (productData.variants && Array.isArray(productData.variants)) {
        formData.append('variants', JSON.stringify(productData.variants));
      }
      
      const response = await apiClient.post('/products/store', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Product created successfully:', response.data);
      return response;
    } catch (error) {
      console.error('Failed to create product:', error);
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
