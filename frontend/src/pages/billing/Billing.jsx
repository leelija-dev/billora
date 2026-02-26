import React, { useEffect, useMemo, useState } from 'react'
import { FiCreditCard } from 'react-icons/fi'
import { billingAPI } from '../../services/api'
import SubscriptionCard from '../../components/features/Billing/SubscriptionCard'
import PaymentHistory from '../../components/features/Billing/PaymentHistory'
import Select from '../../components/common/Select/Select'
import Pagination from '../../components/common/Pagination/Pagination'
import Button from '../../components/common/Button/Button'
import EmptyState from '../../components/common/EmptyState/EmptyState'

const Billing = () => {
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const [subscription, setSubscription] = useState(null)
  const [plans, setPlans] = useState([])
  const [payments, setPayments] = useState([])
  const [paymentsCount, setPaymentsCount] = useState(0)

  const [paymentStatus, setPaymentStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const currentPlan = useMemo(() => {
    if (!subscription?.plan) return null
    return plans.find((p) => p.id === subscription.plan) || null
  }, [plans, subscription?.plan])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [subRes, plansRes, payRes] = await Promise.all([
        billingAPI.subscription(),
        billingAPI.plans(),
        billingAPI.payments({
          page: currentPage,
          pageSize,
          status: paymentStatus || undefined,
        }),
      ])

      setSubscription(subRes?.data || null)
      setPlans(plansRes?.data || [])
      setPayments(payRes?.data?.results || [])
      setPaymentsCount(payRes?.data?.count || 0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [currentPage, paymentStatus])

  const handleUpgrade = async () => {
    if (!plans?.length) return

    const selected = window.prompt(
      `Enter plan id to upgrade: ${plans.map((p) => p.id).join(', ')}`,
      subscription?.plan || 'basic'
    )

    if (!selected) return

    setActionLoading(true)
    try {
      await billingAPI.upgrade(selected)
      await fetchAll()
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!window.confirm('Cancel your subscription? You will keep access until the end of the billing period.')) {
      return
    }

    setActionLoading(true)
    try {
      await billingAPI.cancel()
      await fetchAll()
    } finally {
      setActionLoading(false)
    }
  }

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

      {!subscription && !loading ? (
        <EmptyState
          icon={FiCreditCard}
          title="No subscription found"
          description="We couldn't load your subscription. Try again."
          action={
            <Button onClick={fetchAll} isLoading={loading}>
              Reload
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SubscriptionCard
              subscription={{
                ...subscription,
                nextBillingDate: subscription?.currentPeriodEnd || subscription?.nextBillingDate,
              }}
              onUpgrade={handleUpgrade}
              onCancel={handleCancel}
            />

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="flex-1">
                  <Select
                    label="Payment Status"
                    options={[
                      { value: '', label: 'All statuses' },
                      { value: 'succeeded', label: 'Succeeded' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'failed', label: 'Failed' },
                      { value: 'refunded', label: 'Refunded' },
                    ]}
                    value={paymentStatus}
                    onChange={(e) => {
                      setCurrentPage(1)
                      setPaymentStatus(e.target.value)
                    }}
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={fetchAll} isLoading={loading}>
                    Refresh
                  </Button>
                  <Button onClick={handleUpgrade} isLoading={actionLoading}>
                    Change Plan
                  </Button>
                </div>
              </div>
            </div>

            <PaymentHistory payments={payments} loading={loading} />

            <Pagination
              currentPage={currentPage}
              totalItems={paymentsCount}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Current Plan</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {currentPlan ? `${currentPlan.name} ($${currentPlan.price}/${currentPlan.interval})` : 'Unknown'}
              </p>

              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Status: <span className="font-medium text-gray-900 dark:text-white">{subscription?.status || 'N/A'}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Renews: <span className="font-medium text-gray-900 dark:text-white">{subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'N/A'}</span>
                </p>
                {subscription?.paymentMethod?.type === 'credit_card' && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Card: <span className="font-medium text-gray-900 dark:text-white">{subscription.paymentMethod.brand} •••• {subscription.paymentMethod.last4}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Billing