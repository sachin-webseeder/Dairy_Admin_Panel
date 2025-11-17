// admin_11/src/lib/hooks/useApiNotificationStats.js
import { useState, useEffect } from 'react';
import { notificationService } from '../api/services/notificationService';
import { API_CONFIG } from '../api/config';

export function useApiNotificationStats() {
  const [stats, setStats] = useState({
    totalSent: 0,
    scheduled: 0,
    drafts: 0,
    avgClickRate: "0.0%",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    if (!API_CONFIG.ENABLE_API) {
      // Return mock stats on disabled API
      setStats({ totalSent: 12, scheduled: 3, drafts: 2, avgClickRate: "9.3%" });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.getStats();
      if (response.success) {
        setStats(response.data); // Assuming API returns { data: { totalSent: ..., ... } }
      } else {
        throw new Error(response.message || 'Failed to fetch stats');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching notification stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
}