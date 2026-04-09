// services/productPaymentService.js
import { apiRequest } from "../utils/api";

export const createProductOrder = async (orderData) => {
  try {
    console.log("🔵 Product Payment Service - Sending request to:", "/orders/store");
    console.log("🔵 Product Payment Service - Payload:", orderData);
    
    const response = await apiRequest("/orders/store", "POST", orderData);
    
    console.log("🟢 Product Payment Service - Response:", response);
    return response;
  } catch (error) {
    console.log("🔴 Product Payment Service - Error:", error);
    console.log("🔴 Product Payment Service - Error message:", error.message);
    throw error;
  }
};