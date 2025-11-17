// admin_11/src/lib/api/services/deliveryStaffService.js
import { apiClient } from '../client';
import { API_ENDPOINTS, buildUrl } from '../config';

export const deliveryStaffService = {
  /**
   * Get list of delivery staff with filters
   */
  async getDeliveryStaff(filters) {
    return apiClient.get(API_ENDPOINTS.DELIVERY_STAFF.LIST, filters);
  },

  /**
   * Get a single staff member
   */
  async getStaffMember(id) {
    const endpoint = buildUrl(API_ENDPOINTS.DELIVERY_STAFF.GET, { id });
    return apiClient.get(endpoint);
  },

  /**
   * Create a new staff member
   */
  async createStaffMember(staffData) {
    return apiClient.post(API_ENDPOINTS.DELIVERY_STAFF.CREATE, staffData);
  },

  /**
   * Update an existing staff member
   */
  async updateStaffMember(id, staffData) {
    const endpoint = buildUrl(API_ENDPOINTS.DELIVERY_STAFF.UPDATE, { id });
    return apiClient.put(endpoint, staffData);
  },

  /**
   * Delete a staff member
   */
  async deleteStaffMember(id) {
    const endpoint = buildUrl(API_ENDPOINTS.DELIVERY_STAFF.DELETE, { id });
    return apiClient.delete(endpoint);
  },
  
  /**
   * Toggle staff member status
   */
  async toggleStaffMemberStatus(id) {
    const endpoint = buildUrl(API_ENDPOINTS.DELIVERY_STAFF.TOGGLE_STATUS, { id });
    return apiClient.patch(endpoint);
  },
};