import apiClient from '../utils/api';

export const cartService = {
  // Get cart items from local storage or API
  getCart: async () => {
    try {
      // For now, cart is managed locally in Zustand store
      // This can be extended to sync with backend if needed
      return { success: true, data: [] };
    } catch (error) {
      console.error('Failed to get cart:', error);
      return { success: false, message: error.message };
    }
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    try {
      // Cart is managed locally, but this can sync with backend if needed
      return { success: true, message: 'Item added to cart' };
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return { success: false, message: error.message };
    }
  },

  // Update cart item quantity
  updateQuantity: async (productId, quantity) => {
    try {
      return { success: true, message: 'Cart updated' };
    } catch (error) {
      console.error('Failed to update cart:', error);
      return { success: false, message: error.message };
    }
  },

  // Remove item from cart
  removeFromCart: async (productId) => {
    try {
      return { success: true, message: 'Item removed from cart' };
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      return { success: false, message: error.message };
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      return { success: true, message: 'Cart cleared' };
    } catch (error) {
      console.error('Failed to clear cart:', error);
      return { success: false, message: error.message };
    }
  },

  // Apply coupon/discount
  applyCoupon: async (couponCode) => {
    try {
      const response = await apiClient.post('/cart/apply-coupon', { coupon_code: couponCode });
      return response.data;
    } catch (error) {
      console.error('Failed to apply coupon:', error);
      return { success: false, message: error.message };
    }
  },

  // Remove coupon
  removeCoupon: async () => {
    try {
      const response = await apiClient.post('/cart/remove-coupon');
      return response.data;
    } catch (error) {
      console.error('Failed to remove coupon:', error);
      return { success: false, message: error.message };
    }
  },

  // Get cart summary with totals
  getCartSummary: async () => {
    try {
      // Calculate totals locally since cart is managed in Zustand
      return { success: true, data: { subtotal: 0, tax: 0, total: 0 } };
    } catch (error) {
      console.error('Failed to get cart summary:', error);
      return { success: false, message: error.message };
    }
  }
};
