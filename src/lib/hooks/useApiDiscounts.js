// admin_11/src/lib/hooks/useApiDiscounts.js
import { useState, useEffect } from 'react';
import { walletService } from '../api/services/walletService';
import { API_CONFIG } from '../api/config';
import { usePersistentWallet } from '../usePersistentData'; // For mock data

export function useApiDiscounts(filters) {
  const [{ discounts: localDiscounts }, setLocalWallet] = usePersistentWallet();
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchDiscounts = async () => {
    if (!API_CONFIG.ENABLE_API) {
      setDiscounts(localDiscounts);
      setTotal(localDiscounts.length);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await walletService.getDiscounts(filters);
      // Assuming API returns { data: { discounts: [...], total: ... } }
      setDiscounts(response.data.discounts || []); 
      setTotal(response.data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch discounts');
      setDiscounts(localDiscounts); // Fallback
      setTotal(localDiscounts.length);
    } finally {
      setLoading(false);
    }
  };

  const createDiscount = async (discountData) => {
    if (!API_CONFIG.ENABLE_API) {
      const newDiscount = { ...discountData, id: Date.now().toString() };
      setLocalWallet(prev => ({ ...prev, discounts: [newDiscount, ...prev.discounts] }));
      return { success: true, data: newDiscount };
    }

    try {
      const response = await walletService.createDiscount(discountData);
      await fetchDiscounts(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create discount');
      throw err;
    }
  };

  const updateDiscount = async (id, discountData) => {
    if (!API_CONFIG.ENABLE_API) {
      setLocalWallet(prev => ({
        ...prev,
        discounts: prev.discounts.map(d => d.id === id ? { ...d, ...discountData } : d),
      }));
      return { success: true, data: discountData };
    }

    try {
      const response = await walletService.updateDiscount(id, discountData);
      await fetchDiscounts(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update discount');
      throw err;
    }
  };

  const deleteDiscount = async (id) => {
    if (!API_CONFIG.ENABLE_API) {
      setLocalWallet(prev => ({
        ...prev,
        discounts: prev.discounts.filter(d => d.id !== id),
      }));
      return { success: true };
    }

    try {
      const response = await walletService.deleteDiscount(id);
      await fetchDiscounts(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to delete discount');
      throw err;
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, [JSON.stringify(filters)]);

  return {
    discounts,
    loading,
    error,
    total,
    refetch: fetchDiscounts,
    createDiscount,
    updateDiscount,
    deleteDiscount,
  };
}