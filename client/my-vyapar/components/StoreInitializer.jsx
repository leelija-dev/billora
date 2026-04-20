"use client";

import { useAuthStore } from '../store/authStoreZustand';
import React from 'react';

// Initialize Zustand store on client side
function StoreInitializer() {
  const { checkPlanPurchaseStatus } = useAuthStore();
  
  React.useEffect(() => {
    // Only initialize if not already authenticated
    const timer = setTimeout(() => {
      // Check plan status after a short delay
      setTimeout(checkPlanPurchaseStatus, 100);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [checkPlanPurchaseStatus]);
  
  return null;
}

export default StoreInitializer;
