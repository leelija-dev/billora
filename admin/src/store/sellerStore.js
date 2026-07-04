// store/sellerStore.js
import { create } from "zustand";
import { sellerAPI } from "../services/sellerService";
import toast from "react-hot-toast";

// Cache for seller data
const sellerCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const productRequestCache = new Map();

const isCacheValid = (cacheEntry) => {
  return cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_EXPIRY;
};

const getCachedData = (cacheKey) => {
  const entry = sellerCache.get(cacheKey);
  if (isCacheValid(entry)) {
    return entry.data;
  }
  sellerCache.delete(cacheKey);
  return null;
};

const setCachedData = (cacheKey, data) => {
  sellerCache.set(cacheKey, { data, timestamp: Date.now() });
};

const useSellerStore = create((set, get) => ({
  sellers: [],
  totalSellers: 0,
  currentPage: 1,
  pageSize: 8,
  loading: false,
  error: null,
  filters: {
    search: "",
  },
  currentUserId: null,
  pagination: null,

  // Seller products state
  sellerProducts: [],
  sellerProductsTotal: 0,
  sellerProductsCurrentPage: 1,
  sellerProductsPageSize: 8,
  sellerProductsLoading: false,
  sellerProductsError: null,
  sellerProductsPagination: null,
  sellerProductsSearch: "",
  currentSellerId: null,

  // Seller payment history state
  sellerPaymentHistory: [],
  sellerPaymentHistoryPagination: null,

  // Payment state
  paymentProcessing: false,
  paymentError: null,
  paymentHistory: [],
  paymentHistoryTotal: 0,
  paymentHistoryLoading: false,
  paymentHistoryPagination: null,

  // Cache state
  lastFetchTime: null,
  cacheKey: null,

  // Fetch sellers by user ID with pagination
  fetchSellers: async (userId, page = 1, filters = {}) => {
    set({ currentUserId: userId });

    const cacheKey = JSON.stringify({ userId, page, filters });
    const currentState = get();

    if (
      currentState.cacheKey === cacheKey &&
      currentState.lastFetchTime &&
      Date.now() - currentState.lastFetchTime < 2000
    ) {
      console.log("Using cached seller data, skipping duplicate request");
      return;
    }

    const cached = getCachedData(cacheKey);
    if (cached) {
      console.log("Using cached seller data");
      set({
        sellers: cached.sellers,
        totalSellers: cached.total,
        currentPage: page,
        pageSize: cached.pageSize || 8,
        loading: false,
        cacheKey,
        lastFetchTime: Date.now(),
        currentUserId: userId,
        pagination: cached.pagination || null,
      });
      return;
    }

    set({ loading: true, cacheKey, currentUserId: userId });
    try {
      const params = {
        page,
        ...filters,
      };
      // Remove undefined values
      Object.keys(params).forEach((key) => {
        if (params[key] === undefined || params[key] === "") {
          delete params[key];
        }
      });

      const response = await sellerAPI.getByUserId(userId, params);
      console.log("📦 Sellers fetched successfully:", response.data);

      // Extract sellers from response structure
      let sellersArray = [];
      let total = 0;
      let paginationData = null;

      if (response.data?.sellers?.data) {
        sellersArray = Array.isArray(response.data.sellers.data)
          ? response.data.sellers.data
          : [];
        total = response.data.sellers.total || sellersArray.length;
        paginationData = {
          current_page: response.data.sellers.current_page,
          first_page_url: response.data.sellers.first_page_url,
          from: response.data.sellers.from,
          last_page: response.data.sellers.last_page,
          last_page_url: response.data.sellers.last_page_url,
          links: response.data.sellers.links,
          next_page_url: response.data.sellers.next_page_url,
          path: response.data.sellers.path,
          per_page: response.data.sellers.per_page,
          prev_page_url: response.data.sellers.prev_page_url,
          to: response.data.sellers.to,
          total: response.data.sellers.total,
        };
      } else if (response.data?.sellers) {
        sellersArray = Array.isArray(response.data.sellers)
          ? response.data.sellers
          : [];
        total = sellersArray.length;
      } else if (response.data?.data?.sellers) {
        sellersArray = Array.isArray(response.data.data.sellers)
          ? response.data.data.sellers
          : [];
        total = sellersArray.length;
      } else if (response.data?.data?.data) {
        sellersArray = Array.isArray(response.data.data.data)
          ? response.data.data.data
          : [];
        total = sellersArray.length;
      } else if (Array.isArray(response.data)) {
        sellersArray = response.data;
        total = sellersArray.length;
      }

      console.log("📊 Sellers extracted:", sellersArray.length, "sellers");
      console.log("📊 Total sellers:", total);
      console.log("📊 Pagination:", paginationData);

      const cacheData = {
        sellers: sellersArray,
        total: total,
        pageSize: paginationData?.per_page || 8,
        pagination: paginationData,
      };
      setCachedData(cacheKey, cacheData);

      set({
        sellers: sellersArray,
        totalSellers: total,
        currentPage: page,
        pageSize: paginationData?.per_page || 8,
        loading: false,
        lastFetchTime: Date.now(),
        currentUserId: userId,
        pagination: paginationData,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch sellers:", error);
      toast.error(error.response?.data?.message || "Failed to fetch sellers");
      set({
        sellers: [],
        totalSellers: 0,
        loading: false,
        error: error.message || "Failed to fetch sellers",
        currentUserId: userId,
        pagination: null,
      });
    }
  },

  // Create seller
  createSeller: async (sellerData) => {
    set({ loading: true, error: null });
    try {
      const response = await sellerAPI.create(sellerData);
      console.log("✅ Seller created successfully", response.data);

      toast.success("Seller created successfully");

      get().clearCache();

      const newSeller = response.data?.data || response.data || sellerData;

      const { sellers, currentUserId, currentPage, filters } = get();
      set({
        sellers: [newSeller, ...sellers],
        totalSellers: (sellers?.length || 0) + 1,
        loading: false,
      });

      await get().fetchSellers(currentUserId, currentPage, filters);

      return newSeller;
    } catch (error) {
      console.error("❌ Failed to create seller:", error);
      toast.error(error.response?.data?.message || "Failed to create seller");
      set({
        error: error.response?.data?.message || "Failed to create seller",
        loading: false,
      });
      throw error;
    }
  },

  // Get single seller by ID
  getSellerById: async (sellerId) => {
    set({ loading: true, error: null });
    try {
      const response = await sellerAPI.getById(sellerId);
      console.log("📝 Seller fetched:", response.data);

      let sellerData = null;

      if (response.data?.data) {
        sellerData = response.data.data;
      } else if (response.data?.seller) {
        sellerData = response.data.seller;
      } else {
        sellerData = response.data;
      }

      console.log("📝 Extracted seller data:", sellerData);

      set({ loading: false });
      return sellerData;
    } catch (error) {
      console.error("❌ Failed to fetch seller:", error);
      toast.error(error.response?.data?.message || "Failed to fetch seller");
      set({
        error: error.response?.data?.message || "Failed to fetch seller",
        loading: false,
      });
      throw error;
    }
  },

  // Fetch seller products
  fetchSellerProducts: async (sellerId, page = 1, search = '') => {
    const cacheKey = `${sellerId}-${page}-${search}`;
    
    if (productRequestCache.has(cacheKey)) {
      console.log('⏳ Skipping duplicate products request (cache hit)');
      return productRequestCache.get(cacheKey);
    }

    set({ 
      sellerProductsLoading: true, 
      sellerProductsError: null,
      currentSellerId: sellerId,
      sellerProductsSearch: search,
    })
    
    const requestPromise = (async () => {
      try {
        const params = { page }
        if (search) {
          params.search = search
        }
        
        const response = await sellerAPI.getSellerProducts(sellerId, params)
        console.log('📦 Seller products fetched:', response.data)
        
        let productsArray = []
        let total = 0
        let paginationData = null
        let paymentHistoryArray = []
        let paymentHistoryPagination = null
        
        if (response.data?.sellerProducts?.data) {
          productsArray = Array.isArray(response.data.sellerProducts.data) ? response.data.sellerProducts.data : []
          total = response.data.sellerProducts.total || productsArray.length
          paginationData = {
            current_page: response.data.sellerProducts.current_page,
            first_page_url: response.data.sellerProducts.first_page_url,
            from: response.data.sellerProducts.from,
            last_page: response.data.sellerProducts.last_page,
            last_page_url: response.data.sellerProducts.last_page_url,
            links: response.data.sellerProducts.links,
            next_page_url: response.data.sellerProducts.next_page_url,
            path: response.data.sellerProducts.path,
            per_page: response.data.sellerProducts.per_page,
            prev_page_url: response.data.sellerProducts.prev_page_url,
            to: response.data.sellerProducts.to,
            total: response.data.sellerProducts.total,
          }
        } else if (response.data?.data?.data) {
          productsArray = Array.isArray(response.data.data.data) ? response.data.data.data : []
          total = response.data.data.total || productsArray.length
          paginationData = {
            current_page: response.data.data.current_page,
            first_page_url: response.data.data.first_page_url,
            from: response.data.data.from,
            last_page: response.data.data.last_page,
            last_page_url: response.data.data.last_page_url,
            links: response.data.data.links,
            next_page_url: response.data.data.next_page_url,
            path: response.data.data.path,
            per_page: response.data.data.per_page,
            prev_page_url: response.data.data.prev_page_url,
            to: response.data.data.to,
            total: response.data.data.total,
          }
        } else if (response.data?.products?.data) {
          productsArray = Array.isArray(response.data.products.data) ? response.data.products.data : []
          total = response.data.products.total || productsArray.length
          paginationData = response.data.products
        } else if (Array.isArray(response.data)) {
          productsArray = response.data
          total = productsArray.length
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          productsArray = response.data.data
          total = productsArray.length
        } else if (response.data?.sellerProducts && Array.isArray(response.data.sellerProducts)) {
          productsArray = response.data.sellerProducts
          total = productsArray.length
        }
        
        // Extract payment history
        if (response.data?.sellerPaymentHistory?.data) {
          paymentHistoryArray = Array.isArray(response.data.sellerPaymentHistory.data) ? response.data.sellerPaymentHistory.data : []
          paymentHistoryPagination = {
            current_page: response.data.sellerPaymentHistory.current_page,
            first_page_url: response.data.sellerPaymentHistory.first_page_url,
            from: response.data.sellerPaymentHistory.from,
            last_page: response.data.sellerPaymentHistory.last_page,
            last_page_url: response.data.sellerPaymentHistory.last_page_url,
            links: response.data.sellerPaymentHistory.links,
            next_page_url: response.data.sellerPaymentHistory.next_page_url,
            path: response.data.sellerPaymentHistory.path,
            per_page: response.data.sellerPaymentHistory.per_page,
            prev_page_url: response.data.sellerPaymentHistory.prev_page_url,
            to: response.data.sellerPaymentHistory.to,
            total: response.data.sellerPaymentHistory.total,
          }
        }
        
        console.log('📊 Products extracted:', productsArray.length, 'products')
        console.log('📊 Total products:', total)
        console.log('📊 Pagination:', paginationData)
        console.log('💳 Payment history extracted:', paymentHistoryArray.length, 'records')
        
        set({
          sellerProducts: productsArray,
          sellerProductsTotal: total,
          sellerProductsCurrentPage: page,
          sellerProductsPageSize: paginationData?.per_page || 8,
          sellerProductsLoading: false,
          sellerProductsPagination: paginationData,
          sellerProductsSearch: search,
          currentSellerId: sellerId,
          sellerPaymentHistory: paymentHistoryArray,
          sellerPaymentHistoryPagination: paymentHistoryPagination,
        })
        
        return response.data
      } catch (error) {
        console.error('❌ Failed to fetch seller products:', error)
        toast.error(error.response?.data?.message || 'Failed to fetch seller products')
        set({
          sellerProducts: [],
          sellerProductsTotal: 0,
          sellerProductsLoading: false,
          sellerProductsError: error.message || 'Failed to fetch seller products',
          sellerProductsPagination: null,
        })
        throw error
      } finally {
        productRequestCache.delete(cacheKey);
      }
    })();
    
    productRequestCache.set(cacheKey, requestPromise);
    return requestPromise;
  },

  // Update seller
  updateSeller: async (sellerId, sellerData) => {
    set({ loading: true, error: null });
    try {
      const response = await sellerAPI.update(sellerId, sellerData);
      console.log("✅ Seller updated successfully", response.data);

      toast.success("Seller updated successfully");

      get().clearCache();

      const updatedSeller = response.data?.data || response.data || sellerData;

      const { sellers, currentUserId, currentPage, filters } = get();
      set({
        sellers: sellers.map((seller) =>
          seller.id === sellerId ? updatedSeller : seller,
        ),
        loading: false,
      });

      await get().fetchSellers(currentUserId, currentPage, filters);

      return updatedSeller;
    } catch (error) {
      console.error("❌ Failed to update seller:", error);
      toast.error(error.response?.data?.message || "Failed to update seller");
      set({
        error: error.response?.data?.message || "Failed to update seller",
        loading: false,
      });
      throw error;
    }
  },

  // Delete seller
  deleteSeller: async (sellerId) => {
    set({ loading: true, error: null });
    try {
      await sellerAPI.delete(sellerId);
      console.log("✅ Seller deleted successfully");

      toast.success("Seller deleted successfully");

      get().clearCache();

      const { sellers, currentUserId, currentPage, filters } = get();
      set({
        sellers: sellers.filter((seller) => seller.id !== sellerId),
        totalSellers: Math.max(0, (sellers?.length || 0) - 1),
        loading: false,
      });

      await get().fetchSellers(currentUserId, currentPage, filters);

      return { success: true };
    } catch (error) {
      console.error("❌ Failed to delete seller:", error);
      toast.error(error.response?.data?.message || "Failed to delete seller");
      set({
        error: error.response?.data?.message || "Failed to delete seller",
        loading: false,
      });
      throw error;
    }
  },

  // NEW: Process due payment for a seller
  processDuePayment: async (sellerId, paymentData) => {
    set({ paymentProcessing: true, paymentError: null });
    try {
      const response = await sellerAPI.processDuePayment(sellerId, paymentData);
      console.log("✅ Payment processed successfully:", response.data);

      toast.success("Payment processed successfully");

      // Refresh seller data to update due amount
      await get().fetchSellers(get().currentUserId);

      return response.data;
    } catch (error) {
      console.error("❌ Failed to process payment:", error);
      const errorMessage = error.response?.data?.message || "Failed to process payment";
      toast.error(errorMessage);
      set({
        paymentError: errorMessage,
        paymentProcessing: false,
      });
      throw error;
    } finally {
      set({ paymentProcessing: false });
    }
  },

  // NEW: Fetch payment history for a seller
  fetchPaymentHistory: async (sellerId, page = 1) => {
    set({ paymentHistoryLoading: true });
    try {
      const response = await sellerAPI.getPaymentHistory(sellerId, { page });
      console.log("📦 Payment history fetched:", response.data);

      let history = [];
      let total = 0;
      let pagination = null;

      if (response.data?.data) {
        history = Array.isArray(response.data.data) ? response.data.data : [];
        total = response.data.total || history.length;
        pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
        };
      } else if (Array.isArray(response.data)) {
        history = response.data;
        total = history.length;
      }

      set({
        paymentHistory: history,
        paymentHistoryTotal: total,
        paymentHistoryPagination: pagination,
        paymentHistoryLoading: false,
      });

      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch payment history:", error);
      toast.error(error.response?.data?.message || "Failed to fetch payment history");
      set({
        paymentHistory: [],
        paymentHistoryTotal: 0,
        paymentHistoryLoading: false,
        paymentHistoryPagination: null,
      });
      throw error;
    }
  },

  // Set filters with debouncing and cache invalidation
  setFilters: (filters) => {
    const currentState = get();
    const newFilters = { ...currentState.filters, ...filters };

    if (JSON.stringify(newFilters) !== JSON.stringify(currentState.filters)) {
      set({ filters: newFilters });

      setTimeout(() => {
        const userId = get().currentUserId;
        if (userId) {
          console.log(
            "🔍 Searching sellers with userId:",
            userId,
            "and filters:",
            newFilters,
          );
          get().fetchSellers(userId, 1, newFilters);
        } else {
          console.warn("No userId available for search, skipping fetch");
        }
      }, 300);
    } else {
      set({ filters: newFilters });
    }
  },

  // Clear cache data
  clearCache: () => {
    sellerCache.clear();
    console.log("Seller cache cleared");
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Clear seller products
  clearSellerProducts: () => {
    set({
      sellerProducts: [],
      sellerProductsTotal: 0,
      sellerProductsCurrentPage: 1,
      sellerProductsPageSize: 8,
      sellerProductsLoading: false,
      sellerProductsError: null,
      sellerProductsPagination: null,
      sellerProductsSearch: "",
      currentSellerId: null,
    });
  },

  // Clear payment state
  clearPaymentState: () => {
    set({
      paymentProcessing: false,
      paymentError: null,
      paymentHistory: [],
      paymentHistoryTotal: 0,
      paymentHistoryLoading: false,
      paymentHistoryPagination: null,
    });
  },
}));

export default useSellerStore;