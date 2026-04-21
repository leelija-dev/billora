// Shared Navigation Component with Admin Access
"use client";

import React from 'react';
import { useSharedAuth } from '../contexts/SharedAuthContext';
import { FiSettings, FiExternalLink } from 'react-icons/fi';

const SharedNavigation = ({ children }) => {
  const { user, isAuthenticated, redirectToAdmin, logout } = useSharedAuth();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Admin Access Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={redirectToAdmin}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors duration-200"
        >
          <FiSettings className="w-4 h-4" />
          Admin Panel
          <FiExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* User Info Bar */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome,</span>
            <span className="text-sm font-medium text-gray-900">
              {user?.name || user?.email || 'User'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={redirectToAdmin}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
            >
              <FiSettings className="w-4 h-4" />
              Admin
            </button>
            
            <button
              onClick={logout}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
};

export default SharedNavigation;
