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
      
      // Handle attributes field - send as array
      if (productData.attributes && Array.isArray(productData.attributes)) {
        productData.attributes.forEach((attr, index) => {
          if (typeof attr === 'object' && attr !== null) {
            // Send each attribute object as individual FormData entries
            Object.keys(attr).forEach(key => {
              formData.append(`attributes[${index}][${key}]`, attr[key]);
            });
          }
        });
      }
      
      if (productData.medicine_type_id) formData.append('medicine_type_id', productData.medicine_type_id);
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
      if (productData.warranty_months !== undefined && productData.warranty_months !== null && !isNaN(productData.warranty_months)) {
        formData.append('warranty_months', productData.warranty_months);
      }
      if (productData.warehouse_location) formData.append('warehouse_location', productData.warehouse_location);
      if (productData.supplier_id) formData.append('supplier_id', productData.supplier_id);
      if (productData.updated_by) formData.append('updated_by', productData.updated_by);
      if (productData.image) formData.append('image', productData.image);
      
      // Handle images (multiple)
      // if (productData.image && Array.isArray(productData.image)) {
      //   productData.images.forEach((image, index) => {
      //     if (image instanceof File) {
      //       formData.append(`images[${index}]`, productData.image);
      //     }
      //   });
      // }
      
      // Handle QR code (backend will generate, but allow upload if needed)
      if (productData.qr_code instanceof File) {
        formData.append('qr_code', productData.qr_code);
      }
      
      // Handle variants (array) - send as individual objects for proper parsing
      if (productData.variants && Array.isArray(productData.variants)) {
        productData.variants.forEach((variant, index) => {
          if (variant.size) formData.append(`variants[${index}][size]`, variant.size);
          if (variant.color) formData.append(`variants[${index}][color]`, variant.color);
          if (variant.material) formData.append(`variants[${index}][material]`, variant.material);
          if (variant.gender) formData.append(`variants[${index}][gender]`, variant.gender);
        });
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
      console.log(`Updating product ${id} with data:`, productData);
      
      // Check if there are any new image files to upload
      const hasNewImages = productData.image instanceof File || 
                          (Array.isArray(productData.images) && productData.images.some(img => img instanceof File));
      
      let response;
      
      if (hasNewImages) {
        // Use FormData for updates with new images
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
        if (productData.updated_by) formData.append('updated_by', productData.updated_by);
        
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
        
        // Handle attributes field - send as array
        if (productData.attributes && Array.isArray(productData.attributes)) {
          productData.attributes.forEach((attr, index) => {
            if (typeof attr === 'object' && attr !== null) {
              // Send each attribute object as individual FormData entries
              Object.keys(attr).forEach(key => {
                formData.append(`attributes[${index}][${key}]`, attr[key]);
              });
            }
          });
        }
        
        // Medicine and other fields
        if (productData.medicine_type_id) formData.append('medicine_type_id', productData.medicine_type_id);
        if (productData.expiry_date) formData.append('expiry_date', productData.expiry_date);
        if (productData.batch_number) formData.append('batch_number', productData.batch_number);
        if (productData.manufacturer_name) formData.append('manufacturer_name', productData.manufacturer_name);
        if (productData.prescription_required !== undefined) formData.append('prescription_required', productData.prescription_required);
        if (productData.schedule_type) formData.append('schedule_type', productData.schedule_type);
        if (productData.salt_composition) formData.append('salt_composition', productData.salt_composition);
        if (productData.perishable !== undefined) formData.append('perishable', productData.perishable);
        if (productData.organic_certified !== undefined) formData.append('organic_certified', productData.organic_certified);
        if (productData.harvest_date) formData.append('harvest_date', productData.harvest_date);
        if (productData.storage_instructions) formData.append('storage_instructions', productData.storage_instructions);
        if (productData.short_description) formData.append('short_description', productData.short_description);
        if (productData.is_featured !== undefined) formData.append('is_featured', productData.is_featured);
        if (productData.is_returnable !== undefined) formData.append('is_returnable', productData.is_returnable);
        if (productData.is_refundable !== undefined) formData.append('is_refundable', productData.is_refundable);
        if (productData.warranty_months) formData.append('warranty_months', productData.warranty_months);
        if (productData.warehouse_location) formData.append('warehouse_location', productData.warehouse_location);
        if (productData.supplier_id) formData.append('supplier_id', productData.supplier_id);
        
        // Handle main image
        if (productData.image instanceof File) {
          formData.append('image', productData.image);
        }
        
        // Handle variants (array) - send as individual objects for proper parsing
        if (productData.variants && Array.isArray(productData.variants)) {
          productData.variants.forEach((variant, index) => {
            if (variant.size) formData.append(`variants[${index}][size]`, variant.size);
            if (variant.color) formData.append(`variants[${index}][color]`, variant.color);
            if (variant.material) formData.append(`variants[${index}][material]`, variant.material);
            if (variant.gender) formData.append(`variants[${index}][gender]`, variant.gender);
          });
        }
        
        // Add _method field for Laravel PUT request via POST
        formData.append('_method', 'PUT');
        
        response = await apiClient.post(`/products/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Use JSON for updates without new images (cleaner and faster)
        const cleanedData = { ...productData };
        
        // Remove fields that shouldn't be sent in update (images, variants arrays, etc.)
        delete cleanedData.images;
        delete cleanedData.variants;
        delete cleanedData.created_at;
        delete cleanedData.updated_at;
        delete cleanedData.deleted_at;
        delete cleanedData.lowStock;
        delete cleanedData.lowStockThreshold;
        delete cleanedData.maxStock;
        delete cleanedData.stock;
        delete cleanedData.slug;
        
        // Handle warranty_months - if empty or null, don't send it
        if (!cleanedData.warranty_months || cleanedData.warranty_months === '') {
          delete cleanedData.warranty_months;
        }
        
        // Handle other nullable fields that might cause constraint violations
        const nullableFields = [
          'conversion_factor', 'minimum_stock_quantity', 'maximum_stock_quantity', 'current_stock',
          'mrp', 'wholesale_price', 'gst_hsn_code', 'discount_amount', 'cess_percentage',
          'medicine_type', 'other_medicine_type', 'expiry_date', 'batch_number', 'manufacturer_name',
          'schedule_type', 'salt_composition', 'harvest_date', 'storage_instructions',
          'short_description', 'warehouse_location', 'supplier_id', 'updated_by'
        ];
        
        nullableFields.forEach(field => {
          if (!cleanedData[field] || cleanedData[field] === '') {
            delete cleanedData[field];
          }
        });
        
        response = await apiClient.put(`/products/${id}`, cleanedData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      
      console.log('Product updated successfully:', response.data);
      return response;
    } catch (error) {
      console.error(`Failed to update product ${id}:`, error);
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

  // Get products by URL (for pagination)
  getByUrl: async (url) => {
    try {
      console.log('📦 Fetching products by URL:', url);
      // Extract the path from the full URL to make a relative request
      const urlPath = url.replace(import.meta.env.VITE_API_BASE_URL, '');
      const response = await apiClient.get(urlPath);
      console.log('📦 Products fetched by URL successfully:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch products by URL:', error);
      throw error.response?.data || error.message;
    }
  },
};
