import { mockProducts } from './mockProducts'
import { mockCustomers } from './mockCustomers'

// Generate mock orders
export const generateMockOrders = (count = 30) => {
  const orders = []
  const statuses = ['pending', 'processing', 'completed', 'cancelled', 'refunded']
  const paymentStatuses = ['paid', 'unpaid', 'refunded', 'failed']
  const paymentMethods = ['credit_card', 'debit_card', 'bank_transfer', 'cash', 'paypal']
  
  for (let i = 1; i <= count; i++) {
    const customer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)]
    const itemCount = Math.floor(Math.random() * 5) + 1
    const items = []
    let subtotal = 0
    
    for (let j = 0; j < itemCount; j++) {
      const product = mockProducts[Math.floor(Math.random() * mockProducts.length)]
      const quantity = Math.floor(Math.random() * 3) + 1
      const price = product.price
      const total = price * quantity
      subtotal += total
      
      items.push({
        id: j + 1,
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        quantity,
        price,
        total,
      })
    }
    
    const tax = subtotal * 0.1
    const shipping = Math.random() > 0.7 ? 10 : 0
    const total = subtotal + tax + shipping
    
    orders.push({
      id: i,
      orderNumber: `ORD-${String(i).padStart(6, '0')}`,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
      items,
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      shipping,
      total: parseFloat(total.toFixed(2)),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      shippingAddress: customer.address,
      billingAddress: customer.address,
      notes: Math.random() > 0.7 ? 'Please leave at door' : '',
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }
  
  return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

// EXPORT mockOrders (this was missing)
export const mockOrders = generateMockOrders(30)

// Mock order service
export const mockOrderService = {
  list: (params = {}) => {
    let filteredOrders = [...mockOrders]
    
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredOrders = filteredOrders.filter(o => 
        o.orderNumber.toLowerCase().includes(searchLower) ||
        o.customer.name.toLowerCase().includes(searchLower) ||
        o.customer.email.toLowerCase().includes(searchLower)
      )
    }
    
    if (params.status) {
      filteredOrders = filteredOrders.filter(o => o.status === params.status)
    }
    
    if (params.paymentStatus) {
      filteredOrders = filteredOrders.filter(o => o.paymentStatus === params.paymentStatus)
    }
    
    if (params.dateFrom) {
      filteredOrders = filteredOrders.filter(o => new Date(o.createdAt) >= new Date(params.dateFrom))
    }
    
    if (params.dateTo) {
      filteredOrders = filteredOrders.filter(o => new Date(o.createdAt) <= new Date(params.dateTo))
    }
    
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedOrders = filteredOrders.slice(start, end)
    
    return {
      results: paginatedOrders,
      count: filteredOrders.length,
      next: end < filteredOrders.length ? page + 1 : null,
      previous: page > 1 ? page - 1 : null,
    }
  },
  
  get: (id) => {
    return mockOrders.find(o => o.id === parseInt(id) || o.orderNumber === id)
  },
  
  create: (orderData) => {
    const newOrder = {
      id: mockOrders.length + 1,
      orderNumber: `ORD-${String(mockOrders.length + 1).padStart(6, '0')}`,
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    mockOrders.unshift(newOrder)
    return newOrder
  },
  
  updateStatus: (id, status) => {
    const order = mockOrders.find(o => o.id === parseInt(id))
    if (!order) throw new Error('Order not found')
    order.status = status
    order.updatedAt = new Date().toISOString()
    return order
  },
  
  updatePaymentStatus: (id, paymentStatus) => {
    const order = mockOrders.find(o => o.id === parseInt(id))
    if (!order) throw new Error('Order not found')
    order.paymentStatus = paymentStatus
    order.updatedAt = new Date().toISOString()
    return order
  },
}

// Also export as default if needed
export default {
  mockOrders,
  mockOrderService,
  generateMockOrders,
}