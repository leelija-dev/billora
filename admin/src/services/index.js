// API Services Index - Export all API services
import { apiClient } from './apiClient';
import { isMockMode, getApiBaseUrl, API_BASE_URL, DATA_SOURCE } from './apiConfig';
import { authService } from './authService';
import { productsAPI } from './productsService';
import { brandsAPI } from './brandsService';
import { categoriesAPI } from './categoriesService';
import { unitsAPI } from './unitsService';
import { stocksAPI } from './stocksService';
import { invoiceAPI } from './invoiceService';
import { storeAPI } from './storeService';
import { customerAPI } from './customerService';
import { plansAPI, dashboardAPI, cartAPI, reportsAPI } from './miscService';

// Export individual services
export { 
  authService,
  productsAPI,
  brandsAPI,
  categoriesAPI,
  unitsAPI,
  stocksAPI,
  invoiceAPI,
  storeAPI,
  customerAPI,
  plansAPI,
  dashboardAPI,
  cartAPI,
  reportsAPI
};

// Export core API utilities
export { apiClient, isMockMode, getApiBaseUrl, API_BASE_URL, DATA_SOURCE };

// Default export for convenience
export default {
  apiClient,
  authService,
  productsAPI,
  brandsAPI,
  categoriesAPI,
  unitsAPI,
  stocksAPI,
  invoiceAPI,
  storeAPI,
  customerAPI,
  plansAPI,
  dashboardAPI,
  cartAPI,
  reportsAPI,
};
