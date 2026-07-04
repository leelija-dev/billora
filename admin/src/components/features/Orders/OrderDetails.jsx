import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { FiEdit2, FiX, FiCheckCircle } from "react-icons/fi";
import StatusBadge from "../../common/StatusBadge/StatusBadge";
import Button from "../../common/Button/Button";
import Select from "../../common/Select/Select";
import Input from "../../common/Input/Input";
import toast from "react-hot-toast";

const OrderDetails = ({
  order,
  onUpdateOrder,
  onUpdatePayment,
  onUpdateOrderPayment,
  onPrintInvoice,
  user,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, setEditStatus] = useState(order.order_status);
  const [editPaymentStatus, setEditPaymentStatus] = useState(
    order.payment_status,
  );
  const [paymentAmount, setPaymentAmount] = useState("");
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [paymentAmountError, setPaymentAmountError] = useState("");

  // Calculate if order is fully paid
  const calculateRemainingAmount = () => {
    return parseFloat(order.total_amount || 0) - parseFloat(order.paid_amount || 0);
  };

  const isFullyPaid = calculateRemainingAmount() <= 0;

  console.log("checking orders:", order);

  // Helper function to validate numeric input
  const validateNumericInput = (value) => {
    if (value === "") return true;
    // Allow only numbers and decimal point
    const regex = /^\d*\.?\d*$/;
    return regex.test(value);
  };

  // Helper function to sanitize numeric input
  const sanitizeNumericInput = (value) => {
    // Remove any non-numeric characters except decimal point
    return value.replace(/[^\d.]/g, '');
  };

  // Helper function to format attributes
  const formatAttributes = (attributes) => {
    if (!attributes || !Array.isArray(attributes) || attributes.length === 0) {
      return "";
    }
    
    const attrStrings = attributes.map(attr => {
      if (typeof attr === 'object') {
        const entries = Object.entries(attr);
        return entries.map(([key, value]) => `${key}: ${value}`).join(', ');
      }
      return String(attr);
    });
    
    return attrStrings.join(' | ');
  };

  // Helper function to calculate item total with discount and GST
  const calculateItemTotal = (item) => {
    const price = parseFloat(item.price || 0);
    const quantity = parseFloat(item.quantity || 1);
    const discountPercent = parseFloat(item.discount || 0);
    const gstPercent = parseFloat(item.gst || 0);

    // Apply discount first
    const discountedPrice = price - (price * discountPercent / 100);
    
    // Then apply GST on discounted price
    const gstAmount = discountedPrice * gstPercent / 100;
    const finalPrice = discountedPrice + gstAmount;

    return finalPrice * quantity;
  };

  // Helper function to calculate line item breakdown
  const calculateItemBreakdown = (item) => {
    const price = parseFloat(item.price || 0);
    const quantity = parseFloat(item.quantity || 1);
    const discountPercent = parseFloat(item.discount || 0);
    const gstPercent = parseFloat(item.gst || 0);

    const discountedPrice = price - (price * discountPercent / 100);
    const discountAmount = price * discountPercent / 100;
    const gstAmount = discountedPrice * gstPercent / 100;
    const finalPrice = discountedPrice + gstAmount;
    const total = finalPrice * quantity;

    return {
      basePrice: price,
      discountedPrice,
      discountAmount,
      discountPercent,
      gstAmount,
      gstPercent,
      finalPrice,
      quantity,
      total
    };
  };

  // Handle payment amount change with validation
  const handlePaymentAmountChange = (e) => {
    let value = e.target.value;
    
    // Remove any non-numeric characters except decimal point
    value = sanitizeNumericInput(value);
    
    // Prevent multiple decimal points
    const decimalCount = (value.match(/\./g) || []).length;
    if (decimalCount > 1) {
      return;
    }
    
    // Prevent leading zeros if not decimal
    if (value.length > 1 && value.startsWith('0') && !value.startsWith('0.')) {
      value = value.replace(/^0+/, '');
      if (value === '') value = '0';
    }
    
    setPaymentAmount(value);
    setPaymentAmountError("");
    
    // Additional validation
    if (value && value !== ".") {
      const numValue = parseFloat(value);
      const remainingAmount = calculateRemainingAmount();
      
      if (numValue > remainingAmount) {
        setPaymentAmountError(`Amount cannot exceed remaining due of ₹${remainingAmount.toFixed(2)}`);
      } else if (numValue <= 0) {
        setPaymentAmountError("Amount must be greater than 0");
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "warning",
      processing: "info",
      completed: "success",
      cancelled: "danger",
      refunded: "default",
    };
    return colors[status] || "default";
  };

  const safeFormatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.error("Invalid date value:", dateString);
        return "Invalid Date";
      }
      // return format(date, "PPP");
      return format(date, "MMMM d, yyyy hh:mm a");
    } catch (error) {
      console.error("Date formatting error:", error, "Input:", dateString);
      return "Invalid Date";
    }
  };

  const handleStatusUpdate = async () => {
    if (editStatus !== order.order_status) {
      try {
        await onUpdateOrder(order.id, editStatus);
        order.order_status = editStatus;
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating order status:", error);
      }
    }
  };

  const handlePaymentStatusUpdate = async () => {
    if (editPaymentStatus !== order.payment_status) {
      try {
        await onUpdatePayment(order.id, editPaymentStatus);
        order.payment_status = editPaymentStatus;
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating payment status:", error);
      }
    }
  };

  const handlePaymentAmountUpdate = async () => {
    // Clear any previous errors
    setPaymentAmountError("");
    
    // Validate payment amount
    if (!paymentAmount || paymentAmount === ".") {
      toast.error("Please enter a valid payment amount");
      return;
    }
    
    const amount = parseFloat(paymentAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid payment amount greater than 0");
      return;
    }

    // Check if trying to pay more than remaining amount
    const remainingAmount = calculateRemainingAmount();
    if (amount > remainingAmount) {
      toast.error(`Payment amount cannot exceed remaining amount of ₹${remainingAmount.toFixed(2)}`);
      return;
    }

    try {
      const result = await onUpdateOrderPayment(
        order.id,
        user.id,
        paymentAmount,
      );
      setPaymentAmount("");
      setPaymentAmountError("");
      setShowPaymentSection(false);

      // The store method already shows appropriate toast messages
      // No need to show duplicate message here
    } catch (error) {
      console.error("Error updating payment amount:", error);
      toast.error("Failed to add payment");
    }
  };

  const handleBothUpdates = async () => {
    const statusChanged = editStatus !== order.order_status;
    const paymentStatusChanged = editPaymentStatus !== order.payment_status;

    try {
      // Update order status if changed
      if (statusChanged) {
        await onUpdateOrder(order.id, editStatus);
        order.order_status = editStatus;
      }

      // Update payment status if changed
      if (paymentStatusChanged) {
        await onUpdatePayment(order.id, editPaymentStatus);
        order.payment_status = editPaymentStatus;
      }

      // Only close editing if both updates were successful
      setIsEditing(false);

      // Show success message
      if (statusChanged && paymentStatusChanged) {
        toast.success("Both order and payment status updated successfully");
      } else if (statusChanged) {
        toast.success("Order status updated successfully");
      } else if (paymentStatusChanged) {
        toast.success("Payment status updated successfully");
      }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
      // Don't close editing on error
      throw error;
    }
  };

  const handlePrintInvoice = (type) => {
    if (onPrintInvoice) {
      onPrintInvoice(order, type);
    }
  };

  // Helper function to handle key press (prevent alphabets and special characters)
  const handleKeyPress = (e) => {
    // Allow: backspace, delete, tab, escape, enter, decimal point
    if (e.key === '.' || e.key === 'Backspace' || e.key === 'Delete' || 
        e.key === 'Tab' || e.key === 'Escape' || e.key === 'Enter') {
      return;
    }
    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x')) {
      return;
    }
    // Ensure it's a number
    if (isNaN(Number(e.key)) || e.key === ' ') {
      e.preventDefault();
      toast.error("Only numbers and decimal points are allowed", {
        duration: 1500,
        icon: '⚠️'
      });
    }
  };

  // Helper function to handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    // Remove any non-numeric characters except decimal point
    const sanitized = pastedText.replace(/[^\d.]/g, '');
    if (sanitized) {
      // Prevent multiple decimal points
      const decimalCount = (sanitized.match(/\./g) || []).length;
      if (decimalCount <= 1) {
        setPaymentAmount(sanitized);
      }
    }
  };

  const orderStatusOptions = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "ready_to_serve", label: "Ready to Serve" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const paymentStatusOptions = [
    { value: "pending", label: "Pending" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
  ];

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {safeFormatDate(order.created_at)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Order Status
          </p>
          <StatusBadge
            status={order.order_status}
            variant={getStatusColor(order.order_status)}
          />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Payment Status
          </p>
          <StatusBadge
            status={order.payment_status}
            variant={
              order.payment_status === "completed"
                ? "success"
                : order.payment_status === "failed"
                  ? "danger"
                  : "warning"
            }
          />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Payment Method
          </p>
          <p className="font-medium text-gray-900 dark:text-white capitalize">
            {order.payment_method?.replace("_", " ")}
          </p>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Customer Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {order.customer_name}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {order.customer_phone || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
          Order Items
        </h3>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Product
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Quantity
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Price
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Discount
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  GST
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {order.items?.map((item, index) => {
                const breakdown = calculateItemBreakdown(item);
                const formattedAttrs = formatAttributes(item.product?.attributes);
                
                return (
                  <tr key={index}>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.product?.name || item.product_name || item.name}
                      </p>
                      <div className="mt-1 space-y-0.5">
                        {item.product?.brand?.name && (
                          <p className="text-xs text-green-600 dark:text-green-400">
                            Brand: {item.product.brand.name}
                          </p>
                        )}
                        {item.product?.category?.name && (
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            Category: {item.product.category.name}
                          </p>
                        )}
                        {item.product?.sku && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SKU: {item.product.sku}
                          </p>
                        )}
                        {item.product?.unit?.code && (
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Unit: {item.product.unit.code}
                          </p>
                        )}
                        {formattedAttrs && (
                          <p className="text-xs text-orange-600 dark:text-orange-400">
                            {formattedAttrs}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                      {breakdown.quantity} {item.product?.unit?.code || ''}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                      ₹{breakdown.basePrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                      {breakdown.discountPercent > 0 ? `${breakdown.discountPercent}%` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">
                      {breakdown.gstPercent > 0 ? `${breakdown.gstPercent}%` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                      ₹{breakdown.total.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Subtotal:
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 dark:text-white">
                  ₹{parseFloat(order.total_amount || 0).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-3 text-right text-base font-bold text-gray-900 dark:text-white"
                >
                  Total:
                </td>
                <td className="px-4 py-3 text-right text-base font-bold text-primary-600">
                  ₹{parseFloat(order.total_amount || 0).toFixed(2)}
                </td>
              </tr>
            </tfoot>
           </table>
        </div>
      </div>

      {/* Order Notes */}
      {order.notes && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Order Notes
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            {order.notes}
          </p>
        </div>
      )}

      {/* Payment Details Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Payment Details
          </h3>
          {/* Show Add Payment button only if not fully paid */}
          {!isFullyPaid && (
            <Button
              onClick={() => {
                setShowPaymentSection(!showPaymentSection);
                setPaymentAmountError("");
                setPaymentAmount("");
              }}
              variant="outline"
              size="sm"
              icon={() => <span>₹</span>}
            >
              {showPaymentSection ? "Cancel" : "Add Payment"}
            </Button>
          )}
        </div>

        {/* Show message when fully paid */}
        {isFullyPaid && (
          <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4 flex items-center gap-3">
            <FiCheckCircle className="text-green-600 dark:text-green-400 text-xl flex-shrink-0" />
            <div>
              <p className="text-green-800 dark:text-green-300 font-medium">
                Payment Completed
              </p>
              <p className="text-green-700 dark:text-green-400 text-sm">
                This order has been fully paid. Total: ₹{parseFloat(order.total_amount || 0).toFixed(2)} | 
                Paid: ₹{parseFloat(order.paid_amount || 0).toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {!isFullyPaid && showPaymentSection && (
          <div className="space-y-3">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Amount:
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ₹{parseFloat(order.total_amount || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Already Paid:
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  ₹{parseFloat(order.paid_amount || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mt-1 pt-2 border-t border-gray-300 dark:border-gray-600">
                <span className="text-gray-600 dark:text-gray-400">
                  Due Amount:
                </span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  ₹{calculateRemainingAmount().toFixed(2)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Payment Amount
              </label>
              <Input
                type="text"
                inputMode="decimal"
                placeholder={`Enter amount (Due: ₹${calculateRemainingAmount().toFixed(2)})`}
                value={paymentAmount}
                onChange={handlePaymentAmountChange}
                onKeyPress={handleKeyPress}
                onPaste={handlePaste}
                className={`w-full ${paymentAmountError ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {paymentAmountError && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {paymentAmountError}
                </p>
              )}
            </div>

            {paymentAmount && parseFloat(paymentAmount) > 0 && !paymentAmountError && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {parseFloat(paymentAmount) >= calculateRemainingAmount()
                  ? `✅ This payment will complete the order and change status to "completed"`
                  : `⚠️ Remaining due after this payment: ₹${(calculateRemainingAmount() - parseFloat(paymentAmount)).toFixed(2)}`}
              </div>
            )}

            <Button
              onClick={handlePaymentAmountUpdate}
              disabled={
                !paymentAmount || 
                parseFloat(paymentAmount) <= 0 || 
                parseFloat(paymentAmount) > calculateRemainingAmount() ||
                !!paymentAmountError
              }
              className="w-full"
            >
              Add Payment
            </Button>
          </div>
        )}

        {/* Show payment summary even when not in edit mode and not fully paid */}
        {!isFullyPaid && !showPaymentSection && (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Total Amount:
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                ₹{parseFloat(order.total_amount || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-gray-600 dark:text-gray-400">
                Already Paid:
              </span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                ₹{parseFloat(order.paid_amount || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1 pt-2 border-t border-gray-300 dark:border-gray-600">
              <span className="text-gray-600 dark:text-gray-400">
                Due Amount:
              </span>
              <span className="font-bold text-red-600 dark:text-red-400">
                ₹{calculateRemainingAmount().toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mt-6">
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="outline"
          icon={FiEdit2}
          className="flex-1"
        >
          {isEditing ? "Cancel" : "Update Status"}
        </Button>

        <Button
          onClick={() => handlePrintInvoice("a4")}
          variant="primary"
          className="flex-1"
        >
          Print A4 Invoice
        </Button>

        <Button
          onClick={() => handlePrintInvoice("thermal")}
          variant="secondary"
          className="flex-1"
        >
          Print Thermal
        </Button>
      </div>

      {/* Edit Status Section */}
      {isEditing && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Update Order Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order Status
              </label>
              <Select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                options={orderStatusOptions}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Payment Status
              </label>
              <Select
                value={editPaymentStatus}
                onChange={(e) => setEditPaymentStatus(e.target.value)}
                options={paymentStatusOptions}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleBothUpdates}
              variant="primary"
              disabled={
                editStatus === order.order_status &&
                editPaymentStatus === order.payment_status
              }
            >
              Save All Changes
            </Button>
            <Button onClick={() => setIsEditing(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;