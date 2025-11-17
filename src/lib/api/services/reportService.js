// admin_11/src/lib/api/services/reportService.js
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';

export const reportService = {
  /**
   * Get sales report
   */
  async getSalesReport(filters) {
    return apiClient.get(API_ENDPOINTS.REPORTS.SALES, filters);
  },

  /**
   * Get customers report
   */
  async getCustomerReport(filters) {
    return apiClient.get(API_ENDPOINTS.REPORTS.CUSTOMERS, filters);
  },
  
  /**
   * Get products report
   */
  async getProductReport(filters) {
    return apiClient.get(API_ENDPOINTS.REPORTS.PRODUCTS, filters);
  },
  
  /**
   * Get revenue report
   */
  async getRevenueReport(filters) {
    return apiClient.get(API_ENDPOINTS.REPORTS.REVENUE, filters);
  },

  /**
   * Get top products (for Dashboard)
   */
  async getTopProducts() {
    // This is the same as getProductReport, but maybe with default filters
    return apiClient.get(API_ENDPOINTS.REPORTS.PRODUCTS, { sort: 'top-selling', limit: 5 });
  },
};