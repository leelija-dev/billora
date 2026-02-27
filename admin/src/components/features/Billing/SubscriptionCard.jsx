import React from 'react'
import { FiCheck, FiX, FiStar, FiCpu, FiUsers, FiDatabase, FiCreditCard } from 'react-icons/fi'
import Button from '../../common/Button/Button'

const SubscriptionCard = ({ subscription, onUpgrade, onCancel }) => {
  const plans = {
    free: {
      name: 'Free',
      price: 0,
      features: [
        { name: 'Up to 100 products', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Email support', included: true },
        { name: 'Advanced reporting', included: false },
        { name: 'API access', included: false },
        { name: 'Priority support', included: false },
      ],
      color: 'gray',
      icon: FiStar,
    },
    basic: {
      name: 'Basic',
      price: 29,
      features: [
        { name: 'Up to 500 products', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Email support', included: true },
        { name: 'Advanced reporting', included: true },
        { name: 'API access', included: false },
        { name: 'Priority support', included: false },
      ],
      color: 'blue',
      icon: FiUsers,
    },
    professional: {
      name: 'Professional',
      price: 79,
      features: [
        { name: 'Unlimited products', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Priority support', included: true },
        { name: 'Advanced reporting', included: true },
        { name: 'API access', included: true },
        { name: 'Custom integrations', included: true },
      ],
      color: 'purple',
      icon: FiCpu,
    },
    enterprise: {
      name: 'Enterprise',
      price: 199,
      features: [
        { name: 'Unlimited everything', included: true },
        { name: 'Custom analytics', included: true },
        { name: '24/7 phone support', included: true },
        { name: 'SLA guarantee', included: true },
        { name: 'Dedicated account manager', included: true },
        { name: 'Custom development', included: true },
      ],
      color: 'indigo',
      icon: FiDatabase,
    },
  }

  const currentPlan = plans[subscription?.plan || 'free']
  const Icon = currentPlan.icon

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      {/* Current Plan Header */}
      <div className={`bg-${currentPlan.color}-50 dark:bg-${currentPlan.color}-900/20 p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 bg-${currentPlan.color}-500 rounded-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentPlan.name} Plan
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subscription?.status === 'active' ? 'Active' : 'Inactive'} · Next billing on{' '}
                {subscription?.nextBillingDate 
                  ? new Date(subscription.nextBillingDate).toLocaleDateString() 
                  : 'N/A'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${currentPlan.price}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span>
            </p>
          </div>
        </div>
      </div>

      {/* Plan Details */}
      <div className="p-6">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
          Current Plan Features
        </h4>
        <div className="space-y-3">
          {currentPlan.features.map((feature, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {feature.name}
              </span>
              {feature.included ? (
                <FiCheck className="w-5 h-5 text-green-500" />
              ) : (
                <FiX className="w-5 h-5 text-gray-400" />
              )}
            </div>
          ))}
        </div>

        {/* Usage Stats */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Usage Statistics
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Products</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {subscription?.usage?.products || 0}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  /{subscription?.limits?.products || '∞'}
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Users</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {subscription?.usage?.users || 0}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  /{subscription?.limits?.users || '∞'}
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Storage</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {subscription?.usage?.storage || 0}GB
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  /{subscription?.limits?.storage || '∞'}GB
                </span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">API Calls</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {subscription?.usage?.apiCalls?.toLocaleString() || 0}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  /{subscription?.limits?.apiCalls?.toLocaleString() || '∞'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <Button
            variant="primary"
            fullWidth
            onClick={onUpgrade}
            icon={FiCreditCard}
          >
            Upgrade Plan
          </Button>
          {subscription?.plan !== 'free' && (
            <Button
              variant="outline"
              fullWidth
              onClick={onCancel}
            >
              Cancel Subscription
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SubscriptionCard