// constants/index.js - Application constants for better maintainability

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api',
  DASHBOARD_URL: process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000',
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:4000',
};

// Authentication
export const AUTH = {
  TOKEN_KEY: 'token',
  USER_KEY: 'user',
  AUTH_TOKEN_KEY: 'auth_token',
  USER_DATA_KEY: 'user_data',
  PLAN_KEY_PREFIX: 'plan_',
};

// Navigation Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRICING: '/pricing',
  ORDER_SUMMARY: '/order-summary',
  ORDER_SUCCESS: '/order-success',
  PAYMENT_SUCCESS: '/payment-success',
  PRODUCTS: '/products',
  CONTACT: '/contact',
  ABOUT: '/about',
  PARTNER: '/partner',
  SOLUTION: '/solution',
  CAREERS: '/carrers',
  TRY_MOBILE: '/trymobile',
  BOOK_DEMO: '/bookdemo',
  START_FREE_TRIAL: '/start-free-trial',
  DESKTOP: '/desktop',
};

// Route Mapping for Navbar
export const ROUTE_MAP = {
  [ROUTES.HOME]: 0,
  [ROUTES.TRY_MOBILE]: 1,
  [ROUTES.CAREERS]: 2,
  [ROUTES.PARTNER]: 3,
  [ROUTES.SOLUTION]: 4,
  [ROUTES.ABOUT]: 5,
  [ROUTES.PRICING]: 6,
  [ROUTES.CONTACT]: 7,
};

// Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/,
  PHONE_REGEX: /^\d{10}$/,
  PASSWORD_MIN_LENGTH: 6,
};

// Timeouts and Durations
export const TIMEOUTS = {
  TOAST_DURATION: {
    SUCCESS: 3000,
    ERROR: 4000,
    LOADING: Infinity,
  },
  DEBOUNCE_DELAY: 50,
  RESIZE_DELAY: 50,
  NAVIGATION_DELAY: 10,
  ANIMATION_DURATION: {
    FAST: 200,
    MEDIUM: 300,
    SLOW: 450,
  },
};

// Business Logic
export const BUSINESS = {
  PLAN_VALIDITY_DAYS: 365,
  GST_RATE: 18,
  DEFAULT_BUSINESS_TYPE_ID: 1,
};

// UI Constants
export const UI = {
  Z_INDEX: {
    MODAL: 50,
    DROPDOWN: 40,
    NAVBAR: 35,
    TOASTER: 9999,
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Failed to connect to server. Please check your internet connection.',
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
    USER_NOT_FOUND: 'No account found with this email. Please register first.',
    EMAIL_NOT_VERIFIED: 'Please verify your email before logging in. Check your inbox.',
    TOKEN_EXPIRED: 'Your session has expired. Please login again.',
  },
  VALIDATION: {
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
    PHONE_REQUIRED: 'Phone number is required',
    PHONE_INVALID: 'Please enter a valid 10-digit phone number',
  },
  GENERAL: 'Something went wrong. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful! Welcome back.',
  LOGOUT: 'Successfully logged out. See you soon!',
  REGISTER: 'Registration successful! Please check your email to verify your account.',
  ORDER_PLACED: 'Order placed successfully!',
  PAYMENT_SUCCESS: 'Payment completed successfully!',
};

// Loading Messages
export const LOADING_MESSAGES = {
  LOGIN: 'Logging in...',
  LOGOUT: 'Logging out...',
  REGISTER: 'Creating account...',
  ORDER: 'Placing order...',
  PAYMENT: 'Processing payment...',
  LOADING: 'Loading...',
};

// Plan Status
export const PLAN_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
};

// Time Zones
export const TIME_ZONES = [
  { name: "India Standard Time (IST)", value: "Asia/Kolkata", offset: "+5:30" },
  { name: "Eastern Time (ET)", value: "America/New_York", offset: "-4:00" },
  { name: "Pacific Time (PT)", value: "America/Los_Angeles", offset: "-7:00" },
  { name: "Central Time (CT)", value: "America/Chicago", offset: "-5:00" },
  { name: "Mountain Time (MT)", value: "America/Denver", offset: "-6:00" },
  { name: "Greenwich Mean Time (GMT)", value: "Europe/London", offset: "+1:00" },
  { name: "Central European Time (CET)", value: "Europe/Paris", offset: "+2:00" },
  { name: "Eastern European Time (EET)", value: "Europe/Athens", offset: "+3:00" },
  { name: "Gulf Standard Time (GST)", value: "Asia/Dubai", offset: "+4:00" },
  { name: "Singapore Time (SGT)", value: "Asia/Singapore", offset: "+8:00" },
  { name: "Australia Eastern Time (AET)", value: "Australia/Sydney", offset: "+10:00" },
  { name: "New Zealand Time (NZT)", value: "Pacific/Auckland", offset: "+12:00" }
];

// Enquiry Types
export const ENQUIRY_TYPES = [
  { value: "Product demo", icon: "??", color: "#4461F2" },
  { value: "Pricing enquiry", icon: "??", color: "#10B981" },
  { value: "Technical support", icon: "??", color: "#F59E0B" },
  { value: "Partnership", icon: "??", color: "#9E5CF2" },
  { value: "Other", icon: "??", color: "#6B7280" }
];

// Time Slots
export const TIME_SLOTS = [
  "9:00 AM", "10:00 AM", "11:00 AM", 
  "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];
