// admin_11/src/lib/api/services/notificationService.js
import { apiClient } from '../client';
import { API_ENDPOINTS, buildUrl } from '../config';

export const notificationService = {
  /**
   * Get list of notifications
   */
  async getNotifications(filters) {
    return apiClient.get(API_ENDPOINTS.NOTIFICATIONS.LIST, filters);
  },

  /**
   * Get notification statistics
   */
  async getStats() {
    return apiClient.get(API_ENDPOINTS.NOTIFICATIONS.GET_STATS);
  },

  /**
   * Create (send) a new notification
   */
  async createNotification(notificationData) {
    return apiClient.post(API_ENDPOINTS.NOTIFICATIONS.CREATE, notificationData);
  },
  
  /**
   * Update an existing notification
   */
  async updateNotification(id, notificationData) {
    const endpoint = buildUrl(API_ENDPOINTS.NOTIFICATIONS.UPDATE, { id });
    return apiClient.put(endpoint, notificationData);
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(id) {
    const endpoint = buildUrl(API_ENDPOINTS.NOTIFICATIONS.MARK_READ, { id });
    return apiClient.patch(endpoint);
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    return apiClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  },

  /**
   * Delete a notification
   */
  async deleteNotification(id) {
    const endpoint = buildUrl(API_ENDPOINTS.NOTIFICATIONS.DELETE, { id });
    return apiClient.delete(endpoint);
  },
};