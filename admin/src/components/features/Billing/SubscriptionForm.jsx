import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FiCheckCircle, 
  FiX, 
  FiSave,
  FiStar,
  FiUsers,
  FiPackage,
  FiTrendingUp
} from 'react-icons/fi'
import Button from '../../common/Button/Button'

const SubscriptionForm = ({ plans, currentPlan, onSubmit, onCancel, isSubmitting }) => {
  const [selectedPlanId, setSelectedPlanId] = useState(currentPlan?.id || '')
  const [billingInterval, setBillingInterval] = useState('monthly')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedPlanId) {
      setError('Please select a plan')
      return
    }
    onSubmit(selectedPlanId)
  }

  const getPlanIcon = (planName) => {
    if (planName.toLowerCase().includes('basic')) return FiPackage
    if (planName.toLowerCase().includes('pro')) return FiTrendingUp
    if (planName.toLowerCase().includes('enterprise')) return FiUsers
    return FiStar
  }

  const getPlanColor = (planName) => {
    if (planName.toLowerCase().includes('basic')) return 'from-blue-500 to-cyan-500'
    if (planName.toLowerCase().includes('pro')) return 'from-purple-500 to-pink-500'
    if (planName.toLowerCase().includes('enterprise')) return 'from-orange-500 to-red-500'
    return 'from-green-500 to-emerald-500'
  }

  // Helper function to safely render feature text
  const renderFeatureText = (feature) => {
    if (typeof feature === 'string') {
      return feature;
    }
    if (typeof feature === 'object' && feature !== null) {
      // If it's an object with name property, use that
      if (feature.name) {
        return feature.name;
      }
      // If it's an object with description property, use that
      if (feature.description) {
        return feature.description;
      }
      // Otherwise, return a string representation
      return JSON.stringify(feature);
    }
    return String(feature);
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Change Your Plan
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Select a new plan that best fits your needs
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            icon={FiX}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={FiSave}
            loading={isSubmitting}
          >
            Update Plan
          </Button>
        </div>
      </div>

      {/* Billing Interval Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-xl inline-flex">
          <button
            type="button"
            onClick={() => setBillingInterval('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              billingInterval === 'monthly'
                ? 'bg-white dark:bg-gray-800 shadow-sm text-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingInterval('yearly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
              billingInterval === 'yearly'
                ? 'bg-white dark:bg-gray-800 shadow-sm text-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Yearly
            <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan, index) => {
          const Icon = getPlanIcon(plan.name)
          const color = getPlanColor(plan.name)
          const isCurrentPlan = currentPlan?.id === plan.id
          const isSelected = selectedPlanId === plan.id
          const yearlyPrice = plan.price * 12 * 0.8 // 20% discount
          const displayPrice = billingInterval === 'yearly' ? yearlyPrice : plan.price
          const displayInterval = billingInterval === 'yearly' ? 'year' : plan.interval

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`relative cursor-pointer rounded-xl border-2 transition-all p-6 ${
                isSelected
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : isCurrentPlan
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
              }`}
            >
              {(isCurrentPlan || isSelected) && (
                <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center ${
                  isCurrentPlan 
                    ? 'bg-green-500' 
                    : 'bg-primary-500'
                }`}>
                  <FiCheckCircle className="w-5 h-5 text-white" />
                </div>
              )}

              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {plan.name}
              </h3>

              <div className="mt-2 flex items-baseline">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${displayPrice}
                </span>
                <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                  /{displayInterval}
                </span>
              </div>

              {billingInterval === 'yearly' && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Save ${(plan.price * 12 - yearlyPrice).toFixed(2)}/year
                </p>
              )}

              {isCurrentPlan && (
                <div className="mt-3">
                  <span className="text-xs bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-full">
                    Current Plan
                  </span>
                </div>
              )}

              {/* Display limits instead of features */}
              {plan.limits && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Plan Limits:
                  </p>
                  <ul className="space-y-1">
                    {plan.limits.users && (
                      <li className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                        <FiCheckCircle className="w-3 h-3 mr-1 text-green-500 flex-shrink-0" />
                        {plan.limits.users} users
                      </li>
                    )}
                    {plan.limits.products && (
                      <li className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                        <FiCheckCircle className="w-3 h-3 mr-1 text-green-500 flex-shrink-0" />
                        {plan.limits.products} products
                      </li>
                    )}
                    {plan.limits.storage && (
                      <li className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                        <FiCheckCircle className="w-3 h-3 mr-1 text-green-500 flex-shrink-0" />
                        {plan.limits.storage}GB storage
                      </li>
                    )}
                    {plan.limits.apiCalls && (
                      <li className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                        <FiCheckCircle className="w-3 h-3 mr-1 text-green-500 flex-shrink-0" />
                        {plan.limits.apiCalls.toLocaleString()} API calls/month
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Display features if they exist (as fallback) */}
              {plan.features && plan.features.length > 0 && !plan.limits && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Features:
                  </p>
                  <ul className="space-y-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start">
                        <FiCheckCircle className="w-3 h-3 mr-1 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{renderFeatureText(feature)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Additional Info */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium text-gray-900 dark:text-white">Note:</span> Your new plan will be effective immediately and you'll be charged the prorated difference for the current billing period.
        </p>
      </div>
    </motion.form>
  )
}

export default SubscriptionForm