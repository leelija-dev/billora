import api from './axiosConfig'

export const authService = {
  login: (credentials) => {
    return api.post('/auth/login/', credentials)
  },

  register: (companyData) => {
    return api.post('/auth/register/', companyData)
  },

  refreshToken: (refreshToken) => {
    return api.post('/auth/refresh/', { refresh: refreshToken })
  },

  logout: () => {
    localStorage.removeItem('auth-storage')
  },

  getCurrentUser: () => {
    return api.get('/auth/me/')
  },

  updateProfile: (userData) => {
    return api.put('/auth/profile/', userData)
  },

  changePassword: (passwordData) => {
    return api.post('/auth/change-password/', passwordData)
  },
}