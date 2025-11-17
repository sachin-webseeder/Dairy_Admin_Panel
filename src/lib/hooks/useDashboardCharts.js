// admin_11/src/lib/hooks/useDashboardCharts.js
import { useState, useEffect } from 'react';
import { dashboardService } from '../api/services/dashboardService';
import { API_CONFIG } from '../api/config';
import { revenueDataMonthly, revenueDataWeekly, revenueDataToday } from '../mockData'; // Fallback

export function useDashboardCharts(revenueView) {
  const [revenueData, setRevenueData] = useState(revenueDataMonthly);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Add error state

  // Fetch Revenue Data
  useEffect(() => {
    if (!API_CONFIG.ENABLE_API) {
      const mockData = {
        'monthly': revenueDataMonthly,
        'weekly': revenueDataWeekly,
        'today': revenueDataToday,
      };
      setRevenueData(mockData[revenueView]);
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors
    dashboardService.getRevenueChartData(revenueView)
      .then(response => {
        if (response.success) {
          setRevenueData(response.data.chartData); // Assuming API returns { data: { chartData: [...] } }
        } else {
          throw new Error(response.message || 'Failed to fetch revenue chart');
        }
      })
      .catch(err => {
        console.error("Failed to fetch revenue data", err);
        setError(err.message); // Set error
      })
      .finally(() => setLoading(false));

  }, [revenueView]); // Refetch when view changes

  // Remove the broken "Fetch Order Summary Data" useEffect

  return { revenueData, loading, error };
}