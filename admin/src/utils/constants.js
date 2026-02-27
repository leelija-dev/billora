export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'SaaS ERP'

export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0'

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
}

export const PAYMENT_STATUS = {
  PAID: 'paid',
  UNPAID: 'unpaid',
  REFUNDED: 'refunded',
  FAILED: 'failed',
}

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  CASH: 'cash',
}

export const PRODUCT_CATEGORIES = {
  ELECTRONICS: 'electronics',
  CLOTHING: 'clothing',
  BOOKS: 'books',
  FOOD: 'food',
  OTHER: 'other',
}

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
}

export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  BASIC: 'basic',
  PROFESSIONal: 'professional',
  ENTERPRISE: 'enterprise',
}