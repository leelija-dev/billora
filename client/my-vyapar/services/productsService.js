// services/productsService.js
import api from '../utils/secureApi';
import { logger } from '../utils/logger';

class ProductsService {
  constructor() {
    // No need to store baseURL as api instance handles it
  }

  /**
   * Fetch products by category
   * @param {string|number} categoryId - Category ID
   * @param {string|number} userId - Restaurant owner/user ID
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Products data
   */
  async fetchProductsByCategory(categoryId, userId, options = {}) {
    const { page = 1, per_page = 12, search = '' } = options;
    
    try {
      const params = {
        page: String(page),
       
        user_id: String(userId)
      };
      
      if (search) params.search = search;
      
      logger.log('Fetching products by category:', { categoryId, userId, params });
      
      const response = await api.get(`/restaurant-all-products/category/${categoryId}`, {
        params
      });
      
      logger.log('Category products response:', response.data);
      
      return this.transformProductsResponse(response.data);
      
    } catch (error) {
      logger.error('Error fetching products by category:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Fetch all products for a restaurant
   * @param {string|number} userId - Restaurant owner/user ID
   * @param {Object} options - Filters and pagination options
   * @returns {Promise<Object>} Products data
   */
  async fetchAllProducts(userId, options = {}) {
    const { 
      page = 1, 
      per_page = 12, 
      search = '', 
      categoryId = null 
    } = options;
    
    try {
      // If category is specified and not 'All', use category endpoint
      if (categoryId && categoryId !== 'All') {
        return this.fetchProductsByCategory(categoryId, userId, { page, per_page, search });
      }
      
      // Otherwise fetch all products
      const params = {
        page: String(page),
        per_page: String(per_page)
      };
      
      if (search) params.search = search;
      
      logger.log('Fetching all products:', { userId, params });
      
      const response = await api.get(`/restaurant-all-products/${userId}`, {
        params
      });
      
      logger.log('All products response:', response.data);
      
      return this.transformProductsResponse(response.data);
      
    } catch (error) {
      logger.error('Error fetching all products:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Fetch products with advanced filtering
   * @param {string|number} userId - Restaurant owner/user ID
   * @param {Object} filters - Advanced filters
   * @returns {Promise<Object>} Products data
   */
  async fetchProductsWithFilters(userId, filters = {}) {
    const {
      page = 1,
      per_page = 12,
      search = '',
      categoryId = null,
      minPrice = null,
      maxPrice = null,
      inStock = null,
      sortBy = null,
      sortOrder = 'asc'
    } = filters;
    
    try {
      let endpoint;
      let params = {
        page: String(page),
        per_page: String(per_page),
        user_id: String(userId)
      };
      
      if (search) params.search = search;
      if (minPrice) params.min_price = minPrice;
      if (maxPrice) params.max_price = maxPrice;
      if (inStock !== null) params.in_stock = inStock;
      if (sortBy) {
        params.sort_by = sortBy;
        params.sort_order = sortOrder;
      }
      
      // Determine endpoint based on category
      if (categoryId && categoryId !== 'All') {
        endpoint = `/restaurant-all-products/category/${categoryId}`;
      } else {
        endpoint = `/restaurant-all-products/${userId}`;
      }
      
      logger.log('Fetching products with filters:', { endpoint, params });
      
      const response = await api.get(endpoint, { params });
      
      return this.transformProductsResponse(response.data);
      
    } catch (error) {
      logger.error('Error fetching products with filters:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get product by ID
   * @param {string|number} productId - Product ID
   * @param {string|number} userId - User ID
   * @returns {Promise<Object>} Product data
   */
  async getProductById(productId, userId) {
    try {
      const response = await api.get(`/restaurant-products/${productId}`, {
        params: { user_id: userId }
      });
      
      return this.transformProduct(response.data.product || response.data);
      
    } catch (error) {
      logger.error('Error fetching product by ID:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get multiple products by IDs
   * @param {Array} productIds - Array of product IDs
   * @param {string|number} userId - User ID
   * @returns {Promise<Array>} Products data
   */
  async getProductsByIds(productIds, userId) {
    try {
      const response = await api.post('/restaurant-products/batch', {
        product_ids: productIds,
        user_id: userId
      });
      
      const products = response.data.products || response.data;
      return Array.isArray(products) ? products.map(p => this.transformProduct(p)) : [];
      
    } catch (error) {
      logger.error('Error fetching products by IDs:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Search products (alias for fetchAllProducts with search)
   * @param {string} searchTerm - Search term
   * @param {string|number} userId - User ID
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Search results
   */
  async searchProducts(searchTerm, userId, options = {}) {
    return this.fetchAllProducts(userId, {
      ...options,
      search: searchTerm
    });
  }

  /**
   * Get categories for a store/restaurant
   * @param {string|number} userId - User ID
   * @returns {Promise<Array>} Categories list
   */
  async getCategories(userId) {
    try {
      // Try to get categories from dedicated endpoint first
      try {
        const response = await api.get('/categories', {
          params: { user_id: userId }
        });
        
        if (response.data.categories && Array.isArray(response.data.categories)) {
          return [{ id: 'All', name: 'All' }, ...response.data.categories];
        }
      } catch (err) {
        logger.warn('Could not fetch from categories endpoint, falling back to products endpoint');
      }
      
      // Fallback: Get categories from products endpoint
      const result = await this.fetchAllProducts(userId, { page: 1, per_page: 1 });
      return result.categories;
      
    } catch (error) {
      logger.error('Error fetching categories:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get featured products
   * @param {string|number} userId - User ID
   * @param {number} limit - Number of products to fetch
   * @returns {Promise<Array>} Featured products
   */
  async getFeaturedProducts(userId, limit = 8) {
    try {
      const response = await api.get(`/restaurant-all-products/${userId}/featured`, {
        params: { limit, user_id: userId }
      });
      
      const result = this.transformProductsResponse(response.data);
      return result.products;
      
    } catch (error) {
      logger.error('Error fetching featured products:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get products by brand
   * @param {string|number} brandId - Brand ID
   * @param {string|number} userId - User ID
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Products data
   */
  async fetchProductsByBrand(brandId, userId, options = {}) {
    const { page = 1, per_page = 12, search = '' } = options;
    
    try {
      const params = {
        page: String(page),
        per_page: String(per_page),
        user_id: String(userId)
      };
      
      if (search) params.search = search;
      
      const response = await api.get(`/restaurant-all-products/brand/${brandId}`, {
        params
      });
      
      return this.transformProductsResponse(response.data);
      
    } catch (error) {
      logger.error('Error fetching products by brand:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Transform API response to consistent format
   * @param {Object} responseData - Raw API response
   * @returns {Object} Transformed data
   */
  transformProductsResponse(responseData) {
    // Extract products array
    let productsArray = [];
    if (responseData?.products?.data && Array.isArray(responseData.products.data)) {
      productsArray = responseData.products.data;
    } else if (responseData?.data && Array.isArray(responseData.data)) {
      productsArray = responseData.data;
    } else if (Array.isArray(responseData)) {
      productsArray = responseData;
    } else if (responseData?.products && Array.isArray(responseData.products)) {
      productsArray = responseData.products;
    }
    
    // Transform products
    const transformedProducts = productsArray.map(product => this.transformProduct(product));
    
    // Extract pagination info
    const pagination = {
      current_page: responseData.current_page || responseData.products?.current_page || 1,
      last_page: responseData.last_page || responseData.products?.last_page || 1,
      per_page: responseData.per_page || responseData.products?.per_page || 12,
      total: responseData.total || responseData.products?.total || 0,
      next_page_url: responseData.next_page_url || responseData.products?.next_page_url || null,
      prev_page_url: responseData.prev_page_url || responseData.products?.prev_page_url || null,
      first_page_url: responseData.first_page_url || responseData.products?.first_page_url || null,
      last_page_url: responseData.last_page_url || responseData.products?.last_page_url || null,
      links: responseData.links || responseData.products?.links || []
    };
    
    // Extract categories - check multiple possible locations
    let categories = [{ id: 'All', name: 'All' }];
    
    if (responseData.categories && Array.isArray(responseData.categories)) {
      categories = [{ id: 'All', name: 'All' }, ...responseData.categories];
    } else if (responseData.data?.categories && Array.isArray(responseData.data.categories)) {
      categories = [{ id: 'All', name: 'All' }, ...responseData.data.categories];
    } else if (responseData.products?.categories && Array.isArray(responseData.products.categories)) {
      categories = [{ id: 'All', name: 'All' }, ...responseData.products.categories];
    }
    
    // Extract store info
    const storeId = responseData?.stores && responseData.stores.length > 0
      ? responseData.stores[0].id
      : responseData?.store_id || null;
    
    return {
      products: transformedProducts,
      pagination,
      categories,
      storeId,
      rawData: responseData
    };
  }

  /**
   * Transform single product data
   * @param {Object} product - Raw product data
   * @returns {Object} Transformed product
   */
  transformProduct(product) {
    if (!product) return null;
    
    let imageUrl = this.processProductImage(product.image);
    
    return {
      id: product.id,
      name: product.name || 'Unnamed Product',
      selling_price: parseFloat(product.selling_price) || 0,
      price: parseFloat(product.selling_price) || 0,
      original_price: parseFloat(product.original_price) || parseFloat(product.selling_price) || 0,
      category: product.category?.name || product.category_name || 'General',
      category_id: product.category?.id || product.category_id || null,
      brand: product.brand?.name || product.brand_name || 'Unknown',
      brand_id: product.brand?.id || product.brand_id || null,
      unit: product.unit?.name || product.unit_name || 'Piece',
      unit_id: product.unit_id || 1,
      inStock: product.is_active === 1 || product.is_active === true || product.in_stock === true,
      is_active: product.is_active,
      discount_percentage: parseFloat(product.discount_percentage) || 0,
      gst_percentage: parseFloat(product.gst_percentage) || 0,
      description: product.description || '',
      sku: product.sku || '',
      quantity: product.quantity || 0,
      img: imageUrl,
      created_at: product.created_at,
      updated_at: product.updated_at
    };
  }

  /**
   * Process product image URL
   * @param {string} imageUrl - Raw image URL
   * @returns {string} Processed image URL
   */
  processProductImage(imageUrl) {
    if (!imageUrl || imageUrl === '') {
      return 'https://placehold.co/400x400/f0f0f0/999?text=No+Image';
    }
    
    // Handle Google Drive images
    if (imageUrl.includes('drive.google.com')) {
      let fileId = null;
      
      if (imageUrl.includes('/file/d/')) {
        const match = imageUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        fileId = match ? match[1] : null;
      } else if (imageUrl.includes('uc?export=view')) {
        const match = imageUrl.match(/id=([a-zA-Z0-9_-]+)/);
        fileId = match ? match[1] : null;
      } else if (imageUrl.includes('open?id=')) {
        const match = imageUrl.match(/id=([a-zA-Z0-9_-]+)/);
        fileId = match ? match[1] : null;
      }
      
      if (fileId) {
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h400`;
      }
      return 'https://placehold.co/400x400/f0f0f0/999?text=Invalid+Image';
    }
    
    // Handle relative paths
    if (imageUrl.startsWith('/')) {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
      return `${baseURL}${imageUrl}`;
    }
    
    // Handle quoted URLs
    const cleanUrl = imageUrl.replace(/^"|"$/g, '');
    
    // Handle storage paths that don't have protocol
    if (cleanUrl && !cleanUrl.startsWith('http') && !cleanUrl.startsWith('https')) {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
      // Remove /api from baseURL for storage paths
      const storageBaseURL = baseURL.replace(/\/api$/, '');
      return `${storageBaseURL}/storage/${cleanUrl}`;
    }
    
    return cleanUrl;
  }

  /**
   * Handle API errors consistently
   * @param {Error} error - Axios error object
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 
                     error.response.data?.error || 
                     `Server error: ${error.response.status}`;
      return new Error(message);
    } else if (error.request) {
      // Request was made but no response
      return new Error('Network error: Unable to connect to server');
    } else {
      // Something else happened
      return error;
    }
  }
}

// Create and export singleton instance
export const productsService = new ProductsService();