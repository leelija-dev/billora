import React, { useState, useEffect } from 'react'
import { FiPlus, FiSearch, FiFilter, FiEye } from 'react-icons/fi'
import { useOrderStore } from '../../store/orderStore'
import Button from '../../components/common/Button/Button'
import Input from '../../components/common/Input/Input'
import Table from '../../components/common/Table/Table'
import Modal from '../../components/common/Modal/Modal'
import StatusBadge from '../../components/common/StatusBadge/StatusBadge'
import Pagination from '../../components/common/Pagination/Pagination'
import OrderForm from '../../components/features/Orders/OrderForm'
import OrderDetails from '../../components/features/Orders/OrderDetails'

const Orders = () => {
  const {
    orders,
    totalOrders,
    currentPage,
    pageSize,
    loading,
    filters,
    fetchOrders,
    updateOrderStatus,
    setFilters,
  } = useOrderStore()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [searchTerm, setSearchTerm] = useState(filters.search || '')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters({ search: searchTerm })
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, setFilters])

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
  }

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus)
  }

  const handlePageChange = (page) => {
    fetchOrders(page)
  }

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

  const columns = [
    {
      header: 'Order ID',
      accessor: 'orderNumber',
      cell: (value) => (
        <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
          #{value}
        </span>
      ),
    },
    {
      header: 'Customer',
      accessor: 'customer',
      cell: (value, row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{value.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{value.email}</p>
        </div>
      ),
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      cell: (value) => new Date(value).toLocaleDateString(),
    },
    {
      header: 'Items',
      accessor: 'items',
      cell: (value) => value.length,
    },
    {
      header: 'Total',
      accessor: 'total',
      cell: (value) => `$${value.toFixed(2)}`,
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => (
        <StatusBadge
          status={value}
          variant={getStatusColor(value)}
        />
      ),
    },
    {
      header: 'Payment',
      accessor: 'paymentStatus',
      cell: (value) => (
        <StatusBadge
          status={value}
          variant={value === 'paid' ? 'success' : 'warning'}
        />
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewOrder(row)}
            className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            title="View Details"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <select
            value={row.status}
            onChange={(e) => handleStatusChange(value, e.target.value)}
            className="text-xs border rounded px-2 py-1 bg-transparent"
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track customer orders
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          icon={FiPlus}
        >
          Create Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">156</p>
          <p className="text-xs text-green-600 mt-2">+12% from last month</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">23</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Processing</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">45</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">88</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search orders by ID or customer..."
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
                label="Status"
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'processing', label: 'Processing' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' },
                ]}
                value={filters.status}
                onChange={(e) => setFilters({ status: e.target.value })}
              />
              <Select
                label="Payment Status"
                options={[
                  { value: '', label: 'All' },
                  { value: 'paid', label: 'Paid' },
                  { value: 'unpaid', label: 'Unpaid' },
                  { value: 'refunded', label: 'Refunded' },
                ]}
                value={filters.paymentStatus}
                onChange={(e) => setFilters({ paymentStatus: e.target.value })}
              />
              <Input
                label="Date From"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ dateFrom: e.target.value })}
              />
              <Input
                label="Date To"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ dateTo: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <Table
        columns={columns}
        data={orders}
        loading={loading}
      />
      
      <Pagination
        currentPage={currentPage}
        totalItems={totalOrders}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />

      {/* Create Order Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Order"
        size="lg"
      >
        <OrderForm onClose={() => setShowCreateModal(false)} />
      </Modal>

      {/* Order Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedOrder(null)
        }}
        title={`Order #${selectedOrder?.orderNumber}`}
        size="lg"
      >
        {selectedOrder && (
          <OrderDetails order={selectedOrder} />
        )}
      </Modal>
    </div>
  )
}

export default Orders