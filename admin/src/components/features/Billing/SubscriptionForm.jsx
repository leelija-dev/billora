import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiX,
  FiSave,
  FiStar,
  FiUsers,
  FiPackage,
  FiTrendingUp,
  FiTag,
  FiZap,
  FiShield,
  FiCloud,
  FiAward,
} from "react-icons/fi";
import Button from "../../common/Button/Button";
import Select from "../../common/Select/Select";
import { useBusinessTypeStore } from "../../../store/businessTypeStore";

const SubscriptionForm = ({
  plans,
  currentPlan,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  console.log(
    "📋 SubscriptionForm rendered with plans:",
    plans,
    "currentPlan:",
    currentPlan,
  );
  const [selectedPlanId, setSelectedPlanId] = useState(currentPlan?.id || "");
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [error, setError] = useState("");

  const { businessTypes, fetchBusinessTypes, loading } = useBusinessTypeStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPlanId) {
      setError("Please select a plan");
      return;
    }
    const selectedPlan = plans.find((plan) => plan.id === selectedPlanId);
    if (selectedPlan) {
      onSubmit(selectedPlan);
    } else {
      setError("Selected plan not found");
    }
  };

  const getPlanIcon = (planName) => {
    const name = planName.toLowerCase();
    if (name.includes("basic")) return FiPackage;
    if (name.includes("pro")) return FiZap;
    if (name.includes("business")) return FiTrendingUp;
    if (name.includes("enterprise")) return FiShield;
    if (name.includes("premium")) return FiAward;
    return FiStar;
  };

  const getPlanColor = (planName) => {
    const name = planName.toLowerCase();
    if (name.includes("basic")) return "from-blue-500 to-cyan-500";
    if (name.includes("pro")) return "from-purple-500 to-pink-500";
    if (name.includes("business")) return "from-orange-500 to-red-500";
    if (name.includes("enterprise")) return "from-indigo-500 to-purple-600";
    if (name.includes("premium")) return "from-amber-500 to-orange-600";
    return "from-green-500 to-emerald-500";
  };

  const calculateDiscountedPrice = (price, discountPercentage) => {
    const originalPrice = parseFloat(price) || 0;
    const discount = parseFloat(discountPercentage) || 0;
    const discountedPrice = originalPrice - (originalPrice * discount) / 100;
    return discountedPrice;
  };

  const renderFeatureText = (feature) => {
    if (typeof feature === "string") return feature;
    if (typeof feature === "object" && feature !== null) {
      if (feature.name) return feature.name;
      if (feature.description) return feature.description;
      return JSON.stringify(feature);
    }
    return String(feature);
  };

  // Get popular features for highlighting
  const getPopularFeatures = (plan) => {
    const features = [];
    if (plan.limits) {
      if (plan.limits.users) features.push(`${plan.limits.users} Users`);
      if (plan.limits.products)
        features.push(`${plan.limits.products} Products`);
      if (plan.limits.storage)
        features.push(`${plan.limits.storage}GB Storage`);
      if (plan.limits.apiCalls)
        features.push(`${plan.limits.apiCalls.toLocaleString()} API Calls`);
    }
    return features.slice(0, 2);
  };

  useEffect(() => {
    fetchBusinessTypes();
  }, [fetchBusinessTypes]);

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Change Your Plan
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Select a plan that best fits your business needs
          </p>
        </div>
        <div className="flex items-center space-x-3">
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

      {/* Business Type Filter */}
      <div className="flex justify-center">
        <div className="w-full max-w-xs">
          <Select
            label="Filter by Business Type"
            value={selectedBusinessType}
            onChange={(e) => setSelectedBusinessType(e.target.value)}
            options={businessTypes}
            className="w-full"
            disabled={loading}
          />
          {loading && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
              Loading business types...
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
        {plans
          .filter((plan) => {
            if (!selectedBusinessType) return true;
            if (!plan.business_types || !Array.isArray(plan.business_types))
              return false;
            return plan.business_types.some((bt) => {
              const businessTypeId = bt.business_type_id?.toString();
              const businessTypeName = bt.business_type?.name?.toLowerCase();
              const selectedTypeLower = selectedBusinessType.toLowerCase();
              return (
                businessTypeId === selectedTypeLower ||
                businessTypeName === selectedTypeLower ||
                bt.business_type?.slug?.toLowerCase() === selectedTypeLower
              );
            });
          })
          .map((plan, index) => {
            const Icon = getPlanIcon(plan.name);
            const color = getPlanColor(plan.name);
            const isCurrentPlan = currentPlan?.id === plan.id;
            const isSelected = selectedPlanId === plan.id;
            const originalPrice = parseFloat(plan.price) || 0;
            const discountPercentage = parseFloat(plan.discount) || 0;
            const hasDiscount = discountPercentage > 0;
            const discountedPrice = calculateDiscountedPrice(
              originalPrice,
              discountPercentage,
            );
            const displayInterval = plan.interval || "month";
            const popularFeatures = getPopularFeatures(plan);
            const isPopular = plan.popular || index === 1; // Make middle plan popular by default

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`relative cursor-pointer rounded-2xl transition-all duration-300 shadow-xl ${
                  isSelected
                    ? "ring-2 ring-primary-500 shadow-xl scale-[1.02]"
                    : isCurrentPlan
                      ? "ring-2 ring-green-500 shadow-lg"
                      : "hover:shadow-xl hover:ring-2 hover:ring-primary-300 dark:hover:ring-primary-700"
                }`}
              >
                {/* Popular Badge */}
                {isPopular && !isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg">
                      <FiZap className="w-3 h-3 mr-1" />
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div
                  className={`relative rounded-2xl overflow-hidden h-full ${
                    isSelected
                      ? "bg-primary-50 dark:bg-primary-900/20"
                      : isCurrentPlan
                        ? "bg-green-50 dark:bg-green-900/20"
                        : "bg-white dark:bg-gray-800"
                  }`}
                >
                  {/* Current Plan Overlay */}
                  {isCurrentPlan && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <FiCheckCircle className="w-3 h-3 mr-1" />
                        Current
                      </span>
                    </div>
                  )}

                  {/* Gradient Border Effect for Selected */}
                  {isSelected && !isCurrentPlan && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl opacity-20" />
                  )}

                  <div className="p-6 h-full flex flex-col gap-2 justify-between items-center">
                    <div className="w-full">
                      {/* Icon Section */}
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg transform transition-transform group-hover:scale-110`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      {/* Plan Name */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {plan.name}
                      </h3>

                      {/* Description */}
                      {plan.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                          {plan.description.replace(/<[^>]*>/g, "")}
                        </p>
                      )}

                      {/* Price Section */}
                      <div className="mb-4">
                        {hasDiscount ? (
                          <>
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                ₹{discountedPrice.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                / {plan.duration_days } Days
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm line-through text-gray-400 dark:text-gray-500">
                                ₹{originalPrice.toFixed(2)}
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                <FiTag className="w-3 h-3 mr-1" />
                                {discountPercentage}% OFF
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">
                              ₹{originalPrice.toFixed(2)}
                            </span>
                            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                              /{displayInterval}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Popular Features Preview */}
                      {popularFeatures.length > 0 && (
                        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            KEY FEATURES
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {popularFeatures.map((feature, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-sm"
                              >
                                <FiCheckCircle className="w-3 h-3 mr-1 text-green-500" />
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Plan Limits */}
                      {plan.limits && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
                            Plan Features
                          </p>
                          <ul className="space-y-2">
                            {plan.limits.users && (
                              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                <FiUsers className="w-4 h-4 mr-2 text-primary-500 flex-shrink-0" />
                                <span className="flex-1">Team Members</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {plan.limits.users}
                                </span>
                              </li>
                            )}
                            {plan.limits.products && (
                              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                <FiPackage className="w-4 h-4 mr-2 text-primary-500 flex-shrink-0" />
                                <span className="flex-1">Products</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {plan.limits.products}
                                </span>
                              </li>
                            )}
                            {plan.limits.storage && (
                              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                <FiCloud className="w-4 h-4 mr-2 text-primary-500 flex-shrink-0" />
                                <span className="flex-1">Storage</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {plan.limits.storage}GB
                                </span>
                              </li>
                            )}
                            {plan.limits.apiCalls && (
                              <li className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                                <FiTrendingUp className="w-4 h-4 mr-2 text-primary-500 flex-shrink-0" />
                                <span className="flex-1">API Calls</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {plan.limits.apiCalls.toLocaleString()}/mo
                                </span>
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Features fallback */}
                      {plan.features &&
                        plan.features.length > 0 &&
                        !plan.limits && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
                              Features
                            </p>
                            <ul className="space-y-2">
                              {plan.features.slice(0, 4).map((feature, idx) => (
                                <li
                                  key={idx}
                                  className="text-sm text-gray-600 dark:text-gray-400 flex items-start"
                                >
                                  <FiCheckCircle className="w-4 h-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                                  <span className="flex-1">
                                    {renderFeatureText(feature)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>

                    {/* Select Button */}
                    <div className="mt-6 w-full">
                      {isCurrentPlan ? (
                        <button
                          type="button"
                          disabled
                          className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        >
                          Current Plan
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedPlanId(plan.id)}
                          className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            isSelected
                              ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30 hover:bg-primary-700"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400"
                          }`}
                        >
                          {isSelected ? "Selected" : "Select Plan"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* Additional Info */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start gap-3">
          <FiShield className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-gray-900 dark:text-white">
                Need help choosing?
              </span>{" "}
              Filter plans by business type to find the best plan for your
              needs. All plans include 24/7 support and regular updates.
              Discounted prices are shown where applicable.
            </p>
          </div>
        </div>
      </div>
    </motion.form>
  );
};

export default SubscriptionForm;
