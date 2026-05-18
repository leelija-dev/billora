import { create } from 'zustand';
import { gstAPI } from '../services';
import toast from 'react-hot-toast';
import { useAuthStore } from './authStore';

// Cache for GST data
const gstCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

const isCacheValid = (cacheEntry) => {
  return cacheEntry && (Date.now() - cacheEntry.timestamp) < CACHE_EXPIRY;
};

const getCachedData = (cacheKey) => {
  const entry = gstCache.get(cacheKey);
  if (isCacheValid(entry)) {
    return entry.data;
  }
  gstCache.delete(cacheKey);
  return null;
};

const setCachedData = (cacheKey, data) => {
  gstCache.set(cacheKey, { data, timestamp: Date.now() });
};

export const useGstStore = create((set, get) => ({
  selectedCollection: null,
  selectedProducts: [],
  loading: false,
  productsLoading: false,
  updatingStatus: false,
  
  // Cache state
  lastFetchTime: null,
  cacheKey: null,

  // Fetch GST collection details for a specific user
  fetchGstCollectionDetails: async (userId) => {
    set({ loading: true });

    try {
      const response = await gstAPI.getGstCollection(userId);
      const responseData = response.data;
      
      // Get collections and products
      const collections = responseData.data || [];
      const products = responseData['all products'] || [];
      
      // Create a comprehensive product lookup map with all product details
      const productMap = {};
      products.forEach(item => {
        // Store all product data including name
        if (item.product_id) {
          productMap[item.product_id] = {
            product_id: item.product_id,
            name: item.product?.name || item.product_name || `Product ${item.product_id}`,
            sku: item.product?.sku || item.sku || null,
            total_quantity: parseFloat(item.total_quantity) || 0,
            total_purchase_price: parseFloat(item.total_purchase_price) || 0,
            total_purchase_gst: parseFloat(item.total_purchase_gst) || 0,
            total_selling_price: parseFloat(item.total_selling_price) || 0,
            total_selling_gst: parseFloat(item.total_selling_gst) || 0,
            total_products: parseInt(item.total_products) || 0,
            product: item.product || null
          };
        }
      });
      
      console.log('Product Map created:', productMap);
      
      // Merge product information into collections
      const enrichedCollections = collections.map(collection => {
        const productInfo = productMap[collection.product_id];
        return {
          ...collection,
          product: productInfo || null,
          product_name: productInfo?.name || `Product ${collection.product_id}`,
          product_sku: productInfo?.sku || null,
          product_details: productInfo // Store full product details
        };
      });
      
      // Extract clean product data from the products array (aggregated data)
      const cleanProducts = products.map(item => {
        return {
          product_id: item.product_id,
          product_name: item.product?.name || item.product_name || `Product ${item.product_id}`,
          total_quantity: parseFloat(item.total_quantity) || 0,
          total_purchase_price: parseFloat(item.total_purchase_price) || 0,
          total_purchase_gst: parseFloat(item.total_purchase_gst) || 0,
          total_selling_price: parseFloat(item.total_selling_price) || 0,
          total_selling_gst: parseFloat(item.total_selling_gst) || 0,
          total_products: parseInt(item.total_products) || 0,
          product: item.product || null
        };
      });

      // Handle the API response structure
      const gstData = {
        collections: enrichedCollections,
        products: cleanProducts,
        totalGST: responseData['Total GST'] || '0',
        govtGSTDue: responseData['Govt GST Due'] || '0',
        summary: {
          totalCollections: enrichedCollections.length || 0,
          totalProducts: cleanProducts.length || 0
        }
      };
      
      console.log('Enriched GST Data with Product Names:', gstData);
      console.log('Sample collection with product name:', enrichedCollections[0]);
      console.log('Clean Products with names:', cleanProducts);
      
      set({ 
        selectedCollection: gstData,
        selectedProducts: gstData.products,
        loading: false 
      });
      return gstData;
    } catch (error) {
      console.error('Failed to fetch GST collection details:', error);
      toast.error(error.message || 'Failed to fetch GST collection details');
      set({ loading: false });
      throw error;
    }
  },

  // Fetch all products for GST collection
  fetchGstProducts: async (productId) => {
    set({ productsLoading: true });

    try {
      const response = await gstAPI.getAllProducts(productId);
      set({ 
        selectedProducts: Array.isArray(response.data) ? response.data : [],
        productsLoading: false 
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch GST products:', error);
      toast.error(error.message || 'Failed to fetch GST products');
      set({ productsLoading: false });
      throw error;
    }
  },

  // Update GST payment status
  updatePaymentStatus: async (collectionId, statusData) => {
    set({ updatingStatus: true });

    try {
      const response = await gstAPI.updateGstPaymentStatus(collectionId, statusData);
      
      // Update the selected collection
      const { selectedCollection } = get();
      if (selectedCollection && selectedCollection.id === collectionId) {
        set({ 
          selectedCollection: { ...selectedCollection, ...response.data },
          updatingStatus: false 
        });
      } else {
        set({ updatingStatus: false });
      }
      
      toast.success('GST payment status updated successfully');
      return response.data;
    } catch (error) {
      console.error('Failed to update GST payment status:', error);
      toast.error(error.message || 'Failed to update GST payment status');
      set({ updatingStatus: false });
      throw error;
    }
  },

  // Reset store
  resetStore: () => {
    set({
      selectedCollection: null,
      selectedProducts: [],
      loading: false,
      productsLoading: false,
      updatingStatus: false,
      lastFetchTime: null,
      cacheKey: null,
    });
  },

  // Clear cache
  clearCache: () => {
    gstCache.clear();
  },
}));