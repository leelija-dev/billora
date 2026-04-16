import apiClient from './apiClient';

const notificationAPI = {
  // Get plan expiration reminder
  getPlanExpireReminder: async (userId) => {
    try {
      console.log('🔔 Fetching plan expire reminder for user:', userId);
      const response = await apiClient.get(`/plan-expire-reminder/${userId}`);
      console.log('🔔 Plan expire reminder response:', response.data);
      
      // Handle different response formats
      if (response.data && response.data.notifications && response.data.notifications.length > 0) {
        return response.data.notifications[0]; // Return first notification
      } else if (response.data && response.data.data) {
        return response.data.data; // If data is nested
      } else if (response.data) {
        return response.data; // Return direct response
      }
      
      return null; // Return null if no notifications
    } catch (error) {
      console.error('❌ Failed to fetch plan expire reminder:', error);
      // Return null instead of throwing to prevent app crash
      return null;
    }
  },
};

export default notificationAPI;
