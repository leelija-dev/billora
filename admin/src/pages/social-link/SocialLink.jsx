// src/pages/SocialLink.jsx
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { socialService } from '../../services/socialService';
import { 
  FaFacebook, 
  FaInstagram, 
  FaLink, 
  FaUnlink, 
  FaCheckCircle, 
  FaTimesCircle,
  FaInfoCircle,
  FaArrowRight,
  FaPowerOff,
  FaUserCircle,
  FaClock,
  FaHashtag,
  FaIdBadge,
  FaRegBuilding,
  FaRegCheckCircle,
  FaRegTimesCircle,
  FaUserCheck,
  FaUserSlash
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const SocialLink = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [socialData, setSocialData] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fetch connected accounts on mount
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchSocialStatus();
    }
  }, [isAuthenticated, user?.id]);

  const fetchSocialStatus = async () => {
    try {
      setLoading(true);
      const response = await socialService.getSocialStatus(user.id);
      
      if (response.status && response.data) {
        setSocialData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch social status:', error);
      toast.error('Failed to load social status');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      
      // Direct redirect to the backend endpoint
      const redirectUrl = `http://localhost:8000/api/social/facebook/redirect`;
      window.location.href = redirectUrl;
      
    } catch (error) {
      console.error('Failed to connect Facebook:', error);
      toast.error('Failed to connect Facebook');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    if (!user?.id) {
      toast.error('User ID not found');
      return;
    }

    try {
      setUpdatingStatus(true);
      
      // Send status: 1 = connected, 0 = disconnected
      await socialService.updateSocialStatus(user.id, status);
      
      // Update local state
      setSocialData(prev => ({
        ...prev,
        is_active: status
      }));
      
      toast.success(
        status === 1 
          ? 'Facebook connected successfully' 
          : 'Facebook disconnected successfully'
      );
      
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
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
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }
    
    if (platform && status === 'connected') {
      toast.success('Facebook connected successfully!');
      if (user?.id) {
        setTimeout(() => {
          fetchSocialStatus();
        }, 500);
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user?.id]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaUserCircle className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">Please login to manage social accounts</h2>
        </div>
      </div>
    );
  }

  const isConnected = socialData?.is_active === 1;
  const hasInstagram = socialData?.instagram_business_id && socialData.instagram_business_id !== 'N/A';
  const isInstagramConnected = hasInstagram && isConnected;

  // Toggle switch handler
  const handleToggle = () => {
    if (!socialData) return;
    handleStatusUpdate(isConnected ? 0 : 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Social Media Management</h1>
          <p className="text-gray-600 mt-2">Connect and manage your social media accounts</p>
        </div>

        {/* Main Status Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-[30px] shadow-lg overflow-hidden border border-blue-200 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${isConnected ? 'bg-green-100' : 'bg-gray-200'}`}>
                  {isConnected ? (
                    <FaUserCheck className="text-3xl text-green-600" />
                  ) : (
                    <FaUserSlash className="text-3xl text-gray-500" />
                  )}
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-900">Account Status</h2>
                  <div className="flex items-center mt-1">
                    {isConnected ? (
                      <>
                        <FaCheckCircle className="text-green-500 mr-1.5" />
                        <span className="text-sm font-medium text-green-700">All services are active</span>
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="text-gray-400 mr-1.5" />
                        <span className="text-sm font-medium text-gray-600">No active connections</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                isConnected 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {isConnected ? 'Active' : 'Inactive'}
              </div>
            </div>
          </div>
        </div>

        {/* Facebook Card */}
        <div className="bg-white rounded-[30px] shadow-lg overflow-hidden border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4 sm:flex-row flex-col gap-4">
              <div className="flex items-center">
                <div className="bg-blue-50 p-3 rounded-full">
                  <FaFacebook className="text-3xl text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900 text-lg">Facebook</h3>
                  {socialData ? (
                    <div className="flex items-center mt-1">
                      {isConnected ? (
                        <>
                          <FaCheckCircle className="text-green-500 mr-1" />
                          <span className="text-sm text-green-600 font-medium">Connected</span>
                        </>
                      ) : (
                        <>
                          <FaTimesCircle className="text-red-500 mr-1" />
                          <span className="text-sm text-red-600 font-medium">Disconnected</span>
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">Not connected</p>
                  )}
                </div>
              </div>
              
              {!socialData ? (
                <button
                  onClick={handleConnect}
                  className="px-6 py-2.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                  disabled={isConnecting}
                >
                  <FaLink className="mr-2" /> 
                  {isConnecting ? 'Connecting...' : 'Connect Facebook'}
                </button>
              ) : (
                <button
                  onClick={() => handleStatusUpdate(isConnected ? 0 : 1)}
                  className={`px-6 py-2.5 text-sm rounded-lg transition-colors disabled:opacity-50 flex items-center ${
                    isConnected
                      ? 'text-red-600 border border-red-600 hover:bg-red-50'
                      : 'text-white bg-blue-600 hover:bg-blue-700'
                  }`}
                  disabled={updatingStatus}
                >
                  {isConnected ? (
                    <>
                      <FaUnlink className="mr-2" /> 
                      {updatingStatus ? 'Disconnecting...' : 'Disconnect'}
                    </>
                  ) : (
                    <>
                      <FaLink className="mr-2" /> 
                      {updatingStatus ? 'Connecting...' : 'Connect'}
                    </>
                  )}
                </button>
              )}
            </div>

            {socialData && (
              <div className="mt-6 space-y-4">
                {/* Facebook Account Details - Simplified */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider flex items-center">
                        <FaRegBuilding className="mr-1.5" /> Page Name
                      </p>
                      <p className="font-medium text-gray-900 mt-1">{socialData.page_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider flex items-center">
                        <FaPowerOff className="mr-1.5" /> Status
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                        isConnected
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isConnected ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Toggle Switch for Connection Status */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Facebook Connection</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {isConnected 
                          ? 'Auto-posting is currently enabled' 
                          : 'Auto-posting is currently disabled'}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span className={`text-sm font-medium ${!isConnected ? 'text-gray-700' : 'text-gray-400'}`}>
                        Off
                      </span>
                      
                      {/* Toggle Switch */}
                      <button
                        type="button"
                        onClick={handleToggle}
                        disabled={updatingStatus || !socialData}
                        className={`
                          relative inline-flex h-7 w-14 items-center rounded-full 
                          transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 
                          focus:ring-blue-500 focus:ring-offset-2
                          ${updatingStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                          ${isConnected ? 'bg-blue-600' : 'bg-gray-300'}
                        `}
                        role="switch"
                        aria-checked={isConnected}
                      >
                        <span
                          className={`
                            inline-block h-5 w-5 transform rounded-full bg-white 
                            transition-transform duration-300 ease-in-out shadow-md
                            ${isConnected ? 'translate-x-8' : 'translate-x-1'}
                          `}
                        />
                      </button>
                      
                      <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-gray-400'}`}>
                        On
                      </span>
                    </div>
                  </div>
                  
                  {/* Status badge with connection info */}
                  <div className="mt-3 flex items-center">
                    <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                      isConnected 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isConnected ? (
                        <>
                          <FaRegCheckCircle className="mr-1.5" />
                          Auto-posting is ON
                        </>
                      ) : (
                        <>
                          <FaRegTimesCircle className="mr-1.5" />
                          Auto-posting is OFF
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-xs text-gray-500 flex items-center">
              {isConnected ? (
                <>
                  <FaCheckCircle className="text-green-500 mr-2" />
                  Facebook auto-posting is enabled
                </>
              ) : (
                <>
                  <FaTimesCircle className="text-gray-400 mr-2" />
                  Facebook auto-posting is disabled
                </>
              )}
            </p>
            {socialData && (
              <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {isConnected ? (
                  <>
                    <FaCheckCircle className="mr-1 text-green-600" />
                    Active
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="mr-1 text-gray-400" />
                    Inactive
                  </>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Instagram Card */}
        <div className="bg-white rounded-[30px] shadow-lg overflow-hidden border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4 sm:flex-row flex-col gap-4">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${hasInstagram ? 'bg-pink-50' : 'bg-gray-100'}`}>
                  <FaInstagram className={`text-3xl ${hasInstagram ? 'text-pink-600' : 'text-gray-400'}`} />
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900 text-lg">Instagram</h3>
                  <div className="flex items-center mt-1">
                    {hasInstagram ? (
                      <>
                        {isInstagramConnected ? (
                          <>
                            <FaCheckCircle className="text-green-500 mr-1" />
                            <span className="text-sm text-green-600 font-medium">Connected</span>
                          </>
                        ) : (
                          <>
                            <FaTimesCircle className="text-yellow-500 mr-1" />
                            <span className="text-sm text-yellow-600 font-medium">Pending Connection</span>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500 font-medium">Not Available</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {hasInstagram ? (
                <div className={`px-4 py-2 rounded-full text-xs font-medium flex items-center ${
                  isInstagramConnected 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {isInstagramConnected ? (
                    <>
                      <FaCheckCircle className="mr-1.5" />
                      Connected
                    </>
                  ) : (
                    <>
                      <FaLink className="mr-1.5" />
                      Connect via Facebook
                    </>
                  )}
                </div>
              ) : (
                <div className="px-4 py-2 rounded-full text-xs font-medium bg-gray-100 text-gray-500 flex items-center">
                  <FaTimesCircle className="mr-1.5" />
                  Not Available
                </div>
              )}
            </div>

            <div className="mt-4">
              {hasInstagram ? (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider flex items-center">
                        <FaPowerOff className="mr-1.5" /> Status
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                        isInstagramConnected
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {isInstagramConnected ? 'Connected' : 'Waiting for Facebook connection'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 flex items-center">
                      <FaInfoCircle className="mr-1.5 text-blue-500" />
                      Instagram is connected through your Facebook page. 
                      {isConnected 
                        ? ' Auto-posting will work for Instagram as well.' 
                        : ' Please connect Facebook to enable Instagram auto-posting.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-start">
                    <FaInfoCircle className="text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">No Instagram Business Account Linked</p>
                      <p className="text-xs text-yellow-700 mt-1">
                        To connect Instagram, you need to link an Instagram Business account to your Facebook page.
                        Please ensure your Instagram account is connected to your Facebook page and then reconnect Facebook.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instagram Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-xs text-gray-500 flex items-center">
              {hasInstagram ? (
                <>
                  {isInstagramConnected ? (
                    <>
                      <FaCheckCircle className="text-green-500 mr-2" />
                      Instagram auto-posting is active
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="text-yellow-500 mr-2" />
                      Instagram auto-posting is inactive (Facebook disconnected)
                    </>
                  )}
                </>
              ) : (
                <>
                  <FaTimesCircle className="text-gray-400 mr-2" />
                  Instagram not configured
                </>
              )}
            </p>
            {hasInstagram && (
              <span className={`text-xs px-2 py-1 rounded-full flex items-center ${
                isInstagramConnected 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {isInstagramConnected ? (
                  <>
                    <FaCheckCircle className="mr-1 text-green-600" />
                    Active
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="mr-1 text-yellow-600" />
                    Inactive
                  </>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 flex items-center">
            <FaInfoCircle className="mr-2" /> How it works:
          </h3>
          <ul className="mt-2 text-sm text-blue-700 space-y-1">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center bg-blue-200 text-blue-800 rounded-full w-5 h-5 text-xs font-bold mr-2 flex-shrink-0 mt-0.5">1</span>
              Click "Connect Facebook" to link your Facebook page
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center bg-blue-200 text-blue-800 rounded-full w-5 h-5 text-xs font-bold mr-2 flex-shrink-0 mt-0.5">2</span>
              You'll be redirected to Facebook for authorization
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center bg-blue-200 text-blue-800 rounded-full w-5 h-5 text-xs font-bold mr-2 flex-shrink-0 mt-0.5">3</span>
              After authorizing, you'll be redirected back automatically
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center bg-blue-200 text-blue-800 rounded-full w-5 h-5 text-xs font-bold mr-2 flex-shrink-0 mt-0.5">4</span>
              Use the toggle switch to enable (ON) or disable (OFF) Facebook auto-posting
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center bg-blue-200 text-blue-800 rounded-full w-5 h-5 text-xs font-bold mr-2 flex-shrink-0 mt-0.5">5</span>
              Instagram will automatically connect if you have an Instagram Business account linked to your Facebook page
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center bg-blue-200 text-blue-800 rounded-full w-5 h-5 text-xs font-bold mr-2 flex-shrink-0 mt-0.5">6</span>
              <span><FaArrowRight className="inline mx-1 text-blue-600" /> When Facebook is ON, Instagram auto-posting is also enabled</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SocialLink;