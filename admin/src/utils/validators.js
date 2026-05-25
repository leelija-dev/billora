// ==============================
// VALIDATION FUNCTIONS
// ==============================

// Email validation
export const validateEmail = (email) => {
  if (!email) return false
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

// Phone/Mobile validation (exactly 10 digits for Indian numbers)
export const validatePhone = (phone) => {
  if (!phone) return false
  const re = /^[0-9]{10}$/
  return re.test(phone)
}

// Password validation (min 8 chars, at least 1 uppercase, 1 lowercase, 1 number)
export const validatePassword = (password) => {
  if (!password) return false
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return re.test(password)
}

// SKU validation (uppercase letters, numbers, and hyphens only)
export const validateSKU = (sku) => {
  if (!sku) return false
  const re = /^[A-Z0-9-]+$/
  return re.test(sku)
}

// Price validation (positive number)
export const validatePrice = (price) => {
  if (price === '' || price === null || price === undefined) return false
  const num = parseFloat(price)
  return !isNaN(num) && num >= 0
}

// Quantity validation (non-negative integer)
export const validateQuantity = (quantity) => {
  if (quantity === '' || quantity === null || quantity === undefined) return false
  const num = parseInt(quantity)
  return Number.isInteger(num) && num >= 0
}

// Product name validation
export const validateProductName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 255
}

// Batch number validation
export const validateBatchNumber = (batchNumber) => {
  return !batchNumber || batchNumber.length <= 100
}

// Manufacturer name validation
export const validateManufacturerName = (name) => {
  return !name || name.length <= 255
}

// Warehouse location validation
export const validateWarehouseLocation = (location) => {
  return !location || location.length <= 100
}

// Barcode validation
export const validateBarcode = (barcode) => {
  return !barcode || barcode.length <= 100
}

// Schedule type validation (H, X, G, etc.)
export const validateScheduleType = (type) => {
  return !type || /^[A-Z]{1,5}$/.test(type)
}

// GST HSN Code validation (numeric only, up to 8 digits)
export const validateGSTHSNCode = (code) => {
  return !code || /^[0-9]{1,8}$/.test(code)
}

// Percentage validation (0-100)
export const validatePercentage = (value) => {
  if (value === '' || value === null || value === undefined) return false
  const num = parseFloat(value)
  return !isNaN(num) && num >= 0 && num <= 100
}

// Decimal validation with configurable decimal places
export const validateDecimal = (value, maxDecimalPlaces = 2) => {
  if (value === '' || value === null || value === undefined) return false
  const num = parseFloat(value)
  if (isNaN(num)) return false
  const decimalStr = num.toString()
  const decimalPart = decimalStr.split('.')[1]
  return !decimalPart || decimalPart.length <= maxDecimalPlaces
}

// Selling price validation (must be >= purchase price)
export const validateSellingPrice = (sellingPrice, purchasePrice) => {
  if (!sellingPrice || !purchasePrice) return true
  const selling = parseFloat(sellingPrice)
  const purchase = parseFloat(purchasePrice)
  if (isNaN(selling) || isNaN(purchase)) return true
  return selling >= purchase
}

// GST Number validation (Indian GST format)
export const validateGSTNumber = (gstNumber) => {
  if (!gstNumber) return false
  // Format: 2 digits, 5 alphanumeric, 4 digits, 1 alphanumeric, 1 digit, Z, 1 alphanumeric
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9A-Z]{1}$/
  return gstRegex.test(gstNumber.toUpperCase())
}

// Pincode/Zipcode validation (6 digits for Indian pincodes)
export const validatePincode = (pincode) => {
  if (!pincode) return false
  const re = /^[0-9]{6}$/
  return re.test(pincode)
}

// PAN Card validation (Indian PAN format)
export const validatePAN = (pan) => {
  if (!pan) return false
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  return panRegex.test(pan.toUpperCase())
}

// Aadhar Card validation (12 digits)
export const validateAadhar = (aadhar) => {
  if (!aadhar) return false
  const re = /^[0-9]{12}$/
  return re.test(aadhar)
}

// IFSC Code validation
export const validateIFSC = (ifsc) => {
  if (!ifsc) return false
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/
  return ifscRegex.test(ifsc.toUpperCase())
}

// URL validation
export const validateURL = (url) => {
  if (!url) return false
  const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
  return urlRegex.test(url)
}

// ==============================
// INPUT HANDLERS (Prevent invalid input on type)
// ==============================

// Handle numeric input (only digits)
export const handleNumberInput = (e) => {
  const value = e.target.value
  e.target.value = value.replace(/[^0-9]/g, '')
}

// Handle decimal input (numbers and single decimal point)
export const handleDecimalInput = (e, maxDecimalPlaces = 2) => {
  let value = e.target.value
  // Remove any non-numeric characters except decimal point
  let cleaned = value.replace(/[^0-9.]/g, '')
  
  // Ensure only one decimal point
  const parts = cleaned.split('.')
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('')
  }
  
  // Limit decimal places
  if (parts[1] && parts[1].length > maxDecimalPlaces) {
    cleaned = parts[0] + '.' + parts[1].substring(0, maxDecimalPlaces)
  }
  
  e.target.value = cleaned
}

// Handle phone input (exactly 10 digits)
export const handlePhoneInput = (e) => {
  let value = e.target.value
  // Remove non-digits and limit to 10 characters
  value = value.replace(/[^0-9]/g, '').substring(0, 10)
  e.target.value = value
}

// Handle pincode input (exactly 6 digits)
export const handlePincodeInput = (e) => {
  let value = e.target.value
  value = value.replace(/[^0-9]/g, '').substring(0, 6)
  e.target.value = value
}

// Handle Aadhar input (exactly 12 digits with optional spaces)
export const handleAadharInput = (e) => {
  let value = e.target.value
  // Remove non-digits and limit to 12 characters
  value = value.replace(/[^0-9]/g, '').substring(0, 12)
  
  // Optional: Format with spaces (XXXX XXXX XXXX)
  if (value.length > 8) {
    value = value.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3')
  } else if (value.length > 4) {
    value = value.replace(/(\d{4})(\d{4})/, '$1 $2')
  }
  
  e.target.value = value
}

// Handle GST input (uppercase alphanumeric)
export const handleGSTInput = (e) => {
  let value = e.target.value.toUpperCase()
  // Remove spaces and special characters
  value = value.replace(/[^A-Z0-9]/g, '').substring(0, 15)
  e.target.value = value
}

// Handle PAN input (uppercase alphanumeric)
export const handlePANInput = (e) => {
  let value = e.target.value.toUpperCase()
  value = value.replace(/[^A-Z0-9]/g, '').substring(0, 10)
  e.target.value = value
}

// Handle IFSC input (uppercase alphanumeric)
export const handleIFSCInput = (e) => {
  let value = e.target.value.toUpperCase()
  value = value.replace(/[^A-Z0-9]/g, '').substring(0, 11)
  e.target.value = value
}

// Handle alphanumeric input (letters, numbers, spaces, hyphens, underscores)
export const handleAlphanumericInput = (e) => {
  let value = e.target.value
  value = value.replace(/[^a-zA-Z0-9\s\-_]/g, '')
  e.target.value = value
}

// Handle alphabetic input (only letters and spaces)
export const handleAlphabeticInput = (e) => {
  let value = e.target.value
  value = value.replace(/[^a-zA-Z\s]/g, '')
  e.target.value = value
}

// Handle maximum length
export const handleMaxLength = (e, maxLength) => {
  if (e.target.value.length > maxLength) {
    e.target.value = e.target.value.substring(0, maxLength)
  }
}

// ==============================
// VALIDATION RULES OBJECTS
// ==============================

// Validation rules for easy reference
export const validationRules = {
  // Product fields
  productName: { 
    required: 'Product name is required',
    minLength: 2, 
    maxLength: 255,
    message: 'Product name must be between 2 and 255 characters'
  },
  sku: { 
    pattern: /^[A-Z0-9-]+$/, 
    maxLength: 100,
    message: 'SKU must contain only uppercase letters, numbers, and hyphens'
  },
  batchNumber: { 
    maxLength: 100,
    message: 'Batch number cannot exceed 100 characters'
  },
  manufacturerName: { 
    maxLength: 255,
    message: 'Manufacturer name cannot exceed 255 characters'
  },
  warehouseLocation: { 
    maxLength: 100,
    message: 'Warehouse location cannot exceed 100 characters'
  },
  barcode: { 
    maxLength: 100,
    message: 'Barcode cannot exceed 100 characters'
  },
  scheduleType: { 
    pattern: /^[A-Z]{1,5}$/, 
    maxLength: 5,
    message: 'Schedule type must be 1-5 uppercase letters'
  },
  gstHsnCode: { 
    pattern: /^[0-9]{1,8}$/, 
    maxLength: 8,
    message: 'HSN code must contain only numbers (1-8 digits)'
  },
  
  // Numeric fields
  price: { 
    min: 0, 
    maxDecimalPlaces: 2,
    message: 'Price must be a positive number with up to 2 decimal places'
  },
  percentage: { 
    min: 0, 
    max: 100, 
    maxDecimalPlaces: 2,
    message: 'Percentage must be between 0 and 100'
  },
  quantity: { 
    min: 0, 
    integer: true,
    message: 'Quantity must be a non-negative integer'
  },
  
  // Contact fields
  phone: { 
    minLength: 10, 
    maxLength: 10, 
    pattern: /^[0-9]{10}$/,
    message: 'Phone number must be exactly 10 digits'
  },
  mobile: {
    minLength: 10,
    maxLength: 10,
    pattern: /^[0-9]{10}$/,
    message: 'Mobile number must be exactly 10 digits'
  },
  email: { 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  
  // Address fields
  pincode: {
    pattern: /^[0-9]{6}$/,
    minLength: 6,
    maxLength: 6,
    message: 'Pincode must be exactly 6 digits'
  },
  city: {
    pattern: /^[a-zA-Z\s-]+$/,
    message: 'City name should only contain letters, spaces, and hyphens'
  },
  
  // GST & Tax fields
  gstNumber: {
    pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9A-Z]{1}$/,
    message: 'Invalid GST number format'
  },
  panNumber: {
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    message: 'Invalid PAN card number format'
  },
  aadharNumber: {
    pattern: /^[0-9]{12}$/,
    message: 'Aadhar number must be exactly 12 digits'
  },
  ifscCode: {
    pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
    message: 'Invalid IFSC code format'
  },
  
  // General
  description: { 
    maxLength: 5000,
    message: 'Description cannot exceed 5000 characters'
  },
  shortDescription: { 
    maxLength: 500,
    message: 'Short description cannot exceed 500 characters'
  },
}

// ==============================
// COMPREHENSIVE VALIDATION FUNCTION
// ==============================

// Validate form data against rules
export const validateFormData = (data, rules) => {
  const errors = {}
  
  Object.keys(rules).forEach(field => {
    const value = data[field]
    const rule = rules[field]
    
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = rule.requiredMessage || `${field} is required`
      return
    }
    
    if (value && value.toString().trim() !== '') {
      // Check min length
      if (rule.minLength && value.toString().length < rule.minLength) {
        errors[field] = rule.message || `${field} must be at least ${rule.minLength} characters`
        return
      }
      
      // Check max length
      if (rule.maxLength && value.toString().length > rule.maxLength) {
        errors[field] = rule.message || `${field} cannot exceed ${rule.maxLength} characters`
        return
      }
      
      // Check pattern
      if (rule.pattern && !rule.pattern.test(value.toString())) {
        errors[field] = rule.message || `Invalid ${field} format`
        return
      }
      
      // Check min value
      if (rule.min !== undefined && parseFloat(value) < rule.min) {
        errors[field] = rule.message || `${field} must be at least ${rule.min}`
        return
      }
      
      // Check max value
      if (rule.max !== undefined && parseFloat(value) > rule.max) {
        errors[field] = rule.message || `${field} cannot exceed ${rule.max}`
        return
      }
    }
  })
  
  return errors
}

// ==============================
// REAL-TIME VALIDATION HOOK
// ==============================

// Helper function to create real-time validation for form fields
export const createValidationHandler = (setError, clearError) => {
  return (field, value, rules) => {
    let error = null
    
    if (rules.required && (!value || value.toString().trim() === '')) {
      error = rules.requiredMessage || `${field} is required`
    } else if (value && value.toString().trim() !== '') {
      if (rules.minLength && value.toString().length < rules.minLength) {
        error = rules.message || `${field} must be at least ${rules.minLength} characters`
      } else if (rules.maxLength && value.toString().length > rules.maxLength) {
        error = rules.message || `${field} cannot exceed ${rules.maxLength} characters`
      } else if (rules.pattern && !rules.pattern.test(value.toString())) {
        error = rules.message || `Invalid ${field} format`
      } else if (rules.min !== undefined && parseFloat(value) < rules.min) {
        error = rules.message || `${field} must be at least ${rules.min}`
      } else if (rules.max !== undefined && parseFloat(value) > rules.max) {
        error = rules.message || `${field} cannot exceed ${rules.max}`
      }
    }
    
    if (error) {
      setError(field, { type: 'manual', message: error })
    } else {
      clearError(field)
    }
    
    return !error
  }
}

// Export all validators as a single object
export default {
  validateEmail,
  validatePhone,
  validatePassword,
  validateSKU,
  validatePrice,
  validateQuantity,
  validateProductName,
  validateBatchNumber,
  validateManufacturerName,
  validateWarehouseLocation,
  validateBarcode,
  validateScheduleType,
  validateGSTHSNCode,
  validatePercentage,
  validateDecimal,
  validateSellingPrice,
  validateGSTNumber,
  validatePincode,
  validatePAN,
  validateAadhar,
  validateIFSC,
  validateURL,
  handleNumberInput,
  handleDecimalInput,
  handlePhoneInput,
  handlePincodeInput,
  handleAadharInput,
  handleGSTInput,
  handlePANInput,
  handleIFSCInput,
  handleAlphanumericInput,
  handleAlphabeticInput,
  handleMaxLength,
  validationRules,
  validateFormData,
  createValidationHandler
}