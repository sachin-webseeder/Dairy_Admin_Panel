// admin_11/src/lib/hooks/useApiOrders.js
import { useState, useEffect } from 'react';
import { orderService } from '../api/services/orderService';
import { API_CONFIG } from '../api/config';
import { usePersistentOrders } from '../usePersistentData';

/**
 * Hook for managing orders with API integration
 * Falls back to localStorage when API is disabled
 */
export function useApiOrders(filters) {
  const [localOrders, setLocalOrders] = usePersistentOrders();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Fetch orders from API
  const fetchOrders = async () => {
    if (!API_CONFIG.ENABLE_API) {
      // Use local data when API is disabled
      setOrders(localOrders);
      setTotal(localOrders.length);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await orderService.getOrders(filters);
      setOrders(response.data.orders || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
      // Fallback to local data on error
      setOrders(localOrders);
      setTotal(localOrders.length);
    } finally {
      setLoading(false);
    }
  };

  // Create order
  const createOrder = async (order) => {
    if (!API_CONFIG.ENABLE_API) {
      const newOrder = { ...order, id: Date.now().toString() };
      setLocalOrders([...localOrders, newOrder]);
      setOrders([...orders, newOrder]);
      return { success: true, data: newOrder };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await orderService.createOrder(order);
      await fetchOrders(); // Refresh list
      return response;
    } catch (err)
 {
      setError(err.message || 'Failed to create order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update order
  const updateOrder = async (id, order) => {
    if (!API_CONFIG.ENABLE_API) {
      const updated = localOrders.map(o => o.id === id ? { ...o, ...order } : o);
      setLocalOrders(updated);
      setOrders(updated);
      return { success: true, data: order };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await orderService.updateOrder(id, order);
      await fetchOrders(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete order
  const deleteOrder = async (id) => {
    if (!API_CONFIG.ENABLE_API) {
      const filtered = localOrders.filter(o => o.id !== id);
      setLocalOrders(filtered);
      setOrders(filtered);
      return { success: true };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await orderService.deleteOrder(id);
      await fetchOrders(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to delete order');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Update order status
  const updateOrderStatus = async (id, status) => {
     if (!API_CONFIG.ENABLE_API) {
      const updated = localOrders.map(o => o.id === id ? { ...o, status } : o);
      setLocalOrders(updated);
      setOrders(updated);
      return { success: true };
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.updateOrderStatus(id, status);
      await fetchOrders(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update order status');
      throw err;
    } finally {
      setLoading(false);
    }
  }

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchOrders();
  }, [JSON.stringify(filters)]);

  return {
    orders,
    loading,
    error,
    total,
    refetch: fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
    updateOrderStatus
  };
}