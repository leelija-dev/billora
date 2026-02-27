// Make sure these imports are correct
import { mockOrders } from './mockOrders'  // Now this will work
import { mockProducts } from './mockProducts'
import { mockCustomers } from './mockCustomers'

export const mockDashboardService = {
  getStats: () => {
    // This will now have access to mockOrders
    const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = mockOrders.length
    const pendingOrders = mockOrders.filter(o => o.status === 'pending').length
    const completedOrders = mockOrders.filter(o => o.status === 'completed').length
    const lowStockProducts = mockProducts.filter(p => p.stock <= p.lowStockThreshold).length
    
    const lastMonthRevenue = totalRevenue * 0.85
    const revenueChange = ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
    
    return {
      revenue: {
        total: totalRevenue,
        change: parseFloat(revenueChange.toFixed(1)),
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
        change: 8.2,
      },
      products: {
        total: mockProducts.length,
        lowStock: lowStockProducts,
        change: -3.1,
      },
      customers: {
        total: mockCustomers.length,
        active: mockCustomers.filter(c => c.status === 'active').length,
        change: 15.3,
      },
    }
  },
  
  getRevenueData: (period = 'week') => {
    const data = []
    const now = new Date()
    let days
    
    switch (period) {
      case 'week':
        days = 7
        break
      case 'month':
        days = 30
        break
      case 'quarter':
        days = 90
        break
      default:
        days = 7
    }
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const revenue = Math.random() * 5000 + 2000
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: parseFloat(revenue.toFixed(2)),
      })
    }
    
    return data
  },
  
  getRecentOrders: (limit = 5) => {
    return mockOrders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
      .map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customer: order.customer.name,
        amount: order.total,
        status: order.status,
        date: new Date(order.createdAt).toLocaleDateString(),
      }))
  },
  
  getTopProducts: (limit = 5) => {
    return mockProducts
      .sort(() => Math.random() - 0.5)
      .slice(0, limit)
      .map(product => ({
        id: product.id,
        name: product.name,
        sales: Math.floor(Math.random() * 100) + 20,
        revenue: parseFloat((Math.random() * 5000 + 1000).toFixed(2)),
      }))
  },
  
  getActivityFeed: (limit = 10) => {
    const activities = []
    
    mockOrders.slice(0, 5).forEach(order => {
      activities.push({
        id: `order-${order.id}`,
        type: 'order',
        message: `New order #${order.orderNumber} from ${order.customer.name}`,
        timestamp: order.createdAt,
        status: order.status,
      })
    })
    
    mockProducts.slice(0, 3).forEach(product => {
      activities.push({
        id: `product-${product.id}`,
        type: 'product',
        message: `Product ${product.name} stock updated to ${product.stock}`,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
    })
    
    mockCustomers.slice(0, 2).forEach(customer => {
      activities.push({
        id: `customer-${customer.id}`,
        type: 'customer',
        message: `New customer ${customer.name} registered`,
        timestamp: customer.createdAt,
      })
    })
    
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
  },
}

export default mockDashboardService