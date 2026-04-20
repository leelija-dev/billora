"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuthData, saveAuthData, clearAuthData, isAuthenticated } from '../store/authStore';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasActivePlan, setHasActivePlan] = useState(false);

  // Check if user has purchased a plan
  const checkPlanPurchaseStatus = () => {
    try {
      const userId = user?._id || user?.id;

      console.log("🔍 Checking plan status for user:", userId);
      console.log("🔍 User object:", user);

      if (!userId) {
        console.log("❌ No user ID found");
        setHasActivePlan(false);
        return;
      }

      const planData = localStorage.getItem(`plan_${userId}`);
      console.log("🔍 Plan data from localStorage:", planData);

      if (!planData) {
        console.log("❌ No plan data found in localStorage");
        setHasActivePlan(false);
        return;
      }

      const parsed = JSON.parse(planData);
      console.log("🔍 Parsed plan data:", parsed);

      const purchaseTime = new Date(parsed.purchaseDate).getTime();
      const currentTime = new Date().getTime();
      const daysSincePurchase = (currentTime - purchaseTime) / (1000 * 60 * 60 * 24);

      const isValid = daysSincePurchase <= 365;
      console.log("🔍 Days since purchase:", daysSincePurchase, "Valid:", isValid);

      // Check for both 'active' and 'is_active' fields
      const isActive = parsed.active || parsed.is_active;
      console.log("🔍 Plan active status:", isActive);
      
      setHasActivePlan(isActive && isValid);
      console.log("🔍 Final hasActivePlan set to:", isActive && isValid);

    } catch (error) {
      console.error("❌ Error checking plan:", error);
      setHasActivePlan(false);
    }
  };

  // Initialize authentication state on mount
  const initializeAuth = () => {
    try {
      const authenticated = isAuthenticated();
      const { user: userData } = getAuthData();
      
      setIsLoggedIn(authenticated);
      setUser(userData);
      
      if (authenticated && userData) {
        checkPlanPurchaseStatus();
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      setIsLoggedIn(false);
      setUser(null);
      setHasActivePlan(false);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = (userData, token) => {
    saveAuthData(userData, token);
    setIsLoggedIn(true);
    setUser(userData);
    
    // Save plan data from API response if user has active plan
    if (userData.is_active && userData.plan_id) {
      const userId = userData._id || userData.id;
      if (userId) {
        const planData = {
          active: true,
          is_active: true, // Include both field names
          planId: userData.plan_id,
          plan_id: userData.plan_id, // Include both field names
          businessTypeId: userData.business_type_id,
          business_type_id: userData.business_type_id, // Include both field names
          purchaseDate: userData.created_at || new Date().toISOString(),
          created_at: userData.created_at || new Date().toISOString()
        };
        
        console.log("💾 Saving plan data to localStorage:", planData);
        localStorage.setItem(`plan_${userId}`, JSON.stringify(planData));
        
        // Verify it was saved correctly
        const savedData = localStorage.getItem(`plan_${userId}`);
        console.log("✅ Verified saved plan data:", JSON.parse(savedData));
      }
    }
    
    checkPlanPurchaseStatus();
    
    // Force immediate re-check of plan status after login
    setTimeout(() => {
      console.log("Re-checking plan status after login...");
      checkPlanPurchaseStatus();
    }, 100);
    
    // Dispatch event for other components
    window.dispatchEvent(new Event("userLoggedIn"));
  };

  // Logout function
  const logout = async () => {
    try {
      // Clear auth data
      clearAuthData();
      setIsLoggedIn(false);
      setUser(null);
      setHasActivePlan(false);
      
      // Dispatch event for other components
      window.dispatchEvent(new Event("userLoggedOut"));
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if API call fails
      clearAuthData();
      setIsLoggedIn(false);
      setUser(null);
      setHasActivePlan(false);
    }
  };

  // Update user data
  const updateUser = (userData) => {
    const currentToken = localStorage.getItem("token");
    saveAuthData(userData, currentToken);
    setUser(userData);
  };

  // Listen for storage changes (cross-tab sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "user") {
        initializeAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Listen for custom auth events
  useEffect(() => {
    const handleLoginEvent = () => initializeAuth();
    const handleLogoutEvent = () => {
      setIsLoggedIn(false);
      setUser(null);
      setHasActivePlan(false);
    };

    window.addEventListener("userLoggedIn", handleLoginEvent);
    window.addEventListener("userLoggedOut", handleLogoutEvent);
    
    return () => {
      window.removeEventListener("userLoggedIn", handleLoginEvent);
      window.removeEventListener("userLoggedOut", handleLogoutEvent);
    };
  }, []);

  // Re-check plan status when user changes
  useEffect(() => {
    if (user && isLoggedIn) {
      console.log("User state changed, re-checking plan status...");
      checkPlanPurchaseStatus();
    }
  }, [user, isLoggedIn]);

  // Listen for plan purchase events
  useEffect(() => {
    const handlePlanPurchase = (event) => {
      console.log("Plan purchase event received:", event.detail);

      if (event.detail?.status === 'completed' || event.detail?.planPurchased === true) {
        const userId = user?._id || user?.id;

        if (!userId) return;

        // Save plan per user
        localStorage.setItem(`plan_${userId}`, JSON.stringify({
          active: true,
          purchaseDate: new Date().toISOString()
        }));

        setHasActivePlan(true);
      }
    };

    window.addEventListener("planPurchaseCompleted", handlePlanPurchase);

    return () => {
      window.removeEventListener("planPurchaseCompleted", handlePlanPurchase);
    };
  }, [user]);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const value = {
    isLoggedIn,
    user,
    loading,
    hasActivePlan,
    login,
    logout,
    updateUser,
    checkPlanPurchaseStatus,
    initializeAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
