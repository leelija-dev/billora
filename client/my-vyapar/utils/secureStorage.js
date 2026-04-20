// utils/secureStorage.js - Secure storage utilities for better security
import { AUTH } from '../constants';

// Development mode check
const isDevelopment = process.env.NODE_ENV === 'development';

// Logger utility for development only
const logger = {
  log: (...args) => isDevelopment && console.log(...args),
  error: (...args) => isDevelopment && console.error(...args),
  warn: (...args) => isDevelopment && console.warn(...args),
};

// Token management with security considerations
export const secureStorage = {
  // Save token with basic security measures
  saveToken: (token) => {
    if (!token) return;
    
    try {
      // In production, consider using httpOnly cookies via server
      // For now, we'll use localStorage with basic obfuscation
      const encodedToken = btoa(token); // Basic encoding (not encryption)
      localStorage.setItem(AUTH.TOKEN_KEY, encodedToken);
      
      logger.log('Token saved securely');
    } catch (error) {
      logger.error('Error saving token:', error);
      throw new Error('Failed to save authentication token');
    }
  },

  // Get and decode token
  getToken: () => {
    try {
      const encodedToken = localStorage.getItem(AUTH.TOKEN_KEY);
      if (!encodedToken) return null;
      
      const token = atob(encodedToken); // Decode
      
      // Basic token validation
      if (token && typeof token === 'string' && token.length > 10) {
        return token;
      }
      
      return null;
    } catch (error) {
      logger.error('Error retrieving token:', error);
      return null;
    }
  },

  // Remove token
  removeToken: () => {
    try {
      localStorage.removeItem(AUTH.TOKEN_KEY);
      localStorage.removeItem(AUTH.AUTH_TOKEN_KEY); // Legacy support
      logger.log('Token removed securely');
    } catch (error) {
      logger.error('Error removing token:', error);
    }
  },

  // Save user data
  saveUser: (user) => {
    if (!user) return;
    
    try {
      const userString = JSON.stringify(user);
      const encodedUser = btoa(userString);
      localStorage.setItem(AUTH.USER_KEY, encodedUser);
      
      logger.log('User data saved securely');
    } catch (error) {
      logger.error('Error saving user data:', error);
      throw new Error('Failed to save user data');
    }
  },

  // Get and decode user data
  getUser: () => {
    try {
      const encodedUser = localStorage.getItem(AUTH.USER_KEY);
      if (!encodedUser) return null;
      
      const userString = atob(encodedUser);
      const user = JSON.parse(userString);
      
      return user;
    } catch (error) {
      logger.error('Error retrieving user data:', error);
      return null;
    }
  },

  // Remove user data
  removeUser: () => {
    try {
      localStorage.removeItem(AUTH.USER_KEY);
      localStorage.removeItem(AUTH.USER_DATA_KEY); // Legacy support
      logger.log('User data removed securely');
    } catch (error) {
      logger.error('Error removing user data:', error);
    }
  },

  // Clear all auth data
  clearAuth: () => {
    secureStorage.removeToken();
    secureStorage.removeUser();
    
    // Clear plan data
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(AUTH.PLAN_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    
    logger.log('All auth data cleared securely');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = secureStorage.getToken();
    const user = secureStorage.getUser();
    
    return !!(token && user);
  },

  // Save plan data
  savePlanData: (userId, planData) => {
    if (!userId || !planData) return;
    
    try {
      const planString = JSON.stringify(planData);
      const encodedPlan = btoa(planString);
      const planKey = `${AUTH.PLAN_KEY_PREFIX}${userId}`;
      
      localStorage.setItem(planKey, encodedPlan);
      logger.log('Plan data saved securely');
    } catch (error) {
      logger.error('Error saving plan data:', error);
    }
  },

  // Get plan data
  getPlanData: (userId) => {
    if (!userId) return null;
    
    try {
      const planKey = `${AUTH.PLAN_KEY_PREFIX}${userId}`;
      const encodedPlan = localStorage.getItem(planKey);
      
      if (!encodedPlan) return null;
      
      const planString = atob(encodedPlan);
      const planData = JSON.parse(planString);
      
      return planData;
    } catch (error) {
      logger.error('Error retrieving plan data:', error);
      return null;
    }
  },

  // Remove plan data
  removePlanData: (userId) => {
    if (!userId) return;
    
    try {
      const planKey = `${AUTH.PLAN_KEY_PREFIX}${userId}`;
      localStorage.removeItem(planKey);
      logger.log('Plan data removed securely');
    } catch (error) {
      logger.error('Error removing plan data:', error);
    }
  },
};

// Token validation helper
export const validateToken = (token) => {
  if (!token) return false;
  
  try {
    // Basic JWT structure validation (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Check if payload can be decoded
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration (if present)
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    logger.error('Token validation error:', error);
    return false;
  }
};

// Refresh token helper (placeholder for future implementation)
export const refreshToken = async () => {
  // This would typically call an API endpoint to refresh the token
  // For now, just validate the current token
  const token = secureStorage.getToken();
  
  if (!token || !validateToken(token)) {
    secureStorage.clearAuth();
    return false;
  }
  
  return true;
};

// Export default for convenience
export default secureStorage;
