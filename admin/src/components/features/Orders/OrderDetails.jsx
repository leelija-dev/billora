import React from 'react'
import { format } from 'date-fns'
import StatusBadge from '../../common/StatusBadge/StatusBadge'

const OrderDetails = ({ order }) => {
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

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {format(new Date(order.createdAt), 'PPP')}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Order Status</p>
          <StatusBadge
            status={order.status}
            variant={getStatusColor(order.status)}
          />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Payment Status</p>
          <StatusBadge
            status={order.paymentStatus}
            variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}
          />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
          <p className="font-medium text-gray-900 dark:text-white capitalize">
            {order.paymentMethod?.replace('_', ' ')}
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
              {order.customer.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {order.customer.email}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {order.customer.phone || 'N/A'}
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
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SKU: {item.product.sku}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                    ${(item.quantity * item.price).toFixed(2)}
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
                  ${order.subtotal?.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tax (10%):
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                  ${order.tax?.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td colSpan="3" className="px-4 py-3 text-right text-base font-bold text-gray-900 dark:text-white">
                  Total:
                </td>
                <td className="px-4 py-3 text-right text-base font-bold text-primary-600">
                  ${order.total?.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Shipping Address */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
          Shipping Address
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
          {order.shippingAddress}
        </p>
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
    </div>
  )
}

export default OrderDetails