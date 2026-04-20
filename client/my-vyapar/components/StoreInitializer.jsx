"use client";

import { useAuthStore } from '../store/authStoreZustand';
import React from 'react';

// Initialize Zustand store on client side
function StoreInitializer() {
  const { initializeAuth } = useAuthStore();
  
  React.useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  return null;
}

export default StoreInitializer;
