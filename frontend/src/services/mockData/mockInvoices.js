import { mockCustomers } from './mockCustomers'
import { mockOrders } from './mockOrders'

export const generateMockInvoices = (count = 25) => {
  const invoices = []
  const statuses = ['paid', 'unpaid', 'overdue', 'cancelled', 'refunded']
  
  for (let i = 1; i <= count; i++) {
    const customer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)]
    const order = mockOrders[Math.floor(Math.random() * mockOrders.length)]
    const items = order?.items || []
    const subtotal = items.reduce((sum, item) => sum + item.total, 0) || Math.random() * 500 + 50
    const tax = subtotal * 0.1
    const total = subtotal + tax
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const issueDate = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)
    const dueDate = new Date(issueDate)
    dueDate.setDate(dueDate.getDate() + 30)
    
    invoices.push({
      id: i,
      invoiceNumber: `INV-${String(i).padStart(6, '0')}`,
      orderNumber: order?.orderNumber || `ORD-${String(i).padStart(6, '0')}`,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        address: customer.address,
        phone: customer.phone,
      },
      company: {
        name: 'Demo Company',
        address: '123 Business Ave, Suite 100, San Francisco, CA 94105',
        email: 'billing@democompany.com',
        phone: '+1 (555) 123-4567',
        taxId: '12-3456789',
      },
      items: items.length ? items : [
        {
          description: 'Product Service',
          quantity: 2,
          unitPrice: 99.99,
          total: 199.98,
        },
        {
          description: 'Consulting Hours',
          quantity: 3,
          unitPrice: 150,
          total: 450,
        },
      ],
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      taxRate: 10,
      total: parseFloat(total.toFixed(2)),
      status,
      issueDate: issueDate.toISOString(),
      dueDate: dueDate.toISOString(),
      paidAt: status === 'paid' ? new Date(issueDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString() : null,
      paymentMethod: status === 'paid' ? 'credit_card' : null,
      notes: status === 'overdue' ? 'Payment overdue. Please remit at your earliest convenience.' : '',
      pdfUrl: `#invoice-${i}`,
    })
  }
  
  return invoices.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate))
}

// Export mock data
export const mockInvoices = generateMockInvoices(25)

// Export the service - THIS IS CORRECT
export const mockInvoiceService = {
  list: (params = {}) => {
    let filteredInvoices = [...mockInvoices]
    
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredInvoices = filteredInvoices.filter(i => 
        i.invoiceNumber.toLowerCase().includes(searchLower) ||
        i.customer.name.toLowerCase().includes(searchLower) ||
        i.customer.email.toLowerCase().includes(searchLower)
      )
    }
    
    if (params.status) {
      filteredInvoices = filteredInvoices.filter(i => i.status === params.status)
    }
    
    if (params.dateFrom) {
      filteredInvoices = filteredInvoices.filter(i => new Date(i.issueDate) >= new Date(params.dateFrom))
    }
    
    if (params.dateTo) {
      filteredInvoices = filteredInvoices.filter(i => new Date(i.issueDate) <= new Date(params.dateTo))
    }
    
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedInvoices = filteredInvoices.slice(start, end)
    
    return {
      results: paginatedInvoices,
      count: filteredInvoices.length,
      next: end < filteredInvoices.length ? page + 1 : null,
      previous: page > 1 ? page - 1 : null,
    }
  },
  
  get: (id) => {
    return mockInvoices.find(i => i.id === parseInt(id) || i.invoiceNumber === id)
  },
  
  create: (invoiceData) => {
    const newInvoice = {
      id: mockInvoices.length + 1,
      invoiceNumber: `INV-${String(mockInvoices.length + 1).padStart(6, '0')}`,
      ...invoiceData,
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'unpaid',
    }
    mockInvoices.unshift(newInvoice)
    return newInvoice
  },
  
  update: (id, invoiceData) => {
    const index = mockInvoices.findIndex(i => i.id === parseInt(id))
    if (index === -1) throw new Error('Invoice not found')
    
    mockInvoices[index] = {
      ...mockInvoices[index],
      ...invoiceData,
    }
    return mockInvoices[index]
  },
  
  markAsPaid: (id) => {
    const invoice = mockInvoices.find(i => i.id === parseInt(id))
    if (!invoice) throw new Error('Invoice not found')
    
    invoice.status = 'paid'
    invoice.paidAt = new Date().toISOString()
    return invoice
  },
  
  delete: (id) => {
    const index = mockInvoices.findIndex(i => i.id === parseInt(id))
    if (index === -1) throw new Error('Invoice not found')
    mockInvoices.splice(index, 1)
    return { success: true }
  },
}

// Also export as default for flexibility
export default {
  mockInvoices,
  mockInvoiceService,
  generateMockInvoices,
}