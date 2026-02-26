import React, { useState, useEffect } from 'react'
import { FiPlus, FiSearch, FiFilter, FiDownload } from 'react-icons/fi'
import { useInventoryStore } from '../../store/inventoryStore'
import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import Table from '../../components/common/Table/Table'
import Modal from '../../components/common/Modal/Modal'
import StatusBadge from '../../components/common/StatusBadge/StatusBadge'
import Pagination from '../../components/common/Pagination/Pagination'
import DatePicker from '../../components/common/DatePicker/DatePicker'

const Inventory = () => {
  const {
    stockLogs,
    totalLogs,
    currentPage,
    pageSize,
    loading,
    filters,
    fetchStockLogs,
    addStock,
    removeStock,
    setFilters,
  } = useInventoryStore()

  const [showAddModal, setShowAddModal] = useState(false)
  const [showRemoveModal, setShowRemoveModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [showFilters, setShowFilters] = useState(false)
  const [quantity, setQuantity] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    fetchStockLogs()
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters({ search: searchTerm })
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, setFilters])

  const handleAddStock = async () => {
    if (!selectedProduct || !quantity) return
    
    await addStock({
      productId: selectedProduct.id,
      quantity: parseInt(quantity),
      notes,
    })
    
    setShowAddModal(false)
    setSelectedProduct(null)
    setQuantity('')
    setNotes('')
  }

  const handleRemoveStock = async () => {
    if (!selectedProduct || !quantity) return
    
    await removeStock({
      productId: selectedProduct.id,
      quantity: parseInt(quantity),
      notes,
    })
    
    setShowRemoveModal(false)
    setSelectedProduct(null)
    setQuantity('')
    setNotes('')
  }

  const handlePageChange = (page) => {
    fetchStockLogs(page)
  }

  const columns = [
    {
      header: 'Date',
      accessor: 'createdAt',
      cell: (value) => new Date(value).toLocaleString(),
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
          status={value}
          variant={value === 'IN' ? 'success' : 'danger'}
        />
      ),
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
      cell: (value, row) => (
        <span className={row.type === 'IN' ? 'text-green-600' : 'text-red-600'}>
          {row.type === 'IN' ? '+' : '-'}{value}
        </span>
      ),
    },
    {
      header: 'Previous Stock',
      accessor: 'previousStock',
    },
    {
      header: 'New Stock',
      accessor: 'newStock',
    },
    {
      header: 'Notes',
      accessor: 'notes',
    },
    {
      header: 'Updated By',
      accessor: 'updatedBy',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Inventory Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track stock movements and manage inventory levels
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            icon={FiDownload}
            onClick={() => {}}
          >
            Export
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            icon={FiPlus}
          >
            Add Stock
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            icon={FiFilter}
          >
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                label="Type"
                options={[
                  { value: '', label: 'All Types' },
                  { value: 'IN', label: 'Stock In' },
                  { value: 'OUT', label: 'Stock Out' },
                ]}
                value={filters.type}
                onChange={(e) => setFilters({ type: e.target.value })}
              />
              <DatePicker
                label="From Date"
                value={filters.dateFrom}
                onChange={(date) => setFilters({ dateFrom: date })}
              />
              <DatePicker
                label="To Date"
                value={filters.dateTo}
                onChange={(date) => setFilters({ dateTo: date })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Low Stock Alert */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FiPackage className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <span className="font-medium">Low Stock Alert!</span> 5 products are running low on stock.
              </p>
            </div>
          </div>
          <button className="text-sm font-medium text-yellow-700 dark:text-yellow-300 hover:text-yellow-600">
            View Products
          </button>
        </div>
      </div>

      {/* Stock Logs Table */}
      <Table
        columns={columns}
        data={stockLogs}
        loading={loading}
      />
      
      <Pagination
        currentPage={currentPage}
        totalItems={totalLogs}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />

      {/* Add Stock Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setSelectedProduct(null)
          setQuantity('')
          setNotes('')
        }}
        title="Add Stock"
        footer={
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddStock}
              disabled={!selectedProduct || !quantity}
            >
              Add Stock
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Select
            label="Select Product"
            placeholder="Choose a product"
            options={[]} // Fetch from product store
            value={selectedProduct?.id}
            onChange={(e) => {
              const product = products.find(p => p.id === parseInt(e.target.value))
              setSelectedProduct(product)
            }}
          />
          
          <Input
            label="Quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
          />
          
          <Input
            label="Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes"
          />
          
          {selectedProduct && (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current Stock: <span className="font-medium">{selectedProduct.stock}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                New Stock: <span className="font-medium text-green-600">
                  {selectedProduct.stock + (parseInt(quantity) || 0)}
                </span>
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Remove Stock Modal */}
      <Modal
        isOpen={showRemoveModal}
        onClose={() => {
          setShowRemoveModal(false)
          setSelectedProduct(null)
          setQuantity('')
          setNotes('')
        }}
        title="Remove Stock"
        footer={
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowRemoveModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleRemoveStock}
              disabled={!selectedProduct || !quantity}
            >
              Remove Stock
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Select
            label="Select Product"
            placeholder="Choose a product"
            options={[]} // Fetch from product store
            value={selectedProduct?.id}
            onChange={(e) => {
              const product = products.find(p => p.id === parseInt(e.target.value))
              setSelectedProduct(product)
            }}
          />
          
          <Input
            label="Quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity to remove"
          />
          
          <Input
            label="Reason (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Reason for removal"
          />
          
          {selectedProduct && (
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Current Stock: <span className="font-medium">{selectedProduct.stock}</span>
              </p>
              {parseInt(quantity) > selectedProduct.stock && (
                <p className="text-sm text-red-600 mt-2">
                  Error: Cannot remove more than current stock
                </p>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default Inventory