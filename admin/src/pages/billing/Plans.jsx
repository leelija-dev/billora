import { PandaIcon, CreditCard, AlertCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import PaidUser from '../../components/features/Billing/PaidUser'
import { authService } from '../../services';
import Spinner from '../../components/common/Spinner/Spinner';

const Plans = () => {
  const [mode, setMode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMode = async () => {
      try {
        const response = await authService.checkSession();

        if (response?.user?.plan_mode) {
          setMode(response.user.plan_mode);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMode();
  }, []);

  const handlePurchasePlan = () => {
    const pricingUrl = `${import.meta.env.VITE_CLIENT_URL}/pricing`;
    window.location.href = pricingUrl;
  };

  const handleViewPlans = () => {
    const pricingUrl = `${import.meta.env.VITE_CLIENT_URL}/pricing`;
    window.location.href = pricingUrl;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {mode === 'paid' ? (
        <PaidUser />
      ) : mode === 'trial' ? (
        <div className="max-w-2xl mx-auto mt-8 p-6">
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl border border-blue-200 shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="bg-blue-100 rounded-full p-3">
                    <PandaIcon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    Trial Mode Active
                  </h3>
                  <p className="text-blue-700 mb-4">
                    You're currently exploring the platform with a <strong>free trial</strong>. 
                    To continue enjoying all features without interruption, please upgrade to a paid plan.
                  </p>
                  <div className="bg-sky-50 rounded-lg p-3 mb-4 border border-sky-200">
                    <div className="flex items-center text-sm text-blue-800">
                      <AlertCircle className="h-4 w-4 mr-2 text-sky-600" />
                      <span>Your trial period will expire soon. Upgrade now to keep your data and access.</span>
                    </div>
                  </div>
                  <button 
                    onClick={handlePurchasePlan}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Purchase a Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto mt-8 p-6">
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl border border-blue-200 shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="bg-blue-100 rounded-full p-3">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    No Active Plan Found
                  </h3>
                  <p className="text-blue-700 mb-4">
                    It looks like you don't have an active subscription yet. 
                    Choose a plan that best fits your needs and unlock all premium features.
                  </p>
                  <div className="bg-sky-50 rounded-lg p-3 mb-4 border border-sky-200">
                    <div className="flex items-center text-sm text-blue-800">
                      <AlertCircle className="h-4 w-4 mr-2 text-sky-600" />
                      <span>Get started with our flexible plans starting from just $9/month.</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleViewPlans}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    View Plans & Pricing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Plans