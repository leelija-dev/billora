import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import {
  FiCreditCard,
  FiArrowLeft,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiFileText,
  FiDownload,
  FiMail,
  FiX,
  FiUsers,
  FiDatabase,
  FiCpu,
  FiShoppingCart,
  FiPackage,
  FiRotateCcw,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { plansAPI, invoiceAPI, billingAPI, authService } from "../../../services";
import { usePermissionStore } from "../../../store/permissionStore";
import SubscriptionCard from "./SubscriptionCard";
import PaymentHistory from "./PaymentHistory";
import SubscriptionForm from "./SubscriptionForm";
import Select from "../../common/Select/Select";
import Pagination from "../../common/Pagination/Pagination";
import Button from "../../common/Button/Button";
import EmptyState from "../../common/EmptyState/EmptyState";
import StatusBadge from "../../common/StatusBadge/StatusBadge";
import Input from "../../common/Input/Input";
import ProtectedRoute from "../../features/Auth/ProtectedRoute";
import toast from "react-hot-toast";

const PaidUser = () => {
  const { canAccess, user, permissions } = usePermissionStore();
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showChangePlanForm, setShowChangePlanForm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showRenewConfirm, setShowRenewConfirm] = useState(false);
  const [renewPlanData, setRenewPlanData] = useState(null);

  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentsCount, setPaymentsCount] = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [invoicesCount, setInvoicesCount] = useState(0);

  

  // New state for recent plan data
  const [recentPlanData, setRecentPlanData] = useState(null);

  const [paymentStatus, setPaymentStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [invoicePage, setInvoicePage] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [purchaseData, setPurchaseData] = useState({
    plan_id: "",
    customer_id: "",
    amount: 0,
  });
  const [showUpgradeForm, setShowUpgradeForm] = useState(false);
  const [upgradeData, setUpgradeData] = useState({
    plan_id: "",
    screen_type: "",
    customer_id: "",
    customer_phone: "",
    amount: 0,
    gst: 0,
    discount: 0,
    gstPercentage: 0,
  });

  const pageSize = 10;

  // Refs for preventing duplicate API calls
  const fetchInProgressRef = useRef(false);
  const initialFetchDoneRef = useRef(false);
  const subscriptionFetchedRef = useRef(false);
  const abortControllerRef = useRef(null);

  // Check if user has billing access
  const hasBillingAccess = canAccess("billing");

  const currentPlan = useMemo(() => {
    if (!subscription?.plan) return null;
    if (subscription?.planDetails) {
      return subscription.planDetails;
    }
    return plans.find((p) => p.id === subscription.plan) || null;
  }, [plans, subscription?.plan, subscription?.planDetails]);

  const upgradablePlans = useMemo(() => {
    if (!plans.length) return [];

    // If no current plan, show all plans (for first-time purchase)
    if (!currentPlan) return plans;

    const currentPrice = parseFloat(
      currentPlan.price || currentPlan.amount || 0,
    );

    // Filter plans with price greater than current plan
    const filtered = plans.filter((plan) => {
      const planPrice = parseFloat(plan.price || plan.amount || 0);
      return planPrice > currentPrice;
    });

    // Sort by price ascending (cheapest upgrade first)
    return filtered.sort((a, b) => {
      const priceA = parseFloat(a.price || a.amount || 0);
      const priceB = parseFloat(b.price || b.amount || 0);
      return priceA - priceB;
    });
  }, [plans, currentPlan]);

  // Get user ID from user object or localStorage
  const getUserId = useCallback(() => {
    return (
      user?.id ||
      localStorage.getItem("user_id") ||
      localStorage.getItem("userId") ||
      1
    );
  }, [user?.id]);

  // Load Cashfree SDK
  const loadCashfreeSDK = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (window.Cashfree) {
        resolve(window.Cashfree);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      script.onload = () => {
        if (window.Cashfree) {
          resolve(window.Cashfree);
        } else {
          reject(new Error("Cashfree SDK failed to load"));
        }
      };
      script.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
      document.body.appendChild(script);
    });
  }, []);

  // Helper function to map payment status to UI status
  const mapPaymentStatus = useCallback((paymentStatus) => {
    const statusMap = {
      success: "succeeded",
      pending: "pending",
      failed: "failed",
      refunded: "refunded",
      processing: "pending",
    };
    return statusMap[paymentStatus] || "pending";
  }, []);

  // Function to fetch recent plan data from /api/recent-plan/{user_id}
  const fetchRecentPlan = useCallback(async () => {
    try {
      const userId = getUserId();
      console.log("📅 Fetching recent plan for user:", userId);
      const response = await billingAPI.getRecentPlan(userId);

      const responseData = response?.data;
      const recentData = responseData?.data || responseData;

      if (
        recentData &&
        (recentData.remainingAmount !== undefined ||
          recentData.remainingDays !== undefined)
      ) {
        console.log("📅 Recent plan data received:", recentData);
        console.log("📅 Remaining Amount:", recentData.remainingAmount);
        console.log("📅 Remaining Days:", recentData.remainingDays);

        setRecentPlanData({
          remainingAmount: parseFloat(recentData.remainingAmount) || 0,
          remainingDays: parseInt(recentData.remainingDays) || 0,
          perDayPrice: parseFloat(recentData.perDayPrice) || 0,
          totalDuration: recentData.total_duration || 0,
          startDay: recentData.start_day,
          endDay: recentData.end_day,
          plan: responseData?.plan || null,
        });

        return {
          remainingAmount: parseFloat(recentData.remainingAmount) || 0,
          remainingDays: parseInt(recentData.remainingDays) || 0,
          perDayPrice: parseFloat(recentData.perDayPrice) || 0,
          totalDuration: recentData.total_duration || 0,
        };
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch recent plan:", error);
      return null;
    }
  }, [getUserId]);

  // Function to fetch only subscription data
  const fetchSubscription = useCallback(async () => {
    if (subscriptionFetchedRef.current) {
      console.log("✅ Subscription already fetched, skipping...");
      return;
    }

    try {
      const userId = getUserId();
      console.log("🔄 Fetching subscription for user:", userId);

      const historyRes = await billingAPI.getPlanPurchaseHistory(
        userId,
        1,
        100,
      );

      let historyData = [];
      if (
        historyRes?.data?.data?.data &&
        Array.isArray(historyRes.data.data.data)
      ) {
        historyData = historyRes.data.data.data;
      } else if (
        historyRes?.data?.data &&
        Array.isArray(historyRes.data.data)
      ) {
        historyData = historyRes.data.data;
      } else if (historyRes?.data && Array.isArray(historyRes.data)) {
        historyData = historyRes.data;
      }

      const successfulPurchases = historyData.filter(
        (p) => p.payment_status === "success" && p.status === "active",
      );

      if (successfulPurchases.length > 0) {
        const latestPurchase = successfulPurchases.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        )[0];

        if (latestPurchase.plan_id) {
          if (latestPurchase.plan) {
            setSubscription({
              id: latestPurchase.id,
              plan:
                latestPurchase.plan.name || `Plan ${latestPurchase.plan_id}`,
              planId: latestPurchase.plan_id,
              status: latestPurchase.status || "active",
              currentPeriodStart: latestPurchase.start_date,
              currentPeriodEnd: latestPurchase.end_date,
              amount: parseFloat(latestPurchase.price) || 0,
              interval: latestPurchase.plan.interval || "month",
              planDetails: latestPurchase.plan,
              paymentId: latestPurchase.payment_id,
            });
          } else {
            const planRes = await plansAPI.getById(latestPurchase.plan_id);
            const planData =
              planRes?.data?.["Single Plan"] || planRes?.data?.data;
            if (planData) {
              setSubscription({
                id: latestPurchase.id,
                plan: planData.name || `Plan ${latestPurchase.plan_id}`,
                planId: latestPurchase.plan_id,
                status: latestPurchase.status || "active",
                currentPeriodStart: latestPurchase.start_date,
                currentPeriodEnd: latestPurchase.end_date,
                amount: parseFloat(latestPurchase.price) || 0,
                interval: planData.interval || "month",
                planDetails: planData,
                paymentId: latestPurchase.payment_id,
              });
            }
          }
        }
      } else if (user?.plan_id) {
        const planRes = await plansAPI.getById(user.plan_id);
        const planData = planRes?.data?.["Single Plan"] || planRes?.data?.data;
        if (planData) {
          setSubscription({
            plan: planData.name || `Plan ${user.plan_id}`,
            planId: user.plan_id,
            status: "active",
            currentPeriodEnd: null,
            amount: parseFloat(planData.price) || 0,
            interval: planData.interval || "month",
            planDetails: planData,
          });
        }
      }

      subscriptionFetchedRef.current = true;
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    }
  }, [getUserId, user?.plan_id]);

  // Function to fetch paginated payment history
  const fetchPaymentHistory = useCallback(async () => {
    try {
      const userId = getUserId();
      console.log("🔄 Fetching payment history for page:", currentPage, "search:", paymentStatus);

      const historyRes = await billingAPI.getPlanPurchaseHistory(
        userId,
        currentPage,
        pageSize,
        paymentStatus,
      );

      let historyData = [];
      let totalRecords = 0;

      if (
        historyRes?.data?.data?.data &&
        Array.isArray(historyRes.data.data.data)
      ) {
        historyData = historyRes.data.data.data;
        totalRecords = historyRes.data.data.total || 0;
      } else if (
        historyRes?.data?.data &&
        Array.isArray(historyRes.data.data)
      ) {
        historyData = historyRes.data.data;
        totalRecords = historyRes.data.total || historyRes.data.data.length;
      } else if (historyRes?.data && Array.isArray(historyRes.data)) {
        historyData = historyRes.data;
        totalRecords = historyRes.data.length;
      }

      const transformedPayments = historyData.map((purchase) => ({
        id: purchase.id,
        createdAt: purchase.created_at,
        amount: parseFloat(purchase.price) || 0,
        currency: purchase.currency || "INR",
        status: mapPaymentStatus(purchase.payment_status),
        paymentMethod: purchase.payment_method || "cashfree",
        description: purchase.plan?.name || `Plan #${purchase.plan_id}`,
        invoiceNumber: purchase.payment_id,
        invoiceId: purchase.id,
        planId: purchase.plan_id,
        planName: purchase.plan?.name || "Unknown Plan",
        planDetails: purchase.plan || null,
        startDate: purchase.start_date,
        endDate: purchase.end_date,
        paymentStatus: purchase.payment_status,
        rawStatus: purchase.status,
        paymentId: purchase.payment_id,
        price: purchase.price,
        remarks: purchase.remarks,
      }));

      setPayments(transformedPayments);
      setPaymentsCount(totalRecords);
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
      setPayments([]);
      setPaymentsCount(0);
    }
  }, [getUserId, currentPage, pageSize, mapPaymentStatus, paymentStatus]);

  // Function to fetch plans
  const fetchPlans = useCallback(async () => {
    try {
      const plansRes = await plansAPI.getAll().catch((err) => {
        console.warn("Failed to fetch plans:", err);
        return { data: [] };
      });
      setPlans(plansRes?.data?.data || plansRes?.data || []);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    }
  }, []);

  // Add this function to handle plan renewal
  const handleRenew = useCallback(
    async (plan) => {
      // Get the plan details from subscription
      const planToRenew = subscription?.planDetails || currentPlan;

      if (!planToRenew) {
        setError("No plan found to renew");
        return;
      }

      // Calculate renewal amount: first apply discount, then GST on discounted price
      const planPrice = parseFloat(
        planToRenew.price || planToRenew.amount || 0,
      );
      const discountPercentage = parseFloat(planToRenew.discount) || 0;
      const gstPercentage = parseFloat(planToRenew.gst) || 18;

      // Step 1: Calculate discounted price
      const discountAmount = (planPrice * discountPercentage) / 100;
      const discountedPrice = planPrice - discountAmount;

      // Step 2: Calculate GST on the discounted price
      const gst = (discountedPrice * gstPercentage) / 100;
      const totalAmount = discountedPrice + gst;

      setRenewPlanData({
        plan_id: planToRenew.id,
        plan_name: planToRenew.name,
        original_amount: planPrice,
        discount_percentage: discountPercentage,
        discount_amount: discountAmount,
        discounted_amount: discountedPrice,
        gst_percentage: gstPercentage,
        gst_amount: gst,
        total_amount: totalAmount,
        customer_id: getUserId(),
      });

      setShowRenewConfirm(true);
    },
    [subscription, currentPlan, getUserId],
  );

  // Add this function to process the renewal payment
  const handleRenewPayment = async () => {
    if (!renewPlanData) return;

    console.log("Processing renewal for plan:", renewPlanData);
    setActionLoading(true);
    setError(null);
    const loadingToast = toast.loading("Processing renewal...");

    try {
      const renewPayload = {
        plan_id: renewPlanData.plan_id,
        customer_id: renewPlanData.customer_id,
        amount: renewPlanData.total_amount,
      };

      console.log("Sending renew payload:", renewPayload);

      const renewResponse = await billingAPI.renewPlan(renewPayload);
      const responseData = renewResponse?.data;

      if (responseData?.session_id) {
        toast.success("Renewal initiated! Redirecting to payment...", {
          id: loadingToast,
        });

        const Cashfree = await loadCashfreeSDK();
        const cashfree = new Cashfree({
          mode:
            import.meta.env.VITE_CASHFREE_MODE === "production"
              ? "production"
              : "sandbox",
        });

        const orderInfo = {
          paymentSessionId: responseData.session_id,
          planName: renewPlanData.plan_name,
          amount: renewPlanData.total_amount,
          customerId: renewPlanData.customer_id,
          timestamp: Date.now(),
          isRenewal: true,
          renewalDetails: {
            planId: renewPlanData.plan_id,
            originalAmount: renewPlanData.original_amount,
          },
        };
        localStorage.setItem("pendingPayment", JSON.stringify(orderInfo));

        await cashfree.checkout({
          paymentSessionId: responseData.session_id,
          redirectTarget: "_self",
        });
      } else {
        toast.dismiss(loadingToast);
        setError(responseData?.message || "Failed to initiate plan renewal");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Failed to renew plan:", error);

      let errorMessage = "Renewal failed. Please try again.";
      if (error.message?.includes("customer_id")) {
        errorMessage = "Invalid customer ID format. Please try again.";
      } else if (error.message?.includes("plan_id")) {
        errorMessage = "Invalid plan selected. Please try again.";
      } else if (error.message?.includes("amount")) {
        errorMessage = "Invalid renewal amount. Please try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
      setShowRenewConfirm(false);
      setRenewPlanData(null);
    }
  };

  // Function to fetch invoices
  const fetchInvoices = useCallback(async () => {
    try {
      const invoicesRes = await invoiceAPI.getAll(1, {}).catch((err) => {
        console.warn("Failed to fetch invoices:", err);
        return { data: [] };
      });
      const invoiceData = invoicesRes?.data?.data;
      if (Array.isArray(invoiceData)) {
        setInvoices(invoiceData);
      } else if (invoicesRes?.data && Array.isArray(invoicesRes.data)) {
        setInvoices(invoicesRes.data);
      } else {
        setInvoices([]);
      }
      setInvoicesCount(invoicesRes?.data?.total || 0);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    }
  }, []);

  // Main fetch function - only for initial load
  const fetchInitialData = useCallback(async () => {
    if (fetchInProgressRef.current) {
      console.log("⏳ Fetch already in progress, skipping...");
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    fetchInProgressRef.current = true;
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchPlans(),
        fetchInvoices(),
        fetchSubscription(),
        fetchRecentPlan(),
      ]);
      await fetchPaymentHistory();
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Failed to fetch billing data:", error);
        setError("Failed to load billing information. Please try again.");
      }
    } finally {
      setLoading(false);
      setInitialLoading(false);
      fetchInProgressRef.current = false;
    }
  }, [
    fetchPlans,
    fetchInvoices,
    fetchSubscription,
    fetchRecentPlan,
    fetchPaymentHistory,
  ]);

  // Initial fetch - only runs once
  useEffect(() => {
    if (!initialFetchDoneRef.current) {
      initialFetchDoneRef.current = true;
      fetchInitialData();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchInitialData]);

  // When page changes, ONLY fetch payment history
  useEffect(() => {
    if (initialFetchDoneRef.current) {
      fetchPaymentHistory();
    }
  }, [currentPage, fetchPaymentHistory]);

  // When payment status filter changes, reset to page 1 and refetch
  useEffect(() => {
    if (initialFetchDoneRef.current) {
      setCurrentPage(1);
    }
  }, [paymentStatus]);

  // Refresh function (manual refresh)
  const refreshData = useCallback(async () => {
    if (fetchInProgressRef.current) {
      console.log("⏳ Refresh already in progress, skipping...");
      return;
    }

    fetchInProgressRef.current = true;
    setLoading(true);

    try {
      await Promise.all([
        fetchPlans(),
        fetchInvoices(),
        fetchSubscription(),
        fetchRecentPlan(),
      ]);
      await fetchPaymentHistory();
    } catch (error) {
      console.error("Failed to refresh data:", error);
      setError("Failed to refresh billing information. Please try again.");
    } finally {
      setLoading(false);
      fetchInProgressRef.current = false;
    }
  }, [
    fetchPlans,
    fetchInvoices,
    fetchSubscription,
    fetchRecentPlan,
    fetchPaymentHistory,
  ]);

  // Reset subscription ref when needed (e.g., after upgrade)
  const resetAndRefetchSubscription = useCallback(async () => {
    subscriptionFetchedRef.current = false;
    await fetchSubscription();
    await fetchRecentPlan();
  }, [fetchSubscription, fetchRecentPlan]);

  // Updated calculateProratedUpgrade function using recent plan API data
  const calculateProratedUpgrade = useCallback(
    async (newPlan, currentPlan, subscriptionData) => {
      const newPlanPrice =
        parseFloat(newPlan?.price) ||
        parseFloat(newPlan?.amount) ||
        parseFloat(newPlan?.base_price) ||
        0;
      const gstPercentage = parseFloat(newPlan?.gst) || 18;

      let recentPlan = recentPlanData;
      if (!recentPlan) {
        recentPlan = await fetchRecentPlan();
      }

      if (
        recentPlan &&
        recentPlan.remainingAmount !== undefined &&
        recentPlan.remainingAmount > 0
      ) {
        const remainingAmount = parseFloat(recentPlan.remainingAmount) || 0;
        const remainingDays = parseInt(recentPlan.remainingDays) || 0;

        const discountPercentage = parseFloat(newPlan?.discount) || 0;
        const discountAmount = (newPlanPrice * discountPercentage) / 100;
        const discountedPrice = newPlanPrice - discountAmount;

        let upgradeAmount = discountedPrice - remainingAmount;
        upgradeAmount = Math.max(0, upgradeAmount);

        const gst = (upgradeAmount * gstPercentage) / 100;
        const totalAmount = upgradeAmount + gst;

        return {
          baseAmount: newPlanPrice,
          discountPercentage: discountPercentage,
          discountAmount: discountAmount,
          discountedAmount: discountedPrice,
          currentPlanRemaining: remainingAmount,
          upgradeAmount: upgradeAmount,
          gst: gst,
          totalAmount: totalAmount,
          daysRemaining: remainingDays,
          monthsRemaining: Math.ceil(remainingDays / 30),
          gstPercentage: gstPercentage,
          remainingAmount: remainingAmount,
          usingRecentPlanData: true,
        };
      }

      if (recentPlan && recentPlan.remainingAmount === 0) {
        const discountPercentage = parseFloat(newPlan?.discount) || 0;
        const discountAmount = (newPlanPrice * discountPercentage) / 100;
        const discountedPrice = newPlanPrice - discountAmount;
        const gst = (discountedPrice * gstPercentage) / 100;
        const totalAmount = discountedPrice + gst;

        return {
          baseAmount: newPlanPrice,
          discountPercentage: discountPercentage,
          discountAmount: discountAmount,
          discountedAmount: discountedPrice,
          currentPlanRemaining: 0,
          upgradeAmount: discountedPrice,
          gst: gst,
          totalAmount: totalAmount,
          daysRemaining: 0,
          monthsRemaining: 0,
          gstPercentage: gstPercentage,
          remainingAmount: 0,
          usingRecentPlanData: true,
        };
      }

      console.warn(
        "Recent plan data not available, using fallback calculation",
      );

      if (!currentPlan || !subscriptionData) {
        const discountPercentage = parseFloat(newPlan?.discount) || 0;
        const discountAmount = (newPlanPrice * discountPercentage) / 100;
        const discountedPrice = newPlanPrice - discountAmount;
        const gst = (discountedPrice * gstPercentage) / 100;
        const totalAmount = discountedPrice + gst;

        return {
          baseAmount: newPlanPrice,
          currentPlanRemaining: 0,
          upgradeAmount: discountedPrice,
          gst,
          totalAmount,
          daysRemaining: 0,
          monthsRemaining: 0,
          gstPercentage: gstPercentage,
          discountPercentage: discountPercentage,
          discountAmount: discountAmount,
          discountedAmount: discountedPrice,
          usingRecentPlanData: false,
        };
      }

      const discountPercentage = parseFloat(newPlan?.discount) || 0;
      const discountAmount = (newPlanPrice * discountPercentage) / 100;
      const discountedPrice = newPlanPrice - discountAmount;
      const gst = (discountedPrice * gstPercentage) / 100;
      const totalAmount = discountedPrice + gst;

      return {
        baseAmount: newPlanPrice,
        discountPercentage: discountPercentage,
        discountAmount: discountAmount,
        discountedAmount: discountedPrice,
        currentPlanRemaining: 0,
        upgradeAmount: discountedPrice,
        gst: gst,
        totalAmount: totalAmount,
        daysRemaining: 0,
        monthsRemaining: 0,
        gstPercentage: gstPercentage,
        usingRecentPlanData: false,
      };
    },
    [getUserId, fetchRecentPlan, recentPlanData],
  );

  // Updated handleUpgrade function - this will be called when user selects a plan from SubscriptionForm
  const handleUpgrade = useCallback(
    async (plan) => {
      setSelectedPlan(plan);

      try {
        // Hide the subscription form and show upgrade form
        setShowChangePlanForm(false);

        // Fetch the latest recent plan data
        const recentPlan = await fetchRecentPlan();

        // Calculate pricing with the latest data
        const pricing = await calculateProratedUpgrade(
          plan,
          currentPlan,
          subscription,
        );

        setUpgradeData({
          plan_id: plan.id,
          screen_type: plan.screen_type || "mobile_with_desktop",
          customer_id: user?.customer_id || getUserId(),
          customer_phone: user?.phone || "",
          amount: pricing.baseAmount,
          discount_percentage: pricing.discountPercentage,
          discount_amount: pricing.discountAmount,
          discounted_amount: pricing.discountedAmount,
          current_plan_remaining: pricing.currentPlanRemaining,
          upgrade_amount: pricing.upgradeAmount,
          gst: pricing.gst,
          total_amount: pricing.totalAmount,
          days_remaining: pricing.daysRemaining,
          months_remaining: pricing.monthsRemaining,
          actual_paid_amount: pricing.actualPaidAmount || 0,
          gstPercentage: pricing.gstPercentage,
          recent_plan_remaining_amount:
            recentPlan?.remainingAmount || pricing.currentPlanRemaining,
          recent_plan_remaining_days:
            recentPlan?.remainingDays || pricing.daysRemaining,
        });

        // Show the upgrade form
        setShowUpgradeForm(true);
      } catch (error) {
        console.error("Failed to calculate upgrade pricing:", error);
        setError("Failed to calculate upgrade pricing. Please try again.");
        // If error, go back to subscription form
        setShowChangePlanForm(true);
      }
    },
    [
      calculateProratedUpgrade,
      currentPlan,
      subscription,
      user,
      getUserId,
      fetchRecentPlan,
    ],
  );

  // Updated handlePlanUpgrade function
  const handlePlanUpgrade = async (e) => {
    e.preventDefault();

    if (
      !upgradeData.plan_id ||
      !upgradeData.customer_id ||
      !upgradeData.customer_phone
    ) {
      setError("Please fill all required fields");
      return;
    }

    if (upgradeData.upgrade_amount < 0) {
      setError("Invalid upgrade amount calculation");
      return;
    }

    setActionLoading(true);
    setError(null);
    const loadingToast = toast.loading("Processing upgrade...");

    try {
      const amountToSend = parseFloat(upgradeData.total_amount || 0);

      const upgradePayload = {
        amount: amountToSend,
        plan_id: upgradeData.plan_id,
        screen_type: upgradeData.screen_type,
        customer_id: upgradeData.customer_id,
        customer_phone: upgradeData.customer_phone,
        upgrade_amount: upgradeData.upgrade_amount,
        remaining_amount: upgradeData.current_plan_remaining,
        days_remaining: upgradeData.days_remaining,
      };

      console.log("Sending upgrade payload:", upgradePayload);

      const upgradeResponse = await billingAPI.upgradePlan(upgradePayload);
      const responseData = upgradeResponse?.data;

      if (responseData?.session_id) {
        toast.success("Upgrade initiated! Redirecting to payment...", {
          id: loadingToast,
        });

        const Cashfree = await loadCashfreeSDK();
        const cashfree = new Cashfree({
          mode:
            import.meta.env.VITE_CASHFREE_MODE === "production"
              ? "production"
              : "sandbox",
        });

        const orderInfo = {
          paymentSessionId: responseData.session_id,
          planName: selectedPlan?.name || "Plan Upgrade",
          amount: amountToSend,
          customerId: upgradeData.customer_id,
          timestamp: Date.now(),
          isUpgrade: true,
          upgradeDetails: {
            fromPlan: currentPlan?.name,
            toPlan: selectedPlan?.name,
            remainingAmount: upgradeData.current_plan_remaining,
            upgradeAmount: upgradeData.upgrade_amount,
          },
        };
        localStorage.setItem("pendingPayment", JSON.stringify(orderInfo));

        if (amountToSend > 0) {
          await cashfree.checkout({
            paymentSessionId: responseData.session_id,
            redirectTarget: "_self",
          });
        } else {
          toast.success(
            "Plan upgraded successfully! Your new plan is now active.",
          );
          setShowUpgradeForm(false);
          setSelectedPlan(null);
          setUpgradeData({
            plan_id: "",
            screen_type: "",
            customer_id: "",
            customer_phone: "",
            amount: 0,
            gst: 0,
            discount: 0,
            gstPercentage: 0,
          });
          subscriptionFetchedRef.current = false;
          setTimeout(() => {
            resetAndRefetchSubscription();
            fetchPaymentHistory();
          }, 3000);
        }
      } else {
        toast.dismiss(loadingToast);
        setError(responseData?.message || "Failed to initiate plan upgrade");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Failed to upgrade plan:", error);

      let errorMessage = "Upgrade failed. Please try again.";
      if (error.message?.includes("customer_id")) {
        errorMessage = "Invalid customer ID format. Please try again.";
      } else if (error.message?.includes("plan_id")) {
        errorMessage = "Invalid plan selected. Please try again.";
      } else if (error.message?.includes("amount")) {
        errorMessage = "Invalid upgrade amount. Please try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePurchasePlan = (plan) => {
    setSelectedPlan(plan);
    setPurchaseData({
      plan_id: plan.id,
      customer_id: "",
      amount: plan.price || plan.amount || 0,
    });
    setShowPurchaseForm(true);
  };

  const handlePlanPurchase = async (e) => {
    e.preventDefault();
    if (
      !purchaseData.plan_id ||
      !purchaseData.customer_id ||
      !purchaseData.amount
    ) {
      setError("Please fill all required fields");
      return;
    }

    setActionLoading(true);
    setError(null);
    const loadingToast = toast.loading("Creating order...");

    try {
      const orderResponse = await billingAPI.createCashfreeOrder({
        amount: purchaseData.amount,
        plan_id: purchaseData.plan_id,
        customer_id: purchaseData.customer_id,
      });

      const orderData = orderResponse?.data;

      if (orderData?.session_id) {
        toast.success("Order created! Redirecting to payment...", {
          id: loadingToast,
        });

        const Cashfree = await loadCashfreeSDK();
        const cashfree = new Cashfree({
          mode:
            import.meta.env.VITE_CASHFREE_MODE === "production"
              ? "production"
              : "sandbox",
        });

        const orderInfo = {
          paymentSessionId: orderData.session_id,
          planName: selectedPlan?.name || "Plan Purchase",
          amount: purchaseData.amount,
          customerId: purchaseData.customer_id,
          timestamp: Date.now(),
        };
        localStorage.setItem("pendingPayment", JSON.stringify(orderInfo));

        await cashfree.checkout({
          paymentSessionId: orderData.session_id,
          redirectTarget: "_self",
        });
      } else {
        toast.dismiss(loadingToast);
        setError(orderData?.message || "Failed to create order");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Failed to purchase plan:", error);
      setError(error.message || "Payment failed. Please try again.");
      toast.error(error.message || "Payment failed. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      alert("Subscription cancellation functionality will be implemented.");
      setShowCancelConfirm(false);
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      setError("Failed to cancel subscription. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    setActionLoading(true);
    try {
      alert("Subscription reactivation functionality will be implemented.");
    } catch (error) {
      console.error("Failed to reactivate subscription:", error);
      setError("Failed to reactivate subscription. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdatePaymentMethod = async (paymentMethod) => {
    setActionLoading(true);
    try {
      alert("Payment method update functionality will be implemented.");
    } catch (error) {
      console.error("Failed to update payment method:", error);
      setError("Failed to update payment method. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadInvoice = (invoice) => {
    if (invoice?.pdfUrl) {
      window.open(invoice.pdfUrl, "_blank");
    } else if (invoice?.receiptUrl) {
      window.open(invoice.receiptUrl, "_blank");
    } else {
      alert("Invoice PDF is not available for download");
    }
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleSendInvoice = async (invoice) => {
    try {
      alert("Invoice sending functionality will be implemented.");
    } catch (error) {
      console.error("Failed to send invoice:", error);
      setError("Failed to send invoice. Please try again.");
    }
  };

  const stats = {
    totalSpent: payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0,
    successfulPayments:
      payments?.filter((p) => p.status === "succeeded" || p.status === "paid")
        .length || 0,
    failedPayments: payments?.filter((p) => p.status === "failed").length || 0,
    pendingPayments:
      payments?.filter((p) => p.status === "pending").length || 0,
    nextBilling: subscription?.currentPeriodEnd || null,
    daysUntilBilling: subscription?.currentPeriodEnd
      ? Math.ceil(
          (new Date(subscription.currentPeriodEnd) - new Date()) /
            (1000 * 60 * 60 * 24),
        )
      : 0,
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, delay }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative overflow-hidden group"
    >
      <div
        className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color} opacity-10 rounded-full -mr-6 -mt-6 group-hover:scale-150 transition-transform duration-500`}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (error && !subscription && !loading) {
    return (
      <ProtectedRoute>
        <div className="space-y-6 p-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <FiAlertCircle className="w-12 h-12 mx-auto text-red-500 mb-3" />
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
              Error Loading Data
            </h3>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <Button onClick={() => refreshData()} icon={FiRefreshCw}>
              Try Again
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 p-6"
      >
        <AnimatePresence>
          {(error || successMessage) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-xl shadow-lg ${
                error
                  ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    error
                      ? "bg-red-100 dark:bg-red-900/30"
                      : "bg-green-100 dark:bg-green-900/30"
                  }`}
                >
                  {error ? (
                    <FiAlertCircle
                      className={`w-5 h-5 ${error ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}
                    />
                  ) : (
                    <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      error
                        ? "text-red-800 dark:text-red-200"
                        : "text-green-800 dark:text-green-200"
                    }`}
                  >
                    {error || successMessage}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  className={`p-1 rounded-lg ${
                    error
                      ? "text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
                      : "text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30"
                  }`}
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Billing & Subscription
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center">
              <FiCreditCard className="w-4 h-4 mr-2" />
              {showChangePlanForm
                ? "Change Your Plan"
                : showUpgradeForm
                  ? "Upgrade Plan"
                  : "Manage your subscription and billing information"}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {showChangePlanForm || showUpgradeForm ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowChangePlanForm(false);
                    setShowUpgradeForm(false);
                    setSelectedPlan(null);
                  }}
                  icon={FiArrowLeft}
                >
                  Back to Overview
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => refreshData()}
                  className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  <FiRefreshCw
                    className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${loading ? "animate-spin" : ""}`}
                  />
                </motion.button>
              </>
            )}
          </div>
        </motion.div>

        {!subscription && !loading ? (
          <EmptyState
            icon={FiCreditCard}
            title="No Active Plan"
            description="You don't have an active plan. Choose a plan below to get started."
            action={
              <Button onClick={() => setShowChangePlanForm(true)}>
                Choose a Plan
              </Button>
            }
          />
        ) : (
          <>
            <AnimatePresence mode="wait">
              {!showChangePlanForm && !showUpgradeForm && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {initialLoading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                      >
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <>
                      <StatCard
                        title="Total Spent"
                        value={`₹${stats.totalSpent.toFixed(2)}`}
                        icon={FiDollarSign}
                        color="from-blue-500 to-cyan-500"
                        delay={0.1}
                      />
                      <StatCard
                        title="Successful Payments"
                        value={stats.successfulPayments}
                        icon={FiCheckCircle}
                        color="from-green-500 to-emerald-500"
                        subtitle={`${((stats.successfulPayments / (payments.length || 1)) * 100).toFixed(1)}% success rate`}
                        delay={0.2}
                      />

                      <StatCard
                        title="Pending"
                        value={stats.pendingPayments}
                        icon={FiAlertCircle}
                        color="from-yellow-500 to-orange-500"
                        delay={0.4}
                      />
                      <StatCard
                        title="Next Billing"
                        value={
                          stats.daysUntilBilling > 0
                            ? `${stats.daysUntilBilling} days`
                            : "Today"
                        }
                        icon={FiCalendar}
                        color="from-purple-500 to-indigo-500"
                        subtitle={
                          stats.nextBilling
                            ? new Date(stats.nextBilling).toLocaleDateString('en-IN',{
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            })
                            : "N/A"
                        }
                        delay={0.5}
                      />
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {showChangePlanForm && !showUpgradeForm && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {upgradablePlans.length === 0 && currentPlan ? (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
                      <FiAlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No Upgrades Available
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        You are currently on our highest tier plan. No upgrades
                        are available at this time.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setShowChangePlanForm(false)}
                      >
                        Back to Overview
                      </Button>
                    </div>
                  ) : (
                    <SubscriptionForm
                      plans={plans}
                      currentPlan={currentPlan}
                      onSubmit={handleUpgrade}
                      onCancel={() => setShowChangePlanForm(false)}
                      isSubmitting={actionLoading}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {showUpgradeForm && (
                <motion.div
                  key="upgrade-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          Upgrade Plan
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          Review and confirm your upgrade to{" "}
                          {selectedPlan?.name || "Selected Plan"}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowUpgradeForm(false);
                          setShowChangePlanForm(true);
                          setSelectedPlan(null);
                        }}
                        icon={FiArrowLeft}
                      >
                        Back to Plans
                      </Button>
                    </div>

                    <form onSubmit={handlePlanUpgrade} className="space-y-6">
                      {selectedPlan && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Plan Details
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Current Plan
                              </p>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {currentPlan?.name || "No Active Plan"}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                New Plan
                              </p>
                              <p className="font-medium text-primary-600 dark:text-primary-400">
                                {selectedPlan.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <Input
                        type="hidden"
                        value={upgradeData.customer_id}
                        onChange={(e) =>
                          setUpgradeData((prev) => ({
                            ...prev,
                            customer_id: e.target.value,
                          }))
                        }
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Customer Phone *
                        </label>
                        <Input
                          type="tel"
                          value={upgradeData.customer_phone}
                          onChange={(e) =>
                            setUpgradeData((prev) => ({
                              ...prev,
                              customer_phone: e.target.value,
                            }))
                          }
                          placeholder="Enter customer phone number"
                          required
                        />
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                          Upgrade Calculation
                        </h3>

                        {/* Show remaining amount from recent plan */}
                        {upgradeData.current_plan_remaining > 0 && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-3">
                            <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">
                              Remaining Value from Current Plan
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-blue-700 dark:text-blue-300">
                                Remaining Days:{" "}
                                {upgradeData.days_remaining || 0} days
                              </span>
                              <span className="font-medium text-blue-800 dark:text-blue-200">
                                -₹
                                {parseFloat(
                                  upgradeData.current_plan_remaining || 0,
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="space-y-3">
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                            <p className="text-sm text-purple-800 dark:text-purple-200 font-medium mb-2">
                              Plan Pricing
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-purple-700 dark:text-purple-300">
                                New Plan Price:
                              </span>
                              <span className="font-medium text-purple-800 dark:text-purple-200">
                                ₹
                                {parseFloat(upgradeData.amount || 0).toFixed(2)}
                              </span>
                            </div>

                            {upgradeData.discount_percentage > 0 && (
                              <>
                                <div className="flex justify-between items-center mt-1">
                                  <span className="text-purple-700 dark:text-purple-300">
                                    Discount ({upgradeData.discount_percentage}
                                    %):
                                  </span>
                                  <span className="font-medium text-green-600 dark:text-green-400">
                                    -₹
                                    {parseFloat(
                                      upgradeData.discount_amount || 0,
                                    ).toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center mt-1 border-t border-purple-200 dark:border-purple-700 pt-2">
                                  <span className="text-purple-700 dark:text-purple-300 font-medium">
                                    After Discount:
                                  </span>
                                  <span className="font-semibold text-purple-800 dark:text-purple-200">
                                    ₹
                                    {parseFloat(
                                      upgradeData.discounted_amount || 0,
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>

                          {upgradeData.current_plan_remaining > 0 && (
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                              <p className="text-sm text-green-800 dark:text-green-200 font-medium mb-2">
                                Deduction from Current Plan
                              </p>
                              <div className="flex justify-between items-center">
                                <span className="text-green-700 dark:text-green-300">
                                  Remaining Credit (
                                  {upgradeData.days_remaining || 0} days left):
                                </span>
                                <span className="font-medium text-green-800 dark:text-green-200">
                                  -₹
                                  {parseFloat(
                                    upgradeData.current_plan_remaining || 0,
                                  ).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center mt-2 pt-2 border-t border-green-200 dark:border-green-700">
                                <span className="text-green-700 dark:text-green-300 font-medium">
                                  Upgrade Base Amount:
                                </span>
                                <span className="font-semibold text-green-800 dark:text-green-200">
                                  ₹
                                  {parseFloat(
                                    upgradeData.upgrade_amount || 0,
                                  ).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600 dark:text-gray-400">
                                GST ({upgradeData.gstPercentage || 0}%):
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                +₹{parseFloat(upgradeData.gst || 0).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                Total Amount to Pay
                              </span>
                              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                ₹
                                {parseFloat(
                                  upgradeData.total_amount || 0,
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {upgradeData.current_plan_remaining > 0 && (
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 mt-4">
                              <p className="text-sm text-green-800 dark:text-green-200">
                                <strong>💰 You're saving:</strong> ₹
                                {parseFloat(
                                  upgradeData.current_plan_remaining || 0,
                                ).toFixed(2)}{" "}
                                from your current plan!
                              </p>
                            </div>
                          )}

                          {upgradeData.total_amount === 0 && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mt-4">
                              <p className="text-sm text-blue-800 dark:text-blue-200">
                                <strong>🎉 Free Upgrade!</strong> Your remaining
                                plan value covers the full cost of the new plan.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowUpgradeForm(false);
                            setShowChangePlanForm(true);
                          }}
                          disabled={actionLoading}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          variant="primary"
                          loading={actionLoading}
                          disabled={actionLoading}
                        >
                          {actionLoading
                            ? "Processing..."
                            : "Proceed to Payment"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {!showChangePlanForm && !showUpgradeForm && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {initialLoading ? (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                        >
                          <div className="animate-pulse">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                            <div className="space-y-3">
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
                              <div className="flex space-x-2">
                                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-fit"
                        >
                          <div className="animate-pulse">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                              </div>
                              <div className="flex justify-between">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                              </div>
                              <div className="flex justify-between">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/5"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                      >
                        <div className="animate-pulse">
                          <div className="flex items-center justify-between mb-4">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                            <div className="flex space-x-2">
                              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                              <div
                                key={index}
                                className="border-b border-gray-200 dark:border-gray-700 pb-3"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                  </div>
                                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <SubscriptionCard
                          subscription={subscription}
                          onUpgrade={() => setShowChangePlanForm(true)}
                          onCancel={() => setShowCancelConfirm(true)}
                          onReactivate={handleReactivate}
                          onUpdatePaymentMethod={handleUpdatePaymentMethod}
                          onRenew={() => handleRenew()} // Add this line
                          loading={actionLoading}
                        />

                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-fit"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Current Plan Details
                          </h3>

                          {subscription ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Plan Name
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {subscription.plan ||
                                    subscription.planDetails?.name ||
                                    "N/A"}
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Price
                                </span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  <span className="text-lg font-bold">
                                    ₹
                                    {(
                                      parseFloat(
                                        subscription.planDetails?.price || 0,
                                      ) *
                                      (1 -
                                        parseFloat(
                                          subscription.planDetails?.discount ||
                                            0,
                                        ) /
                                          100)
                                    ).toFixed(2)}
                                  </span>
                                  /
                                  {subscription.planDetails?.duration_days ||
                                    "month"}{" "}
                                  Days
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                  Status
                                </span>
                                <StatusBadge
                                  status={subscription.status || "active"}
                                  variant={
                                    subscription.status === "active"
                                      ? "success"
                                      : "warning"
                                  }
                                />
                              </div>

                              {subscription.currentPeriodStart && (
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Start Date
                                  </span>
                                  <span className="text-sm text-gray-900 dark:text-white">
                                    {new Date(subscription.currentPeriodStart).toLocaleDateString('en-IN' ,{
                                      month: '2-digit',
                                      day: '2-digit',
                                      year: 'numeric'
                                    })}

                                    
                                  </span>
                                </div>
                              )}

                              {subscription.currentPeriodEnd && (
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    End Date
                                  </span>
                                  <span className="text-sm text-gray-900 dark:text-white">
                                   {new Date(subscription.currentPeriodEnd).toLocaleDateString('en-IN',{
                                    month: '2-digit',
                                    day: '2-digit',
                                    year: 'numeric'
                                  })}
                                  </span>
                                </div>
                              )}

                              {recentPlanData &&
                                recentPlanData.remainingDays > 0 && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">
                                      Remaining Days
                                    </span>
                                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                      {recentPlanData.remainingDays} days
                                    </span>
                                  </div>
                                )}

                              {recentPlanData &&
                                recentPlanData.remainingAmount > 0 && (
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">
                                      Remaining Value
                                    </span>
                                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                      ₹
                                      {parseFloat(
                                        recentPlanData.remainingAmount,
                                      ).toFixed(2)}
                                    </span>
                                  </div>
                                )}

                              {subscription.paymentId && (
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Payment ID
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                                    {subscription.paymentId}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <p className="text-gray-500 dark:text-gray-400">
                                No active plan found
                              </p>
                            </div>
                          )}
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Payment History
                          </h3>
                          <div className="flex items-center space-x-2">
                            <Select
                              value={paymentStatus}
                              onChange={(e) => setPaymentStatus(e.target.value)}
                              options={[
                                { value: "", label: "All Payments" },
                                { value: "success", label: "Successful" },
                                { value: "failed", label: "Failed" },
                                { value: "pending", label: "Pending" },
                              ]}
                              className="w-40"
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => refreshData()}
                              className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                            >
                              <FiRefreshCw
                                className={`w-4 h-4 text-gray-600 dark:text-gray-300 ${loading ? "animate-spin" : ""}`}
                              />
                            </motion.button>
                          </div>
                        </div>
                        <PaymentHistory
                          payments={payments}
                          loading={loading}
                          onViewInvoice={handleViewInvoice}
                          onDownloadInvoice={handleDownloadInvoice}
                        />
                        {paymentsCount > 0 && pageSize > 0 && (
                          <div className="mt-4 flex justify-center">
                            <Pagination
                              currentPage={currentPage}
                              totalItems={paymentsCount}
                              pageSize={pageSize}
                              onPageChange={setCurrentPage}
                            />
                          </div>
                        )}
                      </motion.div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Cancel Subscription Modal */}
        <AnimatePresence>
          {showCancelConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowCancelConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <FiX className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </motion.div>

                  <motion.h3
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                  >
                    Cancel Subscription
                  </motion.h3>

                  <motion.p
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 dark:text-gray-400 mb-6"
                  >
                    Are you sure you want to cancel your subscription? This
                    action cannot be undone.
                  </motion.p>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex space-x-3"
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        onClick={() => setShowCancelConfirm(false)}
                        className="w-full"
                      >
                        Keep Subscription
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1"
                    >
                      <Button
                        variant="danger"
                        onClick={handleCancel}
                        isLoading={actionLoading}
                        className="w-full"
                      >
                        {actionLoading ? "Cancelling..." : "Cancel Anyway"}
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Purchase Plan Modal */}
        <AnimatePresence>
          {showPurchaseForm && selectedPlan && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowPurchaseForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <FiShoppingCart className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </motion.div>

                  <motion.h3
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                  >
                    Purchase Plan
                  </motion.h3>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {selectedPlan.name}
                    </h4>
                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      ₹{selectedPlan.price || selectedPlan.amount || 0}/
                      {selectedPlan.interval || "month"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {selectedPlan.description || "No description available"}
                    </p>
                  </motion.div>

                  <motion.form
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onSubmit={handlePlanPurchase}
                    className="space-y-4"
                  >
                    <Input
                      type="hidden"
                      name="plan_id"
                      value={purchaseData.plan_id}
                      readOnly
                    />

                    <Input
                      label="Customer ID"
                      type="number"
                      placeholder="Enter customer ID"
                      value={purchaseData.customer_id}
                      onChange={(e) =>
                        setPurchaseData({
                          ...purchaseData,
                          customer_id: e.target.value,
                        })
                      }
                      required
                    />

                    <Input
                      type="hidden"
                      name="amount"
                      value={purchaseData.amount}
                      readOnly
                    />

                    {error && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {error}
                        </p>
                      </div>
                    )}

                    {successMessage && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {successMessage}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowPurchaseForm(false)}
                          className="w-full"
                        >
                          Cancel
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1"
                      >
                        <Button
                          type="submit"
                          disabled={actionLoading}
                          className="w-full"
                        >
                          {actionLoading
                            ? "Processing..."
                            : "Complete Purchase"}
                        </Button>
                      </motion.div>
                    </div>
                  </motion.form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Invoice View Modal */}
        <AnimatePresence>
          {showInvoiceModal && selectedInvoice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowInvoiceModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedInvoice.number || selectedInvoice.planName}
                  </h3>
                  <button
                    onClick={() => setShowInvoiceModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <FiX className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Date
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(
                          selectedInvoice.date || selectedInvoice.createdAt,
                        ).toLocaleDateString('en-IN',{
                          month: '2-digit',
                          day: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Amount
                      </p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        ₹
                        {(
                          selectedInvoice.amount ||
                          selectedInvoice.total ||
                          0
                        ).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Status
                      </p>
                      <StatusBadge
                        status={selectedInvoice.status || "paid"}
                        variant={
                          selectedInvoice.status === "paid"
                            ? "success"
                            : "warning"
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="outline"
                      onClick={() => handleDownloadInvoice(selectedInvoice)}
                      icon={FiDownload}
                    >
                      Download PDF
                    </Button>
                    <Button
                      onClick={() => handleSendInvoice(selectedInvoice)}
                      icon={FiMail}
                    >
                      Send Email
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {/* Renew Subscription Modal */}
      <AnimatePresence>
        {showRenewConfirm && renewPlanData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setShowRenewConfirm(false);
              setRenewPlanData(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <FiRotateCcw className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </motion.div>

                <motion.h3
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                >
                  Renew Subscription
                </motion.h3>

                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 dark:text-gray-400 mb-6"
                >
                  You are about to renew your plan:
                </motion.p>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {renewPlanData.plan_name}
                  </h4>

                  <div className="space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Original Price:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ₹{renewPlanData.original_amount.toFixed(2)}
                      </span>
                    </div>

                    {/* Show discount if applicable */}
                    {renewPlanData.discount_percentage > 0 && (
                      <>
                        <div className="flex justify-between text-green-600 dark:text-green-400">
                          <span>
                            Discount ({renewPlanData.discount_percentage}%):
                          </span>
                          <span>
                            -₹
                            {renewPlanData.discount_amount?.toFixed(2) ||
                              (
                                (renewPlanData.original_amount *
                                  renewPlanData.discount_percentage) /
                                100
                              ).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Subtotal (after discount):
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            ₹
                            {renewPlanData.discounted_amount?.toFixed(2) ||
                              (
                                renewPlanData.original_amount -
                                (renewPlanData.original_amount *
                                  renewPlanData.discount_percentage) /
                                  100
                              ).toFixed(2)}
                          </span>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        GST ({renewPlanData.gst_percentage}%):
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        +₹{renewPlanData.gst_amount.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Total Amount:
                      </span>
                      <span className="font-bold text-xl text-primary-600 dark:text-primary-400">
                        ₹{renewPlanData.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </motion.div>
                )}

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex space-x-3"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowRenewConfirm(false);
                        setRenewPlanData(null);
                      }}
                      className="w-full"
                      disabled={actionLoading}
                    >
                      Cancel
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      variant="primary"
                      onClick={handleRenewPayment}
                      loading={actionLoading}
                      disabled={actionLoading}
                      className="w-full"
                    >
                      {actionLoading ? "Processing..." : "Proceed to Payment"}
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ProtectedRoute>
  );
};

export default PaidUser;
