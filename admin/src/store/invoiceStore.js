import { create } from "zustand";
import { invoiceAPI } from "../services";
import toast from "react-hot-toast";

// Cache for customer and store data
const customerCache = new Map();
const storeCache = new Map();
const productCache = new Map();

// Cache expiration time (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000;

// Request deduplication
let activeRequests = new Map();
let abortControllers = new Map();

const isCacheValid = (cacheEntry) => {
  return cacheEntry && Date.now() - cacheEntry.timestamp < CACHE_EXPIRY;
};

const getCachedData = (cache, key) => {
  const entry = cache.get(key);
  if (isCacheValid(entry)) {
    return entry.data;
  }
  cache.delete(key);
  return null;
};

const setCachedData = (cache, key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const useInvoiceStore = create((set, get) => ({
  // State
  invoices: [],
  totalInvoices: 0,
  currentPage: 1,
  pageSize: 15,
  loading: false,
  error: null,
  filters: {
    search: "",
    status: "",
  },
  billGenerateData: {},

  // Cache state
  lastFetchTime: null,
  cacheKey: null,

  // Helper to deduplicate requests
  dedupeRequest: async (key, requestFn) => {
    const existingRequest = activeRequests.get(key);
    if (existingRequest) {
      console.log(`🔄 Request deduplicated for: ${key}`);
      return existingRequest;
    }

    const abortController = new AbortController();
    abortControllers.set(key, abortController);

    const promise = requestFn(abortController.signal).finally(() => {
      activeRequests.delete(key);
      abortControllers.delete(key);
    });

    activeRequests.set(key, promise);
    return promise;
  },

  // Helper to extract store data from API response
  extractStoreDataFromResponse: (response, storeId) => {
    try {
      // Handle response from /store/edit/${storeId} endpoint
      if (response?.data?.status === true) {
        // Data is in response.data.data
        if (response.data.data && typeof response.data.data === 'object') {
          if (response.data.data.id) {
            return response.data.data;
          }
          // If data has an id property, return it
          if (response.data.data.id) {
            return response.data.data;
          }
        }
      }
      
      // Handle response from /store/${userId} endpoint (getByUserId)
      if (response?.data?.data?.data && Array.isArray(response.data.data.data)) {
        const store = response.data.data.data.find(s => s.id === storeId);
        if (store) return store;
      }
      
      if (response?.data?.data && Array.isArray(response.data.data)) {
        const store = response.data.data.find(s => s.id === storeId);
        if (store) return store;
      }
      
      // If we have data directly
      if (response?.data && typeof response.data === 'object' && response.data.id) {
        return response.data;
      }
      
      // Fallback: return null if no store found
      console.warn(`Could not extract store data for ID ${storeId} from response:`, response?.data);
      return null;
    } catch (error) {
      console.error(`Error extracting store data for ${storeId}:`, error);
      return null;
    }
  },

  // Helper to extract customer data from API response
  extractCustomerDataFromResponse: (response, customerId) => {
    try {
      if (response?.data?.status === true && response.data.data) {
        return response.data.data;
      }
      if (response?.data && typeof response.data === 'object') {
        if (response.data.id) return response.data;
        if (response.data.data && response.data.data.id) return response.data.data;
      }
      console.warn(`Could not extract customer data for ID ${customerId}`);
      return null;
    } catch (error) {
      console.error(`Error extracting customer data for ${customerId}:`, error);
      return null;
    }
  },

  // Fetch invoices/bills history with pagination and search (optimized)
  fetchInvoices: async (page = 1, filters = {}) => {
    const requestKey = `invoices_${page}_${JSON.stringify(filters)}`;

    // Cancel previous request for the same key
    const existingController = abortControllers.get(requestKey);
    if (existingController) {
      existingController.abort();
      abortControllers.delete(requestKey);
    }

    const currentState = get();

    // Avoid duplicate requests if same data was fetched recently
    if (
      currentState.cacheKey === requestKey &&
      currentState.lastFetchTime &&
      Date.now() - currentState.lastFetchTime < 1000
    ) {
      console.log("Using cached invoice data, skipping duplicate request");
      return currentState.invoices;
    }

    set({ loading: true, cacheKey: requestKey, error: null });

    try {
      const response = await invoiceAPI.getAll(page, filters);
      const invoices = response.data?.data?.data || response.data?.data || [];

      // Batch fetch unique customers and stores to reduce API calls
      const uniqueCustomerIds = [
        ...new Set(invoices.map((inv) => inv.customer_id).filter(Boolean)),
      ];
      const uniqueStoreIds = [
        ...new Set(invoices.map((inv) => inv.store_id).filter(Boolean)),
      ];

      console.log("Fetching data for customers:", uniqueCustomerIds);
      console.log("Fetching data for stores:", uniqueStoreIds);

      // Use Promise.allSettled to prevent one failure from blocking others
      const [customersResult, storesResult] = await Promise.allSettled([
        Promise.all(
          uniqueCustomerIds.map(async (customerId) => {
            const cached = getCachedData(customerCache, customerId);
            if (cached) {
              return { id: customerId, data: cached };
            }

            try {
              const response = await invoiceAPI.getCustomer(customerId);
              const customerData = get().extractCustomerDataFromResponse(response, customerId);
              if (customerData) {
                setCachedData(customerCache, customerId, customerData);
                return { id: customerId, data: customerData };
              }
              return { id: customerId, data: null };
            } catch (error) {
              console.error(`Failed to fetch customer ${customerId}:`, error);
              return { id: customerId, data: null };
            }
          }),
        ),
        Promise.all(
          uniqueStoreIds.map(async (storeId) => {
            const cached = getCachedData(storeCache, storeId);
            if (cached) {
              return { id: storeId, data: cached };
            }

            try {
              const response = await invoiceAPI.getStore(storeId);
              const storeData = get().extractStoreDataFromResponse(response, storeId);
              
              if (storeData && storeData.id) {
                console.log(`✅ Store ${storeId} fetched:`, storeData.name);
                setCachedData(storeCache, storeId, storeData);
                return { id: storeId, data: storeData };
              } else {
                // Store not found, create fallback
                console.warn(`⚠️ Store ${storeId} not found, using fallback`);
                const fallbackStore = {
                  id: storeId,
                  name: `Store Deleted`,
                  is_fallback: true
                };
                setCachedData(storeCache, storeId, fallbackStore);
                return { id: storeId, data: fallbackStore };
              }
            } catch (error) {
              console.error(`Failed to fetch store ${storeId}:`, error);
              // Create fallback store object
              const fallbackStore = {
                id: storeId,
                name: `Store Deleted`,
                is_fallback: true
              };
              setCachedData(storeCache, storeId, fallbackStore);
              return { id: storeId, data: fallbackStore };
            }
          }),
        ),
      ]);

      // Create lookup maps from successful results
      const customerMap = {};
      const storeMap = {};

      if (customersResult.status === "fulfilled") {
        customersResult.value.forEach(({ id, data }) => {
          if (data) customerMap[id] = data;
        });
      }

      if (storesResult.status === "fulfilled") {
        storesResult.value.forEach(({ id, data }) => {
          if (data) {
            storeMap[id] = data;
          } else {
            // Fallback for any missing stores
            storeMap[id] = {
              id: id,
              name: `Store Deleted`,
              is_fallback: true
            };
          }
        });
      }

      // Enrich invoices with cached customer and store data
      const enrichedInvoices = invoices.map((invoice) => {
        const customer = customerMap[invoice.customer_id] || {};
        const store = storeMap[invoice.store_id] || {
          id: invoice.store_id,
          name: `Store Deleted`,
          is_fallback: true
        };

        return {
          ...invoice,
          customer: customer,
          store: store,
          customer_name: customer.name || customer.customer_name || `Customer #${invoice.customer_id}`,
          store_name: store.name || store.store_name || `Store Deleted`,
        };
      });

      set({
        invoices: enrichedInvoices,
        totalInvoices: response.data?.data?.total || response.data?.total || 0,
        currentPage: response.data?.data?.current_page || page,
        pageSize: response.data?.data?.per_page || 15,
        loading: false,
        lastFetchTime: Date.now(),
      });

      console.log(`✅ Fetched ${enrichedInvoices.length} invoices with store data`);
      return enrichedInvoices;
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request was cancelled");
        return null;
      }
      console.error("Failed to fetch invoices:", error);
      toast.error("Failed to fetch invoices");
      set({ loading: false, error: error.message });
      return null;
    }
  },

  // Get bill generate page data (optimized with caching)
  fetchBillGenerateData: async () => {
    const currentState = get();

    // Avoid duplicate requests if data was fetched recently (within 30 seconds)
    if (
      currentState.lastFetchTime &&
      Date.now() - currentState.lastFetchTime < 30000 &&
      Object.keys(currentState.billGenerateData).length > 0
    ) {
      console.log(
        "Using cached bill generate data, skipping duplicate request",
      );
      return currentState.billGenerateData;
    }

    set({ loading: true, error: null });
    try {
      const response = await invoiceAPI.getBillGenerateData();
      const data = response.data?.data || {};

      set({
        billGenerateData: data,
        loading: false,
        lastFetchTime: Date.now(),
      });

      return data;
    } catch (error) {
      console.error("Failed to fetch bill generate data:", error);
      set({
        error: error.message || "Failed to fetch bill generate data",
        loading: false,
      });
      return {};
    }
  },

  // Create/store new invoice/bill with items
  createInvoice: async (invoiceData) => {
    set({ loading: true, error: null });
    try {
      const response = await invoiceAPI.create(invoiceData);
      console.log("Invoice store API response:", response);

      // Handle the actual response structure from backend
      const responseData = response.data;
      if (responseData?.status === true) {
        // Success case - notify customer store to clear cache
        try {
          const broadcastChannel = new BroadcastChannel(
            "app-cache-invalidation",
          );
          broadcastChannel.postMessage({
            type: "invoice-created",
            data: {
              customer_id: invoiceData.customer_id,
              timestamp: Date.now(),
            },
          });
          broadcastChannel.close();
        } catch (error) {
          console.log(
            "BroadcastChannel not supported, skipping cross-module cache invalidation",
          );
        }

        set({ loading: false });
        // Refresh invoices after creation
        await get().fetchInvoices(get().currentPage);
        return { success: true, data: responseData };
      } else {
        // Backend returned failure
        toast.error(responseData?.message || "Failed to create invoice");
        set({ loading: false });
        return { success: false, error: responseData };
      }
    } catch (error) {
      console.error("Invoice store error:", error);
      toast.error("Failed to create invoice");
      set({ loading: false });
      return { success: false, error: error.response?.data || error.message };
    }
  },

  // Update invoice/bill
  updateInvoice: async (id, invoiceData) => {
    set({ loading: true, error: null });
    try {
      const response = await invoiceAPI.update(id, invoiceData);
      set((state) => ({
        invoices: state.invoices.map((inv) =>
          inv.id === id ? response.data : inv,
        ),
        loading: false,
      }));

      // Notify customer store to clear cache
      try {
        const broadcastChannel = new BroadcastChannel("app-cache-invalidation");
        broadcastChannel.postMessage({
          type: "invoice-updated",
          data: {
            customer_id: invoiceData.customer_id,
            timestamp: Date.now(),
          },
        });
        broadcastChannel.close();
      } catch (error) {
        console.log(
          "BroadcastChannel not supported, skipping cross-module cache invalidation",
        );
      }

      toast.success("Invoice updated successfully");
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Failed to update invoice:", error);
      toast.error("Failed to update invoice");
      set({ loading: false });
      return { success: false, error: error.response?.data };
    }
  },

  // Cancel invoice (bill status)
  cancelInvoice: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await invoiceAPI.updateBillStatus(id);
      const ok = response.data?.status === true;
      if (ok) {
        toast.success(response.data?.message || "Invoice cancelled");
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === Number(id) || inv.id === id
              ? { ...inv, status: "cancelled" }
              : inv,
          ),
          loading: false,
        }));
        return { success: true, data: response.data };
      }
      toast.error(response.data?.message || "Failed to cancel invoice");
      set({ loading: false });
      return { success: false, error: response.data };
    } catch (error) {
      console.error("Failed to cancel invoice:", error);
      toast.error(error.response?.data?.message || "Failed to cancel invoice");
      set({ loading: false });
      return { success: false, error: error.response?.data };
    }
  },

  // Delete invoice/bill
  deleteInvoice: async (id) => {
    set({ loading: true, error: null });
    try {
      // Get invoice data before deletion for customer_id
      const currentState = get();
      const invoiceToDelete = currentState.invoices.find(
        (inv) => inv.id === id,
      );

      await invoiceAPI.delete(id);
      set((state) => ({
        invoices: state.invoices.filter((inv) => inv.id !== id),
        totalInvoices: state.totalInvoices - 1,
        loading: false,
      }));

      // Notify customer store to clear cache
      try {
        const broadcastChannel = new BroadcastChannel("app-cache-invalidation");
        broadcastChannel.postMessage({
          type: "invoice-deleted",
          data: {
            customer_id: invoiceToDelete?.customer_id,
            timestamp: Date.now(),
          },
        });
        broadcastChannel.close();
      } catch (error) {
        console.log(
          "BroadcastChannel not supported, skipping cross-module cache invalidation",
        );
      }

      toast.success("Invoice deleted successfully");
      return { success: true };
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      toast.error("Failed to delete invoice");
      set({ loading: false });
      return { success: false };
    }
  },

  setFilters: (filters) => {
    const currentFilters = get().filters;
    const newFilters = { ...currentFilters, ...filters };

    // Only fetch if filters actually changed
    if (JSON.stringify(currentFilters) !== JSON.stringify(newFilters)) {
      set({ filters: newFilters });
      get().fetchInvoices(1, newFilters);
    }
  },

  // Clear cache function
  clearCache: () => {
    customerCache.clear();
    storeCache.clear();
    productCache.clear();
    set({
      lastFetchTime: null,
      cacheKey: null,
      billGenerateData: {},
    });
  },

  // Cleanup function for unmount
  cleanup: () => {
    abortControllers.forEach((controller) => controller.abort());
    activeRequests.clear();
    abortControllers.clear();
  },
}));