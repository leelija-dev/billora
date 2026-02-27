import React from 'react'
import { FiEye, FiDownload, FiFileText } from 'react-icons/fi'
import Table from '../../common/Table/Table'
import StatusBadge from '../../common/StatusBadge/StatusBadge'
import Button from '../../common/Button/Button'

const InvoiceTable = ({ invoices, loading, onView, onDownload }) => {
  const getInvoiceStatusColor = (status) => {
    const colors = {
      paid: 'success',
      unpaid: 'warning',
      overdue: 'danger',
      cancelled: 'default',
      refunded: 'default',
    }
    return colors[status] || 'default'
  }

  const columns = [
    {
      header: 'Invoice',
      accessor: 'invoiceNumber',
      cell: (value, row) => (
        <div className="flex items-center">
          <FiFileText className="w-4 h-4 text-gray-400 mr-2" />
          <div>
            <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">
              #{value}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(row.issueDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer',
      cell: (value) => (
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {value?.name || 'N/A'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {value?.email || ''}
          </p>
        </div>
      ),
    },
    {
      header: 'Amount',
      accessor: 'amount',
      cell: (value, row) => (
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            ${value.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {row.currency}
          </p>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => (
        <StatusBadge
          status={value}
          variant={getInvoiceStatusColor(value)}
        />
      ),
    },
    {
      header: 'Due Date',
      accessor: 'dueDate',
      cell: (value, row) => (
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {new Date(value).toLocaleDateString()}
          </p>
          {row.status === 'unpaid' && new Date(value) < new Date() && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              Overdue
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => onView(row)}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            title="View Invoice"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDownload(row)}
            className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            title="Download PDF"
            disabled={!row.pdfUrl}
          >
            <FiDownload className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      data={invoices}
      loading={loading}
    />
  )
}

export default InvoiceTable