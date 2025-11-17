// admin_11/src/lib/hooks/useDashboardStats.js
import { useState, useEffect } from 'react';
import { dashboardService } from '../api/services/dashboardService';
import { API_CONFIG } from '../api/config';

export function useDashboardStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    if (!API_CONFIG.ENABLE_API) {
      // Return some mock stats if API is off
      setStats({
        totalProducts: 50,
        availableProducts: 45,
        todaysRevenue: 45000,
        avgRating: 4.5,
        totalOrders: 120,
        completedOrders: 90,
        pendingOrders: 25,
        cancelledOrders: 5,
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getStats();
      if (response.success) {
        setStats(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch stats');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []); // Fetch only once on mount

  return { stats, loading, error, refetch: fetchStats };
}