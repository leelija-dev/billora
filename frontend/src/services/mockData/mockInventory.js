import { mockProducts } from './mockProducts'

// Generate mock stock logs
export const generateMockStockLogs = (count = 100) => {
  const logs = []
  const types = ['IN', 'OUT']
  const reasons = ['Purchase', 'Sale', 'Return', 'Adjustment', 'Damaged', 'Transfer']
  
  for (let i = 1; i <= count; i++) {
    const product = mockProducts[Math.floor(Math.random() * mockProducts.length)]
    const type = types[Math.floor(Math.random() * types.length)]
    const quantity = Math.floor(Math.random() * 20) + 1
    const previousStock = product.stock + (type === 'IN' ? -quantity : quantity)
    
    logs.push({
      id: i,
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      type,
      quantity,
      previousStock: Math.max(0, previousStock),
      newStock: Math.max(0, type === 'IN' ? previousStock + quantity : previousStock - quantity),
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      notes: Math.random() > 0.7 ? 'Additional notes here' : '',
      createdBy: 'System',
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }
  
  return logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

// Export mock data
export const mockStockLogs = generateMockStockLogs(100)

// Export the service - THIS IS WHAT'S MISSING
export const mockInventoryService = {
  list: (params = {}) => {
    let filteredLogs = [...mockStockLogs]
    
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredLogs = filteredLogs.filter(l => 
        l.productName.toLowerCase().includes(searchLower) ||
        l.productSku.toLowerCase().includes(searchLower)
      )
    }
    
    if (params.type) {
      filteredLogs = filteredLogs.filter(l => l.type === params.type)
    }
    
    if (params.dateFrom) {
      filteredLogs = filteredLogs.filter(l => new Date(l.createdAt) >= new Date(params.dateFrom))
    }
    
    if (params.dateTo) {
      filteredLogs = filteredLogs.filter(l => new Date(l.createdAt) <= new Date(params.dateTo))
    }
    
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedLogs = filteredLogs.slice(start, end)
    
    return {
      results: paginatedLogs,
      count: filteredLogs.length,
      next: end < filteredLogs.length ? page + 1 : null,
      previous: page > 1 ? page - 1 : null,
    }
  },
  
  get: (id) => {
    return mockStockLogs.find(log => log.id === parseInt(id))
  },
  
  addStock: (data) => {
    const product = mockProducts.find(p => p.id === data.productId)
    if (!product) throw new Error('Product not found')
    
    const previousStock = product.stock
    product.stock += data.quantity
    
    const newLog = {
      id: mockStockLogs.length + 1,
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      type: 'IN',
      quantity: data.quantity,
      previousStock,
      newStock: product.stock,
      reason: 'Manual addition',
      notes: data.notes || '',
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
    }
    
    mockStockLogs.unshift(newLog)
    return newLog
  },
  
  removeStock: (data) => {
    const product = mockProducts.find(p => p.id === data.productId)
    if (!product) throw new Error('Product not found')
    if (product.stock < data.quantity) throw new Error('Insufficient stock')
    
    const previousStock = product.stock
    product.stock -= data.quantity
    
    const newLog = {
      id: mockStockLogs.length + 1,
      productId: product.id,
      productName: product.name,
      productSku: product.sku,
      type: 'OUT',
      quantity: data.quantity,
      previousStock,
      newStock: product.stock,
      reason: 'Manual removal',
      notes: data.notes || '',
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
    }
    
    mockStockLogs.unshift(newLog)
    return newLog
  },
  
  getLowStock: () => {
    return mockProducts.filter(p => p.stock <= p.lowStockThreshold)
  },
  
  getStockLevels: () => {
    return mockProducts.map(p => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
      status: p.stock <= p.lowStockThreshold ? 'low' : 'normal',
    }))
  },
}

// Also export as default for flexibility
export default {
  mockStockLogs,
  mockInventoryService,
  generateMockStockLogs,
}