// Mock plans data
export const mockPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      { name: 'Up to 100 products', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'Email support', included: true },
      { name: 'Advanced reporting', included: false },
      { name: 'API access', included: false },
      { name: 'Priority support', included: false },
      { name: 'Custom domains', included: false },
      { name: 'Team members', included: false, limit: 1 },
    ],
    limits: {
      products: 100,
      users: 1,
      storage: 10,
      apiCalls: 1000,
    },
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    currency: 'USD',
    interval: 'month',
    features: [
      { name: 'Up to 500 products', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'Email support', included: true },
      { name: 'Advanced reporting', included: true },
      { name: 'API access', included: false },
      { name: 'Priority support', included: false },
      { name: 'Custom domains', included: false },
      { name: 'Team members', included: true, limit: 5 },
    ],
    limits: {
      products: 500,
      users: 5,
      storage: 50,
      apiCalls: 5000,
    },
    popular: true,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 79,
    currency: 'USD',
    interval: 'month',
    features: [
      { name: 'Unlimited products', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Priority support', included: true },
      { name: 'Advanced reporting', included: true },
      { name: 'API access', included: true },
      { name: 'Custom domains', included: true },
      { name: 'Team members', included: true, limit: 15 },
      { name: 'Custom integrations', included: true },
    ],
    limits: {
      products: -1, // unlimited
      users: 15,
      storage: 200,
      apiCalls: 50000,
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    currency: 'USD',
    interval: 'month',
    features: [
      { name: 'Unlimited everything', included: true },
      { name: 'Custom analytics', included: true },
      { name: '24/7 phone support', included: true },
      { name: 'SLA guarantee', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'Custom development', included: true },
      { name: 'Unlimited team members', included: true },
      { name: 'On-premise option', included: true },
    ],
    limits: {
      products: -1,
      users: -1,
      storage: 1000,
      apiCalls: -1,
    },
  },
]

// Generate mock payments
export const generateMockPayments = (count = 20) => {
  const payments = []
  const statuses = ['succeeded', 'pending', 'failed', 'refunded']
  const methods = ['credit_card', 'bank_transfer', 'paypal']
  
  for (let i = 1; i <= count; i++) {
    const date = new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000)
    const randomPlan = mockPlans[Math.floor(Math.random() * mockPlans.length)]
    
    payments.push({
      id: `pay_${i}`,
      invoiceNumber: `INV-${String(i).padStart(6, '0')}`,
      date: date.toISOString(),
      description: `Subscription payment - ${randomPlan.name} Plan`,
      amount: parseFloat((Math.random() * 200 + 29).toFixed(2)),
      currency: 'USD',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      paymentMethod: methods[Math.floor(Math.random() * methods.length)],
      invoiceUrl: i % 3 === 0 ? '#' : null,
      receiptUrl: i % 4 === 0 ? '#' : null,
    })
  }
  
  return payments.sort((a, b) => new Date(b.date) - new Date(a.date))
}

export const mockPayments = generateMockPayments(20)

// Mock billing service - MAKE SURE THIS IS EXPORTED
export const mockBillingService = {
  getSubscription: (companyId = 1) => {
    return {
      id: 'sub_123',
      plan: 'professional',
      status: 'active',
      startDate: '2024-01-01',
      currentPeriodStart: '2024-03-01',
      currentPeriodEnd: '2024-04-01',
      cancelAtPeriodEnd: false,
      paymentMethod: {
        type: 'credit_card',
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2025,
      },
      amount: 79,
      currency: 'USD',
      interval: 'month',
      usage: {
        products: 342,
        users: 3,
        storage: 45,
        apiCalls: 5678,
      },
      limits: {
        products: 1000,
        users: 10,
        storage: 100,
        apiCalls: 10000,
      },
    }
  },
  
  getPlans: () => {
    return [...mockPlans] // Return a copy to prevent mutation
  },
  
  getPayments: (params = {}) => {
    let filteredPayments = [...mockPayments]
    
    if (params.status) {
      filteredPayments = filteredPayments.filter(p => p.status === params.status)
    }
    
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const paginatedPayments = filteredPayments.slice(start, end)
    
    return {
      results: paginatedPayments,
      count: filteredPayments.length,
      next: end < filteredPayments.length ? page + 1 : null,
      previous: page > 1 ? page - 1 : null,
    }
  },
  
  upgrade: (planId) => {
    const plan = mockPlans.find(p => p.id === planId)
    return {
      success: true,
      message: `Successfully upgraded to ${plan?.name || 'new'} plan`,
      subscription: {
        plan: planId,
        status: 'active',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    }
  },
  
  cancel: () => {
    return {
      success: true,
      message: 'Subscription cancelled successfully. You will have access until the end of your billing period.',
      cancelAtPeriodEnd: true,
    }
  },
  
  getInvoices: (params = {}) => {
    const invoices = mockPayments
      .filter(p => p.status === 'succeeded')
      .map(p => ({
        id: p.id,
        invoiceNumber: p.invoiceNumber,
        date: p.date,
        amount: p.amount,
        status: 'paid',
        pdfUrl: p.invoiceUrl,
      }))
    
    const page = params.page || 1
    const pageSize = params.pageSize || 10
    const start = (page - 1) * pageSize
    const end = start + pageSize
    
    return {
      results: invoices.slice(start, end),
      count: invoices.length,
    }
  },
}

// Add a default export as well for flexibility
export default {
  mockPlans,
  mockPayments,
  mockBillingService,
  generateMockPayments,
}