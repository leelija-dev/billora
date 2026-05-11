import { apiClient } from './apiClient';



export const customerAPI = {

  // Get all customers by admin ID

  getAll: async (adminId, search = '') => {

    try {

      const params = search ? { search } : {};

      console.log('👥 Fetching customers for admin:', adminId, 'with params:', params);

      const response = await apiClient.get(`/customer/${adminId}`, { params });

      console.log('👥 Customers fetched successfully:', response.data);

      return response;

    } catch (error) {

      console.error('❌ Failed to fetch customers:', error);

      throw error.response?.data || error.message;

    }

  },



  // Get single customer

  getById: async (id) => {

    try {

      console.log(`👥 Fetching customer with ID: ${id}`);

      const response = await apiClient.get(`/customer/show/${id}`);

      console.log('👥 Customer fetched successfully:', response.data);

      return response;

    } catch (error) {

      console.error(`❌ Failed to fetch customer ${id}:`, error);

      throw error.response?.data || error.message;

    }

  },



  // Create customer

  create: async (customerData) => {

    try {

      console.log('👥 Creating customer with data:', {

        user_id: customerData.admin_id,

        name: customerData.name,

        email: customerData.email,

        phone: customerData.phone,

        address: customerData.address,

        city: customerData.city,

        created_by: customerData.created_by

      });

      const response = await apiClient.post('/customer/store', customerData);

      console.log('👥 Customer created successfully:', response.data);

      return response;

    } catch (error) {

      console.error('❌ Failed to create customer:', error);

      throw error.response?.data || error.message;

    }

  },



  // Update customer

  update: async (id, customerData) => {

    try {

      console.log(`👥 Updating customer ${id} with data:`, customerData);

      const response = await apiClient.put(`/customer/${id}`, customerData);

      console.log('👥 Customer updated successfully:', response.data);

      return response;

    } catch (error) {

      console.error(`❌ Failed to update customer ${id}:`, error);

      throw error.response?.data || error.message;

    }

  },



  // Delete customer (soft delete)

  delete: async (id, userId) => {

    try {

      console.log(`👥 Soft deleting customer with ID: ${id}`);

      const response = await apiClient.delete(`/customer/${id}`, {
        data: { user_id: userId }
      });

      console.log('👥 Customer deleted successfully');

      return response;

    } catch (error) {

      console.error(`❌ Failed to delete customer ${id}:`, error);

      throw error.response?.data || error.message;

    }

  },



  // Get all deleted customers (soft deleted)

  getTrashed: async (page = 1) => {

    try {

      console.log('👥 Fetching trashed customers, page:', page);

      const params = page > 1 ? { page } : {};
      const response = await apiClient.get('/customer/trashed', { params });

      console.log('👥 Trashed customers fetched:', response.data);

      return response;

    } catch (error) {

      console.error('❌ Failed to fetch trashed customers:', error);

      throw error.response?.data || error.message;

    }

  },



  // Restore customer

  restore: async (id) => {

    try {

      // Get current user from auth store
      const { useAuthStore } = await import('../store/authStore');
      const { user } = useAuthStore.getState();
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      console.log(`👥 Restoring customer with ID: ${id} for user: ${user.id}`);

      const response = await apiClient.patch(`/customer/${id}`, {
        user_id: user.id
      });

      console.log('👥 Customer restored successfully');

      return response;

    } catch (error) {

      console.error(`❌ Failed to restore customer ${id}:`, error);

      throw error.response?.data || error.message;

    }

  },



  // Permanently delete customer

  forceDelete: async (id) => {

    try {

      console.log(`👥 Permanently deleting customer with ID: ${id}`);

      const response = await apiClient.delete(`/customer/${id}/force`);

      console.log('👥 Customer permanently deleted');

      return response;

    } catch (error) {

      console.error(`❌ Failed to permanently delete customer ${id}:`, error);

      throw error.response?.data || error.message;

    }

  },



  // Customer due payment

  makeDuePayment: async (id, paymentData) => {

    try {

      console.log(`💳 Processing due payment for customer ${id}, data:`, paymentData);

      const response = await apiClient.put(`/customer/due-payment/${id}`, paymentData);

      console.log('💳 Due payment processed successfully');

      return response;

    } catch (error) {

      console.error(`❌ Failed to process due payment for customer ${id}:`, error);

      throw error.response?.data || error.message;

    }

  },



  // Get customer payment history with date filters

  getPaymentHistory: async (id, startDate = '', endDate = '') => {

    try {

      console.log(`💳 Fetching payment history for customer ${id} with date range:`, { startDate, endDate });

      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      const response = await apiClient.get(`/customer/show/${id}${params.toString() ? '?' + params.toString() : ''}`);

      console.log('💳 Payment history fetched:', response.data);

      return response;

    } catch (error) {

      console.error(`❌ Failed to fetch payment history for customer ${id}:`, error);

      throw error.response?.data || error.message;

    }

  },

}

