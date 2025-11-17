// admin_11/src/lib/hooks/useApiDeliveryStaff.js
import { useState, useEffect } from 'react';
import { deliveryStaffService } from '../api/services/deliveryStaffService';
import { API_CONFIG } from '../api/config';
import { usePersistentDeliveryBoys as usePersistentDeliveryStaff } from '../usePersistentData';
export function useApiDeliveryStaff(filters) {
  const [localStaff, setLocalStaff] = usePersistentDeliveryStaff();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchDeliveryStaff = async () => {
    if (!API_CONFIG.ENABLE_API) {
      setStaff(localStaff);
      setTotal(localStaff.length);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await deliveryStaffService.getDeliveryStaff(filters);
      setStaff(response.data.staff || []); // Assuming API returns { data: { staff: [...] } }
      setTotal(response.data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch delivery staff');
      console.error('Error fetching delivery staff:', err);
      setStaff(localStaff);
      setTotal(localStaff.length);
    } finally {
      setLoading(false);
    }
  };

  const createStaffMember = async (staffData) => {
    if (!API_CONFIG.ENABLE_API) {
      const newStaff = { ...staffData, id: Date.now().toString() };
      setLocalStaff([...localStaff, newStaff]);
      setStaff([...staff, newStaff]);
      return { success: true, data: newStaff };
    }

    setLoading(true);
    try {
      const response = await deliveryStaffService.createStaffMember(staffData);
      await fetchDeliveryStaff();
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create staff member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStaffMember = async (id, staffData) => {
    if (!API_CONFIG.ENABLE_API) {
      const updated = localStaff.map(s => s.id === id ? { ...s, ...staffData } : s);
      setLocalStaff(updated);
      setStaff(updated);
      return { success: true, data: staffData };
    }

    setLoading(true);
    try {
      const response = await deliveryStaffService.updateStaffMember(id, staffData);
      await fetchDeliveryStaff();
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update staff member');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteStaffMember = async (id) => {
    if (!API_CONFIG.ENABLE_API) {
      const filtered = localStaff.filter(s => s.id !== id);
      setLocalStaff(filtered);
      setStaff(filtered);
      return { success: true };
    }

    setLoading(true);
    try {
      const response = await deliveryStaffService.deleteStaffMember(id);
      await fetchDeliveryStaff();
      return response;
    } catch (err) {
      setError(err.message || 'Failed to delete staff member');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const toggleStaffMemberStatus = async (id) => {
    if (!API_CONFIG.ENABLE_API) {
      const updated = localStaff.map(s => 
        s.id === id 
          ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } 
          : s
      );
      setLocalStaff(updated);
      setStaff(updated);
      return { success: true };
    }

    setLoading(true);
    try {
      const response = await deliveryStaffService.toggleStaffMemberStatus(id);
      await fetchDeliveryStaff();
      return response;
    } catch (err) {
      setError(err.message || 'Failed to toggle staff status');
      throw err;
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDeliveryStaff();
  }, [JSON.stringify(filters)]);

  return {
    staff,
    loading,
    error,
    total,
    refetch: fetchDeliveryStaff,
    createStaffMember,
    updateStaffMember,
    deleteStaffMember,
    toggleStaffMemberStatus,
  };
}