import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiDollarSign, 
  FiPackage, 
  FiUser,
  
  FiFileText,
  FiDownload,
  FiEdit3,
  FiMail,
  FiPhone,
  FiMapPin,
  FiPrinter,
  FiChevronDown
} from 'react-icons/fi'
import { FaStore } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { reportsAPI } from '../../services/reportsService'
import apiClient from '../../services/apiClient'
import Button from '../../components/common/Button/Button'
import LoadingSpinner from '../../components/common/Spinner/Spinner'
import StatusBadge from '../../components/common/StatusBadge/StatusBadge'

const ReportDetails = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)
  const [showExportDropdown, setShowExportDropdown] = useState(false)

  // Fetch report details
  useEffect(() => {
    const fetchReportDetails = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Get reports data
        const response = await reportsAPI.getReports()
        console.log('Reports API Response:', response)
        
        // Handle aggregate report data
        const reportData = response.data?.data || response.data || {}
        
        // Create a report object from aggregate data
        const aggregateReport = {
          id: 'summary',
          created_at: new Date().toISOString(),
          total_sales_items: reportData.total_sales_items || 0,
          total_sales_amount: reportData.total_sales_amount || 0,
          total_due: reportData.total_due || 0,
          customer_dues: reportData.customer_dues || [],
          salesItem_details: reportData.salesItem_details || [],
          filter: reportData.filter || {},
          user_id: reportData.user_id || user?.id,
          // Add fields that the UI expects
          customer_name: 'Aggregate Report',
          store_name: 'All Stores',
          customer_id: null,
          store_id: null,
          status: 'completed',
          total_amount: Math.abs(parseFloat(reportData.total_sales_amount || 0)),
          paid_amount: Math.abs(parseFloat(reportData.total_sales_amount || 0)) + Math.abs(parseFloat(reportData.total_due || 0)),
          total_items: reportData.total_sales_items || 0,
          invoice_items: reportData.salesItem_details || []
        }
        
        setReport(aggregateReport)
      } catch (error) {
        console.error('Failed to fetch report details:', error)
        setError(error.response?.data?.message || 'Failed to fetch report details')
      } finally {
        setLoading(false)
      }
    }

    fetchReportDetails()
  }, [user?.id])

  // Export report in different formats
  const handleExport = (format) => {
    if (!report) return
    
    const data = [[
      report.id || '',
      report.created_at ? new Date(report.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
      report.customer_name || `Customer #${report.customer_id}`,
      report.store_name || `Store #${report.store_id}`,
      report.total_amount || 0,
      report.paid_amount || 0,
      report.total_items || 0,
      report.status || 'N/A'
    ]]

    const headers = ['Invoice ID', 'Date', 'Customer Name', 'Store Name', 'Total Amount', 'Paid Amount', 'Total Items', 'Status']
    
    switch (format) {
      case 'excel':
        exportToExcel(headers, data)
        break
      case 'pdf':
        exportToPDF(headers, data)
        break
      case 'word':
        exportToWord(headers, data)
        break
      default:
        exportToCSV(headers, data)
    }
    
    setShowExportDropdown(false)
  }

  // Export to CSV
  const exportToCSV = (headers, data) => {
    const csvContent = [
      headers,
      ...data
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report_${report.id}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Export to Excel
  const exportToExcel = (headers, data) => {
    const csvContent = [
      headers,
      ...data
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report_${report.id}.xls`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Export to PDF
  const exportToPDF = (headers, data) => {
    const printWindow = window.open('', '_blank')
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Report Export - Invoice #${report.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          h1 { color: #333; }
          .summary { margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>Report Details - Invoice #${report.id}</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        
        <div class="summary">
          <h3>Summary</h3>
          <p><strong>Customer:</strong> ${report.customer_name}</p>
          <p><strong>Store:</strong> ${report.store_name}</p>
          <p><strong>Date:</strong> ${report.created_at ? new Date(report.created_at).toLocaleString() : 'N/A'}</p>
          <p><strong>Status:</strong> ${report.status}</p>
        </div>
        
        <table>
          <thead>
            <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${data.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
        
        ${report.invoice_items && report.invoice_items.length > 0 ? `
          <h3>Invoice Items</h3>
          <table>
            <thead>
              <tr><th>Product</th><th>Quantity</th><th>Price</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${report.invoice_items.map(item => `
                <tr>
                  <td>${item.product_name || `Product #${item.product_id}`}</td>
                  <td>${item.quantity}</td>
                  <td>₹${parseFloat(item.price || 0).toFixed(2)}</td>
                  <td>₹${parseFloat(item.total_price || item.total || 0).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}
      </body>
      </html>
    `
    
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.print()
  }

  // Export to Word
  const exportToWord = (headers, data) => {
    const tableContent = `
      <table>
        <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
        ${data.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
      </table>
    `
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Report Export - Invoice #${report.id}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1>Report Details - Invoice #${report.id}</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        
        <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px;">
          <h3>Summary</h3>
          <p><strong>Customer:</strong> ${report.customer_name}</p>
          <p><strong>Store:</strong> ${report.store_name}</p>
          <p><strong>Date:</strong> ${report.created_at ? new Date(report.created_at).toLocaleString() : 'N/A'}</p>
          <p><strong>Status:</strong> ${report.status}</p>
        </div>
        
        ${tableContent}
        
        ${report.invoice_items && report.invoice_items.length > 0 ? `
          <h3>Invoice Items</h3>
          <table>
            <thead>
              <tr><th>Product</th><th>Quantity</th><th>Price</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${report.invoice_items.map(item => `
                <tr>
                  <td>${item.product_name || `Product #${item.product_id}`}</td>
                  <td>${item.quantity}</td>
                  <td>₹${parseFloat(item.price || 0).toFixed(2)}</td>
                  <td>₹${parseFloat(item.total_price || item.total || 0).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}
      </body>
      </html>
    `
    
    const blob = new Blob([htmlContent], { type: 'application/msword' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report_${report.id}.doc`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Print function
  const handlePrint = () => {
    if (!report) return
    
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #333; margin-bottom: 20px;">Report Details - Invoice #${report.id}</h1>
        <p style="color: #666; margin-bottom: 20px;">Generated on: ${new Date().toLocaleString()}</p>
        
        <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px;">
          <h3>Summary</h3>
          <p><strong>Customer:</strong> ${report.customer_name}</p>
          <p><strong>Store:</strong> ${report.store_name}</p>
          <p><strong>Date:</strong> ${report.created_at ? new Date(report.created_at).toLocaleString() : 'N/A'}</p>
          <p><strong>Status:</strong> ${report.status}</p>
          <p><strong>Total Amount:</strong> ₹${parseFloat(report.total_amount || 0).toFixed(2)}</p>
          <p><strong>Paid Amount:</strong> ₹${parseFloat(report.paid_amount || 0).toFixed(2)}</p>
          <p><strong>Total Items:</strong> ${report.total_items || 0}</p>
        </div>
        
        ${report.invoice_items && report.invoice_items.length > 0 ? `
          <h3>Invoice Items</h3>
          <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="border: 1px solid #ddd; padding: 8px;">Product</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${report.invoice_items.map(item => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.product_name || `Product #${item.product_id}`}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">₹${parseFloat(item.price || 0).toFixed(2)}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">₹${parseFloat(item.total_price || item.total || 0).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}
      </div>
    `
    
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Report Print - Invoice #${report.id}</title>
      </head>
      <body>
        ${printContent}
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const handleBack = () => {
    navigate('/reports')
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6"
      >
        <div className=" mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading report details...</p>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (error || !report) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6"
      >
        <div className=" mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <FiFileText className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Report Not Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                {error || 'The report you are looking for does not exist or has been removed.'}
              </p>
              <Button onClick={handleBack}>
                Back to Reports
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6"
    >
      <div className=" mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleBack}
                className="p-2"
              >
                <FiArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Report Details
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Invoice #{report.id}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Print Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors flex items-center space-x-2"
              >
                <FiPrinter className="w-4 h-4" />
                <span>Print</span>
              </motion.button>

              {/* Export Dropdown */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowExportDropdown(!showExportDropdown)}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl transition-all duration-200 shadow-lg shadow-green-500/30 flex items-center space-x-2"
                >
                  <FiDownload className="w-4 h-4" />
                  <span>Export</span>
                  <FiChevronDown className={`w-4 h-4 transition-transform ${showExportDropdown ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {showExportDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50"
                    >
                      <div className="py-2">
                        <motion.button
                          whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleExport('excel')}
                          className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                        >
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <FiFileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium">Excel</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">.xls format</p>
                          </div>
                        </motion.button>

                        <motion.button
                          whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleExport('pdf')}
                          className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                        >
                          <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                            <FiFileText className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <p className="font-medium">PDF</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Printable format</p>
                          </div>
                        </motion.button>

                        <motion.button
                          whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleExport('word')}
                          className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                        >
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <FiFileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium">Word</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">.doc format</p>
                          </div>
                        </motion.button>

                        <motion.button
                          whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleExport('csv')}
                          className="w-full px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                        >
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <FiFileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium">CSV</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Data format</p>
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Report Information */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Invoice Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                <FiFileText className="w-4 h-4 mr-2" />
                Invoice ID
              </div>
              <p className="font-mono font-medium text-gray-900 dark:text-white">
                #{report.id}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                <FiCalendar className="w-4 h-4 mr-2" />
                Date
              </div>
              <p className="text-gray-900 dark:text-white">
                {report.created_at ? new Date(report.created_at).toLocaleString() : 'N/A'}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                Status
              </div>
              <StatusBadge
                status={report.status || 'completed'}
                variant={report.status === 'completed' ? 'success' : report.status === 'pending' ? 'warning' : 'default'}
              />
            </div>
          </div>
        </motion.div>

        {/* Customer and Store Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Customer Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                  <span className="text-lg font-medium text-blue-600 dark:text-blue-400">
                    {report.customer_name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {report.customer_name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID: #{report.customer_id}
                  </p>
                </div>
              </div>
              
              {report.customer?.email && (
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <FiMail className="w-4 h-4 mr-2" />
                  {report.customer.email}
                </div>
              )}
              
              {report.customer?.phone && (
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                  <FiPhone className="w-4 h-4 mr-2" />
                  {report.customer.phone}
                </div>
              )}
              
              {report.customer?.address && (
                <div className="flex items-start text-gray-600 dark:text-gray-400 text-sm">
                  <FiMapPin className="w-4 h-4 mr-2 mt-1" />
                  {report.customer.address}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Store Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 flex items-center justify-center">
                  <FaStore className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {report.store_name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID: #{report.store_id}
                  </p>
                </div>
              </div>
              
              {report.store?.address && (
                <div className="flex items-start text-gray-600 dark:text-gray-400 text-sm">
                  <FiMapPin className="w-4 h-4 mr-2 mt-1" />
                  {report.store.address}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Financial Summary */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Financial Summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                <FiDollarSign className="w-4 h-4 mr-2" />
                Total Amount
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{parseFloat(report.total_amount || 0).toFixed(2)}
              </p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
              <div className="flex items-center text-green-700 dark:text-green-400 text-sm mb-2">
                <FiDollarSign className="w-4 h-4 mr-2" />
                Paid Amount
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ₹{parseFloat(report.paid_amount || 0).toFixed(2)}
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <div className="flex items-center text-blue-700 dark:text-blue-400 text-sm mb-2">
                <FiPackage className="w-4 h-4 mr-2" />
                Total Items
              </div>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {report.total_items || 0}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Invoice Items */}
        {report.invoice_items && report.invoice_items.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Invoice Items
            </h2>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {report.invoice_items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {item.product_name || `Product #${item.product_id}`}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        ₹{parseFloat(item.price || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        ₹{parseFloat(item.total_price || item.total || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default ReportDetails