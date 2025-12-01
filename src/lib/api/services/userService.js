import { apiClient } from '../client';
import { API_ENDPOINTS, buildUrl } from '../config';

export const userService = {
  /**
   * Get all panel users
   */
  async getUsers(filters) {
    return apiClient.get(API_ENDPOINTS.USERS.LIST, filters);
  },

  /**
   * Create a new panel user
   */
  async createUser(userData) {
    // userData: { firstName, lastName, email, phone, password, permissions: [] }
    return apiClient.post(API_ENDPOINTS.USERS.CREATE, userData);
  },

  /**
   * Update a panel user
   */
  async updateUser(id, userData) {
    // userData: { permissions: [], isActive: true/false, ... }
    return apiClient.put(buildUrl(API_ENDPOINTS.USERS.UPDATE, { id }), userData);
  },

  /**
   * Delete a panel user
   */
  async deleteUser(id) {
    return apiClient.delete(buildUrl(API_ENDPOINTS.USERS.DELETE, { id }));
  },
  
  /**
   * Toggle user status (using update)
   */
  async toggleUserStatus(id, currentStatus) {
    const isActive = currentStatus === 'active' ? false : true; // Backend expects boolean
    return apiClient.put(buildUrl(API_ENDPOINTS.USERS.UPDATE, { id }), { isActive });
  }
};