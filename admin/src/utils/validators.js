export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
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