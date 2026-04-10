import React, { useEffect, useState } from 'react'
import { 
  FiArrowLeft,
  FiEdit2, 
  FiTrash2, 
  FiDownload,
  FiPrinter,
  FiFileText,
  FiCheckCircle,
  FiDollarSign,
  FiClock,
  FiAlertCircle,
  FiX
} from 'react-icons/fi'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useInvoiceStore } from '../../store/invoiceStore'
import Button from '../../components/common/Button/Button'
import LoadingSpinner from '../../components/common/Spinner/Spinner'
import StatusBadge from '../../components/common/StatusBadge/StatusBadge'
import { printA4Invoice, printThermalInvoice, downloadInvoicePDF } from '../../templates/PrintUtils'
import { invoiceAPI } from '../../services/invoiceService'
import { customerAPI } from '../../services/customerService'
import { storeAPI } from '../../services/storeService'
import { productsAPI } from '../../services/productsService'

const InvoiceDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { invoices, fetchInvoices } = useInvoiceStore()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🔍 Fetching invoice for ID:', id)
        
        // Use the proper invoice service
        const response = await invoiceAPI.getById(id)
        console.log('📋 Invoice response:', response)
        
        if (response.data?.status && response.data?.data) {
          const foundInvoice = response.data.data
          console.log('🎯 Found invoice:', foundInvoice)
          
          // Fetch detailed store and customer data using proper services
          Promise.all([
            // Use storeAPI with user_id (from invoice.user_id)
            storeAPI.getByUserId(foundInvoice.user_id),
            // Use customerAPI for customer details
            customerAPI.getById(foundInvoice.customer_id)
          ]).then(([storeResponse, customerResponse]) => {
            console.log('🏪 Store response:', storeResponse)
            console.log('👤 Customer response:', customerResponse)
            
            // Handle different response structures
            const storesArray = storeResponse.data?.data?.data || storeResponse.data?.data || []
            const customerData = customerResponse.data?.data || {}
            
            // Find the specific store that matches the invoice's store_id
            const storeData = storesArray.find(store => store.id === foundInvoice.store_id) || storesArray[0] || {}
            
            console.log('🏪 All stores for user:', storesArray)
            console.log('🏪 Invoice store_id:', foundInvoice.store_id)
            console.log('🏪 Selected store data:', storeData)
            console.log('👤 Processed customer data:', customerData)
            
            // Get items and packages from the new structure
            const invoiceItems = foundInvoice.invoice_items || foundInvoice.items || []
            const invoicePackages = foundInvoice.packages || []
            console.log('📦 Invoice items before product fetch:', invoiceItems)
            console.log('📦 Invoice packages:', invoicePackages)
            
            // Combine items and packages for processing
            const allItems = [...invoiceItems, ...invoicePackages.map(pkg => ({
              ...pkg,
              is_package: true
            }))]
            
            if (allItems.length > 0) {
              // Fetch product details for each item (packages don't need product fetch)
              const productPromises = allItems.map(item => {
                if (item.is_package) {
                  // For packages, return as-is with package data
                  return Promise.resolve({
                    ...item,
                    product_name: item.package_name || item.product_name || `Package #${item.package_id || item.id || 'Unknown'}`,
                    price: parseFloat(item.package_price || 0),
                    quantity: parseFloat(item.quantity || 1),
                    total_price: parseFloat(item.package_total || item.total_price || 0),
                    gst: 0, // Packages typically don't have GST
                    discount: 0 // Packages typically don't have discount
                  })
                } else {
                  // For products, fetch product details
                  return productsAPI.getById(item.product_id)
                    .then(productResponse => {
                      console.log(`📦 Product ${item.product_id} response:`, productResponse)
                      const productData = productResponse.data?.data || productResponse.data || {}
                      return {
                        ...item,
                        product_name: productData.name || item.product_name || item.name || `Product #${item.product_id || item.id || 'Unknown'}`,
                        price: parseFloat(item.price || productData.selling_price || 0),
                        quantity: parseFloat(item.quantity || item.item_count || 1),
                        total_price: parseFloat(item.total_price || item.total || 0),
                        gst: parseFloat(item.gst || productData.gst_percentage || 0),
                        discount: parseFloat(item.discount || productData.discount_percentage || 0)
                      }
                    })
                    .catch(error => {
                      console.error(`Failed to fetch product ${item.product_id}:`, error)
                      // Fallback to original item data if product fetch fails
                      return {
                        ...item,
                        product_name: item.product_name || item.name || `Product #${item.product_id || item.id || 'Unknown'}`,
                        price: parseFloat(item.price || 0),
                        quantity: parseFloat(item.quantity || item.item_count || 1),
                        total_price: parseFloat(item.total_price || item.total || 0),
                        gst: parseFloat(item.gst || 0),
                        discount: parseFloat(item.discount || 0)
                      }
                    })
                }
              })
              
              Promise.all(productPromises).then(enhancedItems => {
                console.log('📦 Enhanced items with product data:', enhancedItems)
                
                // Separate back into items and packages for display
                const displayItems = enhancedItems.filter(item => !item.is_package)
                const displayPackages = enhancedItems.filter(item => item.is_package)
                
                // Enhance the invoice with real API data
                const enhancedInvoice = {
                  ...foundInvoice,
                  invoice_number: foundInvoice.invoice_number || `INV-${foundInvoice.id}`,
                  customer_name: customerData.name || foundInvoice.customer_name || 'Walk-in Customer',
                  customer_phone: customerData.phone || foundInvoice.customer_phone || 'N/A',
                  customer_email: customerData.email || foundInvoice.customer_email || 'N/A',
                  customer_address: customerData.address ? `${customerData.address}, ${customerData.city}` : foundInvoice.customer_address || 'N/A',
                  customer_gst: customerData.gst || foundInvoice.customer_gst || 'N/A',
                  store_name: storeData.name || foundInvoice.store_name || 'Your Store Name',
                  store_address: storeData.address ? `${storeData.address}, ${storeData.city}` : foundInvoice.store_address || '123 Business Street, City',
                  store_gst: storeData.gst || foundInvoice.store_gst || 'GSTIN123456',
                  store_email: storeData.email || foundInvoice.store_email || 'store@business.com',
                  store_phone: storeData.mobile || storeData.phone || foundInvoice.store_phone || '123-456-7890',
                  items: displayItems,
                  packages: displayPackages
                }
                console.log('✅ Enhanced invoice with real product data:', enhancedInvoice)
                setInvoice(enhancedInvoice)
                setLoading(false)
              }).catch(error => {
                console.error('Failed to fetch product details:', error)
                // Fallback to original invoice data if product fetch fails
                const fallbackItems = invoiceItems.map(item =>({
                  ...item,
                  product_name: item.product_name || item.name || `Product #${item.product_id || item.id || 'Unknown'}`,
                  price: parseFloat(item.price || 0),
                  quantity: parseFloat(item.quantity || item.item_count || 1),
                  total_price: parseFloat(item.total_price || item.total || 0),
                  gst: parseFloat(item.gst || 0),
                  discount: parseFloat(item.discount || 0)
                }))
                
                const fallbackPackages = invoicePackages.map(pkg => ({
                  ...pkg,
                  product_name: pkg.package_name || `Package #${pkg.package_id || pkg.id || 'Unknown'}`,
                  price: parseFloat(pkg.package_price || 0),
                  quantity: parseFloat(pkg.quantity || 1),
                  total_price: parseFloat(pkg.package_total || 0),
                  gst: 0,
                  discount: 0
                }))
                
                const fallbackInvoice = {
                  ...foundInvoice,
                  invoice_number: foundInvoice.invoice_number || `INV-${foundInvoice.id}`,
                  customer_name: customerData.name || foundInvoice.customer_name || 'Walk-in Customer',
                  customer_phone: customerData.phone || foundInvoice.customer_phone || 'N/A',
                  customer_email: customerData.email || foundInvoice.customer_email || 'N/A',
                  customer_address: customerData.address ? `${customerData.address}, ${customerData.city}` : foundInvoice.customer_address || 'N/A',
                  customer_gst: customerData.gst || foundInvoice.customer_gst || 'N/A',
                  store_name: storeData.name || foundInvoice.store_name || 'Your Store Name',
                  store_address: storeData.address ? `${storeData.address}, ${storeData.city}` : foundInvoice.store_address || '123 Business Street, City',
                  store_gst: storeData.gst || foundInvoice.store_gst || 'GSTIN123456',
                  store_email: storeData.email || foundInvoice.store_email || 'store@business.com',
                  store_phone: storeData.mobile || storeData.phone || foundInvoice.store_phone || '123-456-7890',
                  items: fallbackItems,
                  packages: fallbackPackages
                }
                setInvoice(fallbackInvoice)
                setLoading(false)
              })
            } else {
              // No items or packages, use fallback
              const fallbackInvoice = {
                ...foundInvoice,
                invoice_number: foundInvoice.invoice_number || `INV-${foundInvoice.id}`,
                customer_name: customerData.name || foundInvoice.customer_name || 'Walk-in Customer',
                customer_phone: customerData.phone || foundInvoice.customer_phone || 'N/A',
                customer_email: customerData.email || foundInvoice.customer_email || 'N/A',
                customer_address: customerData.address ? `${customerData.address}, ${customerData.city}` : foundInvoice.customer_address || 'N/A',
                customer_gst: customerData.gst || foundInvoice.customer_gst || 'N/A',
                store_name: storeData.name || foundInvoice.store_name || 'Your Store Name',
                store_address: storeData.address ? `${storeData.address}, ${storeData.city}` : foundInvoice.store_address || '123 Business Street, City',
                store_gst: storeData.gst || foundInvoice.store_gst || 'GSTIN123456',
                store_email: storeData.email || foundInvoice.store_email || 'store@business.com',
                store_phone: storeData.mobile || storeData.phone || foundInvoice.store_phone || '123-456-7890',
                items: [],
                packages: []
              }
              setInvoice(fallbackInvoice)
              setLoading(false)
            }
          }).catch(error => {
            console.error('Failed to fetch store/customer data:', error)
            // Fallback to original invoice data if API calls fail
            setInvoice(foundInvoice)
            setLoading(false)
          })
        } else {
          console.log('❌ No invoice data in response')
          setError(`Invoice #${id} not found`)
          setLoading(false)
        }
      } catch (error) {
        console.error('Failed to fetch invoice:', error)
        setError(`Failed to load invoice #${id}`)
        setLoading(false)
      }
    }

    // Only fetch when ID changes and we don't already have the invoice
    if (id && !invoice) {
      fetchInvoice()
    }
  }, [id]) // Removed 'invoices' from dependencies

  const getStatusConfig = (status) => {
    const configs = {
      paid: { variant: 'success', icon: FiCheckCircle, label: 'Paid' },
      unpaid: { variant: 'warning', icon: FiClock, label: 'Unpaid' },
      overdue: { variant: 'danger', icon: FiAlertCircle, label: 'Overdue' },
      completed: { variant: 'success', icon: FiCheckCircle, label: 'Completed' },
      cancelled: { variant: 'default', icon: FiFileText, label: 'Cancelled' },
    }
    return configs[status] || configs.unpaid
  }

  const handleEdit = () => {
    navigate(`/invoices/edit/${invoice?.id}`)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      // In a real implementation, you would call your API
      // await invoiceAPI.deleteInvoice(invoice.id)
      navigate('/invoices')
    }
  }

  // Print handlers using separated templates
  const handlePrint = () => {
    
    printA4Invoice(invoice)
  }

  const handlePrintThermal = () => {
    printThermalInvoice(invoice)
  }

  const handleDownloadPDF = () => {
    downloadInvoicePDF(invoice, 'a4')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFileText className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Invoice</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button onClick={() => navigate('/invoices')} variant="outline">
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Invoices
          </Button>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFileText className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-2">Invoice Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The requested invoice could not be found.</p>
          <Button onClick={() => navigate('/invoices')} variant="outline">
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Invoices
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Button
                onClick={() => navigate('/invoices')}
                variant="outline"
                className="mb-4"
              >
                <FiArrowLeft className="w-4 h-4 mr-2" />
                Back to Invoices
              </Button>
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Invoice #{invoice.invoice_number || invoice.id}
                </h1>
                <StatusBadge 
                  status={invoice.status || 'unpaid'} 
                  className="text-sm"
                />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Created on {new Date(invoice.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={handlePrintThermal}
                variant="outline"
                className="flex items-center"
              >
                <FiPrinter className="w-4 h-4 mr-2" />
                Thermal Print
              </Button>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="flex items-center"
              >
                <FiPrinter className="w-4 h-4 mr-2" />
                A4 Print
              </Button>
              <Button
                onClick={handleDownloadPDF}
                className="flex items-center"
              >
                <FiDownload className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Column - Store Info, Customer Info, Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Store Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                  <FiDollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Store Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Store Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{invoice.store_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">GST Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">{invoice.store_gst || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Address</p>
                  <p className="font-medium text-gray-900 dark:text-white">{invoice.store_address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{invoice.store_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{invoice.store_phone}</p>
                </div>
              </div>
            </motion.div>

            {/* Customer Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                  <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Customer Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{invoice.customer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone</p>
                  <p className="font-medium text-gray-900 dark:text-white">{invoice.customer_phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{invoice.customer_email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">GST Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">{invoice.customer_gst || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Address</p>
                  <p className="font-medium text-gray-900 dark:text-white">{invoice.customer_address}</p>
                </div>
              </div>
            </motion.div>

            {/* Items Table */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Invoice Items</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Item</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qty</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">GST</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Disc</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {invoice.items?.map((item, index) => {
                      const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : (typeof item.price === 'number' ? item.price : 0);
                      const itemTotal = typeof item.total_price === 'string' ? parseFloat(item.total_price) : (typeof item.total_price === 'number' ? item.total_price : 0);
                      const itemGst = typeof item.gst === 'string' ? parseFloat(item.gst) : (typeof item.gst === 'number' ? item.gst : 0);
                      const itemDiscount = typeof item.discount === 'string' ? parseFloat(item.discount) : (typeof item.discount === 'number' ? item.discount : 0);
                      
                      return (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{item.product_name || `Product #${item.product_id}`}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">{item.quantity}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">₹{itemPrice.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">{itemGst || 0}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">{itemDiscount || 0}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-600 dark:text-green-400">₹{itemTotal.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Summary, Payment, Actions */}
          <div className="space-y-6">
            {/* Financial Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-3">
                  <FiDollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Summary</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="font-medium text-gray-900 dark:text-white">₹{parseFloat(invoice.total_amount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total GST:</span>
                  <span className="font-medium text-gray-900 dark:text-white">₹{invoice.items?.reduce((sum, item) => {
                    const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : (typeof item.price === 'number' ? item.price : 0);
                    const itemGst = typeof item.gst === 'string' ? parseFloat(item.gst) : (typeof item.gst === 'number' ? item.gst : 0);
                    const subtotal = itemPrice * parseFloat(item.quantity || 0);
                    return sum + (subtotal * itemGst / 100);
                  }, 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Discount:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">-₹{invoice.items?.reduce((sum, item) => {
                    const itemPrice = typeof item.price === 'string' ? parseFloat(item.price) : (typeof item.price === 'number' ? item.price : 0);
                    const itemDiscount = typeof item.discount === 'string' ? parseFloat(item.discount) : (typeof item.discount === 'number' ? item.discount : 0);
                    const subtotal = itemPrice * parseFloat(item.quantity || 0);
                    return sum + (subtotal * itemDiscount / 100);
                  }, 0).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Grand Total:</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">₹{parseFloat(invoice.total_amount || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Payment Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                  <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Details</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount Paid:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">₹{parseFloat(invoice.paid_amount || 0).toFixed(2)}</span>
                </div>
                {parseFloat(invoice.paid_amount || 0) > parseFloat(invoice.total_amount || 0) ? (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Change Returned:</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">₹{(parseFloat(invoice.paid_amount || 0) - parseFloat(invoice.total_amount || 0)).toFixed(2)}</span>
                  </div>
                ) : parseFloat(invoice.paid_amount || 0) < parseFloat(invoice.total_amount || 0) ? (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Due Amount:</span>
                    <span className="font-medium text-orange-600 dark:text-orange-400">₹{(parseFloat(invoice.total_amount || 0) - parseFloat(invoice.paid_amount || 0)).toFixed(2)}</span>
                  </div>
                ) : null}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                  <FiPrinter className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={handlePrintThermal}
                  variant="outline"
                  className="w-full flex items-center justify-center"
                >
                  <FiPrinter className="w-4 h-4 mr-2" />
                  Print Thermal (3")
                </Button>
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="w-full flex items-center justify-center"
                >
                  <FiPrinter className="w-4 h-4 mr-2" />
                  Print A4
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  className="w-full flex items-center justify-center"
                >
                  <FiDownload className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default InvoiceDetail
