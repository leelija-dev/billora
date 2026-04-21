// services/filterService.js
import { apiRequest } from "@/utils/api";
import { logger } from '../utils/logger';

// Simple search function - just sends filters as query params
export const searchPlans = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  logger.log("Filter Service - Search Plans with filters:", queryParams);
  const endpoint = queryParams ? `/plans/search?${queryParams}` : '/plans/search';

  return await apiRequest(endpoint, 'GET');
};