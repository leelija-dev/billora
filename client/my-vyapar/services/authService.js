// services/authService.js - Cookie-based authentication
import { api } from "../utils/secureApi";

let isLoggingOut = false;

export const loginUser = async (userData) => {
  try {
    console.log('🔐 Attempting login for:', userData.email);
    
    // ✅ Fetch CSRF cookie first
    await api.get("/sanctum/csrf-cookie");
    
    const response = await api.post("/users/login", userData);
    
    console.log('📦 Full response:', response);
    console.log('📦 Response data:', response.data);
    console.log('📦 Response status:', response.data.status);
    
    // Handle both response formats (success OR status)
    if ((response.success || response.status) && response.data) {
      console.log('✅ Login successful from API');
      
      // Let Zustand handle storage via persist middleware
      return response;
    } else {
      // Handle case where status is false
      throw new Error(response.data.message || 'Login failed');
    }
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    // ✅ Fetch CSRF cookie first
    await api.get("/sanctum/csrf-cookie");
    
    const response = await api.post("/users/register", userData);
    console.log("checking response ............", response)
    
    // ✅ Return the full response object
    // The caller will check response.data.status
    return response;
  } catch (error) {
    console.error('Registration service error:', error);
    throw error;
  }
};

export const logoutUser = async (userId) => {
  // Prevent multiple simultaneous logout attempts
  if (isLoggingOut) {
    console.log('⚠️ Logout already in progress, skipping...');
    return { success: true, message: "Logout already in progress" };
  }
  
  isLoggingOut = true;
  
  try {
    const response = await api.post("/users/logout", { user_id: userId });
    
    if (response?.status === true || response?.success === true) {
      // Success case - handled by caller
    }
    
    return response;
  } catch (error) {
    // Don't throw error for logout - always succeed locally
    console.log('Logout API error (session may already be expired):', error.message);
    return { success: true, message: "Logged out successfully" };
  } finally {
    // Reset lock after delay
    setTimeout(() => {
      isLoggingOut = false;
    }, 500);
  }
};

export const checkSession = async () => {
  try {
    const response = await api.get("/users/check-session");
    return response.data;
  } catch (error) {
    return { status: false, message: 'Not authenticated' };
  }
};