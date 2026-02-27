import React from 'react'
import { FiEdit2, FiTrash2, FiPackage } from 'react-icons/fi'
import Table from '../../common/Table/Table'
import StatusBadge from '../../common/StatusBadge/StatusBadge'
import Button from '../../common/Button/Button'

const ProductTable = ({ products, loading, onEdit, onDelete }) => {
  const columns = [
    {
      header: 'Product',
      accessor: 'name',
      cell: (value, row) => (
        <div className="flex items-center">
          {row.image ? (
            <img
              src={row.image}
              alt={value}
              className="w-10 h-10 rounded-lg object-cover mr-3"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg mr-3 flex items-center justify-center">
              <FiPackage className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {row.sku}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      cell: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
          {value}
        </span>
      ),
    },
    {
      header: 'Price',
      accessor: 'price',
      cell: (value) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          ${value?.toFixed(2)}
        </span>
      ),
    },
    {
      header: 'Stock',
      accessor: 'stock',
      cell: (value, row) => (
        <div>
          <span className={`
            text-sm font-medium
            ${value <= row.lowStockThreshold 
              ? 'text-red-600 dark:text-red-400' 
              : 'text-gray-900 dark:text-white'
            }
          `}>
            {value}
          </span>
          {value <= row.lowStockThreshold && (
            <span className="ml-2 text-xs text-red-600 dark:text-red-400">
              Low stock
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'isActive',
      cell: (value) => (
        <StatusBadge
          status={value ? 'active' : 'inactive'}
          variant={value ? 'success' : 'default'}
        />
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
      data={products}
      loading={loading}
    />
  )
}

export default ProductTable