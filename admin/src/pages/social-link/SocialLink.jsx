// src/pages/SocialLink.jsx
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { socialService } from '../../services/socialService';
import { FaFacebook, FaInstagram, FaLink, FaUnlink } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const SocialLink = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [socialAccounts, setSocialAccounts] = useState({
    facebook: null,
    instagram: null
  });
  const [isConnecting, setIsConnecting] = useState(false);

  // Fetch connected accounts on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchConnectedAccounts();
    }
  }, [isAuthenticated]);

  const fetchConnectedAccounts = async () => {
    try {
      setLoading(true);
      const response = await socialService.getConnectedAccounts();
      setSocialAccounts(response.data);
    } catch (error) {
      console.error('Failed to fetch social accounts:', error);
      toast.error('Failed to load social accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform) => {
    try {
      setIsConnecting(true);
      
      // ✅ DIRECT REDIRECT - No AJAX call needed
      // Just redirect to the backend endpoint which will forward to Facebook/Instagram
      const redirectUrl = `http://localhost:8000/api/social/${platform.toLowerCase()}/redirect`;
      
      // Open in same window or new window
      window.location.href = redirectUrl;
      
      // If you want to open in a new window instead:
      // window.open(redirectUrl, '_blank', 'width=600,height=600');
      
    } catch (error) {
      console.error(`Failed to connect ${platform}:`, error);
      toast.error(`Failed to connect ${platform}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (platform) => {
    if (!window.confirm(`Are you sure you want to disconnect ${platform}?`)) {
      return;
    }

    try {
      setLoading(true);
      await socialService.disconnectAccount(platform);
      setSocialAccounts(prev => ({
        ...prev,
        [platform]: null
      }));
      toast.success(`${platform} disconnected successfully`);
    } catch (error) {
      console.error(`Failed to disconnect ${platform}:`, error);
      toast.error(`Failed to disconnect ${platform}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle OAuth callback (when redirected back)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const platform = urlParams.get('platform');
    const status = urlParams.get('status');
    const error = urlParams.get('error');
    
    if (error) {
      toast.error(`Connection failed: ${error}`);
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }
    
    if (platform && status === 'connected') {
      toast.success(`${platform} connected successfully!`);
      fetchConnectedAccounts();
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Please login to manage social accounts</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Social Media Management</h1>
          <p className="text-gray-600 mt-2">Connect your social accounts</p>
        </div>

        {/* Connected Accounts Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Facebook Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaFacebook className="text-3xl text-blue-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">Facebook</h3>
                  {socialAccounts.facebook ? (
                    <p className="text-sm text-green-600">✓ Connected</p>
                  ) : (
                    <p className="text-sm text-gray-500">Not connected</p>
                  )}
                </div>
              </div>
              {socialAccounts.facebook ? (
                <button
                  onClick={() => handleDisconnect('facebook')}
                  className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  disabled={loading}
                >
                  <FaUnlink className="inline mr-1" /> Disconnect
                </button>
              ) : (
                <button
                  onClick={() => handleConnect('facebook')}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={isConnecting}
                >
                  <FaLink className="inline mr-1" /> Connect
                </button>
              )}
            </div>
            {socialAccounts.facebook && (
              <div className="mt-3 text-sm text-gray-600">
                <p>Page: {socialAccounts.facebook.page_name || 'Connected'}</p>
                <p className="text-xs text-gray-400 mt-1">
                  ID: {socialAccounts.facebook.page_id || socialAccounts.facebook.id}
                </p>
              </div>
            )}
          </div>

          {/* Instagram Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaInstagram className="text-3xl text-pink-600 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">Instagram</h3>
                  {socialAccounts.instagram ? (
                    <p className="text-sm text-green-600">✓ Connected</p>
                  ) : (
                    <p className="text-sm text-gray-500">Not connected</p>
                  )}
                </div>
              </div>
              {socialAccounts.instagram ? (
                <button
                  onClick={() => handleDisconnect('instagram')}
                  className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  disabled={loading}
                >
                  <FaUnlink className="inline mr-1" /> Disconnect
                </button>
              ) : (
                <button
                  onClick={() => handleConnect('instagram')}
                  className="px-4 py-2 text-sm text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors"
                  disabled={isConnecting}
                >
                  <FaLink className="inline mr-1" /> Connect
                </button>
              )}
            </div>
            {socialAccounts.instagram && (
              <div className="mt-3 text-sm text-gray-600">
                <p>Account: {socialAccounts.instagram.username || 'Connected'}</p>
                <p className="text-xs text-gray-400 mt-1">
                  ID: {socialAccounts.instagram.id}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800">How it works:</h3>
          <ul className="mt-2 text-sm text-blue-700 space-y-1">
            <li>1. Click "Connect" to link your social media account</li>
            <li>2. You'll be redirected to Facebook/Instagram for authorization</li>
            <li>3. After authorizing, you'll be redirected back automatically</li>
            <li>4. Your connected account will appear here</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SocialLink;