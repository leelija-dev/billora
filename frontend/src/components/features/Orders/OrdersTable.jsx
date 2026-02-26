import React from 'react'
import { FiEye, FiEdit2 } from 'react-icons/fi'
import Table from '../../common/Table/Table'
import StatusBadge from '../../common/StatusBadge/StatusBadge'
import Button from '../../common/Button/Button'

const OrdersTable = ({ orders, loading, onView, onEdit, onStatusChange }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'info',
      completed: 'success',
      cancelled: 'danger',
      refunded: 'default',
    }
    return colors[status] || 'default'
  }

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: 'success',
      unpaid: 'warning',
      refunded: 'default',
      failed: 'danger',
    }
    return colors[status] || 'default'
  }

  const columns = [
    {
      header: 'Order',
      accessor: 'orderNumber',
      cell: (value, row) => (
        <div>
          <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">
            #{value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(row.createdAt).toLocaleDateString()}
          </p>
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
      header: 'Items',
      accessor: 'items',
      cell: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {value?.length || 0} items
        </span>
      ),
    },
    {
      header: 'Total',
      accessor: 'total',
      cell: (value) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          ${value?.toFixed(2)}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value, row) => (
        <div className="space-y-1">
          <StatusBadge
            status={value}
            variant={getStatusColor(value)}
          />
          <StatusBadge
            status={row.paymentStatus}
            variant={getPaymentStatusColor(row.paymentStatus)}
          />
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
            title="View Order"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(row)}
            className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
            title="Edit Order"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <select
            value={row.status}
            onChange={(e) => onStatusChange(value, e.target.value)}
            className="text-xs border rounded px-2 py-1 bg-transparent border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      data={orders}
      loading={loading}
    />
  )
}

export default OrdersTable