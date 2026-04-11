// services/productService.js
import { apiRequest } from "../utils/api";
import { getAuthData } from "../store/authStore";

const getUserId = () => {
  const { user } = getAuthData();
  if (!user || !user.id) {
    throw new Error("User not authenticated");
  }
  return user.id;
};

// Get all products
export const getProducts = async () => {
  try {
    const userId = getUserId();
    const response = await apiRequest(`/restaurant-all-products/${userId}`);
    
    let productsArray = [];
    if (response?.products?.data && Array.isArray(response.products.data)) {
      productsArray = response.products.data;
    } else if (response?.data && Array.isArray(response.data)) {
      productsArray = response.data;
    } else if (Array.isArray(response)) {
      productsArray = response;
    }
    
    return productsArray;
  } catch (error) {
    console.error("Error in getProducts:", error);
    return [];
  }
};

// Get user's store
export const getUserStore = async () => {
  try {
    const userId = getUserId();
    const response = await apiRequest(`/store/${userId}`);
    if (response?.data && response.data.length > 0) {
      return response.data[0].id;
    }
    return 1;
  } catch (error) {
    console.error("Error fetching store:", error);
    return 1;
  }
};

// Place order - ONLY send what backend validates
export const placeOrder = async (orderData) => {
  try {
    // Only send fields that are in the validation rules
    const payload = {
      user_id: orderData.user_id,
      store_id: orderData.store_id,
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      product_id: orderData.product_id,
      quantity: orderData.quantity,
      unit_id: orderData.unit_id
    };
    
    console.log("📤 Sending order:", payload);
    const response = await apiRequest("/orders/store", "POST", payload);
    console.log("📥 Order response:", response);
    return response;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

// Update payment status after successful online payment
export const updatePaymentStatus = async (orderId, status) => {
  try {
    const response = await apiRequest(`/invoice/update-payment-status/${orderId}`, "PUT", {
      payment_status: status
    });
    return response;
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await apiRequest(`/invoice/update-order-status/${orderId}`, "PUT", {
      order_status: status
    });
    return response;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export default {
  getProducts,
  getUserStore,
  placeOrder,
  updatePaymentStatus,
  // holiday?
  updateOrderStatus
};