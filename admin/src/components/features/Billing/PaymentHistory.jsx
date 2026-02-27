import React from 'react'
import { motion } from 'framer-motion'
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiRefreshCw,
  FiDownload,
  FiEye,
  FiFileText
} from 'react-icons/fi'
import StatusBadge from '../../common/StatusBadge/StatusBadge'
import Table from '../../common/Table/Table'

const PaymentHistory = ({ payments, loading, onViewInvoice, onDownloadInvoice }) => {
  const getStatusConfig = (status) => {
    const configs = {
      succeeded: { variant: 'success', icon: FiCheckCircle, label: 'Succeeded' },
      pending: { variant: 'warning', icon: FiClock, label: 'Pending' },
      failed: { variant: 'danger', icon: FiXCircle, label: 'Failed' },
      refunded: { variant: 'info', icon: FiRefreshCw, label: 'Refunded' },
    }
    return configs[status] || configs.pending
  }

  const columns = [
    {
      header: 'Date',
      accessor: 'createdAt',
      cell: (value) => (
        <div className="text-sm text-gray-900 dark:text-white">
          {new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      cell: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {value || 'Payment'}
          </p>
          {row.invoiceNumber && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Invoice #{row.invoiceNumber}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Amount',
      accessor: 'amount',
      cell: (value, row) => (
        <p className="font-semibold text-gray-900 dark:text-white">
          {row.currency || 'USD'} ${value?.toFixed(2)}
        </p>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => {
        const config = getStatusConfig(value)
        return (
          <StatusBadge
            status={config.label}
            variant={config.variant}
            icon={config.icon}
          />
        )
      },
    },
    {
      header: 'Payment Method',
      accessor: 'paymentMethod',
      cell: (value) => (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {value?.brand ? (
            <span>
              {value.brand} •••• {value.last4}
            </span>
          ) : (
            <span className="text-gray-400">N/A</span>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (_, row) => (
        <div className="flex items-center space-x-2">
          {row.invoiceId && (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewInvoice(row)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                title="View Invoice"
              >
                <FiEye className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDownloadInvoice(row)}
                className="p-1.5 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                title="Download Invoice"
              >
                <FiDownload className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </div>
      ),
    },
  ]

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
        <FiFileText className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
          No payment history
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Your payment history will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <Table columns={columns} data={payments} />
    </div>
  )
}

export default PaymentHistory