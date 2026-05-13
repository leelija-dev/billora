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
      
      // Extract clean product data from the products array
      const cleanProducts = products.map(item => {
        // Log the item structure for debugging
        console.log('Processing product item:', item);
        
        return {
          ...item.product,
          // Ensure all GST-related values are properly mapped and converted to numbers
          selling_price: parseFloat(item.selling_price) || parseFloat(item.product?.selling_price) || 0,
          selling_gst_percentage: parseFloat(item.selling_gst_percentage) || parseFloat(item.product?.gst_percentage) || 0,
          selling_gst_amount: parseFloat(item.selling_gst_amount) || 0,
          quantity: parseFloat(item.quantity) || 1,
          purchase_price: parseFloat(item.purchase_price) || parseFloat(item.product?.purchase_price) || 0,
          purchase_gst_percentage: parseFloat(item.purchase_gst_percentage) || parseFloat(item.product?.purchase_gst_percentage) || 0,
          purchase_gst_amount: parseFloat(item.purchase_gst_amount) || 0,
          selling_discount_percentage: parseFloat(item.selling_discount_percentage) || parseFloat(item.product?.discount_percentage) || 0,
          total_quantity: parseFloat(item.quantity) || 1,
          // Also map the product's own GST percentage if available
          gst_rate: parseFloat(item.product?.gst_percentage) || parseFloat(item.selling_gst_percentage) || 18
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
