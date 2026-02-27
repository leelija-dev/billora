import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSave, FiX, FiPlus, FiTrash2, FiUser, FiCalendar, FiDollarSign, FiFileText } from 'react-icons/fi'
import Input from '../../common/Input/Input'
import Button from '../../common/Button/Button'
import Select from '../../common/Select/Select'

const InvoiceForm = ({ initialData, mode, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerAddress: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'unpaid',
    currency: 'USD',
    notes: '',
    terms: '',
    items: [
      {
        id: Date.now(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ],
    subtotal: 0,
    taxRate: 0,
    tax: 0,
    discount: 0,
    total: 0,
  })

  const [errors, setErrors] = useState({})
  const [customers, setCustomers] = useState([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [searchCustomer, setSearchCustomer] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        items: initialData.items || formData.items,
        issueDate: initialData.issueDate?.split('T')[0] || formData.issueDate,
        dueDate: initialData.dueDate?.split('T')[0] || formData.dueDate,
      })
    }
  }, [initialData])

  useEffect(() => {
    // Fetch customers for dropdown
    const fetchCustomers = async () => {
      setLoadingCustomers(true)
      try {
        // Replace with your actual API call
        const response = await fetch('/api/customers')
        const data = await response.json()
        setCustomers(data)
      } catch (error) {
        console.error('Failed to fetch customers:', error)
      } finally {
        setLoadingCustomers(false)
      }
    }
    fetchCustomers()
  }, [])

  useEffect(() => {
    calculateTotals()
  }, [formData.items, formData.taxRate, formData.discount])

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.amount || 0), 0)
    const tax = (subtotal * (formData.taxRate || 0)) / 100
    const total = subtotal + tax - (formData.discount || 0)

    setFormData(prev => ({
      ...prev,
      subtotal,
      tax,
      total: Math.max(total, 0),
    }))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items]
    updatedItems[index][field] = value

    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = field === 'quantity' ? value : updatedItems[index].quantity
      const unitPrice = field === 'unitPrice' ? value : updatedItems[index].unitPrice
      updatedItems[index].amount = (parseFloat(quantity) || 0) * (parseFloat(unitPrice) || 0)
    }

    setFormData(prev => ({ ...prev, items: updatedItems }))
  }

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now(),
          description: '',
          quantity: 1,
          unitPrice: 0,
          amount: 0,
        },
      ],
    }))
  }

  const handleRemoveItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }))
    }
  }

  const handleCustomerSelect = (customerId) => {
    const customer = customers.find(c => c.id === customerId)
    
    setFormData(prev => ({
      ...prev,
      customerId,
      customerName: customer?.name || '',
      customerEmail: customer?.email || '',
      customerAddress: customer?.address || '',
    }))

    if (errors.customerId) {
      setErrors(prev => ({ ...prev, customerId: '' }))
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchCustomer.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchCustomer.toLowerCase())
  )

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.customerId) {
      newErrors.customerId = 'Customer is required'
    }
    
    if (!formData.invoiceNumber?.trim()) {
      newErrors.invoiceNumber = 'Invoice number is required'
    }
    
    if (!formData.issueDate) {
      newErrors.issueDate = 'Issue date is required'
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required'
    } else if (new Date(formData.dueDate) < new Date(formData.issueDate)) {
      newErrors.dueDate = 'Due date must be after issue date'
    }

    let hasValidItem = false
    formData.items.forEach((item, index) => {
      if (!item.description?.trim()) {
        newErrors[`item_${index}_description`] = 'Description is required'
      }
      if (item.quantity <= 0) {
        newErrors[`item_${index}_quantity`] = 'Quantity must be greater than 0'
      } else {
        hasValidItem = true
      }
      if (item.unitPrice < 0) {
        newErrors[`item_${index}_price`] = 'Price cannot be negative'
      }
    })

    if (!hasValidItem) {
      newErrors.items = 'At least one valid item is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
            <FiFileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {mode === 'add' ? 'Create New Invoice' : 'Edit Invoice'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {mode === 'add' ? 'Fill in the details to create a new invoice' : `Editing invoice #${initialData?.invoiceNumber}`}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            icon={FiX}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={FiSave}
            loading={isSubmitting}
          >
            {mode === 'add' ? 'Create Invoice' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer Info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
              <FiUser className="w-4 h-4 mr-2" />
              Customer Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Customer
                </label>
                <Select
                  value={formData.customerId}
                  onChange={(e) => handleCustomerSelect(e.target.value)}
                  options={[
                    { value: '', label: 'Choose a customer...' },
                    ...filteredCustomers.map(c => ({ value: c.id, label: c.name })),
                  ]}
                  error={errors.customerId}
                  loading={loadingCustomers}
                />
              </div>

              {!formData.customerId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quick Customer Search
                  </label>
                  <Input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchCustomer}
                    onChange={(e) => setSearchCustomer(e.target.value)}
                    className="mb-2"
                  />
                  {searchCustomer && filteredCustomers.length > 0 && (
                    <div className="max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg">
                      {filteredCustomers.map(customer => (
                        <button
                          key={customer.id}
                          type="button"
                          onClick={() => handleCustomerSelect(customer.id)}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-xs text-gray-500">{customer.email}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {formData.customerName && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500"
                >
                  <p className="font-medium text-gray-900 dark:text-white">{formData.customerName}</p>
                  {formData.customerEmail && (
                    <p className="text-sm text-gray-500 dark:text-gray-300">{formData.customerEmail}</p>
                  )}
                  {formData.customerAddress && (
                    <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">{formData.customerAddress}</p>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column - Invoice Details */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
              <FiFileText className="w-4 h-4 mr-2" />
              Invoice Details
            </h3>

            <div className="space-y-4">
              <Input
                label="Invoice Number"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleChange}
                placeholder="INV-2024-001"
                error={errors.invoiceNumber}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Issue Date"
                  name="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={handleChange}
                  error={errors.issueDate}
                  required
                />

                <Input
                  label="Due Date"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  error={errors.dueDate}
                  required
                />
              </div>

              <Select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'unpaid', label: 'Unpaid' },
                  { value: 'paid', label: 'Paid' },
                  { value: 'overdue', label: 'Overdue' },
                  { value: 'cancelled', label: 'Cancelled' },
                  { value: 'refunded', label: 'Refunded' },
                ]}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Financial Details */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center">
              <FiDollarSign className="w-4 h-4 mr-2" />
              Financial Details
            </h3>

            <div className="space-y-4">
              <Select
                label="Currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                options={[
                  { value: 'USD', label: 'USD ($)' },
                  { value: 'EUR', label: 'EUR (€)' },
                  { value: 'GBP', label: 'GBP (£)' },
                  { value: 'JPY', label: 'JPY (¥)' },
                  { value: 'CAD', label: 'CAD ($)' },
                  { value: 'AUD', label: 'AUD ($)' },
                ]}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Tax Rate (%)"
                  name="taxRate"
                  type="number"
                  value={formData.taxRate}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                />

                <Input
                  label="Discount"
                  name="discount"
                  type="number"
                  value={formData.discount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Invoice Items
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddItem}
            icon={FiPlus}
          >
            Add Item
          </Button>
        </div>

        {errors.items && (
          <p className="text-sm text-red-600 dark:text-red-400 mb-3">{errors.items}</p>
        )}

        {/* Items Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 mb-2 px-3">
          <div className="col-span-5 text-xs font-medium text-gray-500 dark:text-gray-400">Description</div>
          <div className="col-span-2 text-xs font-medium text-gray-500 dark:text-gray-400">Quantity</div>
          <div className="col-span-2 text-xs font-medium text-gray-500 dark:text-gray-400">Unit Price</div>
          <div className="col-span-2 text-xs font-medium text-gray-500 dark:text-gray-400">Amount</div>
          <div className="col-span-1"></div>
        </div>

        <div className="space-y-3">
          {formData.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start bg-white dark:bg-gray-600 p-3 rounded-lg"
            >
              <div className="md:col-span-5">
                <Input
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  error={errors[`item_${index}_description`]}
                  className="w-full"
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="1"
                  error={errors[`item_${index}_quantity`]}
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  type="number"
                  placeholder="Price"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  error={errors[`item_${index}_price`]}
                />
              </div>
              <div className="md:col-span-2">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={item.amount.toFixed(2)}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-500"
                />
              </div>
              <div className="md:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  disabled={formData.items.length === 1}
                  className={`p-2 rounded-lg transition-colors ${
                    formData.items.length === 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                  }`}
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-500">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Subtotal:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formData.currency} {formData.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Tax ({formData.taxRate}%):</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formData.currency} {formData.tax.toFixed(2)}
                </span>
              </div>
              {formData.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Discount:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    -{formData.currency} {formData.discount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-500">
                <span className="text-gray-900 dark:text-white">Total:</span>
                <span className="text-primary-600 dark:text-primary-400">
                  {formData.currency} {formData.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notes and Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Additional notes for the customer..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Terms & Conditions
          </label>
          <textarea
            name="terms"
            value={formData.terms}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Payment terms, late fees, etc..."
          />
        </div>
      </div>

      {/* Metadata for edit mode */}
      {mode === 'edit' && initialData && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Invoice ID</p>
              <p className="font-medium text-gray-900 dark:text-white">{initialData.id}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Created</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(initialData.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Last Updated</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {new Date(initialData.updatedAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Created By</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {initialData.createdBy || 'System'}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.form>
  )
}

export default InvoiceForm