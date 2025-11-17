// admin_11/src/lib/hooks/useApiWalletStats.js
import { useState, useEffect } from 'react';
import { walletService } from '../api/services/walletService';
import { API_CONFIG } from '../api/config';

export function useApiWalletStats() {
  const [stats, setStats] = useState({
    // Discount stats
    totalDiscounts: 0,
    activeDiscounts: 0,
    totalRedeemed: 0,
    totalValue: 0,
    // Transaction stats
    totalWalletBalance: 0,
    totalCredit: 0,
    totalDebit: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    if (!API_CONFIG.ENABLE_API) {
      setStats({
        totalDiscounts: 15,
        activeDiscounts: 10,
        totalRedeemed: 120,
        totalValue: 5000,
        totalWalletBalance: 25000,
        totalCredit: 50000,
        totalDebit: 25000,
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await walletService.getStats();
      if (response.success) {
        setStats(response.data); // Assuming API returns all stats
      } else {
        throw new Error(response.message || 'Failed to fetch wallet stats');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching wallet stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
}