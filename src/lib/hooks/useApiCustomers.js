import { useState, useEffect } from 'react';
import { customerService } from '../api/services/customerService';
import { API_CONFIG } from '../api/config';
import { usePersistentCustomers } from '../usePersistentData';

/**
 * Hook for managing customers with API integration
 * Falls back to localStorage when API is disabled
 */
export function useApiCustomers(filters) {
  const [localCustomers, setLocalCustomers] = usePersistentCustomers();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Fetch customers from API
  const fetchCustomers = async () => {
    if (!API_CONFIG.ENABLE_API) {
      // Use local data when API is disabled
      setCustomers(localCustomers);
      setTotal(localCustomers.length);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await customerService.getCustomers(filters);
      setCustomers(response.data.customers);
      setTotal(response.data.total);
    } catch (err) {
      setError(err.message || 'Failed to fetch customers');
      console.error('Error fetching customers:', err);
      
      // Fallback to local data on error
      setCustomers(localCustomers);
      setTotal(localCustomers.length);
    } finally {
      setLoading(false);
    }
  };

  // Create customer
  const createCustomer = async (customer) => {
    if (!API_CONFIG.ENABLE_API) {
      // Use local storage
      const newCustomer = { ...customer, id: Date.now().toString() };
      setLocalCustomers([...localCustomers, newCustomer]);
      setCustomers([...customers, newCustomer]);
      return { success: true, data: newCustomer };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await customerService.createCustomer(customer);
      await fetchCustomers(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create customer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update customer
  const updateCustomer = async (id, customer) => {
    if (!API_CONFIG.ENABLE_API) {
      // Use local storage
      const updated = localCustomers.map(c => c.id === id ? { ...c, ...customer } : c);
      setLocalCustomers(updated);
      setCustomers(updated);
      return { success: true, data: customer };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await customerService.updateCustomer(id, customer);
      await fetchCustomers(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update customer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete customer
  const deleteCustomer = async (id) => {
    if (!API_CONFIG.ENABLE_API) {
      // Use local storage
      const filtered = localCustomers.filter(c => c.id !== id);
      setLocalCustomers(filtered);
      setCustomers(filtered);
      return { success: true };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await customerService.deleteCustomer(id);
      await fetchCustomers(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to delete customer');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Toggle customer status
  const toggleCustomerStatus = async (id) => {
    if (!API_CONFIG.ENABLE_API) {
      // Use local storage
      const updated = localCustomers.map(c => 
        c.id === id 
          ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' }
          : c
      );
      setLocalCustomers(updated);
      setCustomers(updated);
      return { success: true };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await customerService.toggleCustomerStatus(id);
      await fetchCustomers(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to toggle customer status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchCustomers();
  }, [JSON.stringify(filters)]);

  return {
    customers,
    loading,
    error,
    total,
    refetch: fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    toggleCustomerStatus,
  };
}