import { apiClient } from './apiClient'

export const reportsAPI = {
  // Get reports with optional date filtering
  getReports: (startDate = '', endDate = '') => {
    let url = '/reports/'
    const params = new URLSearchParams()
    
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }
    
    console.log('📊 Reports API Request:', {
      url,
      params: {
        start_date: startDate,
        end_date: endDate
      }
    })
    
    return apiClient.get(url).then(response => {
      console.log('✅ Reports API Response:', response)
      return response
    }).catch(error => {
      console.error('❌ Reports API Error:', error)
      throw error
    })
  },

  // Get today's reports (default endpoint)
  getTodayReports: () => {
    console.log('📊 Fetching today\'s reports')
    return apiClient.get('/reports/').then(response => {
      console.log('✅ Today\'s Reports Response:', response)
      return response
    }).catch(error => {
      console.error('❌ Today\'s Reports Error:', error)
      throw error
    })
  },

  // Export reports data
  exportReports: (startDate = '', endDate = '') => {
    let url = '/reports/export'
    const params = new URLSearchParams()
    
    if (startDate) params.append('start_date', startDate)
    if (endDate) params.append('end_date', endDate)
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }
    
    console.log('📊 Exporting reports:', { start_date: startDate, end_date: endDate })
    return apiClient.get(url)
  },

  // Get customer details with timeout
  getCustomer: (customerId) => {
    console.log('👤 Fetching customer:', customerId)
    return apiClient.get(`/customer/show/${customerId}`, { timeout: 5000 })
      .then(response => {
        console.log('✅ Customer Response:', response)
        return response
      })
      .catch(error => {
        console.error('❌ Customer API Error:', error)
        throw error
      })
  },

  // Get store details with timeout
  getStore: (storeId) => {
    console.log('🏪 Fetching store:', storeId)
    return apiClient.get(`/store/${storeId}`, { timeout: 5000 })
      .then(response => {
        console.log('✅ Store Response:', response)
        return response
      })
      .catch(error => {
        console.error('❌ Store API Error:', error)
        throw error
      })
  }
}

export default reportsAPI
