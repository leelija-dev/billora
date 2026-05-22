import { create } from 'zustand';
import { gstAPI, productsAPI } from '../services';
import toast from 'react-hot-toast';

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

  // Fetch all products for name mapping
  fetchAllProductsForMapping: async () => {
    try {
      const response = await productsAPI.getAll();
      console.log('Products API Response for mapping:', response.data);
      
      // Handle nested data structure - API returns { status: true, data: { data: [...] } }
      let allProducts = [];
      
      if (response.data?.data?.data) {
        // Structure: { data: { data: [...] } }
        allProducts = response.data.data.data;
      } else if (response.data?.data) {
        // Structure: { data: [...] }
        allProducts = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Structure: direct array
        allProducts = response.data;
      } else if (response.data?.status === true && response.data?.data) {
        // Structure: { status: true, data: [...] }
        allProducts = response.data.data;
      }
      
      // Create mapping of product_id to product name
      const productNameMap = new Map();
      const productDetailsMap = new Map();
      
      if (Array.isArray(allProducts) && allProducts.length > 0) {
        allProducts.forEach(product => {
          if (product && product.id) {
            const productId = parseInt(product.id);
            const productName = product.name || product.product_name || `Product ${productId}`;
            productNameMap.set(productId, productName);
            productDetailsMap.set(productId, product);
            console.log(`Mapped product ${productId} -> ${productName}`);
          }
        });
      }
      
      console.log('Product name map created with size:', productNameMap.size);
      return { productNameMap, productDetailsMap };
    } catch (error) {
      console.error('Failed to fetch products for mapping:', error);
      return { productNameMap: new Map(), productDetailsMap: new Map() };
    }
  },

  // Fetch GST collection details for a specific user
  fetchGstCollectionDetails: async (userId) => {
    set({ loading: true });

    try {
      // Step 1: Fetch all products for name mapping FIRST
      const { productNameMap, productDetailsMap } = await get().fetchAllProductsForMapping();
      
      // Step 2: Fetch GST collections
      const response = await gstAPI.getGstCollection(userId);
      const responseData = response.data;
      
      // Get collections and products from GST API
      const collections = responseData.data || [];
      const gstProducts = responseData['all products'] || [];
      
      console.log('Raw API Response:', responseData);
      console.log('Products from GST API:', gstProducts);
      console.log('Product Name Map size:', productNameMap.size);
      
      // Step 3: Create enriched collections with product names
      const enrichedCollections = collections.map(collection => {
        const productId = parseInt(collection.product_id);
        
        // Try to get product name from the map first
        let productName = productNameMap.get(productId);
        
        // If not found in map, try to get from GST products array
        if (!productName) {
          const gstProduct = gstProducts.find(p => parseInt(p.product_id) === productId);
          if (gstProduct) {
            productName = gstProduct.product_name || 
                         gstProduct.name || 
                         (gstProduct.product && gstProduct.product.name) ||
                         `Product ${productId}`;
          } else {
            productName = `Product ${productId}`;
          }
        }
        
        console.log(`Collection ${collection.id} - Product ID: ${productId} - Name: ${productName}`);
        
        return {
          ...collection,
          product_name: productName,
          product_id: productId,
          product_details: productDetailsMap.get(productId) || null,
        };
      });
      
      // Step 4: Create clean products array with proper names
      const cleanProducts = gstProducts.map(item => {
        const productId = parseInt(item.product_id);
        let productName = productNameMap.get(productId);
        
        if (!productName) {
          productName = item.product_name || 
                       item.name || 
                       (item.product && item.product.name) ||
                       `Product ${productId}`;
        }
        
        return {
          product_id: productId,
          product_name: productName,
          total_quantity: parseFloat(item.total_quantity) || 0,
          total_purchase_price: parseFloat(item.total_purchase_price) || 0,
          total_purchase_gst: parseFloat(item.total_purchase_gst) || 0,
          total_selling_price: parseFloat(item.total_selling_price) || 0,
          total_selling_gst: parseFloat(item.total_selling_gst) || 0,
          total_products: parseInt(item.total_products) || 0,
          product_details: productDetailsMap.get(productId) || null,
        };
      });

      // Step 5: Build final data structure
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
      
      console.log('Final GST Data with Product Names:', gstData);
      console.log('First collection:', enrichedCollections[0]);
      console.log('First product in products tab:', cleanProducts[0]);
      
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
      
      // Refresh the collection data after update
      const { selectedCollection } = get();
      if (selectedCollection) {
        // Update the specific collection's status in the local state
        const updatedCollections = selectedCollection.collections.map(col => 
          col.id === collectionId 
            ? { ...col, govt_pay_status: statusData.govt_gst_pay_status }
            : col
        );
        
        set({ 
          selectedCollection: { 
            ...selectedCollection, 
            collections: updatedCollections 
          },
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