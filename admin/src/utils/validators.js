export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  // Phone number: exactly 10 digits for Indian numbers
  const re = /^[0-9]{10}$/
  return re.test(phone)
}

export const validatePassword = (password) => {
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return re.test(password)
}

export const validateSKU = (sku) => {
  const re = /^[A-Z0-9-]+$/
  return re.test(sku)
}

export const validatePrice = (price) => {
  return !isNaN(price) && price >= 0
}

export const validateQuantity = (quantity) => {
  return Number.isInteger(quantity) && quantity >= 0
}

// Product-specific validators based on database structure
export const validateProductName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 255
}

export const validateBatchNumber = (batchNumber) => {
  // Max 100 characters
  return !batchNumber || batchNumber.length <= 100
}

export const validateManufacturerName = (name) => {
  // Max 255 characters
  return !name || name.length <= 255
}

export const validateWarehouseLocation = (location) => {
  // Max 100 characters
  return !location || location.length <= 100
}

export const validateBarcode = (barcode) => {
  // Max 100 characters
  return !barcode || barcode.length <= 100
}

export const validateScheduleType = (type) => {
  // H, X, G, etc. - single character or short code
  return !type || /^[A-Z]{1,5}$/.test(type)
}

export const validateGSTHSNCode = (code) => {
  // Numeric only, up to 12 digits
  return !code || /^[0-9]{1,12}$/.test(code)
}

export const validatePercentage = (value) => {
  // Percentage between 0 and 100
  const num = parseFloat(value)
  return !isNaN(num) && num >= 0 && num <= 100
}

export const validateDecimal = (value, maxDecimalPlaces = 2) => {
  const num = parseFloat(value)
  if (isNaN(num)) return false
  const decimalStr = num.toString()
  const decimalPart = decimalStr.split('.')[1]
  return !decimalPart || decimalPart.length <= maxDecimalPlaces
}

// Input handlers to prevent invalid input
export const handleNumberInput = (e) => {
  const value = e.target.value
  // Remove any non-numeric characters
  e.target.value = value.replace(/[^0-9]/g, '')
}

export const handleDecimalInput = (e, maxDecimalPlaces = 2) => {
  const value = e.target.value
  // Allow only numbers and decimal point
  const cleaned = value.replace(/[^0-9.]/g, '')
  // Ensure only one decimal point
  const parts = cleaned.split('.')
  if (parts.length > 2) {
    e.target.value = parts[0] + '.' + parts.slice(1).join('')
  } else {
    e.target.value = cleaned
  }
  // Limit decimal places
  if (parts[1] && parts[1].length > maxDecimalPlaces) {
    e.target.value = parts[0] + '.' + parts[1].substring(0, maxDecimalPlaces)
  }
}

export const handlePhoneInput = (e) => {
  const value = e.target.value
  // Allow only numbers, max 10 digits
  e.target.value = value.replace(/[^0-9]/g, '').substring(0, 10)
}

export const handleAlphanumericInput = (e) => {
  const value = e.target.value
  // Allow only alphanumeric characters, spaces, and common symbols
  e.target.value = value.replace(/[^a-zA-Z0-9\s\-_]/g, '')
}

export const handleMaxLength = (e, maxLength) => {
  if (e.target.value.length > maxLength) {
    e.target.value = e.target.value.substring(0, maxLength)
  }
}

// Validation rules object for easy reference
export const validationRules = {
  // Product fields
  productName: { minLength: 2, maxLength: 255 },
  sku: { pattern: /^[A-Z0-9-]+$/, maxLength: 100 },
  batchNumber: { maxLength: 100 },
  manufacturerName: { maxLength: 255 },
  warehouseLocation: { maxLength: 100 },
  barcode: { maxLength: 100 },
  scheduleType: { pattern: /^[A-Z]{1,5}$/, maxLength: 5 },
  gstHsnCode: { pattern: /^[0-9]{1,12}$/, maxLength: 12 },
  
  // Numeric fields
  price: { min: 0, maxDecimalPlaces: 2 },
  percentage: { min: 0, max: 100, maxDecimalPlaces: 2 },
  quantity: { min: 0, integer: true },
  
  // Contact fields
  phone: { minLength: 10, maxLength: 10, pattern: /^[0-9]{10}$/ },
  email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  
  // General
  description: { maxLength: 5000 },
  shortDescription: { maxLength: 500 },
}