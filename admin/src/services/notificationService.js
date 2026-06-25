import apiClient from './apiClient';

const notificationAPI = {
  // Get plan expiration reminder
  getPlanExpireReminder: async (userId) => {
    try {
      console.log('🔔 Fetching notifications for user:', userId);
      const response = await apiClient.get(`/notifications/${userId}`);
      console.log('🔔 Notifications API response:', response.data);
      
      // Handle the specific response structure from backend
      if (response.data && response.data.notifications) {
        const notificationsData = response.data.notifications;
        console.log('🔔 Extracted notifications object:', notificationsData);
        
        // Transform into unified notification format
        const unifiedNotifications = [];
        
        // Add low stock notifications
        if (notificationsData.lowStocks && Array.isArray(notificationsData.lowStocks)) {
          notificationsData.lowStocks.forEach(stock => {
            unifiedNotifications.push({
              id: `low-stock-${stock.id}`,
              title: 'Low Stock Alert',
              description: `${stock.product?.name || 'Product'} is running low (${stock.quantity} units)`,
              type: 'warning',
              priority: 'high',
              read: false,
              time: stock.updated_at || new Date().toISOString(),
              data: stock
            });
          });
        }
        
        // Add due customer notifications
        if (notificationsData.dueCustomer && Array.isArray(notificationsData.dueCustomer)) {
          notificationsData.dueCustomer.forEach(customer => {
            unifiedNotifications.push({
              id: `due-customer-${customer.id}`,
              title: 'Payment Due',
              description: `${customer.name} has pending payment of ${customer.due_amount || 'N/A'}`,
              type: 'payment',
              priority: 'normal',
              read: false,
              time: customer.updated_at || new Date().toISOString(),
              data: customer
            });
          });
        }
        
        // Add plan expiry reminder if exists
        if (notificationsData.planExpireReminder && Array.isArray(notificationsData.planExpireReminder) && notificationsData.planExpireReminder.length > 0) {
          notificationsData.planExpireReminder.forEach(plan => {
            unifiedNotifications.push({
              id: 'plan-expiry',
              title: 'Plan Expiry Reminder',
              description: plan.message || 'Your subscription is expiring soon',
              type: 'expiry',
              priority: 'high',
              read: false,
              time: plan.updated_at || new Date().toISOString(),
              data: plan
            });
          });
        }
        
        console.log('🔔 Unified notifications:', unifiedNotifications);
        return unifiedNotifications;
      }
      
      // Fallback for other response formats
      if (response.data && Array.isArray(response.data)) {
        console.log('🔔 Returning array directly:', response.data);
        return response.data;
      } else if (response.data && response.data.data) {
        console.log('🔔 Returning nested data:', response.data.data);
        return response.data.data;
      } else if (response.data && typeof response.data === 'object') {
        console.log('🔔 Returning direct response object:', response.data);
        return response.data;
      }
      
      console.log('🔔 No notifications found, returning empty array');
      return [];
    } catch (error) {
      console.error('❌ Failed to fetch notifications:', error);
      console.error('❌ Error details:', error.response?.data || error.message);
      // Return empty array instead of throwing to prevent app crash
      return [];
    }
  },
};

export default notificationAPI;
