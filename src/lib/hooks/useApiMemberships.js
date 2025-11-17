// admin_11/src/lib/hooks/useApiMemberships.js
import { useState, useEffect } from 'react';
import { membershipService } from '../api/services/membershipService';
import { API_CONFIG } from '../api/config';
import { usePersistentMembership } from '../usePersistentData'; // For mock data fallback

export function useApiMemberships(filters) {
  const [localMemberships, setLocalMemberships] = usePersistentMembership();
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchMemberships = async () => {
    if (!API_CONFIG.ENABLE_API) {
      setMemberships(localMemberships);
      setTotal(localMemberships.length);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await membershipService.getMemberships(filters);
      // Assuming API returns { data: { memberships: [...], total: ... } }
      setMemberships(response.data.memberships || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch membership plans');
      setMemberships(localMemberships); // Fallback
      setTotal(localMemberships.length);
    } finally {
      setLoading(false);
    }
  };

  const createMembership = async (membershipData) => {
    if (!API_CONFIG.ENABLE_API) {
      const newPlan = { ...membershipData, id: Date.now().toString() };
      setLocalMemberships([...localMemberships, newPlan]);
      return { success: true, data: newPlan };
    }

    try {
      const response = await membershipService.createMembership(membershipData);
      await fetchMemberships(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create membership');
      throw err;
    }
  };

  const updateMembership = async (id, membershipData) => {
    if (!API_CONFIG.ENABLE_API) {
      setLocalMemberships(prev => prev.map(m => m.id === id ? { ...m, ...membershipData } : m));
      return { success: true, data: membershipData };
    }

    try {
      const response = await membershipService.updateMembership(id, membershipData);
      await fetchMemberships(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update membership');
      throw err;
    }
  };

  const deleteMembership = async (id) => {
    if (!API_CONFIG.ENABLE_API) {
      setLocalMemberships(prev => prev.filter(m => m.id !== id));
      return { success: true };
    }

    try {
      const response = await membershipService.deleteMembership(id);
      await fetchMemberships(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to delete membership');
      throw err;
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, [JSON.stringify(filters)]);

  return {
    memberships,
    loading,
    error,
    total,
    refetch: fetchMemberships,
    createMembership,
    updateMembership,
    deleteMembership,
  };
}