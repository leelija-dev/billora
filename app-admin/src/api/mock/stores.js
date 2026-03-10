// Mock stores data and functions
let mockStoresList = [
  {
    id: 1,
    user_id: 1,
    name: 'Main Store',
    gst: 'GST123456',
    email: 'main@store.com',
    logo: null,
    mobile: '+1234567890',
    address: '123 Main Street, Downtown',
    city: 'New York',
    status: 'active',
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    name: 'Branch Store',
    gst: 'GST789012',
    email: 'branch@store.com',
    logo: null,
    mobile: '+0987654321',
    address: '456 Branch Road, Uptown',
    city: 'Los Angeles',
    status: 'active',
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let mockStoreUsers = [
  {
    id: 1,
    store_id: 1,
    user_id: 1,
    role: 'owner',
    permissions: ['all'],
    created_at: new Date().toISOString(),
  },
];

let mockStoreSettings = [
  {
    store_id: 1,
    currency: 'USD',
    tax_rate: 5,
    low_stock_threshold: 10,
    auto_backup: true,
    email_notifications: true,
    sms_notifications: false,
  },
];

const mockStores = {
  get: async (endpoint, params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    if (endpoint.startsWith('/store/') && !endpoint.includes('/edit') && !endpoint.includes('/settings') && !endpoint.includes('/users') && !endpoint.includes('/stats') && !endpoint.includes('/logo')) {
      const userId = parseInt(endpoint.split('/')[2]);
      let filteredStores = mockStoresList.filter(s => s.user_id === userId);
      
      // Apply filters
      if (params.status) {
        filteredStores = filteredStores.filter(s => s.status === params.status);
      }

      return {
        data: {
          success: true,
          stores: filteredStores,
        }
      };
    }

    if (endpoint.includes('/edit/')) {
      const id = parseInt(endpoint.split('/')[3]);
      const store = mockStoresList.find(s => s.id === id);
      
      if (!store) {
        throw {
          response: {
            data: { message: 'Store not found' }
          }
        };
      }

      return {
        data: {
          success: true,
          store: store,
        }
      };
    }

    if (endpoint.includes('/settings')) {
      const storeId = parseInt(endpoint.split('/')[2]);
      const settings = mockStoreSettings.find(s => s.store_id === storeId);

      if (!settings) {
        return {
          data: {
            success: true,
            settings: {
              currency: 'USD',
              tax_rate: 5,
              low_stock_threshold: 10,
              auto_backup: true,
              email_notifications: true,
              sms_notifications: false,
            }
          }
        };
      }

      return {
        data: {
          success: true,
          settings: settings,
        }
      };
    }

    if (endpoint.includes('/users')) {
      const storeId = parseInt(endpoint.split('/')[2]);
      const users = mockStoreUsers.filter(u => u.store_id === storeId);

      return {
        data: {
          success: true,
          users: users,
        }
      };
    }

    if (endpoint.includes('/stats')) {
      const storeId = parseInt(endpoint.split('/')[2]);
      
      // Mock stats calculation
      const totalInvoices = 25;
      const totalRevenue = 15420.50;
      const totalProducts = 150;
      const lowStockItems = 8;
      const totalCustomers = 45;

      return {
        data: {
          success: true,
          stats: {
            totalInvoices,
            totalRevenue,
            totalProducts,
            lowStockItems,
            totalCustomers,
          }
        }
      };
    }

    throw {
      response: {
        data: { message: 'Endpoint not found' }
      }
    };
  },

  post: async (endpoint, data) => {
    await new Promise(resolve => setTimeout(resolve, 400));

    if (endpoint === '/store/store') {
      const newStore = {
        id: mockStoresList.length + 1,
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockStoresList.push(newStore);

      // Add default settings
      mockStoreSettings.push({
        store_id: newStore.id,
        currency: 'USD',
        tax_rate: 5,
        low_stock_threshold: 10,
        auto_backup: true,
        email_notifications: true,
        sms_notifications: false,
      });

      // Add owner as user
      mockStoreUsers.push({
        id: mockStoreUsers.length + 1,
        store_id: newStore.id,
        user_id: data.user_id,
        role: 'owner',
        permissions: ['all'],
        created_at: new Date().toISOString(),
      });

      return {
        data: {
          success: true,
          message: 'Store created successfully',
          store: newStore,
        }
      };
    }

    if (endpoint.includes('/users')) {
      const storeId = parseInt(endpoint.split('/')[2]);
      const newUser = {
        id: mockStoreUsers.length + 1,
        store_id: storeId,
        ...data,
        created_at: new Date().toISOString(),
      };

      mockStoreUsers.push(newUser);

      return {
        data: {
          success: true,
          message: 'User added to store successfully',
          user: newUser,
        }
      };
    }

    if (endpoint.includes('/logo')) {
      const storeId = parseInt(endpoint.split('/')[2]);
      const storeIndex = mockStoresList.findIndex(s => s.id === storeId);

      if (storeIndex === -1) {
        throw {
          response: {
            data: { message: 'Store not found' }
          }
        };
      }

      // Mock logo upload - just return success
      return {
        data: {
          success: true,
          message: 'Logo uploaded successfully',
          logo_url: `https://example.com/logos/store_${storeId}.jpg`,
        }
      };
    }

    throw {
      response: {
        data: { message: 'Endpoint not found' }
      }
    };
  },

  put: async (endpoint, data) => {
    await new Promise(resolve => setTimeout(resolve, 400));

    if (endpoint.startsWith('/store/') && !endpoint.includes('/settings')) {
      const id = parseInt(endpoint.split('/')[2]);
      const storeIndex = mockStoresList.findIndex(s => s.id === id);

      if (storeIndex === -1) {
        throw {
          response: {
            data: { message: 'Store not found' }
          }
        };
      }

      mockStoresList[storeIndex] = { 
        ...mockStoresList[storeIndex], 
        ...data, 
        updated_at: new Date().toISOString() 
      };

      return {
        data: {
          success: true,
          message: 'Store updated successfully',
          store: mockStoresList[storeIndex],
        }
      };
    }

    if (endpoint.includes('/settings')) {
      const storeId = parseInt(endpoint.split('/')[2]);
      const settingsIndex = mockStoreSettings.findIndex(s => s.store_id === storeId);

      if (settingsIndex === -1) {
        mockStoreSettings.push({
          store_id: storeId,
          ...data,
        });
      } else {
        mockStoreSettings[settingsIndex] = { 
          ...mockStoreSettings[settingsIndex], 
          ...data 
        };
      }

      return {
        data: {
          success: true,
          message: 'Store settings updated successfully',
        }
      };
    }

    throw {
      response: {
        data: { message: 'Endpoint not found' }
      }
    };
  },

  delete: async (endpoint) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    if (endpoint.startsWith('/store/') && !endpoint.includes('/users')) {
      const id = parseInt(endpoint.split('/')[2]);
      const storeIndex = mockStoresList.findIndex(s => s.id === id);

      if (storeIndex === -1) {
        throw {
          response: {
            data: { message: 'Store not found' }
          }
        };
      }

      mockStoresList.splice(storeIndex, 1);

      // Remove related settings and users
      const settingsIndex = mockStoreSettings.findIndex(s => s.store_id === id);
      if (settingsIndex !== -1) {
        mockStoreSettings.splice(settingsIndex, 1);
      }

      const userIndices = mockStoreUsers
        .map((u, index) => ({ ...u, index }))
        .filter(u => u.store_id === id)
        .map(u => u.index)
        .reverse();

      userIndices.forEach(index => {
        mockStoreUsers.splice(index, 1);
      });

      return {
        data: {
          success: true,
          message: 'Store deleted successfully',
        }
      };
    }

    if (endpoint.includes('/users')) {
      const storeId = parseInt(endpoint.split('/')[2]);
      const userId = parseInt(endpoint.split('/')[4]);
      const userIndex = mockStoreUsers.findIndex(u => u.store_id === storeId && u.user_id === userId);

      if (userIndex === -1) {
        throw {
          response: {
            data: { message: 'User not found in store' }
          }
        };
      }

      mockStoreUsers.splice(userIndex, 1);

      return {
        data: {
          success: true,
          message: 'User removed from store successfully',
        }
      };
    }

    throw {
      response: {
        data: { message: 'Endpoint not found' }
      }
    };
  },
};

export { mockStores };
