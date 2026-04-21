// Shared Authentication Context for Next.js MyVyapar App
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/sharedAuthService';

const SharedAuthContext = createContext();

export const useSharedAuth = () => {
  const context = useContext(SharedAuthContext);
  if (!context) {
    throw new Error('useSharedAuth must be used within SharedAuthProvider');
  }
  return context;
};

export const SharedAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const authResult = await authService.checkAuthStatus();
      
      if (authResult.isAuthenticated) {
        setUser(authResult.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      setError(err.message);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.login(credentials);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        return { success: true, user: result.user };
      } else {
        setError(result.message);
        return { success: false, message: result.message };
      }
    } catch (err) {
      const message = err.message || 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to admin app
  const redirectToAdmin = () => {
    authService.redirectToAdmin();
  };

  // Initialize auth status on mount
  useEffect(() => {
    checkAuthStatus();

    // Set up periodic auth checking
    const interval = setInterval(() => {
      checkAuthStatus();
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Listen for storage events (for cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'auth_logout') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    checkAuthStatus,
    redirectToAdmin,
  };

  return (
    <SharedAuthContext.Provider value={value}>
      {children}
    </SharedAuthContext.Provider>
  );
};
