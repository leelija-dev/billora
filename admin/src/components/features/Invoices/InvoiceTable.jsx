import React from 'react'
import { motion } from 'framer-motion'
import { 
  FiEye, 
  FiDownload, 
  FiEdit2, 
  FiTrash2, 
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
  onDelete,
  onMarkPaid 
}) => {
  const getStatusConfig = (status) => {
    const configs = {
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
      accessor: 'invoiceNumber',
      cell: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">#{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(row.issueDate).toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customerName',
      cell: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{value || 'N/A'}</p>
          {row.customerEmail && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{row.customerEmail}</p>
          )}
        </div>
      ),
    },
    {
      header: 'Amount',
      accessor: 'amount',
      cell: (value, row) => (
        <p className="font-semibold text-gray-900 dark:text-white">
          {row.currency} {value?.toFixed(2)}
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
      header: 'Due Date',
      accessor: 'dueDate',
      cell: (value, row) => {
        const dueDate = new Date(value)
        const today = new Date()
        const isOverdue = row.status !== 'paid' && dueDate < today
        
        return (
          <div className="flex items-center">
            <span className={`text-sm ${
              isOverdue 
                ? 'text-red-600 dark:text-red-400 font-medium' 
                : 'text-gray-600 dark:text-gray-300'
            }`}>
              {dueDate.toLocaleDateString()}
            </span>
            {isOverdue && (
              <FiAlertCircle className="w-4 h-4 ml-1 text-red-500" />
            )}
          </div>
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
            onClick={() => onDownload(row)}
            className="p-1.5 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/20 rounded-lg transition-colors"
            title="Download PDF"
          >
            <FiDownload className="w-4 h-4" />
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
          
          {row.status !== 'paid' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onMarkPaid(row)}
              className="p-1.5 text-purple-600 hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
              title="Mark as Paid"
            >
              <FiCheckCircle className="w-4 h-4" />
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(row)}
            className="p-1.5 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete Invoice"
          >
            <FiTrash2 className="w-4 h-4" />
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