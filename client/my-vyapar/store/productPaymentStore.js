// store/productPaymentStore.js - Zustand store for product payment management
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { logger } from '../utils/logger';
import { createProductOrder } from '../services/productPaymentService';

// Create Zustand store for product payments
export const useProductPaymentStore = create(
  persist(
    (set, get) => ({
      // State
      orders: [],
      currentOrder: null,
      loading: false,
      error: null,
      paymentSession: null,
      orderHistory: [],
      lastFetched: null,

      // Actions
      /**
       * Create a product order
       * @param {Object} orderData - Order data
       * @returns {Promise<Object>} Order result
       */
      createProductOrder: async (orderData) => {
        set({ loading: true, error: null });

        try {
          logger.log('🔄 Creating product order...');
          const response = await createProductOrder(orderData);
          
          // Create order object with timestamp
          const newOrder = {
            ...response,
            orderData,
            timestamp: new Date().toISOString(),
            status: 'pending'
          };

          set({
            currentOrder: newOrder,
            orders: [...get().orders, newOrder],
            orderHistory: [...get().orderHistory, newOrder],
            loading: false,
            error: null
          });

          logger.log('✅ Product order created successfully:', response);
          return response;
        } catch (error) {
          logger.error('❌ Product order creation error:', error);
          
          const failedOrder = {
            orderData,
            error: error.message,
            timestamp: new Date().toISOString(),
            status: 'failed'
          };
          
          set({
            loading: false,
            error: error.message || 'Failed to create product order',
            currentOrder: null,
            orderHistory: [...get().orderHistory, failedOrder]
          });

          throw error;
        }
      },

      /**
       * Set payment session
       * @param {Object} session - Payment session data
       */
      setPaymentSession: (session) => {
        set({ paymentSession: session });
        logger.log('💳 Payment session set:', session?.id);
      },

      /**
       * Update order status
       * @param {string} orderId - Order ID
       * @param {string} status - New status
       */
      updateOrderStatus: (orderId, status) => {
        set((state) => {
          const updatedOrders = state.orders.map(order => 
            order.id === orderId || order.orderId === orderId
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order
          );

          const updatedHistory = state.orderHistory.map(order => 
            order.id === orderId || order.orderId === orderId
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order
          );

          const updatedCurrent = state.currentOrder?.id === orderId || state.currentOrder?.orderId === orderId
            ? { ...state.currentOrder, status, updatedAt: new Date().toISOString() }
            : state.currentOrder;

          return {
            orders: updatedOrders,
            orderHistory: updatedHistory,
            currentOrder: updatedCurrent
          };
        });

        logger.log('📦 Order status updated:', { orderId, status });
      },

      /**
       * Set current order
       * @param {Object} order - Order object
       */
      setCurrentOrder: (order) => {
        set({ currentOrder: order });
      },

      /**
       * Clear current order
       */
      clearCurrentOrder: () => {
        set({ currentOrder: null, paymentSession: null });
      },

      /**
       * Set orders
       * @param {Array} orders - Array of orders
       */
      setOrders: (orders) => {
        set({ orders, lastFetched: Date.now() });
      },

      /**
       * Clear error state
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Reset store to initial state
       */
      resetStore: () => {
        set({
          orders: [],
          currentOrder: null,
          loading: false,
          error: null,
          paymentSession: null,
          orderHistory: [],
          lastFetched: null
        });
      },

      /**
       * Get orders by status
       * @param {string} status - Order status
       * @returns {Array} Filtered orders
       */
      getOrdersByStatus: (status) => {
        const state = get();
        return state.orders.filter(order => order.status === status);
      },

      /**
       * Get order by ID
       * @param {string} orderId - Order ID
       * @returns {Object|null} Order object
       */
      getOrderById: (orderId) => {
        const state = get();
        return state.orders.find(order => 
          order.id === orderId || order.orderId === orderId
        ) || null;
      },

      /**
       * Get total order count
       * @returns {number} Total orders
       */
      getTotalOrders: () => {
        const state = get();
        return state.orders.length;
      },

      /**
       * Get orders by date range
       * @param {Date} startDate - Start date
       * @param {Date} endDate - End date
       * @returns {Array} Filtered orders
       */
      getOrdersByDateRange: (startDate, endDate) => {
        const state = get();
        return state.orders.filter(order => {
          const orderDate = new Date(order.timestamp || order.createdAt);
          return orderDate >= startDate && orderDate <= endDate;
        });
      },

      /**
       * Clear order history
       */
      clearOrderHistory: () => {
        set({ orderHistory: [] });
      },
    }),
    {
      name: 'product-payment-store',
      partialize: (state) => ({
        orders: state.orders,
        orderHistory: state.orderHistory.slice(-50), // Keep last 50 orders
        lastFetched: state.lastFetched
      }),
      onRehydrateStorage: () => (state) => {
        logger.log('🔄 Product payment store rehydrated');
        if (state) {
          state.loading = false;
          state.error = null;
          state.currentOrder = null;
          state.paymentSession = null;
        }
      },
    }
  )
);

export default useProductPaymentStore;
