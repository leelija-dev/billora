// Shared Authentication Context for React Admin App
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
        // Redirect to main app for login
        redirectToMainApp();
      }
    } catch (err) {
      setError(err.message);
      setUser(null);
      setIsAuthenticated(false);
      // Redirect to main app for login
      redirectToMainApp();
    } finally {
      setLoading(false);
    }
  };

  // Login function (redirect to main app)
  const login = () => {
    redirectToMainApp();
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      // Notify other tabs
      localStorage.setItem('auth_logout', Date.now());
      setTimeout(() => localStorage.removeItem('auth_logout'), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to main app
  const redirectToMainApp = () => {
    authService.redirectToMainApp();
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

  // Listen for visibility change (check auth when tab becomes active)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkAuthStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    checkAuthStatus,
    redirectToMainApp,
  };

  return (
    <SharedAuthContext.Provider value={value}>
      {children}
    </SharedAuthContext.Provider>
  );
};
