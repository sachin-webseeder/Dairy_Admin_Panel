// admin_11/src/lib/api/services/dashboardService.js
import { apiClient } from '../client';
import { API_ENDPOINTS, buildUrl } from '../config'; // Import buildUrl

export const dashboardService = {
  /**
   * Get dashboard statistics (for Stat Cards)
   */
  async getStats() {
    return apiClient.get(API_ENDPOINTS.DASHBOARD.STATS);
  },

  /**
   * Get revenue chart data
   * @param {string} view - 'monthly', 'weekly', 'today'
   */
  async getRevenueChartData(view) {
    // We pass the view as a query param, e.g., /dashboard/revenue-chart?view=monthly
    return apiClient.get(API_ENDPOINTS.DASHBOARD.REVENUE_CHART, { view });
  },

  /**
   * Get order summary chart data
   * @param {string} view - 'monthly', 'weekly'
   */
  async getOrderSummaryData(view) {
    // Assuming a similar endpoint exists, let's re-use REVENUE_CHART for this example
    // In a real app, this might be /dashboard/order-summary-chart
    return apiClient.get(API_ENDPOINTS.DASHBOARD.REVENUE_CHART, { view, type: 'order' });
  },
};