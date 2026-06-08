// store/orderStore.js
import { create } from 'zustand';
import { logger } from '../utils/logger';
import { orderService } from '../services/orderService';

export const useOrderStore = create((set, get) => ({
  // State
  orders: [],
  summary: null,
  loading: false,
  error: null,
  searchPerformed: false,
  currentMobile: null,
  selectedOrder: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setOrders: (orders) => set({ orders }),
  setSummary: (summary) => set({ summary }),
  setSearchPerformed: (performed) => set({ searchPerformed: performed }),
  setCurrentMobile: (mobile) => set({ currentMobile: mobile }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),

  // Fetch order history by mobile number
  fetchOrderHistory: async (mobile, userId) => {
    set({ loading: true, error: null, searchPerformed: true, currentMobile: mobile });
    
    try {
      if (!mobile || !mobile.trim()) {
        throw new Error('Please enter a mobile number');
      }
      
      if (!userId) {
        throw new Error('Restaurant ID is required');
      }
      
      const result = await orderService.getOrderHistoryByMobile(mobile, userId);
      
      set({
        orders: result.orders,
        summary: result.summary,
        loading: false,
        error: result.orders.length === 0 ? 'No orders found' : null
      });
      
      return result;
      
    } catch (error) {
      logger.error('Error in fetchOrderHistory:', error);
      set({
        error: error.message || 'Failed to fetch order history',
        loading: false,
        orders: [],
        summary: null
      });
      throw error;
    }
  },

  // View single order details
  viewOrderDetails: (order) => {
    set({ selectedOrder: order });
  },

  // Clear selected order
  clearSelectedOrder: () => {
    set({ selectedOrder: null });
  },

  // Reset order history
  resetOrderHistory: () => {
    set({
      orders: [],
      summary: null,
      error: null,
      searchPerformed: false,
      currentMobile: null,
      selectedOrder: null
    });
  },

  // Clear error
  clearError: () => set({ error: null })
}));

// Export selector hooks
export const useOrders = () => useOrderStore((state) => state.orders);
export const useOrderSummary = () => useOrderStore((state) => state.summary);
export const useOrderLoading = () => useOrderStore((state) => state.loading);
export const useOrderError = () => useOrderStore((state) => state.error);
export const useSearchPerformed = () => useOrderStore((state) => state.searchPerformed);
export const useCurrentMobile = () => useOrderStore((state) => state.currentMobile);
export const useSelectedOrder = () => useOrderStore((state) => state.selectedOrder);