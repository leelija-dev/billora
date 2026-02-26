import React from 'react'
import { FiCreditCard } from 'react-icons/fi'
import EmptyState from '../../components/common/EmptyState/EmptyState'

const Billing = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Billing & Subscription
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your subscription and billing information
        </p>
      </div>
      
      <EmptyState
        icon={FiCreditCard}
        title="Billing module coming soon"
        description="This module is under development and will be available soon."
      />
    </div>
  )
}

export default Billing