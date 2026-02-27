import React from 'react'
import { FiDownload, FiFileText } from 'react-icons/fi'
import Table from '../../common/Table/Table'
import StatusBadge from '../../common/StatusBadge/StatusBadge'
import Button from '../../common/Button/Button'

const PaymentHistory = ({ payments, loading }) => {
  const getPaymentStatusColor = (status) => {
    const colors = {
      succeeded: 'success',
      pending: 'warning',
      failed: 'danger',
      refunded: 'default',
    }
    return colors[status] || 'default'
  }

  const columns = [
    {
      header: 'Date',
      accessor: 'date',
      cell: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      ),
    },
    {
      header: 'Invoice',
      accessor: 'invoiceNumber',
      cell: (value, row) => (
        <div className="flex items-center">
          <FiFileText className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">
            #{value}
          </span>
        </div>
      ),
    },
    {
      header: 'Description',
      accessor: 'description',
      cell: (value) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {value}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessor: 'amount',
      cell: (value, row) => (
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          ${value.toFixed(2)} {row.currency}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => (
        <StatusBadge
          status={value}
          variant={getPaymentStatusColor(value)}
        />
      ),
    },
    {
      header: 'Actions',
      accessor: 'id',
      cell: (value, row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(row.invoiceUrl, '_blank')}
          icon={FiDownload}
          disabled={!row.invoiceUrl}
        >
          Invoice
        </Button>
      ),
    },
  ]

  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
        <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          No payment history
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your payments will appear here once you subscribe to a plan.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Payment History
        </h3>
      </div>
      <Table
        columns={columns}
        data={payments}
        loading={loading}
      />
    </div>
  )
}

export default PaymentHistory