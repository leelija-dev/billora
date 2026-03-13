// Mock billing data for development
let mockBills = [
  {
    id: 1,
    invoice_number: "INV-001",
    customer_id: 1,
    store_id: 1,
    user_id: 1,
    total_amount: 1299.99,
    paid_amount: 1300.00,
    balance_amount: -0.01,
    status: "paid",
    payment_method: "cash",
    created_by: 1,
    created_at: "2024-03-15T10:30:00Z",
    updated_at: "2024-03-15T10:35:00Z",
    items: [
      {
        id: 1,
        product_id: 1,
        quantity: 2,
        item_count: 2,
        unit_id: 1,
        price: 299.99,
        gst: 30.00,
        discount: 10.00,
        total_price: 589.98,
        status: "completed"
      },
      {
        id: 2,
        product_id: 2,
        quantity: 1,
        item_count: 1,
        unit_id: 1,
        price: 599.99,
        gst: 60.00,
        discount: 20.00,
        total_price: 639.99,
        status: "completed"
      },
      {
        id: 3,
        product_id: 4,
        quantity: 1,
        item_count: 1,
        unit_id: 1,
        price: 149.99,
        gst: 15.00,
        discount: 5.00,
        total_price: 159.99,
        status: "completed"
      }
    ],
    customer: {
      id: 1,
      name: "John Smith",
      phone: "+91 98765 43210",
      email: "john.smith@email.com"
    },
    store: {
      id: 1,
      name: "Main Store",
      address: "123 Main Street, Mumbai, Maharashtra 400001",
      phone: "+91 22 1234 5678",
      email: "main@store.com"
    },
    payments: [
      {
        id: 1,
        amount: 1000.00,
        method: "cash",
        date: "2024-03-15T10:30:00Z",
        notes: "Initial payment"
      },
      {
        id: 2,
        amount: 300.00,
        method: "upi",
        date: "2024-03-15T10:35:00Z",
        notes: "Remaining balance"
      }
    ]
  },
  {
    id: 2,
    invoice_number: "INV-002",
    customer_id: 2,
    store_id: 1,
    user_id: 1,
    total_amount: 549.50,
    paid_amount: 550.00,
    balance_amount: -0.50,
    status: "paid",
    payment_method: "card",
    created_by: 1,
    created_at: "2024-03-14T14:20:00Z",
    updated_at: "2024-03-14T14:25:00Z",
    items: [
      {
        id: 4,
        product_id: 1,
        quantity: 1,
        item_count: 1,
        unit_id: 1,
        price: 299.99,
        gst: 15.00,
        discount: 5.00,
        total_price: 309.99,
        status: "completed"
      },
      {
        id: 5,
        product_id: 3,
        quantity: 1,
        item_count: 1,
        unit_id: 1,
        price: 249.99,
        gst: 25.00,
        discount: 10.00,
        total_price: 264.99,
        status: "completed"
      }
    ],
    customer: {
      id: 2,
      name: "Emma Wilson",
      phone: "+91 98765 43211",
      email: "emma.wilson@email.com"
    },
    store: {
      id: 1,
      name: "Main Store",
      address: "123 Main Street, Mumbai, Maharashtra 400001",
      phone: "+91 22 1234 5678",
      email: "main@store.com"
    },
    payments: [
      {
        id: 3,
        amount: 550.00,
        method: "card",
        date: "2024-03-14T14:20:00Z",
        notes: "Full payment"
      }
    ]
  },
  {
    id: 3,
    invoice_number: "INV-003",
    customer_id: 3,
    store_id: 2,
    user_id: 1,
    total_amount: 899.99,
    paid_amount: 500.00,
    balance_amount: 399.99,
    status: "partial",
    payment_method: "upi",
    created_by: 1,
    created_at: "2024-03-14T09:15:00Z",
    updated_at: "2024-03-14T09:20:00Z",
    items: [
      {
        id: 6,
        product_id: 3,
        quantity: 2,
        item_count: 2,
        unit_id: 1,
        price: 449.99,
        gst: 45.00,
        discount: 20.00,
        total_price: 924.98,
        status: "completed"
      }
    ],
    customer: {
      id: 3,
      name: "Michael Brown",
      phone: "+91 98765 43212",
      email: "michael.brown@email.com"
    },
    store: {
      id: 2,
      name: "Branch Store",
      address: "456 Oak Avenue, Mumbai, Maharashtra 400002",
      phone: "+91 22 8765 4321",
      email: "branch@store.com"
    },
    payments: [
      {
        id: 4,
        amount: 500.00,
        method: "upi",
        date: "2024-03-14T09:15:00Z",
        notes: "Partial payment"
      }
    ]
  },
  {
    id: 4,
    invoice_number: "INV-004",
    customer_id: 4,
    store_id: 1,
    user_id: 1,
    total_amount: 2199.99,
    paid_amount: 0.00,
    balance_amount: 2199.99,
    status: "pending",
    payment_method: null,
    created_by: 1,
    created_at: "2024-03-13T16:45:00Z",
    updated_at: "2024-03-13T16:45:00Z",
    items: [
      {
        id: 7,
        product_id: 2,
        quantity: 3,
        item_count: 3,
        unit_id: 1,
        price: 599.99,
        gst: 90.00,
        discount: 30.00,
        total_price: 1859.97,
        status: "completed"
      },
      {
        id: 8,
        product_id: 5,
        quantity: 1,
        item_count: 1,
        unit_id: 1,
        price: 340.02,
        gst: 34.00,
        discount: 10.00,
        total_price: 364.02,
        status: "completed"
      }
    ],
    customer: {
      id: 4,
      name: "Sarah Davis",
      phone: "+91 98765 43213",
      email: "sarah.davis@email.com"
    },
    store: {
      id: 1,
      name: "Main Store",
      address: "123 Main Street, Mumbai, Maharashtra 400001",
      phone: "+91 22 1234 5678",
      email: "main@store.com"
    },
    payments: []
  },
  {
    id: 5,
    invoice_number: "INV-005",
    customer_id: 5,
    store_id: 2,
    user_id: 1,
    total_amount: 449.99,
    paid_amount: 450.00,
    balance_amount: -0.01,
    status: "paid",
    payment_method: "cash",
    created_by: 1,
    created_at: "2024-03-13T11:30:00Z",
    updated_at: "2024-03-13T11:35:00Z",
    items: [
      {
        id: 9,
        product_id: 4,
        quantity: 3,
        item_count: 3,
        unit_id: 1,
        price: 149.99,
        gst: 22.50,
        discount: 15.00,
        total_price: 456.47,
        status: "completed"
      }
    ],
    customer: {
      id: 5,
      name: "David Lee",
      phone: "+91 98765 43214",
      email: "david.lee@email.com"
    },
    store: {
      id: 2,
      name: "Branch Store",
      address: "456 Oak Avenue, Mumbai, Maharashtra 400002",
      phone: "+91 22 8765 4321",
      email: "branch@store.com"
    },
    payments: [
      {
        id: 5,
        amount: 450.00,
        method: "cash",
        date: "2024-03-13T11:30:00Z",
        notes: "Full payment"
      }
    ]
  }
];

let mockStores = [
  {
    id: 1,
    name: "Main Store",
    address: "123 Main Street, Mumbai, Maharashtra 400001",
    phone: "+91 22 1234 5678",
    email: "main@store.com"
  },
  {
    id: 2,
    name: "Branch Store",
    address: "456 Oak Avenue, Mumbai, Maharashtra 400002",
    phone: "+91 22 8765 4321",
    email: "branch@store.com"
  }
];

let mockCustomers = [
  { id: 1, name: "John Smith", phone: "+91 98765 43210", email: "john.smith@email.com" },
  { id: 2, name: "Emma Wilson", phone: "+91 98765 43211", email: "emma.wilson@email.com" },
  { id: 3, name: "Michael Brown", phone: "+91 98765 43212", email: "michael.brown@email.com" },
  { id: 4, name: "Sarah Davis", phone: "+91 98765 43213", email: "sarah.davis@email.com" },
  { id: 5, name: "David Lee", phone: "+91 98765 43214", email: "david.lee@email.com" }
];

// Mock billing API handler
export const handleBillingRequest = (endpoint, options = {}) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      try {
        if (endpoint.startsWith('/invoice/bill-history')) {
          // Handle bill history with search
          const url = new URL(endpoint, 'http://localhost:8000');
          const searchParams = url.searchParams;
          let filteredBills = [...mockBills];

          if (searchParams) {
            const search = searchParams.get('search');
            const startDate = searchParams.get('start_date');
            const endDate = searchParams.get('end_date');

            if (search) {
              const searchLower = search.toLowerCase();
              filteredBills = mockBills.filter(bill => 
                bill.invoice_number.toLowerCase().includes(searchLower) ||
                bill.customer.name.toLowerCase().includes(searchLower) ||
                bill.items.some(item => 
                  item.product_id && 
                  mockProducts.find(p => p.id === item.product_id)?.name?.toLowerCase().includes(searchLower)
                )
              );
            }

            if (startDate) {
              const start = new Date(startDate);
              filteredBills = filteredBills.filter(bill => 
                new Date(bill.created_at) >= start
              );
            }

            if (endDate) {
              const end = new Date(endDate);
              filteredBills = filteredBills.filter(bill => 
                new Date(bill.created_at) <= end
              );
            }
          }

          resolve({
            data: {
              data: filteredBills,
              message: 'Bills retrieved successfully',
              status: true
            },
            status: 200
          });
        } 
        else if (endpoint.match(/^\/invoice\/\d+$/)) {
          // Handle single bill fetch
          const billId = parseInt(endpoint.split('/')[2]);
          const bill = mockBills.find(b => b.id === billId);
          
          if (bill) {
            resolve({
              data: {
                data: bill,
                message: 'Bill retrieved successfully',
                status: true
              },
              status: 200
            });
          } else {
            reject({
              response: {
                data: { message: 'Bill not found' }
              }
            });
          }
        } 
        else if (endpoint === '/invoice/store' && options.method === 'POST') {
          // Handle bill creation
          const newBill = {
            id: mockBills.length + 1,
            invoice_number: `INV-${String(mockBills.length + 1).padStart(3, '0')}`,
            ...options.data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          mockBills.push(newBill);
          
          resolve({
            data: {
              data: newBill,
              message: 'Bill created successfully',
              status: true
            },
            status: 201
          });
        }
        else if (endpoint.match(/^\/invoice\/print\/\d+$/) && options.method === 'POST') {
          // Handle bill printing
          const billId = parseInt(endpoint.split('/')[3]);
          const bill = mockBills.find(b => b.id === billId);
          
          if (bill) {
            // Simulate PDF/TXT generation
            const printData = {
              billId: bill.id,
              printerType: options.data.printer_type,
              format: options.data.format,
              downloadUrl: `data:application/${options.data.format === 'pdf' ? 'pdf' : 'plain'},base64,${btoa('Mock bill content')}`
            };
            
            resolve({
              data: {
                data: printData,
                message: 'Bill generated for printing',
                status: true
              },
              status: 200
            });
          } else {
            reject({
              response: {
                data: { message: 'Bill not found' }
              }
            });
          }
        }
        else if (endpoint.match(/^\/invoice\/\d+\/payment$/) && options.method === 'POST') {
          // Handle payment addition
          const billId = parseInt(endpoint.split('/')[2]);
          const bill = mockBills.find(b => b.id === billId);
          
          if (bill) {
            const newPayment = {
              id: bill.payments.length + 1,
              ...options.data,
              date: new Date().toISOString()
            };
            
            bill.payments.push(newPayment);
            bill.paid_amount += newPayment.amount;
            bill.balance_amount = bill.total_amount - bill.paid_amount;
            
            if (bill.balance_amount <= 0) {
              bill.status = 'paid';
              bill.payment_method = newPayment.method;
            } else {
              bill.status = 'partial';
            }
            
            resolve({
              data: {
                data: newPayment,
                message: 'Payment added successfully',
                status: true
              },
              status: 201
            });
          } else {
            reject({
              response: {
                data: { message: 'Bill not found' }
              }
            });
          }
        }
        else if (endpoint.match(/^\/invoice\/\d+\/payments$/)) {
          // Handle payment history fetch
          const billId = parseInt(endpoint.split('/')[2]);
          const bill = mockBills.find(b => b.id === billId);
          
          if (bill) {
            resolve({
              data: {
                data: bill.payments,
                message: 'Payment history retrieved successfully',
                status: true
              },
              status: 200
            });
          } else {
            reject({
              response: {
                data: { message: 'Bill not found' }
              }
            });
          }
        }
        else if (endpoint === '/invoice/stats') {
          // Handle statistics
          const url = new URL(endpoint, 'http://localhost:8000');
          const searchParams = url.searchParams;
          
          let statsBills = [...mockBills];
          
          if (searchParams) {
            const startDate = searchParams.get('start_date');
            const endDate = searchParams.get('end_date');

            if (startDate) {
              const start = new Date(startDate);
              statsBills = statsBills.filter(bill => 
                new Date(bill.created_at) >= start
              );
            }

            if (endDate) {
              const end = new Date(endDate);
              statsBills = statsBills.filter(bill => 
                new Date(bill.created_at) <= end
              );
            }
          }

          const stats = {
            totalBills: statsBills.length,
            totalAmount: statsBills.reduce((sum, bill) => sum + bill.total_amount, 0),
            totalPaid: statsBills.reduce((sum, bill) => sum + bill.paid_amount, 0),
            totalPending: statsBills.filter(bill => bill.status === 'pending').length,
            totalPartial: statsBills.filter(bill => bill.status === 'partial').length,
            totalPaidBills: statsBills.filter(bill => bill.status === 'paid').length,
            averageBillAmount: statsBills.length > 0 ? statsBills.reduce((sum, bill) => sum + bill.total_amount, 0) / statsBills.length : 0
          };

          resolve({
            data: {
              data: stats,
              message: 'Statistics retrieved successfully',
              status: true
            },
            status: 200
          });
        }
        else {
          reject({
            response: {
              data: { message: 'Endpoint not found' }
            }
          });
        }
      } catch (error) {
        reject(error);
      }
    }, 500); // Simulate 500ms delay
  });
};

// Mock products for search functionality
const mockProducts = [
  { id: 1, name: "Classic White T-Shirt", code: "PRD001", price: 299.99, stock: 50, unit: "Pieces", gst: 5 },
  { id: 2, name: "Slim Fit Jeans", code: "PRD002", price: 599.99, stock: 25, unit: "Pieces", gst: 5 },
  { id: 3, name: "Leather Sneakers", code: "PRD003", price: 129.99, stock: 15, unit: "Pairs", gst: 18 },
  { id: 4, name: "Leather Belt", code: "PRD004", price: 149.99, stock: 30, unit: "Pieces", gst: 18 },
  { id: 5, name: "Cashmere Sweater", code: "PRD005", price: 449.99, stock: 10, unit: "Pieces", gst: 12 }
];

export { mockBills, mockStores, mockCustomers, mockProducts };
export default handleBillingRequest;
