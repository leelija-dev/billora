// services/authService.js - Cookie-based authentication
import { api } from "../utils/secureApi";

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
    console.error('❌ Login error:', error);
    console.error('❌ Error response:', error.response);
    console.error('❌ Error data:', error.response?.data);
    
    // Provide specific error messages
    if (error.message?.includes("User not found")) {
      throw new Error('User not found. Please check your credentials.');
    } else if (error.message?.includes("password")) {
      throw new Error('Invalid password. Please try again.');
    } else if (error.message?.includes("verify")) {
      throw new Error('Email not verified. Please check your email.');
    } else {
      throw error;
    }
  }
};

export const registerUser = async (userData) => {
  try {
    // ✅ Fetch CSRF cookie first
    await api.get("/sanctum/csrf-cookie");
    
    const response = await api.post("/users/register", userData);
    
    // Handle both response formats
    if ((response.success || response.status) && response.data) {
      // Let Zustand handle storage via persist middleware
      return response;
    } else {
      throw new Error(response.data.message || 'Registration failed');
    }
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async (userId) => {
  try {
    const response = await api.post("/users/logout", { user_id: userId });
    
    if (response?.status === true || response?.success === true) {
      // Success case - handled by caller
    }
    
    return response;
  } catch (error) {
    // Don't throw error for logout - always succeed locally
    return { success: true, message: "Logged out successfully" };
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