// Generate mock units
export const generateMockUnits = (count = 10) => {
  const units = []
  const unitNames = ['Pieces', 'Kilograms', 'Grams', 'Liters', 'Milliliters', 'Boxes', 'Cartons', 'Bottles', 'Packs', 'Sets']
  const shortNames = ['pcs', 'kg', 'g', 'l', 'ml', 'box', 'ctn', 'btl', 'pk', 'set']
  
  for (let i = 1; i <= count; i++) {
    units.push({
      id: i,
      name: unitNames[i - 1] || `Unit ${i}`,
      short_name: shortNames[i - 1] || `u${i}`,
      description: `Measurement unit for ${unitNames[i - 1] || 'items'}`,
      is_base_unit: i === 1, // First unit is base unit
      conversion_factor: 1,
      status: 'active',
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    })
  }
  
  return units
}

export const mockUnits = generateMockUnits(10)

export const mockUnitService = {
  list: (params = {}) => {
    let filteredUnits = [...mockUnits]
    
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredUnits = filteredUnits.filter(u => 
        u.name.toLowerCase().includes(searchLower) ||
        u.short_name.toLowerCase().includes(searchLower)
      )
    }
    
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedUnits = filteredUnits.slice(start, end)
    
    return {
      results: paginatedUnits,
      count: filteredUnits.length,
      next: end < filteredUnits.length ? page + 1 : null,
      previous: page > 1 ? page - 1 : null,
    }
  },
  
  get: (id) => {
    return mockUnits.find(u => u.id === parseInt(id))
  },
  
  create: (unitData) => {
    const newUnit = {
      id: mockUnits.length + 1,
      ...unitData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockUnits.push(newUnit)
    return newUnit
  },
  
  update: (id, unitData) => {
    const index = mockUnits.findIndex(u => u.id === parseInt(id))
    if (index === -1) throw new Error('Unit not found')
    
    mockUnits[index] = {
      ...mockUnits[index],
      ...unitData,
      updated_at: new Date().toISOString(),
    }
    return mockUnits[index]
  },
  
  delete: (id) => {
    const index = mockUnits.findIndex(u => u.id === parseInt(id))
    if (index === -1) throw new Error('Unit not found')
    mockUnits.splice(index, 1)
    return { success: true }
  },
}

export default {
  mockUnits,
  mockUnitService,
  generateMockUnits,
}
