// Mock users data
export const mockUsers = [
  {
    id: 1,
    email: 'admin@demo.com',
    password: 'demo123',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff',
    createdAt: '2024-01-01T10:00:00Z',
    lastLogin: '2024-03-15T08:30:00Z',
  },
  // ... other users
]

// Mock companies data
export const mockCompanies = [
  {
    id: 1,
    name: 'Demo Company',
    email: 'company@demo.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, Suite 100, San Francisco, CA 94105',
    logo: 'https://ui-avatars.com/api/?name=Demo+Company&background=6366f1&color=fff',
    plan: 'professional',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    subscription: {
      id: 'sub_123',
      plan: 'professional',
      status: 'active',
      startDate: '2024-01-01',
      nextBillingDate: '2024-04-01',
      amount: 79,
      currency: 'USD',
      interval: 'month',
    },
  },
]

// Generate mock token
const generateMockToken = (userId) => {
  return {
    access: `mock_access_token_${userId}_${Date.now()}`,
    refresh: `mock_refresh_token_${userId}_${Date.now()}`,
  }
}

// Mock auth service object - MAKE SURE THIS IS EXPORTED
export const mockAuth = {
  login: (email, password) => {
    console.log('mockAuth.login called with:', { email, password })
    
    const user = mockUsers.find(u => u.email === email && u.password === password)
    if (!user) {
      throw new Error('Invalid email or password')
    }
    
    const company = mockCompanies.find(c => c.id === 1)
    const { password: _, ...userWithoutPassword } = user
    const tokens = generateMockToken(user.id)
    
    return {
      user: userWithoutPassword,
      company,
      ...tokens,
    }
  },

  register: (companyData) => {
    return { message: 'Registration successful' }
  },

  refreshToken: (refreshToken) => {
    return {
      access: `mock_new_access_token_${Date.now()}`,
    }
  },

  getCurrentUser: () => {
    const user = mockUsers[0]
    const company = mockCompanies[0]
    const { password: _, ...userWithoutPassword } = user
    return { user: userWithoutPassword, company }
  },
}