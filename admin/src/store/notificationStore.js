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
        if (state.notifications && state.notifications.length > 0 && state._lastFetch) {
          const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
          if (state._lastFetch > fiveMinutesAgo) {
            return state.notifications;
          }
        }

        set({ loading: true, error: null });
        
        const fetchPromise = (async () => {
          try {
            const data = await notificationAPI.getPlanExpireReminder(userId);
            console.log('📦 Store received data:', data);
            
            // Handle different response formats
            if (Array.isArray(data)) {
              // If it's an array, store in notifications
              set({
                notifications: data,
                planExpireReminder: null,
                loading: false,
                _fetchPromise: null,
                _lastFetch: Date.now(),
              });
            } else if (data && typeof data === 'object') {
              // If it's an object, check if it has plan expiry info
              if (data.days_left !== undefined || data.message) {
                // It's a plan expiry reminder
                set({
                  planExpireReminder: data,
                  notifications: [],
                  loading: false,
                  _fetchPromise: null,
                  _lastFetch: Date.now(),
                });
              } else {
                // It might be a wrapper with notifications
                if (data.notifications && Array.isArray(data.notifications)) {
                  set({
                    notifications: data.notifications,
                    planExpireReminder: null,
                    loading: false,
                    _fetchPromise: null,
                    _lastFetch: Date.now(),
                  });
                } else {
                  // Unknown format, store as plan expiry reminder
                  set({
                    planExpireReminder: data,
                    notifications: [],
                    loading: false,
                    _fetchPromise: null,
                    _lastFetch: Date.now(),
                  });
                }
              }
            } else {
              // No data
              set({
                notifications: [],
                planExpireReminder: null,
                loading: false,
                _fetchPromise: null,
                _lastFetch: Date.now(),
              });
            }
            
            return data;
          } catch (error) {
            console.error('❌ Store error:', error);
            set({
              error: error.message || 'Failed to fetch notifications',
              loading: false,
              planExpireReminder: null,
              notifications: [],
              _fetchPromise: null,
            });
            toast.error('Failed to fetch notifications');
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
        set((state) => {
          // If it's the plan expiry reminder, update that separately
          if (notification.id === 'plan-expiry' && notification.planExpireReminder) {
            return {
              planExpireReminder: notification.planExpireReminder,
            };
          }
          // Otherwise update the notifications array
          return {
            notifications: state.notifications.map((n) =>
              n.id === notification.id ? notification : n
            ),
          };
        });
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
