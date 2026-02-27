import React from 'react'
import Modal from '../../common/Modal/Modal'
import Button from '../../common/Button/Button'
import StatusBadge from '../../common/StatusBadge/StatusBadge'
import { FiDownload, FiMail, FiPrinter } from 'react-icons/fi'

const InvoiceModal = ({ isOpen, onClose, invoice }) => {
  if (!invoice) return null

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Invoice #${invoice.invoiceNumber}`}
      size="lg"
      footer={
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={() => window.open(invoice.pdfUrl, '_blank')}
            icon={FiDownload}
            disabled={!invoice.pdfUrl}
          >
            Download PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = `mailto:${invoice.customer?.email}`}
            icon={FiMail}
          >
            Send Email
          </Button>
          <Button
            variant="outline"
            onClick={() => window.print()}
            icon={FiPrinter}
          >
            Print
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Invoice Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              INVOICE
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              #{invoice.invoiceNumber}
            </p>
          </div>
          <StatusBadge
            status={invoice.status}
            variant={getInvoiceStatusColor(invoice.status)}
          />
        </div>

        {/* Company & Customer Info */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From
            </h3>
            <p className="text-sm text-gray-900 dark:text-white font-medium">
              {invoice.company?.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {invoice.company?.address}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {invoice.company?.email}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {invoice.company?.phone}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tax ID: {invoice.company?.taxId}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To
            </h3>
            <p className="text-sm text-gray-900 dark:text-white font-medium">
              {invoice.customer?.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {invoice.customer?.address}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {invoice.customer?.email}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {invoice.customer?.phone}
            </p>
            {invoice.customer?.taxId && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tax ID: {invoice.customer.taxId}
              </p>
            )}
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Issue Date</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {new Date(invoice.issueDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Due Date</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {new Date(invoice.dueDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Payment Terms</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {invoice.paymentTerms || 'Net 30'}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Invoice Items
          </h3>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Description
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Quantity
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Unit Price
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {invoice.items?.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {item.description}
                      </p>
                      {item.sku && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SKU: {item.sku}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
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
                    ${invoice.subtotal?.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tax ({invoice.taxRate}%):
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                    ${invoice.tax?.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="px-4 py-3 text-right text-base font-bold text-gray-900 dark:text-white">
                    Total:
                  </td>
                  <td className="px-4 py-3 text-right text-base font-bold text-primary-600">
                    ${invoice.total?.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              {invoice.notes}
            </p>
          </div>
        )}

        {/* Payment Information */}
        {invoice.status === 'paid' && invoice.paidAt && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-300">
              Paid on {new Date(invoice.paidAt).toLocaleDateString()} 
              {invoice.paymentMethod && ` via ${invoice.paymentMethod}`}
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default InvoiceModal