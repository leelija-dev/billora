import React, { useState } from 'react'
import { FiEdit2, FiTrash2, FiPackage, FiPlus } from 'react-icons/fi'
import Table from '../../common/Table/Table'
import StatusBadge from '../../common/StatusBadge/StatusBadge'
import Button from '../../common/Button/Button'
import StockAddModal from '../../common/CreateModals/StockAddModal'

const ProductTable = ({ products, loading, onEdit, onDelete, onAddStock }) => {
  const [showStockModal, setShowStockModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleAddStock = (stockData) => {
    if (onAddStock) {
      onAddStock(stockData)
    }
  }

  const openStockModal = (product) => {
    setSelectedProduct(product)
    setShowStockModal(true)
  }
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
        <div className="flex items-center gap-2">
          <span className={`
            text-sm font-medium
            ${value <= row.lowStockThreshold 
              ? 'text-red-600 dark:text-red-400' 
              : value === 0
              ? 'text-orange-600 dark:text-orange-400'
              : 'text-gray-900 dark:text-white'
            }
          `}>
            {value}
          </span>
          {value === 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => openStockModal(row)}
              icon={FiPlus}
              className="!px-2 !py-1 text-orange-600 border-orange-300 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-700 dark:hover:bg-orange-900/20"
              title="Add Stock"
            >
              <FiPlus className="w-3 h-3" />
            </Button>
          )}
          {value > 0 && value <= row.lowStockThreshold && (
            <span className="text-xs text-red-600 dark:text-red-400">
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
    <>
      <Table
        columns={columns}
        data={products}
        loading={loading}
      />
      
      {/* Stock Add Modal */}
      <StockAddModal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        onAddStock={handleAddStock}
        product={selectedProduct}
      />
    </>
  )
}

export default ProductTable