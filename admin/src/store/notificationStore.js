import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import notificationAPI from '../services/notificationService';
import toast from 'react-hot-toast';

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [],
      planExpireReminder: null,
      loading: false,
      error: null,

      // Fetch plan expiration reminder
      fetchPlanExpireReminder: async (userId) => {
        set({ loading: true, error: null });
        try {
          const data = await notificationAPI.getPlanExpireReminder(userId);
          set({
            planExpireReminder: data,
            loading: false,
          });
          return data;
        } catch (error) {
          set({
            error: error.message || 'Failed to fetch plan expire reminder',
            loading: false,
            planExpireReminder: null,
          });
          toast.error('Failed to fetch plan expire reminder');
          return null;
        }
      },

      // Initialize notifications (fetch plan expire reminder)
      initializeNotifications: async (userId) => {
        await get().fetchPlanExpireReminder(userId);
      },

      // Clear notifications
      clearNotifications: () => {
        set({
          notifications: [],
          planExpireReminder: null,
          error: null,
        });
      },

      // Update notification (for marking as read)
      updateNotification: (notification) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notification.id ? notification : n
          ),
        }));
      },
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({
        notifications: state.notifications,
        planExpireReminder: state.planExpireReminder,
      }),
    }
  )
);
