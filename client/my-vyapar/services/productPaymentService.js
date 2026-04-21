// services/productPaymentService.js
import { apiRequest } from "../utils/api";
import { logger } from '../utils/logger';

export const createProductOrder = async (orderData) => {
  try {
    logger.log("Product Payment Service - Sending request to:", "/orders/store");
    logger.log("Product Payment Service - Payload:", orderData);
    
    const response = await apiRequest("/orders/store", "POST", orderData);
    
    logger.log("Product Payment Service - Response:", response);
    return response;
  } catch (error) {
    logger.log("Product Payment Service - Error:", error);
    logger.log("Product Payment Service - Error message:", error.message);
    throw error;
  }
};

// Also export as default for flexibility
export default {
  createProductOrder,
};