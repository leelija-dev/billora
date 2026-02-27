import React from 'react'
import Table from '../../common/Table/Table'
import StatusBadge from '../../common/StatusBadge/StatusBadge'

const StockTable = ({ logs, loading }) => {
  const columns = [
    {
      header: 'Date',
      accessor: 'createdAt',
      cell: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(value).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Product',
      accessor: 'productName',
      cell: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{value}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {row.productSku}</p>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
      cell: (value) => (
        <StatusBadge
          status={value === 'IN' ? 'Stock In' : 'Stock Out'}
          variant={value === 'IN' ? 'success' : 'danger'}
        />
      ),
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
      cell: (value, row) => (
        <span className={`text-sm font-medium ${
          row.type === 'IN' ? 'text-green-600' : 'text-red-600'
        }`}>
          {row.type === 'IN' ? '+' : '-'}{value}
        </span>
      ),
    },
    {
      header: 'Previous Stock',
      accessor: 'previousStock',
      cell: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {value}
        </span>
      ),
    },
    {
      header: 'New Stock',
      accessor: 'newStock',
      cell: (value) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {value}
        </span>
      ),
    },
    {
      header: 'Notes',
      accessor: 'notes',
      cell: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {value || '-'}
        </span>
      ),
    },
    {
      header: 'Updated By',
      accessor: 'updatedBy',
      cell: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {value || 'System'}
        </span>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      data={logs}
      loading={loading}
    />
  )
}

export default StockTable