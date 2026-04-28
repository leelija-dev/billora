// services/paymentService.js
import { api } from "../utils/secureApi";
import { logger } from '../utils/logger';

export const createOrder = async (orderData) => {
  try {
    logger.log("Payment Service - Sending request to:", "/cashfree/create-order");
    logger.log("Payment Service - Payload:", orderData);
    
    const response = await api.post("/cashfree/create-order", orderData);
    
    logger.log("Payment Service - Response:", response.data);
    return response.data;
  } catch (error) {
    logger.log("Payment Service - Error:", error);
    logger.log("Payment Service - Error message:", error.message);
    throw error;
  }
};