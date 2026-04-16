// services/paymentService.js
import { apiRequest } from "../utils/api";

export const createOrder = async (orderData) => {
  try {
    console.log("🔵 Payment Service - Sending request to:", "/cashfree/create-order");
    console.log("🔵 Payment Service - Payload:", orderData);
    
    const response = await apiRequest("/cashfree/create-order", "POST", orderData);
    
    console.log("🟢 Payment Service - Response:", response);
    return response;
  } catch (error) {
    console.log("🔴 Payment Service - Error:", error);
    console.log("🔴 Payment Service - Error message:", error.message);
    throw error;
  }
};