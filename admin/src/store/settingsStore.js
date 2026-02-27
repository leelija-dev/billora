import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'
import { authAPI } from '../services/api'
import { useAuthStore } from './authStore'

export const useSettingsStore = create(
  persist(
    (set, get) => ({
      loading: false,
      savingProfile: false,
      savingPassword: false,
      savingPreferences: false,
      savingNotifications: false,

      profile: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        avatar: '',
      },

      notifications: {
        emailNotifications: true,
        orderUpdates: true,
        lowStockAlerts: true,
      },

      preferences: {
        language: 'en',
        timezone: 'utc',
        dateFormat: 'MM/DD/YYYY',
      },

      security: {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      },

      setProfile: (patch) => set({ profile: { ...get().profile, ...patch } }),
      setNotifications: (patch) => set({ notifications: { ...get().notifications, ...patch } }),
      setPreferences: (patch) => set({ preferences: { ...get().preferences, ...patch } }),
      setSecurity: (patch) => set({ security: { ...get().security, ...patch } }),

      loadSettings: async () => {
        set({ loading: true })
        try {
          const res = await authAPI.me()
          const me = res?.data || {}
          const user = me.user || me

          const fullName = user?.name || ''
          const [firstNameFromName = '', ...rest] = fullName.split(' ')
          const lastNameFromName = rest.join(' ')

          set({
            profile: {
              firstName: user?.first_name ?? user?.firstName ?? firstNameFromName,
              lastName: user?.last_name ?? user?.lastName ?? lastNameFromName,
              email: user?.email ?? '',
              phone: user?.phone ?? '',
              avatar: user?.avatar ?? '',
            },
          })
        } catch (e) {
          toast.error(e?.response?.data?.message || 'Failed to load settings')
        } finally {
          set({ loading: false })
        }
      },

      saveProfile: async () => {
        const { profile } = get()
        set({ savingProfile: true })
        try {
          const payload = {
            first_name: profile.firstName,
            last_name: profile.lastName,
            email: profile.email,
            phone: profile.phone,
            avatar: profile.avatar,
            name: `${profile.firstName} ${profile.lastName}`.trim(),
          }

          const res = await authAPI.updateProfile(payload)
          const updatedUser = res?.data?.user || res?.data || payload

          useAuthStore.getState().updateUser(updatedUser)
          toast.success('Profile updated')
          return { success: true }
        } catch (e) {
          toast.error(e?.response?.data?.message || 'Failed to update profile')
          return { success: false }
        } finally {
          set({ savingProfile: false })
        }
      },

      savePassword: async () => {
        const { security } = get()

        if (!security.currentPassword || !security.newPassword) {
          toast.error('Please fill all password fields')
          return { success: false }
        }

        if (security.newPassword !== security.confirmNewPassword) {
          toast.error('New password and confirmation do not match')
          return { success: false }
        }

        set({ savingPassword: true })
        try {
          await authAPI.changePassword({
            current_password: security.currentPassword,
            new_password: security.newPassword,
          })

          set({ security: { currentPassword: '', newPassword: '', confirmNewPassword: '' } })
          toast.success('Password updated')
          return { success: true }
        } catch (e) {
          toast.error(e?.response?.data?.message || 'Failed to update password')
          return { success: false }
        } finally {
          set({ savingPassword: false })
        }
      },

      savePreferences: async () => {
        set({ savingPreferences: true })
        try {
          toast.success('Preferences saved')
          return { success: true }
        } finally {
          set({ savingPreferences: false })
        }
      },

      saveNotifications: async () => {
        set({ savingNotifications: true })
        try {
          toast.success('Notification settings saved')
          return { success: true }
        } finally {
          set({ savingNotifications: false })
        }
      },
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        notifications: state.notifications,
        preferences: state.preferences,
      }),
    }
  )
)
