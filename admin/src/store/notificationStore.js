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
      _fetchPromise: null, // Internal state for deduplication

      // Fetch plan expiration reminder with deduplication
      fetchPlanExpireReminder: async (userId) => {
        const state = get();
        
        // If already loading, return the existing promise
        if (state._fetchPromise) {
          return state._fetchPromise;
        }

        // If we have recent data (less than 5 minutes old), return it
        if (state.planExpireReminder && state._lastFetch) {
          const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
          if (state._lastFetch > fiveMinutesAgo) {
            return state.planExpireReminder;
          }
        }

        set({ loading: true, error: null });
        
        const fetchPromise = (async () => {
          try {
            const data = await notificationAPI.getPlanExpireReminder(userId);
            set({
              planExpireReminder: data,
              loading: false,
              _fetchPromise: null,
              _lastFetch: Date.now(),
            });
            return data;
          } catch (error) {
            set({
              error: error.message || 'Failed to fetch plan expire reminder',
              loading: false,
              planExpireReminder: null,
              _fetchPromise: null,
            });
            toast.error('Failed to fetch plan expire reminder');
            return null;
          }
        })();

        // Store the promise for deduplication
        set({ _fetchPromise: fetchPromise });
        
        return fetchPromise;
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
        _lastFetch: state._lastFetch,
      }),
    }
  )
);
