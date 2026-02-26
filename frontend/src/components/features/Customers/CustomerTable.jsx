import React from 'react'
import { FiEdit2, FiTrash2, FiMail, FiPhone, FiUser } from 'react-icons/fi'
import Table from '../../common/Table/Table'
import StatusBadge from '../../common/StatusBadge/StatusBadge'
import Button from '../../common/Button/Button'

const CustomerTable = ({ customers, loading, onEdit, onDelete, onView }) => {
  const columns = [
    {
      header: 'Customer',
      accessor: 'name',
      cell: (value, row) => (
        <div className="flex items-center">
          {row.avatar ? (
            <img
              src={row.avatar}
              alt={value}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mr-3 flex items-center justify-center">
              <FiUser className="w-5 h-5 text-white" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <FiMail className="w-3 h-3 mr-1" />
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact',
      accessor: 'phone',
      cell: (value, row) => (
        <div className="space-y-1">
          {value && (
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <FiPhone className="w-3 h-3 mr-1" />
              {value}
            </p>
          )}
          {row.company && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {row.company}
            </p>
          )}
        </div>
      ),
    },
    {
      header: 'Total Orders',
      accessor: 'totalOrders',
      cell: (value) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {value || 0}
        </span>
      ),
    },
    {
      header: 'Total Spent',
      accessor: 'totalSpent',
      cell: (value) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          ${value?.toFixed(2) || '0.00'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => (
        <StatusBadge
          status={value || 'active'}
          variant={value === 'active' ? 'success' : 'default'}
        />
      ),
    },
    {
      header: 'Last Order',
      accessor: 'lastOrderDate',
      cell: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {value ? new Date(value).toLocaleDateString() : 'Never'}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value, row) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(row)}
            icon={FiEdit2}
            className="!px-2"
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(value)}
            icon={FiTrash2}
            className="!px-2"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      data={customers}
      loading={loading}
    />
  )
}

export default CustomerTable