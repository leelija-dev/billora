import React from 'react'
import { motion } from 'framer-motion'
import { 
  FiCreditCard, 
  FiTrendingUp, 
  FiXCircle,
  FiRefreshCw,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi'
import Button from '../../common/Button/Button'
import StatusBadge from '../../common/StatusBadge/StatusBadge'

const SubscriptionCard = ({ 
  subscription, 
  onUpgrade, 
  onCancel, 
  onReactivate,
  onUpdatePaymentMethod,
  loading 
}) => {
  const getStatusBadge = () => {
    const status = subscription?.status
    const configs = {
      active: { variant: 'success', icon: FiCheckCircle, label: 'Active' },
      past_due: { variant: 'warning', icon: FiAlertCircle, label: 'Past Due' },
      canceled: { variant: 'danger', icon: FiXCircle, label: 'Canceled' },
      incomplete: { variant: 'warning', icon: FiAlertCircle, label: 'Incomplete' },
      incomplete_expired: { variant: 'danger', icon: FiXCircle, label: 'Expired' },
      trialing: { variant: 'info', icon: FiCalendar, label: 'Trial' },
      unpaid: { variant: 'danger', icon: FiAlertCircle, label: 'Unpaid' },
    }
    const config = configs[status] || configs.active
    return (
      <StatusBadge
        status={config.label}
        variant={config.variant}
        icon={config.icon}
      />
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative overflow-hidden h-full"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-500 to-secondary-500 opacity-5 rounded-full -mr-10 -mt-10" />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-lg">
              <FiCreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Subscription
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage your plan and billing
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Plan</span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">
              {subscription?.plan || 'N/A'}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Price</span>
            <span className="font-medium text-gray-900 dark:text-white">
              ${subscription?.amount?.toFixed(2) || '0.00'}/{subscription?.interval || 'month'}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">Next Billing</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {subscription?.currentPeriodEnd 
                ? new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : 'N/A'}
            </span>
          </div>

          {subscription?.cancelAtPeriodEnd && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Your subscription will end on{' '}
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-3">
          {subscription?.status === 'active' && !subscription.cancelAtPeriodEnd && (
            <>
              <Button
                onClick={onUpgrade}
                icon={FiTrendingUp}
                fullWidth
                loading={loading}
              >
                Change Plan
              </Button>
              <Button
                variant="outline"
                onClick={onCancel}
                icon={FiXCircle}
                fullWidth
                loading={loading}
              >
                Cancel Subscription
              </Button>
            </>
          )}

          {subscription?.cancelAtPeriodEnd && (
            <Button
              onClick={onReactivate}
              icon={FiRefreshCw}
              fullWidth
              loading={loading}
            >
              Reactivate Subscription
            </Button>
          )}

          <Button
            variant="outline"
            onClick={onUpdatePaymentMethod}
            icon={FiCreditCard}
            fullWidth
            loading={loading}
          >
            Update Payment Method
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default SubscriptionCard