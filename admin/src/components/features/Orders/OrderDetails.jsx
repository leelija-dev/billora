import React, { useState } from 'react'
import { format } from 'date-fns'
import StatusBadge from '../../common/StatusBadge/StatusBadge'
import Button from '../../common/Button/Button'
import Select from '../../common/Select/Select'

const OrderDetails = ({ order, onUpdateOrder, onUpdatePayment, onPrintInvoice }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editStatus, setEditStatus] = useState(order.order_status)
  const [editPaymentStatus, setEditPaymentStatus] = useState(order.payment_status)

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

  const safeFormatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date value:', dateString)
        return 'Invalid Date'
      }
      return format(date, 'PPP')
    } catch (error) {
      console.error('Date formatting error:', error, 'Input:', dateString)
      return 'Invalid Date'
    }
  }

  const handleStatusUpdate = async () => {
    if (editStatus !== order.order_status) {
      try {
        await onUpdateOrder(order.id, editStatus)
        order.order_status = editStatus
        setIsEditing(false)
      } catch (error) {
        console.error('Error updating order status:', error)
      }
    }
  }

  const handlePaymentStatusUpdate = async () => {
    if (editPaymentStatus !== order.payment_status) {
      try {
        await onUpdatePayment(order.id, editPaymentStatus)
        order.payment_status = editPaymentStatus
        setIsEditing(false)
      } catch (error) {
        console.error('Error updating payment status:', error)
      }
    }
  }

  const handlePrintInvoice = (type) => {
    if (onPrintInvoice) {
      onPrintInvoice(order, type)
    }
  }

  const orderStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'ready_to_serve', label: 'Ready to Serve' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ]

  const paymentStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
  ]

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {safeFormatDate(order.created_at)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Order Status</p>
          <StatusBadge
            status={order.order_status}
            variant={getStatusColor(order.order_status)}
          />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Payment Status</p>
          <StatusBadge
            status={order.payment_status}
            variant={order.payment_status === 'paid' ? 'success' : 'warning'}
          />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
          <p className="font-medium text-gray-900 dark:text-white capitalize">
            {order.payment_method?.replace('_', ' ')}
          </p>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Customer Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {order.customer_name}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {order.customer_phone || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Order Items
        </h3>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Product
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Quantity
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Price
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {order.items?.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.product?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SKU: {item.product?.sku}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                    ${parseFloat(item.price || 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                    ${(parseFloat(item.quantity || 0) * parseFloat(item.price || 0)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subtotal:
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                  ${parseFloat(order.total_amount || 0).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tax (10%):
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                  ${(parseFloat(order.total_amount || 0) * 0.1).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td colSpan="3" className="px-4 py-3 text-right text-base font-bold text-gray-900 dark:text-white">
                  Total:
                </td>
                <td className="px-4 py-3 text-right text-base font-bold text-primary-600">
                  ${parseFloat(order.total_amount || 0).toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Order Notes */}
      {order.notes && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Order Notes
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            {order.notes}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-6">
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="outline"
          className="flex-1"
        >
          {isEditing ? 'Cancel' : 'Update Order'}
        </Button>
        
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="outline"
          className="flex-1"
        >
          {isEditing ? 'Cancel' : 'Update Payment'}
        </Button>
        
        <Button
          onClick={() => handlePrintInvoice('a4')}
          variant="primary"
          className="flex-1"
        >
          Print A4 Invoice
        </Button>
        
        <Button
          onClick={() => handlePrintInvoice('thermal')}
          variant="secondary"
          className="flex-1"
        >
          Print Thermal
        </Button>
      </div>

      {/* Edit Status Section */}
      {isEditing && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Update Order Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order Status
              </label>
              <Select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                options={orderStatusOptions}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Status
              </label>
              <Select
                value={editPaymentStatus}
                onChange={(e) => setEditPaymentStatus(e.target.value)}
                options={paymentStatusOptions}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleStatusUpdate}
              variant="primary"
              disabled={editStatus === order.order_status && editPaymentStatus === order.payment_status}
            >
              Save Changes
            </Button>
            <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

          </div>
  )
}

export default OrderDetails
