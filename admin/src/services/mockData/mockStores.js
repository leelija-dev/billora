// Generate mock stores
export const generateMockStores = (count = 10) => {
  const stores = []
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego']
  const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA']
  
  for (let i = 1; i <= count; i++) {
    stores.push({
      id: i,
      name: `Store ${i} - ${cities[i % cities.length]}`,
      code: `STR${String(i).padStart(3, '0')}`,
      address: `${Math.floor(Math.random() * 9999)} ${['Main St', 'Oak Ave', 'Pine Rd', 'Elm Blvd'][i % 4]}`,
      city: cities[i % cities.length],
      state: states[i % states.length],
      zipCode: `${Math.floor(Math.random() * 90000) + 10000}`,
      phone: `+1 ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      email: `store${i}@example.com`,
      manager: `Manager ${i}`,
      status: 'active',
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }
  
  return stores
}

export const mockStores = generateMockStores(10)

export const mockStoreService = {
  list: (params = {}) => {
    let filteredStores = [...mockStores]
    
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredStores = filteredStores.filter(s => 
        s.name.toLowerCase().includes(searchLower) ||
        s.code.toLowerCase().includes(searchLower) ||
        s.city.toLowerCase().includes(searchLower)
      )
    }
    
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedStores = filteredStores.slice(start, end)
    
    return {
      results: paginatedStores,
      count: filteredStores.length,
      next: end < filteredStores.length ? page + 1 : null,
      previous: page > 1 ? page - 1 : null,
    }
  },
  
  get: (id) => {
    return mockStores.find(s => s.id === parseInt(id))
  },
  
  create: (storeData) => {
    const newStore = {
      id: mockStores.length + 1,
      ...storeData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockStores.push(newStore)
    return newStore
  },
  
  update: (id, storeData) => {
    const index = mockStores.findIndex(s => s.id === parseInt(id))
    if (index === -1) throw new Error('Store not found')
    
    mockStores[index] = {
      ...mockStores[index],
      ...storeData,
      updatedAt: new Date().toISOString(),
    }
    return mockStores[index]
  },
  
  delete: (id) => {
    const index = mockStores.findIndex(s => s.id === parseInt(id))
    if (index === -1) throw new Error('Store not found')
    mockStores.splice(index, 1)
    return { success: true }
  },
}

export default {
  mockStores,
  mockStoreService,
  generateMockStores,
}
