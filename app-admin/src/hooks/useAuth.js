import { useState, useEffect } from 'react';
import { authAPI } from '../api';
import { authStorage } from '../utils/storage';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser, isAuthenticated, setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = await authStorage.getAuthToken();
      const storedUser = await authStorage.getUser();
      
      if (token && storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      // Mock API call - replace with actual API
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simple validation for demo
          if (credentials.email && credentials.password) {
            resolve({
              user: {
                id: '1',
                email: credentials.email,
                firstName: 'John',
                lastName: 'Doe',
              },
              token: 'mock-jwt-token',
              refreshToken: 'mock-refresh-token',
            });
          } else {
            reject(new Error('Invalid credentials'));
          }
        }, 1000);
      });
      
      const { user: userData, token, refreshToken } = response;
      
      await authStorage.setAuthToken(token);
      if (refreshToken) {
        await authStorage.setRefreshToken(refreshToken);
      }
      await authStorage.setUser(userData);
      
      setUser(userData);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      // Mock API call - replace with actual API
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (userData.email && userData.password) {
            resolve({
              user: {
                id: '1',
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
              },
              token: 'mock-jwt-token',
              refreshToken: 'mock-refresh-token',
            });
          } else {
            reject(new Error('Registration failed'));
          }
        }, 1000);
      });
      
      const { user: newUser, token, refreshToken } = response;
      
      await authStorage.setAuthToken(token);
      if (refreshToken) {
        await authStorage.setRefreshToken(refreshToken);
      }
      await authStorage.setUser(newUser);
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      await authStorage.clearAuth();
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    try {
      setIsLoading(true);
      // Mock API call - replace with actual API
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 1000);
      });
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setIsLoading(true);
      // Mock API call - replace with actual API
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 1000);
      });
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    try {
      setIsLoading(true);
      // Mock API call - replace with actual API
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            user: {
              ...user,
              ...userData,
            },
          });
        }, 1000);
      });
      
      await authStorage.setUser(response.user);
      setUser(response.user);
      
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshTokenValue = await authStorage.getRefreshToken();
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }
      
      const response = await authAPI.refreshToken();
      const { token: newToken, refreshToken: newRefreshToken } = response;
      
      await authStorage.setAuthToken(newToken);
      if (newRefreshToken) {
        await authStorage.setRefreshToken(newRefreshToken);
      }
      
      return response;
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
      throw error;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    refreshToken,
  };
};