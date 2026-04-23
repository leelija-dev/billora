import { apiRequest } from "../utils/api";
import { logger } from '../utils/logger';

export const getBusinessTypes = async () => {
  try {
    // Make sure the URL is correct
    // If your API base URL is already set in apiRequest, just use the relative path
    const res = await apiRequest('/business-type'); // or '/business-type' without 's'
    logger.log("Business types response:", res);
    return res;
  } catch (error) {
    logger.error("Business types API error:", error);
    throw error.response?.data || { message: "Failed to fetch business types" };
  }
};