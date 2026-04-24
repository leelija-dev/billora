import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      // Cart state
      cart: [],
      isCartOpen: false,
      isCheckoutOpen: false,
      
      // Cart actions
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.cart.find(item => item.id === product.id);
          
          if (existingItem) {
            // Update quantity if item exists
            return {
              cart: state.cart.map(item =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isCartOpen: true
            };
          } else {
            // Add new item to cart
            return {
              cart: [
                ...state.cart,
                {
                  ...product,
                  quantity,
                  title: product.name,
                  price: product.selling_price || product.price,
                  selling_price: product.selling_price || product.price,
                  unit_id: product.unit_id || 1,
                  stock_id: product.id,
                  discount_percentage: product.discount_percentage || 0,
                  gst_percentage: product.gst_percentage || 0,
                }
              ],
              isCartOpen: true
            };
          }
        });
      },
      
      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter(item => item.id !== productId),
          isCartOpen: state.cart.length > 1
        }));
      },
      
      updateQuantity: (productId, newQuantity) => {
        if (newQuantity < 1) {
          get().removeFromCart(productId);
          return;
        }
        
        set((state) => ({
          cart: state.cart.map(item =>
            item.id === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        }));
      },
      
      clearCart: () => {
        set({
          cart: [],
          isCartOpen: false,
          isCheckoutOpen: false
        });
      },
      
      toggleCart: () => {
        set((state) => ({ isCartOpen: !state.isCartOpen }));
      },
      
      openCart: () => {
        set({ isCartOpen: true });
      },
      
      closeCart: () => {
        set({ isCartOpen: false });
      },
      
      openCheckout: () => {
        set({ isCheckoutOpen: true, isCartOpen: false });
      },
      
      closeCheckout: () => {
        set({ isCheckoutOpen: false });
      },
      
      // Getters
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => {
          const itemTotal = (item.selling_price || item.price) * item.quantity;
          const discount = itemTotal * ((item.discount_percentage || 0) / 100);
          const afterDiscount = itemTotal - discount;
          const gst = afterDiscount * ((item.gst_percentage || 0) / 100);
          return total + afterDiscount + gst;
        }, 0);
      },
      
      getCartItemsCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },
      
      getCartSubtotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => 
          total + ((item.selling_price || item.price) * item.quantity), 0
        );
      },
      
      getTotalDiscount: () => {
        const { cart } = get();
        return cart.reduce((total, item) => {
          const itemTotal = (item.selling_price || item.price) * item.quantity;
          return total + (itemTotal * ((item.discount_percentage || 0) / 100));
        }, 0);
      },
      
      getTotalGST: () => {
        const { cart } = get();
        return cart.reduce((total, item) => {
          const itemTotal = (item.selling_price || item.price) * item.quantity;
          const discount = itemTotal * ((item.discount_percentage || 0) / 100);
          const afterDiscount = itemTotal - discount;
          return total + (afterDiscount * ((item.gst_percentage || 0) / 100));
        }, 0);
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        cart: state.cart,
        isCartOpen: state.isCartOpen,
        isCheckoutOpen: state.isCheckoutOpen,
      }),
    }
  )
);
