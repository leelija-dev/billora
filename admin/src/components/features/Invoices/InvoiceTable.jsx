import React from 'react'
import { motion } from 'framer-motion'
import { 
  FiEye, 
  FiDownload, 
  FiEdit2, 
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiFileText 
} from 'react-icons/fi'
import Table from '../../common/Table/Table'
import StatusBadge from '../../common/StatusBadge/StatusBadge'

const InvoiceTable = ({ 
  invoices, 
  loading, 
  onView, 
  onDownload,
  onEdit,
  onMarkPaid 
}) => {
  const getStatusConfig = (status) => {
    const configs = {
      completed: { variant: 'success', icon: FiCheckCircle, label: 'Completed' },
      paid: { variant: 'success', icon: FiCheckCircle, label: 'Paid' },
      unpaid: { variant: 'warning', icon: FiClock, label: 'Unpaid' },
      overdue: { variant: 'danger', icon: FiAlertCircle, label: 'Overdue' },
      draft: { variant: 'default', icon: FiFileText, label: 'Draft' },
      cancelled: { variant: 'default', icon: FiFileText, label: 'Cancelled' },
      refunded: { variant: 'info', icon: FiFileText, label: 'Refunded' },
    }
    return configs[status] || configs.unpaid
  }

  const columns = [
    {
      header: 'Invoice',
      accessor: 'id',
      cell: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">#{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(row.created_at).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer_id',
      cell: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {row.customer_name || `Customer #${value}`}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ID: #{value}
          </p>
        </div>
      ),
    },
    {
      header: 'Store',
      accessor: 'store_id',
      cell: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {row.store_name || `Store #${value}`}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ID: #{value}
          </p>
        </div>
      ),
    },
    {
      header: 'Total Amount',
      accessor: 'total_amount',
      cell: (value, row) => (
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            ₹{parseFloat(value || 0).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Paid: ₹{parseFloat(row.paid_amount || 0).toFixed(2)}
          </p>
        </div>
      ),
    },
    {
      header: 'Items',
      accessor: 'total_items',
      cell: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{value || 0} items</p>
          {row.invoice_items && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {row.invoice_items.length} products
            </p>
          )}
        </div>
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
      header: 'Actions',
      accessor: 'actions',
      cell: (_, row) => (
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onView(row)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="View Invoice"
          >
            <FiEye className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(row)}
            className="p-1.5 text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
            title="Edit Invoice"
          >
            <FiEdit2 className="w-4 h-4" />
          </motion.button>
        </div>
      ),
    },
  ]

  return (
    <Table 
      columns={columns} 
      data={invoices} 
      loading={loading}
      onRowClick={onView}
      className="cursor-pointer"
    />
  )
}

export default InvoiceTable