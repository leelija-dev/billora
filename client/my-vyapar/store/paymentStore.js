// store/paymentStore.js
import { create } from "zustand";
import { createOrder } from "../services/paymentService";
import { logger } from '../utils/logger';

export const usePaymentStore = create((set) => ({
  order: null,
  loading: false,
  error: null,

  createOrderAction: async (payload) => {
    logger.log("🟣 Store - Creating order with payload:", payload);
    set({ loading: true, error: null });

    try {
      const response = await createOrder(payload);
      
      logger.log("🟣 Store - Order created successfully:", response);
      
      set({
        order: response,
        loading: false,
        error: null,
      });

      return response;
    } catch (error) {
      logger.log("🟣 Store - Error creating order:", error);
      
      set({
        error: error.message || "Failed to create order",
        loading: false,
        order: null,
      });
      
      throw error;
    }
  },

  clearPayment: () => {
    set({
      order: null,
      error: null,
      loading: false,
    });
  },
}));