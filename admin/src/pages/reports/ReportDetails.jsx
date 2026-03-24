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
  FiMapPin
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

  // Fetch report details
  useEffect(() => {
    const fetchReportDetails = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // First get all reports to find the specific one
        const response = await reportsAPI.getReports()
        console.log('✅ Reports API Response:', response)
        
        let reportsData = []
        
        if (response.data?.data?.salesItem_details && Array.isArray(response.data.data.salesItem_details)) {
          reportsData = response.data.data.salesItem_details
        } else if (response.data?.salesItem_details && Array.isArray(response.data.salesItem_details)) {
          reportsData = response.data.salesItem_details
        }
        
        // Find the specific report by ID
        const foundReport = reportsData.find(r => r.id.toString() === id)
        
        if (foundReport) {
          // Enrich with customer and store details
          try {
            const [customerResponse, storeResponse] = await Promise.all([
              apiClient.get(`/customer/show/${foundReport.customer_id}`),
              apiClient.get(`/store/${foundReport.store_id}`)
            ])
            
            const customer = customerResponse.data?.data || customerResponse.data || {}
            const store = storeResponse.data?.data?.data || storeResponse.data?.data || []
            const storeData = store[0] || {}
            
            const enrichedReport = {
              ...foundReport,
              customer: customer,
              store: storeData,
              customer_name: customer.name || `Customer #${foundReport.customer_id}`,
              store_name: storeData.name || `Store #${foundReport.store_id}`
            }
            
            setReport(enrichedReport)
          } catch (error) {
            console.error('Failed to fetch customer/store details:', error)
            setReport({
              ...foundReport,
              customer_name: `Customer #${foundReport.customer_id}`,
              store_name: `Store #${foundReport.store_id}`
            })
          }
        } else {
          setError('Report not found')
        }
      } catch (error) {
        console.error('❌ Failed to fetch report details:', error)
        setError(error.response?.data?.message || 'Failed to fetch report details')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchReportDetails()
    }
  }, [id])

  const handleExport = () => {
    if (!report) return
    
    const csvContent = [
      ['Invoice ID', 'Date', 'Customer Name', 'Store Name', 'Total Amount', 'Paid Amount', 'Total Items', 'Status'],
      [
        report.id || '',
        report.created_at ? new Date(report.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
        report.customer_name || `Customer #${report.customer_id}`,
        report.store_name || `Store #${report.store_id}`,
        report.total_amount || 0,
        report.paid_amount || 0,
        report.total_items || 0,
        report.status || 'N/A'
      ]
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report_${report.id}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors flex items-center space-x-2"
              >
                <FiDownload className="w-4 h-4" />
                <span>Export</span>
              </motion.button>
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
