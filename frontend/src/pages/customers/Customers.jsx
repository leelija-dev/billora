import React from 'react'
import { FiUsers } from 'react-icons/fi'
import EmptyState from '../../components/common/EmptyState/EmptyState'

const Customers = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Customers
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your customer relationships
        </p>
      </div>
      
      <EmptyState
        icon={FiUsers}
        title="Customers module coming soon"
        description="This module is under development and will be available soon."
      />
    </div>
  )
}

export default Customers