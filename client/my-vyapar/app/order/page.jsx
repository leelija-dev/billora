"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Nav2 from "@/components/Nav2";
import Footer from "@/components/Footer";

const OrderPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  // Load orders from localStorage
  useEffect(() => {
    // Simulate loading delay for smooth UX
    setTimeout(() => {
      try {
        // Get orders from localStorage
        const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
        
        // If no orders exist, show empty state
        if (savedOrders.length === 0) {
          setOrders([]);
        } else {
          // Sort orders by date (newest first)
          const sortedOrders = savedOrders.sort((a, b) => 
            new Date(b.orderDate) - new Date(a.orderDate)
          );
          setOrders(sortedOrders);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      }
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return '✅';
      case 'processing':
        return '⚙️';
      case 'shipped':
        return '🚚';
      case 'pending':
        return '⏳';
      case 'cancelled':
        return '❌';
      default:
        return '📦';
    }
  };

  const cancelOrder = (orderId) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      const updatedOrders = orders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: "Cancelled", 
              cancellationReason: "Customer requested cancellation",
              cancelledAt: new Date().toISOString()
            }
          : order
      );
      setOrders(updatedOrders);
      localStorage.setItem('userOrders', JSON.stringify(updatedOrders));
      alert('Order cancelled successfully!');
    }
  };

  const reorderItems = (order) => {
    // Add items to cart and redirect to cart page
    const cartItems = order.items.map(item => ({
      id: item.id,
      title: item.name,
      price: item.price,
      quantity: item.quantity,
      img: item.image || '/image/placeholder.png',
      category: item.category || 'General'
    }));
    
    // Save to localStorage cart
    localStorage.setItem('cart', JSON.stringify(cartItems));
    alert('Items added to cart! Redirecting to cart...');
    setTimeout(() => {
      router.push('/cart');
    }, 1000);
  };

  const downloadInvoice = (order) => {
    // Create invoice HTML content
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${order.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .company { font-size: 24px; font-weight: bold; color: #3b82f6; }
          .invoice-title { font-size: 20px; margin: 20px 0; }
          .order-details { margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background-color: #f3f4f6; }
          .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
          .footer { text-align: center; margin-top: 50px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company">Billora</div>
          <div class="invoice-title">Tax Invoice</div>
        </div>
        
        <div class="order-details">
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Order Date:</strong> ${formatDate(order.orderDate)}</p>
          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p><strong>Order Status:</strong> ${order.status}</p>
        </div>
        
        <h3>Items:</h3>
        <table>
          <thead>
            <tr><th>Item</th><th>Quantity</th><th>Price</th><th>Total</th></tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price.toLocaleString('en-IN')}</td>
                <td>₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="total">
          Total Amount: ₹${order.total.toLocaleString('en-IN')}
        </div>
        
        <div class="footer">
          <p>Thank you for shopping with us!</p>
          <p>For any queries, contact us at support@billora.com</p>
        </div>
      </body>
      </html>
    `;
    
    // Create blob and download
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${order.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(order => order.status?.toLowerCase() === filterStatus.toLowerCase());

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  if (loading) {
    return (
      <>
        <Nav2/>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav2 />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              My Orders
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Track and manage all your orders in one place
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 border-b border-gray-200 pb-4">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium transition-all capitalize ${
                  filterStatus === status
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All Orders' : status}
                {status !== 'all' && (
                  <span className="ml-2 text-xs">
                    ({orders.filter(o => o.status?.toLowerCase() === status).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 sm:py-16 bg-white rounded-2xl shadow-sm">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">You haven't placed any orders yet</p>
              <Link href="/products">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Start Shopping
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-100"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Order ID</p>
                        <p className="font-mono font-semibold text-gray-900 text-sm sm:text-base">
                          {order.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Order Date</p>
                        <p className="font-medium text-gray-700 text-sm sm:text-base">
                          {formatDate(order.orderDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-500">Total Amount</p>
                        <p className="font-bold text-blue-600 text-lg sm:text-xl">
                          ₹{order.total.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Details - Collapsible */}
                  <div className="p-4 sm:p-6">
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="w-full flex items-center justify-between text-left mb-4"
                    >
                      <span className="font-semibold text-gray-700 text-sm sm:text-base">
                        Order Items ({order.items.length})
                      </span>
                      <span className="text-blue-600 text-lg">
                        {selectedOrder === order.id ? '▲' : '▼'}
                      </span>
                    </button>

                    {selectedOrder === order.id && (
                      <div className="space-y-4 animate-fadeIn">
                        {/* Items List with Images */}
                        <div className="space-y-3">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex gap-3 items-center py-2 border-b border-gray-100">
                              {item.image && (
                                <div className="w-12 h-12 relative flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                  <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className="w-full h-full object-contain p-1"
                                    onError={(e) => e.target.src = '/image/placeholder.png'}
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-gray-800 text-sm sm:text-base">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                              </div>
                              <p className="font-semibold text-gray-900">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Payment Info */}
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Payment Method:</span> {order.paymentMethod}
                          </p>
                          {order.trackingId && (
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Tracking ID:</span> {order.trackingId}
                            </p>
                          )}
                          {order.estimatedDelivery && (
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Estimated Delivery:</span> {formatDate(order.estimatedDelivery)}
                            </p>
                          )}
                          {order.cancellationReason && (
                            <p className="text-sm text-red-600">
                              <span className="font-semibold">Cancellation Reason:</span> {order.cancellationReason}
                            </p>
                          )}
                        </div>

                        {/* Shipping Address */}
                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                            Shipping Address
                          </h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>{order.shippingAddress.fullName}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>
                              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                            </p>
                            <p>Phone: {order.shippingAddress.phone}</p>
                            <p>Email: {order.shippingAddress.email}</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                          {order.status?.toLowerCase() !== 'cancelled' && order.status?.toLowerCase() !== 'delivered' && (
                            <button
                              onClick={() => cancelOrder(order.id)}
                              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition text-sm sm:text-base"
                            >
                              Cancel Order
                            </button>
                          )}
                          {order.status?.toLowerCase() === 'delivered' && (
                            <button
                              onClick={() => reorderItems(order)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
                            >
                              Buy Again
                            </button>
                          )}
                          <button
                            onClick={() => downloadInvoice(order)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm sm:text-base"
                          >
                            Download Invoice
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default OrderPage;