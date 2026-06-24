// store/gstStore.js
import { create } from 'zustand';
import { gstAPI } from '../services/gstService';
import toast from 'react-hot-toast';

const gstCache = new Map();
const CACHE_EXPIRY = 5 * 60 * 1000;

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
  collections: [],
  gstInData: [],
  gstOutData: [],
  allProducts: [],
  pagination: null,
  gstInPagination: null,
  gstOutPagination: null,
  allProductsPagination: null,
  loading: false,
  updatingStatus: false,
  filters: {
    month: '',
    year: '',
  },
  summary: {
    gstOut: 0,
    gstIn: 0,
    dateFrom: '',
    dateTo: '',
  },

  fetchGstCollections: async (userId, params = {}) => {
    set({ loading: true });

    try {
      const cacheKey = `gst_${userId}_${JSON.stringify(params)}`;
      const cachedData = getCachedData(cacheKey);

      if (cachedData) {
        console.log('📊 Using cached GST data');
        set({
          ...cachedData,
          loading: false,
        });
        return cachedData;
      }

      const response = await gstAPI.getGstCollection(userId, params);
      const data = response.data;

      if (!data.status) {
        throw new Error(data.message || 'Failed to fetch GST collections');
      }

      // Extract GST In data with unique IDs
      const gstInData = data.gst_in_data?.data?.map((item, index) => ({
        ...item,
        // Create a truly unique ID for React keys
        _uniqueId: `gst_in_${item.id}_${Date.now()}_${index}`,
        _originalId: item.id,
        _type: 'gst_in',
      })) || [];

      // Extract GST Out data with unique IDs
      const gstOutData = data.gst_out_data?.data?.map((item, index) => ({
        ...item,
        // Create a truly unique ID for React keys
        _uniqueId: `gst_out_${item.id}_${Date.now()}_${index}`,
        _originalId: item.id,
        _type: 'gst_out',
      })) || [];

      // Extract all products data
      const allProductsData = data.all_products?.data?.map((item, index) => ({
        ...item,
        _uniqueId: `prod_${item.product_id}_${Date.now()}_${index}`,
        _originalId: item.product_id,
      })) || [];

      // Combine all collections for backward compatibility
      const allCollections = [...gstInData, ...gstOutData];

      // Pagination for GST In
      const gstInPagination = data.gst_in_data ? {
        current_page: data.gst_in_data.current_page,
        first_page_url: data.gst_in_data.first_page_url,
        from: data.gst_in_data.from,
        last_page: data.gst_in_data.last_page,
        last_page_url: data.gst_in_data.last_page_url,
        links: data.gst_in_data.links,
        next_page_url: data.gst_in_data.next_page_url,
        path: data.gst_in_data.path,
        per_page: data.gst_in_data.per_page,
        prev_page_url: data.gst_in_data.prev_page_url,
        to: data.gst_in_data.to,
        total: data.gst_in_data.total,
      } : null;

      // Pagination for GST Out
      const gstOutPagination = data.gst_out_data ? {
        current_page: data.gst_out_data.current_page,
        first_page_url: data.gst_out_data.first_page_url,
        from: data.gst_out_data.from,
        last_page: data.gst_out_data.last_page,
        last_page_url: data.gst_out_data.last_page_url,
        links: data.gst_out_data.links,
        next_page_url: data.gst_out_data.next_page_url,
        path: data.gst_out_data.path,
        per_page: data.gst_out_data.per_page,
        prev_page_url: data.gst_out_data.prev_page_url,
        to: data.gst_out_data.to,
        total: data.gst_out_data.total,
      } : null;

      const allProductsPagination = data.all_products ? {
        current_page: data.all_products.current_page,
        first_page_url: data.all_products.first_page_url,
        from: data.all_products.from,
        last_page: data.all_products.last_page,
        last_page_url: data.all_products.last_page_url,
        links: data.all_products.links,
        next_page_url: data.all_products.next_page_url,
        path: data.all_products.path,
        per_page: data.all_products.per_page,
        prev_page_url: data.all_products.prev_page_url,
        to: data.all_products.to,
        total: data.all_products.total,
      } : null;

      const result = {
        collections: allCollections,
        gstInData: gstInData,
        gstOutData: gstOutData,
        allProducts: allProductsData,
        pagination: gstInPagination,
        gstInPagination: gstInPagination,
        gstOutPagination: gstOutPagination,
        allProductsPagination: allProductsPagination,
        summary: {
          gstOut: parseFloat(data.gst_out) || 0,
          gstIn: parseFloat(data.gst_in) || 0,
          dateFrom: data.date_from || '',
          dateTo: data.date_to || '',
        },
      };

      setCachedData(cacheKey, result);

      set({
        ...result,
        loading: false,
      });

      return result;
    } catch (error) {
      console.error('Failed to fetch GST collections:', error);
      toast.error(error.message || 'Failed to fetch GST collections');
      set({ loading: false });
      throw error;
    }
  },

  updatePaymentStatus: async (collectionId, statusData) => {
    set({ updatingStatus: true });

    try {
      const response = await gstAPI.updateGstPaymentStatus(collectionId, statusData);
      const data = response.data;

      if (data.status) {
        const { gstInData, gstOutData } = get();
        
        // Update in both GST In and GST Out data
        const updatedGstIn = gstInData.map(item =>
          item._originalId === collectionId
            ? { ...item, govt_pay_status: statusData.govt_gst_pay_status }
            : item
        );
        
        const updatedGstOut = gstOutData.map(item =>
          item._originalId === collectionId
            ? { ...item, govt_pay_status: statusData.govt_gst_pay_status }
            : item
        );

        set({
          gstInData: updatedGstIn,
          gstOutData: updatedGstOut,
          updatingStatus: false,
        });

        // Clear cache to force refresh
        gstCache.clear();

        toast.success('Payment status updated successfully');
        return data;
      } else {
        throw new Error(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Failed to update GST payment status:', error);
      toast.error(error.message || 'Failed to update payment status');
      set({ updatingStatus: false });
      throw error;
    }
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  clearFilters: () => {
    set({
      filters: {
        month: '',
        year: '',
      },
    });
    gstCache.clear();
  },

  resetStore: () => {
    set({
      collections: [],
      gstInData: [],
      gstOutData: [],
      allProducts: [],
      pagination: null,
      gstInPagination: null,
      gstOutPagination: null,
      allProductsPagination: null,
      loading: false,
      updatingStatus: false,
      filters: {
        month: '',
        year: '',
      },
      summary: {
        gstOut: 0,
        gstIn: 0,
        dateFrom: '',
        dateTo: '',
      },
    });
    gstCache.clear();
  },
}));