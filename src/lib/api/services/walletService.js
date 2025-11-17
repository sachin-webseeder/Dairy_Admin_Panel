// admin_11/src/lib/api/services/walletService.js
import { apiClient } from '../client';
import { API_ENDPOINTS, buildUrl } from '../config';

export const walletService = {
  /**
   * Get list of discounts with filters
   */
  async getDiscounts(filters) {
    return apiClient.get(API_ENDPOINTS.WALLET.DISCOUNTS, filters);
  },

  /**
   * Get wallet & discount statistics
   */
  async getStats() {
    return apiClient.get(API_ENDPOINTS.WALLET.GET_STATS);
  },

  /**
   * Create a new discount
   */
  async createDiscount(discountData) {
    return apiClient.post(API_ENDPOINTS.WALLET.CREATE_DISCOUNT, discountData);
  },

  /**
   * Update an existing discount
   */
  async updateDiscount(id, discountData) {
    const endpoint = buildUrl(API_ENDPOINTS.WALLET.UPDATE_DISCOUNT, { id });
    return apiClient.put(endpoint, discountData);
  },

  /**
   * Delete a discount
   */
  async deleteDiscount(id) {
    const endpoint = buildUrl(API_ENDPOINTS.WALLET.DELETE_DISCOUNT, { id });
    return apiClient.delete(endpoint);
  },
};