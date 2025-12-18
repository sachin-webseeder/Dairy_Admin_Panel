import { useState, useEffect, useCallback } from 'react';
import { userService } from '../api/services/userService';
import { toast } from 'sonner';

export function useApiUsers({ search = '' } = {}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers();
      // The controller returns { success: true, users: [...] }
      setUsers(response.users || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // CREATE User
  const createUser = async (userData) => {
    try {
      await userService.createUser(userData);
      // Refresh list after success
      await fetchUsers();
      return true;
    } catch (err) {
      throw err; // Let the component handle the error toast
    }
  };

  // UPDATE User
  const updateUser = async (id, userData) => {
    try {
      await userService.updateUser(id, userData);
      await fetchUsers();
      return true;
    } catch (err) {
      throw err;
    }
  };

  // DELETE User
  const deleteUser = async (id) => {
    try {
      await userService.deleteUser(id);
      await fetchUsers();
      return true;
    } catch (err) {
      throw err;
    }
  };

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refetch: fetchUsers // Expose refetch for manual refresh buttons
  };
}