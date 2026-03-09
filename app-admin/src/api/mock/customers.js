// Mock customers data and functions
let mockCustomersList = [
  {
    id: 1,
    admin_id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    address: '123 Main Street, Apt 4B',
    city: 'New York',
    status: 'active',
    created_by: 1,
    created_at: new Date(Date.now() - 2592000000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 2,
    admin_id: 1,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+0987654321',
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    status: 'active',
    created_by: 1,
    created_at: new Date(Date.now() - 1728000000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 3,
    admin_id: 1,
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    phone: '+1122334455',
    address: '789 Pine Road',
    city: 'Chicago',
    status: 'inactive',
    created_by: 1,
    created_at: new Date(Date.now() - 864000000).toISOString(),
    updated_at: new Date(Date.now() - 432000000).toISOString(),
  },
];

let mockCustomerPayments = [
  {
    id: 1,
    customer_id: 1,
    amount: 500.00,
    payment_method: 'cash',
    payment_date: new Date(Date.now() - 86400000).toISOString(),
    notes: 'Advance payment for order',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 2,
    customer_id: 2,
    amount: 200.00,
    payment_method: 'card',
    payment_date: new Date(Date.now() - 172800000).toISOString(),
    notes: 'Partial payment',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

const mockCustomers = {
  get: async (endpoint, params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    if (endpoint.startsWith('/customer/') && !isNaN(endpoint.split('/')[2]) && !endpoint.includes('/search') && !endpoint.includes('/export') && !endpoint.includes('/bulk-import') && !endpoint.includes('/orders') && !endpoint.includes('/invoices') && !endpoint.includes('/stats') && !endpoint.includes('/balance') && !endpoint.includes('/payments') && !endpoint.includes('/status')) {
      const adminId = parseInt(endpoint.split('/')[2]);
      let filteredCustomers = mockCustomersList.filter(c => c.admin_id === adminId);
      
      // Apply filters
      if (params.status) {
        filteredCustomers = filteredCustomers.filter(c => c.status === params.status);
      }
      if (params.search) {
        filteredCustomers = filteredCustomers.filter(c => 
          c.name.toLowerCase().includes(params.search.toLowerCase()) ||
          c.email.toLowerCase().includes(params.search.toLowerCase()) ||
          c.phone.includes(params.search)
        );
      }

      return {
        data: {
          success: true,
          customers: filteredCustomers,
        }
      };
    }

    if (endpoint.startsWith('/customer/') && !isNaN(endpoint.split('/')[2]) && endpoint.includes('/search')) {
      const adminId = parseInt(endpoint.split('/')[2]);
      const query = params.q || '';
      
      const searchResults = mockCustomersList.filter(c => 
        c.admin_id === adminId && (
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.email.toLowerCase().includes(query.toLowerCase()) ||
          c.phone.includes(query)
        )
      );

      return {
        data: {
          success: true,
          customers: searchResults,
        }
      };
    }

    if (endpoint.startsWith('/customer/') && !isNaN(endpoint.split('/')[2]) && endpoint.includes('/orders')) {
      const customerId = parseInt(endpoint.split('/')[2]);
      
      // Mock orders for customer
      const mockOrders = [
        {
          id: 1,
          customer_id: customerId,
          order_number: 'ORD-001',
          total_amount: 359.96,
          status: 'completed',
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ];

      return {
        data: {
          success: true,
          orders: mockOrders,
        }
      };
    }

    if (endpoint.startsWith('/customer/') && !isNaN(endpoint.split('/')[2]) && endpoint.includes('/invoices')) {
      const customerId = parseInt(endpoint.split('/')[2]);
      
      // Mock invoices for customer
      const mockInvoices = [
        {
          id: 1,
          customer_id: customerId,
          invoice_number: 'INV-001',
          total_amount: 359.96,
          paid_amount: 359.96,
          due_amount: 0,
          status: 'paid',
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ];

      return {
        data: {
          success: true,
          invoices: mockInvoices,
        }
      };
    }

    if (endpoint.startsWith('/customer/') && !isNaN(endpoint.split('/')[2]) && endpoint.includes('/stats')) {
      const customerId = parseInt(endpoint.split('/')[2]);
      
      // Mock stats for customer
      const totalOrders = 5;
      const totalInvoices = 5;
      const totalSpent = 2540.75;
      const outstandingBalance = 150.00;

      return {
        data: {
          success: true,
          stats: {
            totalOrders,
            totalInvoices,
            totalSpent,
            outstandingBalance,
          }
        }
      };
    }

    if (endpoint.startsWith('/customer/') && !isNaN(endpoint.split('/')[2]) && endpoint.includes('/balance')) {
      const customerId = parseInt(endpoint.split('/')[2]);
      
      // Mock outstanding balance
      const balance = customerId === 1 ? 150.00 : 0.00;

      return {
        data: {
          success: true,
          balance: balance,
        }
      };
    }

    if (endpoint.startsWith('/customer/') && !isNaN(endpoint.split('/')[2]) && endpoint.includes('/payments')) {
      const customerId = parseInt(endpoint.split('/')[2]);
      const payments = mockCustomerPayments.filter(p => p.customer_id === customerId);

      return {
        data: {
          success: true,
          payments: payments,
        }
      };
    }

    if (endpoint.startsWith('/customer/') && !isNaN(endpoint.split('/')[2]) && !endpoint.includes('/search') && !endpoint.includes('/export') && !endpoint.includes('/bulk-import') && !endpoint.includes('/orders') && !endpoint.includes('/invoices') && !endpoint.includes('/stats') && !endpoint.includes('/balance') && !endpoint.includes('/payments') && !endpoint.includes('/status')) {
      const id = parseInt(endpoint.split('/')[2]);
      const customer = mockCustomersList.find(c => c.id === id);
      
      if (!customer) {
        throw {
          response: {
            data: { message: 'Customer not found' }
          }
        };
      }

      return {
        data: {
          success: true,
          customer: customer,
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

    if (endpoint === '/customer/store') {
      const newCustomer = {
        id: mockCustomersList.length + 1,
        ...data,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockCustomersList.push(newCustomer);

      return {
        data: {
          success: true,
          message: 'Customer created successfully',
          customer: newCustomer,
        }
      };
    }

    if (endpoint.includes('/payment')) {
      const customerId = parseInt(endpoint.split('/')[2]);
      const newPayment = {
        id: mockCustomerPayments.length + 1,
        customer_id: customerId,
        ...data,
        created_at: new Date().toISOString(),
      };

      mockCustomerPayments.push(newPayment);

      return {
        data: {
          success: true,
          message: 'Payment added successfully',
          payment: newPayment,
        }
      };
    }

    if (endpoint.includes('/bulk-import')) {
      const adminId = parseInt(endpoint.split('/')[2]);
      const { customers } = data;
      
      const newCustomers = customers.map((customer, index) => ({
        id: mockCustomersList.length + index + 1,
        admin_id: adminId,
        ...customer,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

      mockCustomersList.push(...newCustomers);

      return {
        data: {
          success: true,
          message: `${newCustomers.length} customers imported successfully`,
          customers: newCustomers,
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

    if (endpoint.startsWith('/customer/') && !endpoint.includes('/status')) {
      const id = parseInt(endpoint.split('/')[2]);
      const customerIndex = mockCustomersList.findIndex(c => c.id === id);

      if (customerIndex === -1) {
        throw {
          response: {
            data: { message: 'Customer not found' }
          }
        };
      }

      mockCustomersList[customerIndex] = { 
        ...mockCustomersList[customerIndex], 
        ...data, 
        updated_at: new Date().toISOString() 
      };

      return {
        data: {
          success: true,
          message: 'Customer updated successfully',
          customer: mockCustomersList[customerIndex],
        }
      };
    }

    throw {
      response: {
        data: { message: 'Endpoint not found' }
      }
    };
  },

  patch: async (endpoint, data) => {
    await new Promise(resolve => setTimeout(resolve, 300));

    if (endpoint.includes('/status')) {
      const customerId = parseInt(endpoint.split('/')[2]);
      const customerIndex = mockCustomersList.findIndex(c => c.id === customerId);

      if (customerIndex === -1) {
        throw {
          response: {
            data: { message: 'Customer not found' }
          }
        };
      }

      mockCustomersList[customerIndex].status = data.status;
      mockCustomersList[customerIndex].updated_at = new Date().toISOString();

      return {
        data: {
          success: true,
          message: 'Customer status updated successfully',
          customer: mockCustomersList[customerIndex],
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

    if (endpoint.startsWith('/customer/')) {
      const id = parseInt(endpoint.split('/')[2]);
      const customerIndex = mockCustomersList.findIndex(c => c.id === id);

      if (customerIndex === -1) {
        throw {
          response: {
            data: { message: 'Customer not found' }
          }
        };
      }

      mockCustomersList.splice(customerIndex, 1);

      return {
        data: {
          success: true,
          message: 'Customer deleted successfully',
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

export { mockCustomers };
