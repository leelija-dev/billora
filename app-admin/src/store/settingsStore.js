import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';
import { useAuthStore } from './authStore';
import { Alert } from 'react-native';

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
        set({ loading: true });
        try {
          const response = await authAPI.me();
          const userData = response.data?.user || response.data || {};

          set({
            profile: {
              firstName: userData.first_name || userData.firstName || '',
              lastName: userData.last_name || userData.lastName || '',
              email: userData.email || '',
              phone: userData.phone || '',
              avatar: userData.avatar || '',
            },
          });
        } catch (error) {
          Alert.alert('Error', 'Failed to load settings');
        } finally {
          set({ loading: false });
        }
      },

      saveProfile: async () => {
        const { profile } = get();
        set({ savingProfile: true });

        try {
          const payload = {
            first_name: profile.firstName,
            last_name: profile.lastName,
            email: profile.email,
            phone: profile.phone,
            name: `${profile.firstName} ${profile.lastName}`.trim(),
          };

          const response = await authAPI.updateProfile(payload);
          const updatedUser = response.data?.user || response.data;

          useAuthStore.getState().updateUser(updatedUser);
          Alert.alert('Success', 'Profile updated successfully');
          return { success: true };
        } catch (error) {
          Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
          return { success: false };
        } finally {
          set({ savingProfile: false });
        }
      },

      savePassword: async () => {
        const { security } = get();

        if (!security.currentPassword || !security.newPassword) {
          Alert.alert('Error', 'Please fill all password fields');
          return { success: false };
        }

        if (security.newPassword !== security.confirmNewPassword) {
          Alert.alert('Error', 'New passwords do not match');
          return { success: false };
        }

        set({ savingPassword: true });

        try {
          await authAPI.changePassword({
            current_password: security.currentPassword,
            new_password: security.newPassword,
          });

          set({
            security: {
              currentPassword: '',
              newPassword: '',
              confirmNewPassword: '',
            },
          });

          Alert.alert('Success', 'Password updated successfully');
          return { success: true };
        } catch (error) {
          Alert.alert('Error', error.response?.data?.message || 'Failed to update password');
          return { success: false };
        } finally {
          set({ savingPassword: false });
        }
      },

      savePreferences: async () => {
        set({ savingPreferences: true });
        try {
          // Save to backend if needed
          Alert.alert('Success', 'Preferences saved');
          return { success: true };
        } finally {
          set({ savingPreferences: false });
        }
      },

      saveNotifications: async () => {
        set({ savingNotifications: true });
        try {
          // Save to backend if needed
          Alert.alert('Success', 'Notification settings saved');
          return { success: true };
        } finally {
          set({ savingNotifications: false });
        }
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        notifications: state.notifications,
        preferences: state.preferences,
      }),
    }
  )
);