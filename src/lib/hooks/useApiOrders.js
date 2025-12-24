import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client'; // ✅ FIXED IMPORT PATH

export function useApiOrders(params = {}) {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    pending: 0,
    delivered: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (params.status && params.status !== 'all') queryParams.append('status', params.status);
      
      const response = await apiClient.get(`/orders/all?${queryParams.toString()}`);

      // ✅ SAFETY FIX: Handle if response IS the data (interceptor) or HAS data property
      const data = response.data || response; 

      if (data && data.success) {
        setOrders(data.orders || []);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        // Handle case where success is false but no error thrown
        console.warn("API response not successful:", data);
        setOrders([]);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(err.response?.data?.message || err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]); // safe dependency for object

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const deleteOrder = async (id) => {
     await apiClient.delete(`/orders/${id}`);
     fetchOrders(); 
  };

  return {
    orders,
    stats,
    loading,
    error,
    refetch: fetchOrders,
    deleteOrder
  };
}