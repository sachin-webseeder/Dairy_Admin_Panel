// admin_11/src/lib/api/services/membershipService.js
import { apiClient } from '../client';
import { API_ENDPOINTS, buildUrl } from '../config';

export const membershipService = {
  /**
   * Get list of membership plans
   */
  async getMemberships(filters) {
    return apiClient.get(API_ENDPOINTS.MEMBERSHIP.LIST, filters);
  },

  /**
   * Create a new membership plan
   */
  async createMembership(membershipData) {
    return apiClient.post(API_ENDPOINTS.MEMBERSHIP.CREATE, membershipData);
  },

  /**
   * Update an existing membership plan
   */
  async updateMembership(id, membershipData) {
    const endpoint = buildUrl(API_ENDPOINTS.MEMBERSHIP.UPDATE, { id });
    return apiClient.put(endpoint, membershipData);
  },

  /**
   * Delete a membership plan
   */
  async deleteMembership(id) {
    const endpoint = buildUrl(API_ENDPOINTS.MEMBERSHIP.DELETE, { id });
    return apiClient.delete(endpoint);
  },
};