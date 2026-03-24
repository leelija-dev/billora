import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiCalendar, 
  FiDownload, 
  FiFilter, 
  FiX, 
  FiBarChart2, 
  FiTrendingUp, 
  FiDollarSign, 
  FiPackage,
  FiRefreshCw,
  FiChevronDown,
  FiEye,
  FiAlertCircle,
  FiArrowLeft,
  FiPrinter,
  FiFile
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { reportsAPI } from '../../services/reportsService'
import apiClient from '../../services/apiClient'
import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import LoadingSpinner from '../../components/common/Spinner/Spinner'
import EmptyState from '../../components/common/EmptyState/EmptyState'
import Table from '../../components/common/Table/Table'
import StatusBadge from '../../components/common/StatusBadge/StatusBadge'

const Reports = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [reports, setReports] = useState([])
  const [filteredReports, setFilteredReports] = useState([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showExportDropdown, setShowExportDropdown] = useState(false)

  // Fetch today's reports by default
  const fetchReports = async (start = '', end = '') => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await reportsAPI.getReports(start, end)
      console.log('✅ Reports API Response:', response)
      
      // Handle the actual API response structure
      let reportsData = []
      
      if (response.data?.data?.salesItem_details && Array.isArray(response.data.data.salesItem_details)) {
        reportsData = response.data.data.salesItem_details
      } else if (response.data?.salesItem_details && Array.isArray(response.data.salesItem_details)) {
        reportsData = response.data.salesItem_details
      }
      
      // Enrich reports with customer and store names
      const enrichedReports = await Promise.all(
        reportsData.map(async (report) => {
          try {
            const [customerResponse, storeResponse] = await Promise.all([
              apiClient.get(`/customer/show/${report.customer_id}`),
              apiClient.get(`/store/${report.store_id}`)
            ])
            
            const customer = customerResponse.data?.data || customerResponse.data || {}
            const store = storeResponse.data?.data?.data || storeResponse.data?.data || []
            const storeData = store[0] || {}
            
            return {
              ...report,
              customer: customer,
              store: storeData,
              customer_name: customer.name || `Customer #${report.customer_id}`,
              store_name: storeData.name || `Store #${report.store_id}`
            }
          } catch (error) {
            console.error('Failed to fetch customer/store details:', error)
            return {
              ...report,
              customer_name: `Customer #${report.customer_id}`,
              store_name: `Store #${report.store_id}`
            }
          }
        })
      )
      
      setReports(enrichedReports)
      setFilteredReports(enrichedReports)
    } catch (error) {
      console.error('❌ Failed to fetch reports:', error)
      setError(error.response?.data?.message || 'Failed to fetch reports')
    } finally {
      setLoading(false)
    }
  }

  // Initialize with today's reports
  useEffect(() => {
    fetchReports()
  }, [])

  // Apply search filter
  useEffect(() => {
    if (!reports.length) return
    
    const filtered = reports.filter(report => {
      const searchLower = searchTerm.toLowerCase()
      return (
        (report.id && report.id.toString().includes(searchLower)) ||
        (report.customer_name && report.customer_name.toLowerCase().includes(searchLower)) ||
        (report.store_name && report.store_name.toLowerCase().includes(searchLower)) ||
        (report.invoice_number && report.invoice_number.toLowerCase().includes(searchLower))
      )
    })
    
    setFilteredReports(filtered)
  }, [searchTerm, reports])

  // Handle date filter
  const handleDateFilter = () => {
    fetchReports(startDate, endDate)
    setShowFilters(false)
  }

  // Clear filters
  const clearFilters = () => {
    setStartDate('')
    setEndDate('')
    setSearchTerm('')
    setShowFilters(false)
    fetchReports()
  }

  // Get today's date for default input values
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  // Calculate report statistics
  const calculateStats = () => {
    if (!filteredReports.length) return { total: 0, revenue: 0, orders: 0, products: 0, averageOrder: 0 }
    
    const stats = filteredReports.reduce((acc, report) => ({
      total: acc.total + (parseFloat(report.total_amount) || 0),
      revenue: acc.revenue + (parseFloat(report.paid_amount) || 0),
      orders: acc.orders + 1,
      products: acc.products + (parseInt(report.total_items) || 0)
    }), { total: 0, revenue: 0, orders: 0, products: 0 })
    
    return {
      ...stats,
      averageOrder: stats.orders > 0 ? stats.revenue / stats.orders : 0
    }
  }

  const stats = calculateStats()

  // Export reports in different formats
  const handleExport = (format) => {
    const data = filteredReports.map(report => [
      report.id || '',
      report.created_at ? new Date(report.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
      report.customer_name || `Customer #${report.customer_id}`,
      report.store_name || `Store #${report.store_id}`,
      report.total_amount || 0,
      report.paid_amount || 0,
      report.total_items || 0,
      report.status || 'N/A'
    ])

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
    a.download = `reports_${startDate || 'all'}_${endDate || 'all'}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Export to Excel (using CSV format as base)
  const exportToExcel = (headers, data) => {
    const csvContent = [
      headers,
      ...data
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reports_${startDate || 'all'}_${endDate || 'all'}.xls`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Export to PDF (using window.print as base)
  const exportToPDF = (headers, data) => {
    const printWindow = window.open('', '_blank')
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reports Export</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          table { border-collapse: collapse; width: 100%; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          h1 { color: #333; }
        </style>
      </head>
      <body>
        <h1>Reports Export</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        <table>
          <thead>
            <tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${data.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
          </tbody>
        </table>
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
        <title>Reports Export</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1>Reports Export</h1>
        <p>Generated on: ${new Date().toLocaleString()}</p>
        ${tableContent}
      </body>
      </html>
    `
    
    const blob = new Blob([htmlContent], { type: 'application/msword' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reports_${startDate || 'all'}_${endDate || 'all'}.doc`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Print function
  const handlePrint = () => {
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #333; margin-bottom: 20px;">Reports Dashboard</h1>
        <p style="color: #666; margin-bottom: 20px;">Generated on: ${new Date().toLocaleString()}</p>
        ${filteredReports.length === 0 ? '<p>No reports found</p>' : `
          <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
            <thead>
              <tr style="background-color: #f2f2f2;">
                <th style="border: 1px solid #ddd; padding: 8px;">Invoice ID</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Date</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Customer Name</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Store Name</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Total Amount</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Paid Amount</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Total Items</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredReports.map(report => `
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">#${report.id || ''}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${report.created_at ? new Date(report.created_at).toLocaleDateString() : 'N/A'}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${report.customer_name || `Customer #${report.customer_id}`}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${report.store_name || `Store #${report.store_id}`}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">₹${parseFloat(report.total_amount || 0).toFixed(2)}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">₹${parseFloat(report.paid_amount || 0).toFixed(2)}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${report.total_items || 0}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${report.status || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `}
      </div>
    `
    
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reports Print</title>
      </head>
      <body>
        ${printContent}
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchReports(startDate, endDate)
    setRefreshing(false)
  }

  const handleViewDetails = (report) => {
    navigate(`/reports/${report.id}`)
  }

  const columns = [
    {
      header: 'Invoice ID',
      accessor: 'id',
      cell: (value) => (
        <span className="font-mono font-medium text-primary-600 dark:text-primary-400">
          #{value}
        </span>
      ),
    },
    {
      header: 'Date',
      accessor: 'created_at',
      cell: (value) => (
        <div className="flex items-center">
          <FiCalendar className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-700 dark:text-gray-300">
            {value ? new Date(value).toLocaleDateString() : 'N/A'}
          </span>
        </div>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer_name',
      cell: (value, row) => (
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {value.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ID: {row.customer_id}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Store',
      accessor: 'store_name',
      cell: (value) => (
        <div className="flex items-center">
          <FiPackage className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-gray-700 dark:text-gray-300">{value}</span>
        </div>
      ),
    },
    {
      header: 'Total Amount',
      accessor: 'total_amount',
      cell: (value) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          ₹{parseFloat(value || 0).toFixed(2)}
        </span>
      ),
    },
    {
      header: 'Paid Amount',
      accessor: 'paid_amount',
      cell: (value, row) => {
        const paid = parseFloat(value || 0)
        const total = parseFloat(row.total_amount || 0)
        const percentage = total > 0 ? (paid / total) * 100 : 0
        
        return (
          <div className="space-y-1">
            <span className="font-medium text-green-600 dark:text-green-400">
              ₹{paid.toFixed(2)}
            </span>
            <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-green-500 rounded-full"
              />
            </div>
          </div>
        )
      },
    },
    {
      header: 'Items',
      accessor: 'total_items',
      cell: (value) => (
        <div className="flex items-center space-x-1">
          <FiPackage className="w-4 h-4 text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">{value || 0}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => {
        let status = 'completed'
        if (value === 'pending') status = 'pending'
        else if (value === 'cancelled') status = 'cancelled'
        
        return (
          <StatusBadge
            status={status}
            variant={status === 'completed' ? 'success' : status === 'pending' ? 'warning' : 'default'}
            size="sm"
          />
        )
      },
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value, row) => (
        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleViewDetails(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="View details"
          >
            <FiEye className="w-4 h-4" />
          </motion.button>
        </div>
      ),
    },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6"
    >
      {/* Header with Gradient */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Reports Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
            <FiBarChart2 className="w-4 h-4 mr-2" />
            View and analyze your business reports and analytics
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Refresh Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <FiRefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${refreshing ? 'animate-spin' : ''}`} />
          </motion.button>

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
                        <FiFile className="w-4 h-4 text-green-600 dark:text-green-400" />
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
                        <FiFile className="w-4 h-4 text-red-600 dark:text-red-400" />
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
                        <FiFile className="w-4 h-4 text-blue-600 dark:text-blue-400" />
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
                        <FiFile className="w-4 h-4 text-purple-600 dark:text-purple-400" />
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
      </motion.div>

      {/* Statistics Cards */}
      <AnimatePresence>
        {!loading && filteredReports.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold mt-2">
                    ₹{stats.revenue.toFixed(2)}
                  </p>
                </div>
                <FiDollarSign className="w-10 h-10 text-blue-200 opacity-80" />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Orders</p>
                  <p className="text-3xl font-bold mt-2">
                    {stats.orders}
                  </p>
                </div>
                <FiPackage className="w-10 h-10 text-green-200 opacity-80" />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Products Sold</p>
                  <p className="text-3xl font-bold mt-2">
                    {stats.products}
                  </p>
                </div>
                <FiBarChart2 className="w-10 h-10 text-purple-200 opacity-80" />
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Avg. Order Value</p>
                  <p className="text-3xl font-bold mt-2">
                    ₹{stats.averageOrder.toFixed(2)}
                  </p>
                </div>
                <FiTrendingUp className="w-10 h-10 text-orange-200 opacity-80" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by invoice ID, customer, or store..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-xl border transition-colors flex items-center space-x-2 ${
                showFilters 
                  ? 'bg-primary-50 border-primary-200 text-primary-600 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-400'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <FiFilter className="w-4 h-4" />
              <span>Filters</span>
              {(startDate || endDate) && (
                <span className="ml-1 w-2 h-2 bg-primary-500 rounded-full" />
              )}
            </motion.button>

            {(searchTerm || startDate || endDate) && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={clearFilters}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <FiX className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date
                    </label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      max={getTodayDate()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      max={getTodayDate()}
                    />
                  </div>
                </div>
                <div className="flex space-x-3 mt-4">
                  <Button onClick={handleDateFilter} className="flex-1">
                    Apply Filters
                  </Button>
                  <Button variant="outline" onClick={clearFilters} className="flex-1">
                    Clear All
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Reports Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading reports...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <FiAlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Error Loading Reports
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                {error}
              </p>
              <Button onClick={() => fetchReports(startDate, endDate)} className="mt-4">
                Try Again
              </Button>
            </div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <EmptyState
              icon={FiBarChart2}
              title="No reports found"
              description={searchTerm ? "No reports match your search criteria." : "Try adjusting your date filters or check back later for new reports."}
              action={searchTerm || startDate || endDate ? (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              ) : null}
            />
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <Table
                columns={columns}
                data={filteredReports}
                loading={loading}
              />
            </div>
            <div className="mt-4 text-right text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredReports.length} of {reports.length} reports
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

export default Reports