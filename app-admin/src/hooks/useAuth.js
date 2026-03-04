import { useState, useEffect, useContext } from 'react';
import { authAPI } from '../api';
import { authStorage } from '../utils/storage';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
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
      await logout();
    }
  };

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(credentials);
      
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
      const response = await authAPI.register(userData);
      
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
      await authAPI.logout();
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
      const response = await authAPI.forgotPassword(email);
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
      const response = await authAPI.resetPassword(token, newPassword);
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
      const response = await authAPI.updateProfile(userData);
      
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
