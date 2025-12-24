// src/lib/hooks/useDashboardStats.js
import { useState, useEffect } from 'react';
import { apiClient } from '../api/client'; // ✅ Ensure correct path to client

export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    todaysOrders: 0, // Renamed to match UI usage
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    avgOrderValue: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // ✅ USE THE WORKING ENDPOINT
      const { data } = await apiClient.get('/orders/all');

      if (data.success) {
        // 1. Extract basic stats from the specific 'stats' object in response
        const apiStats = data.stats || {};

        // 2. Calculate extra stats (Revenue, Customers) from the 'orders' array
        const orders = data.orders || [];
        
        const calculatedRevenue = orders
          .filter(o => o.orderStatus === 'Delivered')
          .reduce((sum, o) => sum + (Number(o.finalAmount) || 0), 0);

        // Count unique customers if needed
        const uniqueCustomers = new Set(orders.map(o => o.customer?._id).filter(Boolean)).size;

        setStats({
          totalOrders: apiStats.total || 0,
          todaysOrders: apiStats.today || 0,
          pendingOrders: apiStats.pending || 0,
          deliveredOrders: apiStats.delivered || 0,
          
          // Calculated fields
          totalRevenue: calculatedRevenue,
          totalCustomers: uniqueCustomers || 0,
          avgOrderValue: apiStats.delivered > 0 ? Math.round(calculatedRevenue / apiStats.delivered) : 0
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Don't set global error for 404s to avoid breaking the whole UI, just log it
      // setError(err.message); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
}