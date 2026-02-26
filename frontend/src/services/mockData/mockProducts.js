import { faker } from '@faker-js/faker' // Optional: for realistic data generation

// Generate mock products
export const generateMockProducts = (count = 50) => {
  const products = []
  const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Food', 'Beauty']
  const statuses = ['active', 'inactive', 'draft']
  
  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const price = Math.random() * 500 + 10
    const cost = price * (0.4 + Math.random() * 0.3)
    const stock = Math.floor(Math.random() * 200)
    const lowStockThreshold = 10
    
    products.push({
      id: i,
      sku: `SKU-${category.substring(0, 3).toUpperCase()}-${String(i).padStart(4, '0')}`,
      name: `${category} Product ${i}`,
      description: `This is a high-quality ${category.toLowerCase()} product. Perfect for your needs.`,
      category,
      price: parseFloat(price.toFixed(2)),
      cost: parseFloat(cost.toFixed(2)),
      stock,
      lowStockThreshold,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      image: `https://picsum.photos/200/200?random=${i}`,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      variants: Math.random() > 0.7 ? [
        { size: 'S', stock: Math.floor(Math.random() * 20) },
        { size: 'M', stock: Math.floor(Math.random() * 20) },
        { size: 'L', stock: Math.floor(Math.random() * 20) },
      ] : [],
      tags: ['new', 'featured'].filter(() => Math.random() > 0.5),
    })
  }
  
  return products
}

export const mockProducts = generateMockProducts(50)

// Mock product service functions
export const mockProductService = {
  list: (params = {}) => {
    let filteredProducts = [...mockProducts]
    
    // Apply filters
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.sku.toLowerCase().includes(searchLower)
      )
    }
    
    if (params.category) {
      filteredProducts = filteredProducts.filter(p => p.category === params.category)
    }
    
    if (params.status) {
      filteredProducts = filteredProducts.filter(p => p.status === params.status)
    }
    
    if (params.minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= params.minPrice)
    }
    
    if (params.maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= params.maxPrice)
    }
    
    // Pagination
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedProducts = filteredProducts.slice(start, end)
    
    return {
      results: paginatedProducts,
      count: filteredProducts.length,
      next: end < filteredProducts.length ? page + 1 : null,
      previous: page > 1 ? page - 1 : null,
    }
  },
  
  get: (id) => {
    return mockProducts.find(p => p.id === parseInt(id))
  },
  
  create: (productData) => {
    const newProduct = {
      id: mockProducts.length + 1,
      ...productData,
      sku: productData.sku || `SKU-NEW-${String(mockProducts.length + 1).padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockProducts.push(newProduct)
    return newProduct
  },
  
  update: (id, productData) => {
    const index = mockProducts.findIndex(p => p.id === parseInt(id))
    if (index === -1) throw new Error('Product not found')
    
    mockProducts[index] = {
      ...mockProducts[index],
      ...productData,
      updatedAt: new Date().toISOString(),
    }
    return mockProducts[index]
  },
  
  delete: (id) => {
    const index = mockProducts.findIndex(p => p.id === parseInt(id))
    if (index === -1) throw new Error('Product not found')
    mockProducts.splice(index, 1)
    return { success: true }
  },
}