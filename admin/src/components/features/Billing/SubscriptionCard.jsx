import React from "react";
import { motion } from "framer-motion";
import {
  FiCreditCard,
  FiCalendar,
  FiTrendingUp,
  FiXCircle,
  FiRefreshCw,
  FiTag,
} from "react-icons/fi";
import Button from "../../common/Button/Button";
import StatusBadge from "../../common/StatusBadge/StatusBadge";

const SubscriptionCard = ({
  subscription,
  onUpgrade,
  onCancel,
  onReactivate,
  onUpdatePaymentMethod,
  loading,
}) => {
  // Helper function to calculate discounted price
  const calculateDiscountedPrice = (price, discountPercentage) => {
    const originalPrice = parseFloat(price) || 0;
    const discount = parseFloat(discountPercentage) || 0;
    const discountedPrice = originalPrice - (originalPrice * discount) / 100;
    return discountedPrice;
  };

  const getOriginalPrice = () => {
    return parseFloat(subscription?.amount || subscription?.planDetails?.price || 0);
  };

  const getDiscountPercentage = () => {
    return parseFloat(subscription?.planDetails?.discount) || 0;
  };

  const originalPrice = getOriginalPrice();
  const discountPercentage = getDiscountPercentage();
  const hasDiscount = discountPercentage > 0;
  const discountedPrice = calculateDiscountedPrice(originalPrice, discountPercentage);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Current Subscription
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Your active plan details
          </p>
        </div>
        <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-xl">
          <FiCreditCard className="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
      </div>

      {subscription ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Plan Name</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {subscription.plan || subscription.planDetails?.name || "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Price</span>
            <div className="text-right">
              {hasDiscount ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-white text-lg">
                      ₹{discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      /{subscription.interval || "month"}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <span className="text-xs line-through text-gray-400 dark:text-gray-500">
                      ₹{originalPrice.toFixed(2)}
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <FiTag className="w-3 h-3 mr-1" />
                      {discountPercentage}% OFF
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center">
                  <span className="font-bold text-gray-900 dark:text-white text-lg">
                    ₹{originalPrice.toFixed(2)}
                  </span>
                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                    /{subscription.interval || "month"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">Status</span>
            <StatusBadge
              status={subscription.status || "active"}
              variant={subscription.status === "active" ? "success" : "warning"}
            />
          </div>

          {subscription.currentPeriodStart && (
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">
                Start Date
              </span>
              <span className="text-sm text-gray-900 dark:text-white">
                {new Date(subscription.currentPeriodStart).toLocaleDateString()}
              </span>
            </div>
          )}

          {subscription.currentPeriodEnd && (
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">End Date</span>
              <div className="text-right">
                <span className="text-sm text-gray-900 dark:text-white">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </span>
                {subscription.currentPeriodEnd && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {Math.ceil(
                      (new Date(subscription.currentPeriodEnd) - new Date()) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days remaining
                  </p>
                )}
              </div>
            </div>
          )}

          {subscription.paymentId && (
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">
                Payment ID
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {subscription.paymentId}
              </span>
            </div>
          )}

          <div className="pt-2 space-y-2">
            {subscription.status === "active" ? (
              <>
                <Button
                  onClick={onUpgrade}
                  variant="primary"
                  icon={FiTrendingUp}
                  fullWidth
                  loading={loading}
                >
                  Upgrade Plan
                </Button>
                <Button
                  onClick={onCancel}
                  variant="outline"
                  icon={FiXCircle}
                  fullWidth
                  loading={loading}
                >
                  Cancel Subscription
                </Button>
              </>
            ) : subscription.status === "canceled" ? (
              <Button
                onClick={onReactivate}
                variant="primary"
                icon={FiRefreshCw}
                fullWidth
                loading={loading}
              >
                Reactivate Subscription
              </Button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No active subscription found
          </p>
          <Button onClick={onUpgrade} variant="primary" className="mt-4">
            Choose a Plan
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default SubscriptionCard;