// app/order-history/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOrderStore } from "../../store/orderStore";
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FiArrowLeft,
  FiSearch,
  FiPackage,
  FiEye,
  FiCalendar,
  FiUser,
  FiPhone,
  FiCreditCard,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiRefreshCw,
  FiHome,
  FiTrendingUp,
  FiShoppingBag,
  FiDollarSign,
  FiStar,
  FiLock,
  FiShoppingCart,
  FiArrowRight,
} from "react-icons/fi";
import {
  FaRupeeSign,
  FaMobileAlt,
  FaStore,
  FaBoxOpen,
  FaClipboardList,
  FaRegSmile,
} from "react-icons/fa";
import { MdLocalOffer, MdPayment } from "react-icons/md";
import { GiConfirmed, GiTakeMyMoney } from "react-icons/gi";
import { BiTrendingUp, BiDollar, BiShoppingBag } from "react-icons/bi";

const OrderHistoryPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const restaurantId = searchParams.get("user_id");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const {
    orders,
    summary,
    loading,
    error,
    searchPerformed,
    selectedOrder,
    fetchOrderHistory,
    viewOrderDetails,
    clearSelectedOrder,
    resetOrderHistory,
    clearError,
  } = useOrderStore();

  useEffect(() => {
    resetOrderHistory();
  }, [restaurantId, resetOrderHistory]);

  const handleSearch = async (e) => {
    e.preventDefault();
    clearError();

    if (!mobileNumber.trim()) {
      toast.error("Please enter a mobile number", {
        position: "top-right",
        autoClose: 3000,
        transition: Bounce,
      });
      return;
    }

    if (!restaurantId) {
      toast.error("Restaurant ID is required in URL", {
        position: "top-right",
        autoClose: 3000,
        transition: Bounce,
      });
      return;
    }

    // Show loading toast
    const loadingToastId = toast.loading("Searching for orders...", {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    });

    try {
      const result = await fetchOrderHistory(mobileNumber, restaurantId);
      toast.dismiss(loadingToastId);

      if (result.orders.length === 0) {
        toast.error(`No orders found for mobile: ${mobileNumber}`, {
          position: "top-right",
          autoClose: 3000,
          transition: Bounce,
        });
      } else {
        toast.success(`Found ${result.orders.length} order(s)`, {
          position: "top-right",
          autoClose: 3000,
          transition: Bounce,
        });
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error(error.message, {
        position: "top-right",
        autoClose: 4000,
        transition: Bounce,
      });
    }
  };

  const handleReset = () => {
    setMobileNumber("");
    resetOrderHistory();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <GiConfirmed className="w-3.5 h-3.5" />;
      case "pending":
        return <FiClock className="w-3.5 h-3.5" />;
      case "cancelled":
        return <FiXCircle className="w-3.5 h-3.5" />;
      case "processing":
        return <FiRefreshCw className="w-3.5 h-3.5" />;
      default:
        return <FiPackage className="w-3.5 h-3.5" />;
    }
  };

  if (!restaurantId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center p-10 bg-white rounded-2xl shadow-xl max-w-md animate-fade-in-up">
          <div className="text-7xl mb-5 animate-float-1 flex justify-center">
            <FaStore className="w-20 h-20 text-blue-600" />
          </div>
          <h2 className="text-h2-sm md:text-h2-lg font-bold text-slate-800 mb-3">
            Restaurant ID Required
          </h2>
          <p className="text-p-sm text-slate-600 mb-6">
            Please provide a valid restaurant user_id in the URL
          </p>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-primary text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <FiHome className="w-5 h-5" />
            Go to Home
          </button>
          <p className="text-text-sm text-slate-400 mt-6 font-mono">
            Example: /order-history?user_id=2
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* ToastContainer removed - using global one from layout */}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 lg:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => router.back()}
                className="group p-2 hover:bg-slate-100 rounded-xl transition-all duration-300"
              >
                <FiArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-900 group-hover:scale-110 transition-transform" />
              </button>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-primary rounded-xl shadow-md">
                  <FaClipboardList className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h1 className="text-h3-sm md:text-h2-sm font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Order History
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8 lg:py-10">
        {!selectedOrder ? (
          <>
            {/* Hero Search Section */}
            <div className="relative mb-10 lg:mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-2xl blur-3xl"></div>
              <div className="relative bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 lg:p-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center p-3 bg-gradient-primary rounded-2xl mb-4 shadow-lg">
                    <FaMobileAlt className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h2 className="text-h3-sm md:text-h2-sm font-bold text-slate-800 mb-2">
                    Search Customer Orders
                  </h2>
                  <p className="text-text-sm md:text-p-xs text-slate-500">
                    Enter mobile number to view complete order history
                  </p>
                </div>

                <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative group">
                      <div
                        className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-all duration-300 ${isFocused ? "text-blue-600" : "text-slate-400"}`}
                      >
                        <FaMobileAlt className="w-5 h-5" />
                      </div>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) =>
                          setMobileNumber(
                            e.target.value.replace(/\D/g, "").slice(0, 10),
                          )
                        }
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Enter 10-digit mobile number"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-p-xs"
                        maxLength="10"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3.5 bg-gradient-primary text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                      {loading ? (
                        <FiRefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <FiSearch className="w-5 h-5" />
                      )}
                      <span className="font-semibold">Search Orders</span>
                    </button>
                    {searchPerformed && (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="px-6 py-3.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all duration-300 font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </form>

                <div className="flex items-center justify-center gap-4 text-text-xs text-slate-400 text-center mt-4">
                  <span className="flex items-center gap-1">
                    <FiLock className="w-3 h-3" />
                    Secure search
                  </span>
                  <span className="flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    Instant results
                  </span>
                  <span className="flex items-center gap-1">
                    <FaBoxOpen className="w-3 h-3" />
                    Complete details
                  </span>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-8 animate-fade-in-up">
                <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 shadow-sm">
                  <p className="text-red-700 text-p-xs">{error}</p>
                </div>
              </div>
            )}

            {/* Order History Results */}
            {searchPerformed && !loading && orders.length > 0 && (
              <div className="animate-fade-in-up">
                {/* Summary Cards */}
                {summary && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
                    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 border border-slate-100 hover:border-blue-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <FiShoppingBag className="w-5 h-5 text-blue-700" />
                        </div>
                        <BiTrendingUp className="w-4 h-4 text-slate-400" />
                      </div>
                      <p className="text-text-xs text-slate-500 mb-1">
                        Total Orders
                      </p>
                      <p className="text-h3-sm font-bold text-slate-800">
                        {summary.total_orders}
                      </p>
                    </div>

                    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 border border-slate-100 hover:border-emerald-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                          <GiTakeMyMoney className="w-5 h-5 text-emerald-700" />
                        </div>
                        <BiDollar className="w-4 h-4 text-slate-400" />
                      </div>
                      <p className="text-text-xs text-slate-500 mb-1">
                        Total Spent
                      </p>
                      <p className="text-h3-sm font-bold text-slate-800">
                        ₹{formatPrice(summary.total_spent)}
                      </p>
                    </div>

                    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 border border-slate-100 hover:border-purple-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                          <FiTrendingUp className="w-5 h-5 text-purple-700" />
                        </div>
                        <FiStar className="w-4 h-4 text-slate-400" />
                      </div>
                      <p className="text-text-xs text-slate-500 mb-1">
                        Average Order
                      </p>
                      <p className="text-h3-sm font-bold text-slate-800">
                        ₹{formatPrice(summary.average_order_value)}
                      </p>
                    </div>

                    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 border border-slate-100 hover:border-orange-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                          <FiCalendar className="w-5 h-5 text-orange-700" />
                        </div>
                        <FiClock className="w-4 h-4 text-slate-400" />
                      </div>
                      <p className="text-text-xs text-slate-500 mb-1">
                        Last Order
                      </p>
                      <p className="text-text-sm font-semibold text-slate-700">
                        {summary.last_order_date
                          ? formatDate(summary.last_order_date)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                )}

                {/* Orders List Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-h3-xs font-bold text-slate-800">
                      Order History for {mobileNumber}
                    </h3>
                    <p className="text-text-xs text-slate-500 mt-1">
                      Showing {orders.length} order(s)
                    </p>
                  </div>
                  <div className="bg-slate-100 px-3 py-1.5 rounded-full">
                    <span className="text-text-xs text-slate-600">
                      <BiShoppingBag className="inline w-3 h-3 mr-1" />
                      {orders.reduce(
                        (sum, order) => sum + order.items_count,
                        0,
                      )}{" "}
                      items total
                    </span>
                  </div>
                </div>

                {/* Orders List */}
                <div className="space-y-4 md:space-y-5">
                  {orders.map((order, index) => (
                    <div
                      key={order.id}
                      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-200 cursor-pointer overflow-hidden animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => viewOrderDetails(order)}
                    >
                      <div className="p-5 md:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                              <h4 className="font-mono font-bold text-h4-xs text-slate-800">
                                #{order.order_id}
                              </h4>
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-text-xs font-medium border ${getStatusColor(order.order_status)}`}
                              >
                                {getStatusIcon(order.order_status)}
                                {order.order_status}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-text-sm">
                              <div className="flex items-center gap-2 text-slate-600">
                                <FiUser className="w-4 h-4 text-slate-400" />
                                <span>{order.customer_name}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-600">
                                <FiPhone className="w-4 h-4 text-slate-400" />
                                <span>{order.customer_phone}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-600">
                                <FiCalendar className="w-4 h-4 text-slate-400" />
                                <span>{formatDate(order.created_at)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-600">
                                <MdPayment className="w-4 h-4 text-slate-400" />
                                <span className="capitalize">
                                  {order.payment_mode}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-left lg:text-right">
                            <p className="text-h4-sm font-bold text-emerald-600 flex items-center lg:justify-end gap-1">
                              <FaRupeeSign className="w-4 h-4" />
                              {formatPrice(order.grand_total)}
                            </p>
                            <p className="text-text-xs text-slate-500 mt-1">
                              {order.items_count} items
                            </p>
                            <button className="mt-2 text-blue-600 hover:text-blue-700 text-text-xs font-medium flex items-center gap-1 lg:justify-end group-hover:gap-2 transition-all">
                              <FiEye className="w-4 h-4" />
                              View Details
                              <FiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchPerformed && !loading && orders.length === 0 && !error && (
              <div className="animate-fade-in-up">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-12 md:p-16 text-center">
                  <div className="text-8xl mb-6 animate-float-2 flex justify-center">
                    <FaRegSmile className="w-24 h-24 text-slate-300" />
                  </div>
                  <h3 className="text-h3-sm font-bold text-slate-800 mb-3">
                    No orders found
                  </h3>
                  <p className="text-p-xs text-slate-500 mb-2">
                    No orders found for mobile number:{" "}
                    <span className="font-semibold text-slate-700">
                      {mobileNumber}
                    </span>
                  </p>
                  <p className="text-text-sm text-slate-400">
                    Please check the mobile number and try again
                  </p>
                </div>
              </div>
            )}

            {/* Initial State */}
            {!searchPerformed && (
              <div className="animate-fade-in-up">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-12 md:p-16 text-center">
                  <div className="text-8xl mb-6 animate-float-3 flex justify-center">
                    <FaBoxOpen className="w-24 h-24 text-blue-400" />
                  </div>
                  <h3 className="text-h3-sm font-bold text-slate-800 mb-3">
                    Customer Order History
                  </h3>
                  <p className="text-p-xs text-slate-500 mb-2">
                    Enter a customer's mobile number above to view their
                    complete order history
                  </p>
                  <p className="text-text-sm text-slate-400 flex items-center justify-center gap-2">
                    <FaRegSmile className="w-4 h-4" />
                    This is a public page - no login required
                    <FaRegSmile className="w-4 h-4" />
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          // Order Details View
          <div className="animate-fade-in-up">
            <button
              onClick={clearSelectedOrder}
              className="group mb-6 flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-all duration-300"
            >
              <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Orders</span>
            </button>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-text-sm text-blue-100 mb-2">Order ID</p>
                    <h2 className="text-h2-sm md:text-h2-lg font-bold text-white font-mono">
                      #{selectedOrder.order_id}
                    </h2>
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-text-sm font-semibold backdrop-blur-sm bg-white/20 text-white border border-white/30 w-fit`}
                  >
                    {getStatusIcon(selectedOrder.order_status)}
                    {selectedOrder.order_status?.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Order Info */}
              <div className="p-6 md:p-8 border-b border-slate-100">
                <h3 className="text-h4-xs font-bold text-slate-800 mb-5">
                  Order Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-text-xs text-slate-500 mb-1">
                      Customer Name
                    </p>
                    <p className="font-semibold text-slate-800 flex items-center gap-2">
                      <FiUser className="w-4 h-4 text-slate-400" />
                      {selectedOrder.customer_name}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-text-xs text-slate-500 mb-1">
                      Mobile Number
                    </p>
                    <p className="font-semibold text-slate-800 flex items-center gap-2">
                      <FiPhone className="w-4 h-4 text-slate-400" />
                      {selectedOrder.customer_phone}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-text-xs text-slate-500 mb-1">
                      Order Date
                    </p>
                    <p className="font-semibold text-slate-800 flex items-center gap-2">
                      <FiCalendar className="w-4 h-4 text-slate-400" />
                      {formatDate(selectedOrder.created_at)}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-text-xs text-slate-500 mb-1">
                      Payment Mode
                    </p>
                    <p className="font-semibold text-slate-800 flex items-center gap-2 capitalize">
                      <MdPayment className="w-4 h-4 text-slate-400" />
                      {selectedOrder.payment_mode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6 md:p-8 border-b border-slate-100">
                <h3 className="text-h4-xs font-bold text-slate-800 mb-5">
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors px-3 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-p-xs">
                          {item.product_name}
                        </p>
                        <div className="flex gap-4 text-text-sm text-slate-500 mt-1">
                          <span>Quantity: {item.quantity}</span>
                          <span>Price: ₹{formatPrice(item.price)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-800 text-p-sm">
                          ₹{formatPrice(item.total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-6 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="max-w-md ml-auto">
                  <h3 className="text-h4-xs font-bold text-slate-800 mb-4">
                    Order Summary
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-p-xs">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-medium text-slate-800">
                        ₹{formatPrice(selectedOrder.total_amount)}
                      </span>
                    </div>
                    {selectedOrder.discount_amount > 0 && (
                      <div className="flex justify-between text-p-xs">
                        <span className="text-slate-600">Discount</span>
                        <span className="font-medium text-emerald-600 flex items-center gap-1">
                          <MdLocalOffer className="w-3 h-3" />
                          -₹{formatPrice(selectedOrder.discount_amount)}
                        </span>
                      </div>
                    )}
                    {selectedOrder.gst_amount > 0 && (
                      <div className="flex justify-between text-p-xs">
                        <span className="text-slate-600">GST</span>
                        <span className="font-medium text-slate-800">
                          ₹{formatPrice(selectedOrder.gst_amount)}
                        </span>
                      </div>
                    )}
                    <div className="border-t-2 border-slate-200 pt-3 mt-3">
                      <div className="flex justify-between text-h4-xs font-bold">
                        <span className="text-slate-800">Grand Total</span>
                        <span className="text-emerald-600 flex items-center gap-1">
                          <GiTakeMyMoney className="w-4 h-4" />₹
                          {formatPrice(selectedOrder.grand_total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;