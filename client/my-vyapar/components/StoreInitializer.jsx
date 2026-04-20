"use client";

import { useAuthStore } from '../store/authStoreZustand';
import React from 'react';

// Initialize Zustand store on client side
function StoreInitializer() {
  const { initializeAuth, checkPlanPurchaseStatus } = useAuthStore();
  
  React.useEffect(() => {
    // Simple initialization with a small delay to ensure hydration
    const timer = setTimeout(() => {
      initializeAuth();
      // Check plan status after a short delay
      setTimeout(checkPlanPurchaseStatus, 100);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [initializeAuth, checkPlanPurchaseStatus]);
  
  return null;
}

export default StoreInitializer;
