// Authentication Debug Component for React Admin
import React, { useEffect, useState } from 'react';
import { useSharedAuth } from '../contexts/SharedAuthContext';

const AuthDebug = () => {
  const { user, isAuthenticated, loading, error, checkAuthStatus } = useSharedAuth();
  const [debugInfo, setDebugInfo] = useState({});
  const [cookies, setCookies] = useState({});

  useEffect(() => {
    // Get all cookies
    const allCookies = {};
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      allCookies[name] = value;
    });
    setCookies(allCookies);

    // Get debug info
    setDebugInfo({
      userAgent: navigator.userAgent,
      origin: window.location.origin,
      href: window.location.href,
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
      mainAppUrl: import.meta.env.VITE_MAIN_APP_URL,
      adminAppUrl: import.meta.env.VITE_ADMIN_APP_URL,
    });
  }, []);

  const handleManualAuthCheck = async () => {
    console.log('Manual auth check...');
    const result = await checkAuthStatus();
    console.log('Auth check result:', result);
  };

  const handleTestAPI = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/test`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      const data = await response.json();
      console.log('API Test Response:', data);
      alert(`API Test Success: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('API Test Error:', error);
      alert(`API Test Error: ${error.message}`);
    }
  };

  const handleAuthCheck = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/session/check`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      const data = await response.json();
      console.log('Auth Check Response:', data);
      alert(`Auth Check Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      console.error('Auth Check Error:', error);
      alert(`Auth Check Error: ${error.message}`);
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg mb-4">
      <h3 className="text-lg font-bold mb-3">Authentication Debug Info</h3>
      
      {/* Status */}
      <div className="mb-4 p-3 bg-white rounded">
        <strong>Status:</strong> {loading ? 'Loading...' : isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
        {error && <div className="text-red-600 text-sm mt-1">Error: {error}</div>}
      </div>

      {/* User Info */}
      {user && (
        <div className="mb-4 p-3 bg-white rounded">
          <strong>User:</strong>
          <pre className="text-xs mt-1">{JSON.stringify(user, null, 2)}</pre>
        </div>
      )}

      {/* Cookies */}
      <div className="mb-4 p-3 bg-white rounded">
        <strong>Cookies:</strong>
        <pre className="text-xs mt-1 max-h-32 overflow-auto">
          {JSON.stringify(cookies, null, 2)}
        </pre>
      </div>

      {/* Debug Info */}
      <div className="mb-4 p-3 bg-white rounded">
        <strong>Debug Info:</strong>
        <pre className="text-xs mt-1">{JSON.stringify(debugInfo, null, 2)}</pre>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleManualAuthCheck}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Check Auth Status
        </button>
        <button
          onClick={handleTestAPI}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          Test API
        </button>
        <button
          onClick={handleAuthCheck}
          className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
        >
          Check Auth Endpoint
        </button>
        <button
          onClick={() => window.location.href = 'http://localhost:3000/login'}
          className="px-3 py-1 bg-orange-500 text-white rounded text-sm"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default AuthDebug;
