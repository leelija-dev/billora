// services/orderService.js
import api from '../utils/secureApi';
import { logger } from '../utils/logger';

class OrderService {
  constructor() {}

  /**
   * Fetch order history by mobile number
   * @param {string} mobile - Customer mobile number
   * @param {string|number} userId - Restaurant owner/user ID
   * @returns {Promise<Object>} Order history data
   */
  async getOrderHistoryByMobile(mobile, userId) {
    try {
      // Remove any non-digit characters from mobile number
      const cleanMobile = mobile.replace(/\D/g, '');
      
      if (!cleanMobile || cleanMobile.length < 10) {
        throw new Error('Please enter a valid 10-digit mobile number');
      }

      if (!userId) {
        throw new Error('Restaurant ID is required');
      }

      const params = {
        user_id: String(userId)
      };

      logger.log('Fetching order history for mobile:', { mobile: cleanMobile, userId });
      
      const response = await api.get(`/orders/history/${cleanMobile}`, { params });
      
      logger.log('Order history response:', response.data);
      
      return this.transformOrderHistory(response.data);
      
    } catch (error) {
      logger.error('Error fetching order history:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Transform order history response
   * @param {Object} responseData - Raw API response
   * @returns {Object} Transformed order history
   */
  transformOrderHistory(responseData) {
    let orders = [];
    
    // Extract orders array from response
    if (responseData.orders && Array.isArray(responseData.orders)) {
      orders = responseData.orders;
    } else if (responseData.data && Array.isArray(responseData.data)) {
      orders = responseData.data;
    } else if (Array.isArray(responseData)) {
      orders = responseData;
    }
    
    // Transform each order
    const transformedOrders = orders.map(order => this.transformOrder(order));
    
    // Calculate summary
    const summary = {
      total_orders: transformedOrders.length,
      total_spent: transformedOrders.reduce((sum, order) => sum + order.grand_total, 0),
      last_order_date: transformedOrders[0]?.created_at || null,
      average_order_value: transformedOrders.length > 0 
        ? transformedOrders.reduce((sum, order) => sum + order.grand_total, 0) / transformedOrders.length 
        : 0
    };
    
    return {
      orders: transformedOrders,
      summary
    };
  }

  /**
   * Transform single order
   * @param {Object} order - Raw order data
   * @returns {Object} Transformed order
   */
  transformOrder(order) {
    if (!order) return null;
    
    return {
      id: order.id,
      order_id: order.order_id || `ORD${order.id}`,
      customer_name: order.customer_name || order.name || 'Guest',
      customer_phone: order.customer_phone || order.mobile || '',
      total_amount: parseFloat(order.total_amount) || 0,
      discount_amount: parseFloat(order.discount_amount) || 0,
      gst_amount: parseFloat(order.gst_amount) || 0,
      grand_total: parseFloat(order.grand_total) || parseFloat(order.total_amount) || 0,
      payment_mode: order.payment_mode || order.payment_method || 'cash',
      order_status: order.order_status || order.status || 'completed',
      items_count: order.items_count || (order.items?.length || 0),
      items: order.items ? order.items.map(item => this.transformOrderItem(item)) : [],
      created_at: order.created_at,
      notes: order.notes || ''
    };
  }

  /**
   * Transform order item
   * @param {Object} item - Raw order item
   * @returns {Object} Transformed order item
   */
  transformOrderItem(item) {
    return {
      id: item.id,
      product_id: item.product_id,
      product_name: item.product_name || item.name || 'Product',
      quantity: parseInt(item.quantity) || 1,
      price: parseFloat(item.price) || 0,
      total: parseFloat(item.total) || (parseFloat(item.price) * (parseInt(item.quantity) || 1)),
      discount: parseFloat(item.discount) || 0,
      gst: parseFloat(item.gst) || 0,
      image: item.image || null
    };
  }

  /**
   * Handle API errors consistently
   * @param {Error} error - Axios error object
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      const message = error.response.data?.message || 
                     error.response.data?.error || 
                     `Server error: ${error.response.status}`;
      return new Error(message);
    } else if (error.request) {
      return new Error('Network error: Unable to connect to server');
    } else {
      return error;
    }
  }
}

// Create and export singleton instance
export const orderService = new OrderService();