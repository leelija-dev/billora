'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStoreZustand';

export default function StoreInitializer() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'auth-storage' || e.key === 'auth_token') {
        initializeAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [initializeAuth]);

  return null;
}

// "use client";

// import { useAuthStore } from '../store/authStoreZustand';
// import React from 'react';
// import { logger } from '../utils/logger';

// // Initialize Zustand store on client side
// function StoreInitializer() {
//   const { checkPlanPurchaseStatus, isLoggedIn, user, token } = useAuthStore();
  
//   React.useEffect(() => {
//     // Initialize auth state after component mounts
//     const timer = setTimeout(() => {
//       // Check if auth state needs to be validated
//       if (isLoggedIn && user && token) {
//         logger.log('StoreInitializer: Auth state is valid, checking plan status');
//         checkPlanPurchaseStatus();
//       } else {
//         logger.log('StoreInitializer: No active auth state found');
//       }
//     }, 100);
    
//     return () => clearTimeout(timer);
//   }, [checkPlanPurchaseStatus, isLoggedIn, user, token]);
  
//   return null;
// }

// export default StoreInitializer;
