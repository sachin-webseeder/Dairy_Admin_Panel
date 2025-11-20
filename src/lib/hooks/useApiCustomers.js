// admin_11/src/lib/hooks/useApiCustomers.js
import { useState, useEffect } from 'react';
import { customerService } from '../api/services/customerService';
import { API_CONFIG } from '../api/config';
import { customers as defaultCustomers } from '../mockData';

export function useApiCustomers(filters) {
  // Initialize with empty array to prevent "length of undefined" errors
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Helper to clean filters (Remove 'all' and empty strings)
  const cleanFilters = (dirtyFilters) => {
    const cleaned = {};
    Object.keys(dirtyFilters).forEach((key) => {
      const value = dirtyFilters[key];
      // Only include the filter if it's NOT 'all' and NOT empty
      if (value !== 'all' && value !== '' && value !== null && value !== undefined) {
        cleaned[key] = value;
      }
    });
    return cleaned;
  };

  const fetchCustomers = async () => {
    if (!API_CONFIG.ENABLE_API) {
      setCustomers(defaultCustomers);
      setTotal(defaultCustomers.length);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ✨ FIX 1: Clean filters before sending
      const activeFilters = cleanFilters(filters);
      
      const response = await customerService.getCustomers(activeFilters);
      
      // ✨ DEBUG: Check what the API actually sends
      console.log("Customers API Response:", response);

      // ✨ FIX 2: Handle both 'flat' and 'nested' response structures
      // It checks response.customers OR response.data.customers
      const customersList = response.customers || (response.data && response.data.customers) || [];
      const totalCount = response.total || (response.data && response.data.total) || customersList.length || 0;

      setCustomers(customersList);
      setTotal(totalCount);

    } catch (err) {
      setError(err.message || 'Failed to fetch customers');
      console.error('Error fetching customers:', err);
      setCustomers([]); 
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const createCustomer = async (customer) => {
    try {
      const response = await customerService.createCustomer(customer);
      await fetchCustomers(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create customer');
      throw err;
    }
  };

  const updateCustomer = async (id, customer) => {
    try {
      const response = await customerService.updateCustomer(id, customer);
      await fetchCustomers(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update customer');
      throw err;
    }
  };

  const deleteCustomer = async (id) => {
    try {
      const response = await customerService.deleteCustomer(id);
      await fetchCustomers(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to delete customer');
      throw err;
    }
  };

  const toggleCustomerStatus = async (id) => {
    try {
      const response = await customerService.toggleCustomerStatus(id);
      await fetchCustomers(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to toggle status');
      throw err;
    }
  };

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
    toggleCustomerStatus
  };
}