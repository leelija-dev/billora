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
      
      // Create a product lookup map for efficient access
      const productMap = {};
      products.forEach(item => {
        if (item.product && item.product_id) {
          productMap[item.product_id] = item.product;
        }
      });
      
      // Merge product information into collections
      const enrichedCollections = collections.map(collection => ({
        ...collection,
        product: productMap[collection.product_id] || null,
        product_name: productMap[collection.product_id]?.name || null,
        product_sku: productMap[collection.product_id]?.sku || null
      }));
      
      // Extract clean product data from the products array (aggregated data)
      const cleanProducts = products.map(item => {
        // Log the item structure for debugging
        console.log('Processing product item:', item);
        
        // The API returns aggregated product data with these fields:
        // product_id, total_quantity, total_purchase_price, total_purchase_gst,
        // total_selling_price, total_selling_gst, total_products
        return {
          product_id: item.product_id,
          total_quantity: parseFloat(item.total_quantity) || 0,
          total_purchase_price: parseFloat(item.total_purchase_price) || 0,
          total_purchase_gst: parseFloat(item.total_purchase_gst) || 0,
          total_selling_price: parseFloat(item.total_selling_price) || 0,
          total_selling_gst: parseFloat(item.total_selling_gst) || 0,
          total_products: parseInt(item.total_products) || 0,
          // Keep product details if available
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
          totalCollections: responseData.data?.length || 0,
          totalProducts: responseData['all products']?.length || 0
        }
      };
      
      console.log('Enriched GST Data:', gstData);
      console.log('Clean Products:', cleanProducts);
      if (cleanProducts.length > 0) {
        console.log('First Clean Product:', cleanProducts[0]);
      }
      
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
