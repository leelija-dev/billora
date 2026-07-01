import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  FiUser,
  FiBell,
  FiLock,
  FiGlobe,
  FiSave,
  FiDownload,
  FiShare2,
  FiShield,
  FiMoon,
  FiSun,
  FiSmartphone,
  FiCheck,
  FiCopy,
  FiZoomIn,
  FiMail,
  FiShoppingBag,
  FiAlertCircle,
  FiRefreshCw,
  FiPlus,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import Select from "../../components/common/Select/Select";
import { useSettingsStore } from "../../store/settingsStore";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";
import toast from "react-hot-toast";
import { FaQrcode } from "react-icons/fa";
import { apiClient } from "../../services/apiClient";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showQRModal, setShowQRModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regeneratingQR, setRegeneratingQR] = useState(false);

  const {
    loading,
    savingProfile,
    savingPassword,
    savingPreferences,
    savingNotifications,
    profile,
    notifications,
    preferences,
    security,
    loadSettings,
    setProfile,
    setNotifications,
    setPreferences,
    setSecurity,
    saveProfile,
    savePassword,
    savePreferences,
    saveNotifications,
  } = useSettingsStore();

  const { user, token, updateUser } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();

  

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Memoize the initials to prevent recalculation
  const initials = useMemo(() => {
    const name = user?.name || profile.name || "User";
    const parts = name.split(" ").filter(Boolean);
    const first = parts[0]?.[0] || "U";
    const second = parts[1]?.[0] || "";
    return `${first}${second}`.toUpperCase();
  }, [user?.name, profile.name]);

  const tabs = useMemo(
    () => [
      {
        id: "profile",
        name: "Profile",
        icon: FiUser,
        description: "Manage your personal info",
      },
      {
        id: "notifications",
        name: "Notifications",
        icon: FiBell,
        description: "Set your preferences",
      },
      {
        id: "security",
        name: "Security",
        icon: FiLock,
        description: "Protect your account",
      },
      {
        id: "preferences",
        name: "Preferences",
        icon: FiGlobe,
        description: "Customize experience",
      },
      {
        id: "qr",
        name: "QR Code",
        icon: FaQrcode,
        description: "Share your store",
      },
    ],
    [],
  );

  const downloadQRCode = useCallback(async () => {
    if (!user?.products_qr) return;

    try {
      const response = await fetch(user.products_qr);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `store-qr-${user.name?.replace(/\s/g, "-") || "store"}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("QR Code downloaded successfully");
    } catch (error) {
      toast.error("Failed to download QR code");
    }
  }, [user?.products_qr, user?.name]);

  const copyQRUrl = useCallback(async () => {
    console.log(user);
    if (!user?.qrUrl) return;
    try {
      await navigator.clipboard.writeText(user.qrUrl);
      setCopied(true);
      toast.success("QR Code URL copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy URL");
    }
  }, [user?.products_qr]);

  const shareQRCode = useCallback(async () => {
    if (!user?.products_qr) return;

    try {
      const response = await fetch(user.products_qr);
      const blob = await response.blob();
      const file = new File([blob], "qr-code.svg", { type: "image/svg+xml" });

      if (navigator.share) {
        await navigator.share({
          title: `${user.name || "Store"} QR Code`,
          text: `Scan this QR code to explore ${user.name || "my store"} products`,
          files: [file],
        });
      } else {
        await copyQRUrl();
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error("Failed to share QR code");
      }
    }
  }, [user?.products_qr, user?.name, copyQRUrl]);

 const generateOrRegenerateQRCode = useCallback(async () => {
  if (!user?.id) {
    toast.error('User ID not found')
    return
  }
  
  // Show confirmation dialog for regeneration only if QR already exists
  const action = user?.products_qr ? 'regenerate' : 'generate'
  if (action === 'regenerate') {
    const confirmed = window.confirm(
      'Are you sure you want to regenerate your QR code? The old QR code will no longer work.'
    )
    if (!confirmed) return
  }
  
  setRegeneratingQR(true)
  
  try {
    // First, fetch CSRF cookie from Sanctum
    await apiClient.get('/sanctum/csrf-cookie')
    
    // Make the QR code generation request
    const response = await apiClient.post(`/users/qr-re-generate/${user.id}`)
    
    // Check if response is successful based on your API structure
    if (response.data && response.data.status === true) {
      // Extract QR URL from response (your API returns 'qr_url')
      const newQrUrl = response.data.qr_url || response.data.products_qr || response.data.data?.qr_url
      
      if (newQrUrl) {
        // Update user in auth store
        if (updateUser) {
          updateUser({ ...user, products_qr: newQrUrl })
        }
        
        // Reload settings to get fresh data
        await loadSettings()
        
        // Show success message from API or default message
        const successMessage = response.data.message || `QR Code ${action === 'regenerate' ? 'regenerated' : 'generated'} successfully!`
        toast.success(successMessage)
        
        // Close modal if open
        setShowQRModal(false)
      } else {
        toast.error('QR code was generated but URL not received')
      }
    } else {
      // Handle unsuccessful response (status === false)
      const errorMessage = response.data?.message || `Failed to ${action} QR code`
      throw new Error(errorMessage)
    }
  } catch (error) {
    console.error(`Error ${action}ing QR code:`, error)
    
    // Handle specific error cases
    if (error.response?.status === 419) {
      toast.error('Session expired. Please refresh the page and try again.')
    } else if (error.response?.status === 401) {
      toast.error('Authentication expired. Please login again.')
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.')
    } else if (error.response?.status === 404) {
      toast.error('User not found. Please try again.')
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.')
    } else {
      // Use error message from response if available
      const errorMessage = error.response?.data?.message || error.message || `Failed to ${action} QR code`
      toast.error(errorMessage)
    }
  } finally {
    setRegeneratingQR(false)
  }
}, [user?.id, user?.products_qr, updateUser, loadSettings])

  // Memoize the SettingCard component to prevent remounting
  const SettingCard = useCallback(
    ({ children, className = "" }) => (
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
      >
        {children}
      </div>
    ),
    [],
  );

  // Handle input changes more efficiently
  const handleProfileChange = useCallback(
    (field, value) => {
      setProfile({ [field]: value });
    },
    [setProfile],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - No animation on every keystroke */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - No animation on every keystroke */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-2">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                          ${
                            isActive
                              ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }
                        `}
                      >
                        <Icon
                          className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110 ${isActive ? "text-white" : ""}`}
                        />
                        <div className="text-left flex-1">
                          <div
                            className={`font-medium ${isActive ? "text-white" : ""}`}
                          >
                            {tab.name}
                          </div>
                          <div
                            className={`text-xs ${isActive ? "text-primary-100" : "text-gray-500 dark:text-gray-400"}`}
                          >
                            {tab.description}
                          </div>
                        </div>
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content - Use key with activeTab to only remount when tab changes */}
          <div className="flex-1" key={activeTab}>
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <SettingCard>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-transparent dark:from-primary-900/20">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Profile Information
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Update your personal details and contact information
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex items-center space-x-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                        {initials}
                      </div>
                      <button className="absolute -bottom-2 -right-2 p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-shadow">
                        <FiSmartphone className="w-4 h-4 text-primary-600" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {user?.name || "User"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Member since{" "}
                        {/* {user?.created_at
                          ? new Date(user.created_at).toLocaleDateString()
                          : "N/A"} */}
                          {user?.created_at ? new Date(user.created_at).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true, // set to false for 24-hour format
                        }) : "N/A"}
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Change Avatar
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      label="Full Name"
                      value={profile.name || ""}
                      onChange={(e) =>
                        handleProfileChange("name", e.target.value)
                      }
                      disabled={loading}
                      className="rounded-xl"
                      placeholder="Enter full name"
                    />

                    <Input
                      label="Phone Number"
                      value={profile.phone}
                      onChange={(e) =>
                        handleProfileChange("phone", e.target.value)
                      }
                      disabled={loading}
                      className="rounded-xl"
                      placeholder="Enter phone number"
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={profile.email}
                      disabled={true}
                      className="rounded-xl opacity-60"
                      title="Email cannot be changed"
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      icon={FiSave}
                      onClick={saveProfile}
                      isLoading={savingProfile}
                      disabled={loading}
                      className="px-6 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </SettingCard>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <SettingCard>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Notification Preferences
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Choose how you want to be notified
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {[
                    {
                      key: "emailNotifications",
                      icon: FiMail,
                      title: "Email Notifications",
                      description:
                        "Receive email notifications for important updates",
                    },
                    {
                      key: "orderUpdates",
                      icon: FiShoppingBag,
                      title: "Order Updates",
                      description:
                        "Get notified when orders are placed or updated",
                    },
                    {
                      key: "lowStockAlerts",
                      icon: FiAlertCircle,
                      title: "Low Stock Alerts",
                      description:
                        "Receive alerts when products are running low",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                          <item.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={notifications[item.key]}
                          onChange={(e) =>
                            setNotifications({ [item.key]: e.target.checked })
                          }
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}

                  <div className="flex justify-end pt-4">
                    <Button
                      icon={FiSave}
                      onClick={saveNotifications}
                      isLoading={savingNotifications}
                      className="rounded-xl"
                    >
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </SettingCard>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <SettingCard>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Security Settings
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Protect your account with strong security
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <Input
                      label="Current Password"
                      type="password"
                      placeholder="Enter current password"
                      value={security.currentPassword}
                      onChange={(e) =>
                        setSecurity({ currentPassword: e.target.value })
                      }
                      className="rounded-xl"
                    />
                    <Input
                      label="New Password"
                      type="password"
                      placeholder="Enter new password"
                      value={security.newPassword}
                      onChange={(e) =>
                        setSecurity({ newPassword: e.target.value })
                      }
                      className="rounded-xl"
                    />
                    <Input
                      label="Confirm New Password"
                      type="password"
                      placeholder="Confirm new password"
                      value={security.confirmNewPassword}
                      onChange={(e) =>
                        setSecurity({ confirmNewPassword: e.target.value })
                      }
                      className="rounded-xl"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                          <FiShield className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            Two-Factor Authentication
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                      >
                        Enable 2FA
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={savePassword}
                      isLoading={savingPassword}
                      className="rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
              </SettingCard>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <SettingCard>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    App Preferences
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Customize your experience
                  </p>
                </div>

                <div className="p-6 space-y-5">
                  <div className="pt-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                          {theme === "light" ? (
                            <FiMoon className="w-5 h-5 text-primary-600" />
                          ) : (
                            <FiSun className="w-5 h-5 text-primary-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            Dark Mode
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {theme === "light"
                              ? "Switch to dark theme"
                              : "Switch to light theme"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={toggleTheme}
                        className="relative inline-flex items-center cursor-pointer"
                      >
                        <div
                          className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                            theme === "dark" ? "bg-primary-600" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform duration-200 ease-in-out flex items-center justify-center ${
                              theme === "dark"
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                          >
                            {theme === "dark" ? (
                              <FiMoon className="w-3 h-3 text-primary-600" />
                            ) : (
                              <FiSun className="w-3 h-3 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </SettingCard>
            )}

            {/* QR Code Tab */}
            {activeTab === "qr" && (
              <SettingCard>
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-transparent dark:from-primary-900/20">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Store QR Code
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Share your store with customers via QR code
                  </p>
                </div>

                <div className="p-6">
                  {user?.products_qr ? (
                    <div className="flex flex-col items-center space-y-8">
                      {/* QR Code Card */}
                      <div
                        className="relative group cursor-pointer"
                        onClick={() => setShowQRModal(true)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border-2 border-primary-100 dark:border-primary-900/30">
                          <img
                            src={user.products_qr}
                            alt="Store QR Code"
                            className="w-64 h-64 object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/256?text=QR+Code";
                            }}
                          />
                          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
                          <div className="absolute -top-2 -right-2 bg-primary-500 rounded-full p-1.5 shadow-lg">
                            <FiZoomIn className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* QR Info */}
                      <div className="text-center space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {user.name || "Your Store"}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Scan to view products catalog
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap justify-center gap-3">
                        <Button
                          variant="outline"
                          icon={FiDownload}
                          onClick={downloadQRCode}
                          className="rounded-xl"
                        >
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          icon={copied ? FiCheck : FiCopy}
                          onClick={copyQRUrl}
                          className="rounded-xl"
                        >
                          {copied ? "Copied!" : "Copy URL"}
                        </Button>
                        <Button
                          variant="outline"
                          icon={FiShare2}
                          onClick={shareQRCode}
                          className="rounded-xl"
                        >
                          Share
                        </Button>
                        <Button
                          variant="outline"
                          icon={FiRefreshCw}
                          onClick={generateOrRegenerateQRCode}
                          isLoading={regeneratingQR}
                          className="rounded-xl"
                        >
                          Regenerate QR
                        </Button>
                      </div>

                      {/* Tips */}
                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                              <FiSmartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                          </div>
                          <div className="text-left">
                            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300">
                              Pro Tip
                            </h4>
                            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                              Print this QR code and display it at your store
                              counter for customers to scan and browse products
                              online.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mb-6">
                        <FaQrcode className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No QR Code Available
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                        Generate a QR code for your store so customers can
                        easily scan and browse your products.
                      </p>
                      <Button
                        icon={FiPlus}
                        onClick={generateOrRegenerateQRCode}
                        isLoading={regeneratingQR}
                        className="rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                      >
                        Generate QR Code
                      </Button>
                    </div>
                  )}
                </div>
              </SettingCard>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRModal && user?.products_qr && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowQRModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-gradient-to-r from-primary-500 to-primary-600 p-6 text-white">
                <button
                  onClick={() => setShowQRModal(false)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  ✕
                </button>
                <h3 className="text-xl font-bold">Store QR Code</h3>
                <p className="text-primary-100 text-sm mt-1">
                  Scan to view products
                </p>
              </div>

              <div className="p-8 flex justify-center">
                <img
                  src={user.products_qr}
                  alt="Store QR Code Large"
                  className="w-80 h-80 object-contain"
                />
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadQRCode}
                  className="rounded-lg"
                >
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={shareQRCode}
                  className="rounded-lg"
                >
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateOrRegenerateQRCode}
                  isLoading={regeneratingQR}
                  className="rounded-lg"
                >
                  Regenerate
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
