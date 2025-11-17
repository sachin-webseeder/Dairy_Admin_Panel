// admin_11/src/lib/api/services/orderService.js
import { apiClient } from '../client';
import { API_ENDPOINTS, buildUrl } from '../config';

export const orderService = {
  /**
   * Get list of orders with filters
   */
  async getOrders(filters) {
    // 'filters' will be { search, status, membership, page, limit }
    return apiClient.get(API_ENDPOINTS.ORDERS.LIST, filters);
  },

  /**
   * Get a single order
   */
  async getOrder(id) {
    const endpoint = buildUrl(API_ENDPOINTS.ORDERS.GET, { id });
    return apiClient.get(endpoint);
  },

  /**
   * Create a new order
   */
  async createOrder(orderData) {
    return apiClient.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
  },

  /**
   * Update an existing order
   */
  async updateOrder(id, orderData) {
    const endpoint = buildUrl(API_ENDPOINTS.ORDERS.UPDATE, { id });
    return apiClient.put(endpoint, orderData);
  },

  /**
   * Delete an order
   */
  async deleteOrder(id) {
    const endpoint = buildUrl(API_ENDPOINTS.ORDERS.DELETE, { id });
    return apiClient.delete(endpoint);
  },
  
  /**
   * Update order status
   */
  async updateOrderStatus(id, status) {
    const endpoint = buildUrl(API_ENDPOINTS.ORDERS.UPDATE_STATUS, { id });
    // The backend is expecting an object, e.g., { "status": "completed" }
    return apiClient.patch(endpoint, { status });
  },
};