// services/paymentService.js
import { apiRequest } from "../utils/api";
import { logger } from '../utils/logger';

export const createOrder = async (orderData) => {
  try {
    logger.log("Payment Service - Sending request to:", "/cashfree/create-order");
    logger.log("Payment Service - Payload:", orderData);
    
    const response = await apiRequest("/cashfree/create-order", "POST", orderData);
    
    logger.log("Payment Service - Response:", response);
    return response;
  } catch (error) {
    logger.log("Payment Service - Error:", error);
    logger.log("Payment Service - Error message:", error.message);
    throw error;
  }
};