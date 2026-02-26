// Generate mock customers
export const generateMockCustomers = (count = 25) => {
  const customers = []
  const statuses = ['active', 'inactive', 'blocked']
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'Robert', 'Lisa', 'William', 'Maria']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']
  
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const totalOrders = Math.floor(Math.random() * 20)
    const totalSpent = totalOrders * (50 + Math.random() * 200)
    
    customers.push({
      id: i,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      company: Math.random() > 0.5 ? `Company ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}` : null,
      address: `${Math.floor(Math.random() * 9999)} Main St, Suite ${Math.floor(Math.random() * 100)}`,
      city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
      state: ['NY', 'CA', 'IL', 'TX', 'AZ'][Math.floor(Math.random() * 5)],
      zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
      country: 'USA',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      totalOrders,
      totalSpent: parseFloat(totalSpent.toFixed(2)),
      lastOrderDate: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString() : null,
      notes: Math.random() > 0.8 ? 'VIP Customer' : '',
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }
  
  return customers
}

// EXPORT mockCustomers (this was missing)
export const mockCustomers = generateMockCustomers(25)

export const mockCustomerService = {
  list: (params = {}) => {
    let filteredCustomers = [...mockCustomers]
    
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredCustomers = filteredCustomers.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        (c.phone && c.phone.includes(searchLower))
      )
    }
    
    if (params.status) {
      filteredCustomers = filteredCustomers.filter(c => c.status === params.status)
    }
    
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedCustomers = filteredCustomers.slice(start, end)
    
    return {
      results: paginatedCustomers,
      count: filteredCustomers.length,
      next: end < filteredCustomers.length ? page + 1 : null,
      previous: page > 1 ? page - 1 : null,
    }
  },
  
  get: (id) => {
    return mockCustomers.find(c => c.id === parseInt(id))
  },
  
  create: (customerData) => {
    const newCustomer = {
      id: mockCustomers.length + 1,
      ...customerData,
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockCustomers.push(newCustomer)
    return newCustomer
  },
  
  update: (id, customerData) => {
    const index = mockCustomers.findIndex(c => c.id === parseInt(id))
    if (index === -1) throw new Error('Customer not found')
    
    mockCustomers[index] = {
      ...mockCustomers[index],
      ...customerData,
      updatedAt: new Date().toISOString(),
    }
    return mockCustomers[index]
  },
  
  delete: (id) => {
    const index = mockCustomers.findIndex(c => c.id === parseInt(id))
    if (index === -1) throw new Error('Customer not found')
    mockCustomers.splice(index, 1)
    return { success: true }
  },
}

// Also export as default if needed
export default {
  mockCustomers,
  mockCustomerService,
  generateMockCustomers,
}