// admin_11/src/lib/api/services/homepageService.js
import { apiClient } from '../client';
import { API_ENDPOINTS, buildUrl } from '../config';

export const homepageService = {
  
  // --- Functions for the Full Page Editor ---

  /**
   * Get the entire homepage settings object
   */
  async getSettings() {
    return apiClient.get(API_ENDPOINTS.HOMEPAGE.GET_SETTINGS);
  },

  /**
   * Update the entire homepage settings object
   */
  async updateSettings(settingsData) {
    return apiClient.put(API_ENDPOINTS.HOMEPAGE.UPDATE_SETTINGS, settingsData);
  },

  // --- Functions for the simple banner list (not used by this page) ---

  async getBanners(filters) {
    return apiClient.get(API_ENDPOINTS.HOMEPAGE.BANNERS, filters);
  },
  async createBanner(bannerData) {
    return apiClient.post(API_ENDPOINTS.HOMEPAGE.CREATE_BANNER, bannerData);
  },
  async updateBanner(id, bannerData) {
    const endpoint = buildUrl(API_ENDPOINTS.HOMEPAGE.UPDATE_BANNER, { id });
    return apiClient.put(endpoint, bannerData);
  },
  async deleteBanner(id) {
    const endpoint = buildUrl(API_ENDPOINTS.HOMEPAGE.DELETE_BANNER, { id });
    return apiClient.delete(endpoint);
  },
  async reorderBanners(orderData) {
    return apiClient.post(API_ENDPOINTS.HOMEPAGE.REORDER_BANNERS, orderData);
  }
};