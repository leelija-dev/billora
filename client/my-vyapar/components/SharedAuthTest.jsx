// Shared Authentication Test Component
"use client";

import React from 'react';
import { useSharedAuth } from '../contexts/SharedAuthContext';
import { FiUser, FiLogOut, FiSettings, FiExternalLink } from 'react-icons/fi';

const SharedAuthTest = () => {
  const { 
    user, 
    isAuthenticated, 
    loading, 
    error, 
    login, 
    logout, 
    redirectToAdmin,
    checkAuthStatus 
  } = useSharedAuth();

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span>Checking authentication...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FiUser className="w-5 h-5" />
        Shared Authentication Status
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">Error: {error}</p>
        </div>
      )}
      
      <div className="space-y-4">
        {/* Authentication Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium">Status:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isAuthenticated 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </span>
        </div>
        
        {/* User Information */}
        {isAuthenticated && user && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <h3 className="font-medium mb-2">User Information:</h3>
            <div className="space-y-1 text-sm">
              <p><strong>Name:</strong> {user.name || 'N/A'}</p>
              <p><strong>Email:</strong> {user.email || 'N/A'}</p>
              <p><strong>ID:</strong> {user.id || 'N/A'}</p>
              <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
              <p><strong>Company:</strong> {user.company_name || 'N/A'}</p>
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          {isAuthenticated ? (
            <>
              <button
                onClick={redirectToAdmin}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FiSettings className="w-4 h-4" />
                Admin Panel
                <FiExternalLink className="w-3 h-3" />
              </button>
              
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
              
              <button
                onClick={checkAuthStatus}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh Status
              </button>
            </>
          ) : (
            <button
              onClick={() => window.location.href = '/login'}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiUser className="w-4 h-4" />
              Go to Login
            </button>
          )}
        </div>
        
        {/* Instructions */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-sm mb-1">Test Instructions:</h4>
          <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
            <li>Login to the main application</li>
            <li>Click "Admin Panel" to open React Admin app</li>
            <li>Verify the admin app shows you as authenticated</li>
            <li>Test logout from either application</li>
            <li>Verify both apps log out simultaneously</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SharedAuthTest;
