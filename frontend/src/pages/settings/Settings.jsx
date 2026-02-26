import React, { useEffect, useMemo, useState } from 'react'
import { FiUser, FiBell, FiLock, FiGlobe, FiSave } from 'react-icons/fi'
import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import Select from '../../components/common/Select/Select'
import { useSettingsStore } from '../../store/settingsStore'
import { useAuthStore } from '../../store/authStore'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')

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
  } = useSettingsStore()

  const { user } = useAuthStore()

  useEffect(() => {
    loadSettings()
  }, [])

  const initials = useMemo(() => {
    const name = user?.name || `${profile.firstName} ${profile.lastName}`.trim() || 'User'
    const parts = name.split(' ').filter(Boolean)
    const first = parts[0]?.[0] || 'U'
    const second = parts[1]?.[0] || ''
    return `${first}${second}`.toUpperCase()
  }, [user?.name, profile.firstName, profile.lastName])

  const tabs = [
    { id: 'profile', name: 'Profile', icon: FiUser },
    { id: 'notifications', name: 'Notifications', icon: FiBell },
    { id: 'security', name: 'Security', icon: FiLock },
    { id: 'preferences', name: 'Preferences', icon: FiGlobe },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center px-6 py-3 text-sm font-medium border-b-2
                    ${activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {initials}
                </div>
                <Button variant="outline" size="sm">
                  Change Avatar
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ firstName: e.target.value })}
                  disabled={loading}
                />
                <Input
                  label="Last Name"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ lastName: e.target.value })}
                  disabled={loading}
                />
                <Input
                  label="Email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ email: e.target.value })}
                  disabled={loading}
                />
                <Input
                  label="Phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ phone: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="flex justify-end">
                <Button icon={FiSave} onClick={saveProfile} isLoading={savingProfile} disabled={loading}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Email Notifications
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive email notifications for important updates
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.emailNotifications}
                    onChange={(e) => setNotifications({ emailNotifications: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Order Updates
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get notified when orders are placed or updated
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.orderUpdates}
                    onChange={(e) => setNotifications({ orderUpdates: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Low Stock Alerts
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive alerts when products are running low
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.lowStockAlerts}
                    onChange={(e) => setNotifications({ lowStockAlerts: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>

              <div className="flex justify-end">
                <Button icon={FiSave} onClick={saveNotifications} isLoading={savingNotifications}>
                  Save Notification Settings
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4 max-w-2xl">
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                value={security.currentPassword}
                onChange={(e) => setSecurity({ currentPassword: e.target.value })}
              />
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                value={security.newPassword}
                onChange={(e) => setSecurity({ newPassword: e.target.value })}
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                value={security.confirmNewPassword}
                onChange={(e) => setSecurity({ confirmNewPassword: e.target.value })}
              />

              <div className="pt-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Two-Factor Authentication
                </h3>
                <Button variant="outline" size="sm">
                  Enable 2FA
                </Button>
              </div>

              <div className="flex justify-end">
                <Button onClick={savePassword} isLoading={savingPassword}>
                  Update Password
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-4 max-w-2xl">
              <Select
                label="Language"
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                  { value: 'de', label: 'German' },
                ]}
                value={preferences.language}
                onChange={(e) => setPreferences({ language: e.target.value })}
              />

              <Select
                label="Timezone"
                options={[
                  { value: 'utc', label: 'UTC' },
                  { value: 'est', label: 'Eastern Time' },
                  { value: 'pst', label: 'Pacific Time' },
                  { value: 'gmt', label: 'GMT' },
                ]}
                value={preferences.timezone}
                onChange={(e) => setPreferences({ timezone: e.target.value })}
              />

              <Select
                label="Date Format"
                options={[
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                ]}
                value={preferences.dateFormat}
                onChange={(e) => setPreferences({ dateFormat: e.target.value })}
              />

              <div className="flex justify-end">
                <Button icon={FiSave} onClick={savePreferences} isLoading={savingPreferences}>
                  Save Preferences
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings