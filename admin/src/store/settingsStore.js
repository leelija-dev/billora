import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import toast from 'react-hot-toast'
import { authService } from '../services/authService'
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
          const { user } = useAuthStore.getState()
          const res = await authService.getUserById(user?.id)
          const userData = res?.data?.data || res?.data || {}

          const fullName = userData?.name || ''
          const [firstNameFromName = '', ...rest] = fullName.split(' ')
          const lastNameFromName = rest.join(' ')

          set({
            profile: {
              firstName: firstNameFromName,
              lastName: lastNameFromName,
              email: userData?.email || '',
              phone: userData?.phone || '',
              avatar: userData?.avatar || '',
              company_name: userData?.company_name || '',
              gst_number: userData?.gst_number || '',
              address: userData?.address || '',
              city: userData?.city || '',
              state: userData?.state || '',
              country: userData?.country || '',
              pincode: userData?.pincode || '',
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
        const { user } = useAuthStore.getState()
        
        set({ savingProfile: true })
        try {
          const payload = {
            id: user?.id,
            name: `${profile.firstName} ${profile.lastName}`.trim(),
            phone: profile.phone,
            company_name: profile.company_name,
            gst_number: profile.gst_number,
            address: profile.address,
            city: profile.city,
            state: profile.state,
            country: profile.country,
            pincode: profile.pincode,
          }

          const res = await authService.updateProfile(payload)
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
        const { user } = useAuthStore.getState()

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
          await authService.changePassword({
            id: user?.id,
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
