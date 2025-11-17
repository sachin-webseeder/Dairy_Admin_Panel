// admin_11/src/lib/hooks/useApiProfile.js
import { useState, useEffect } from 'react';
import { authService } from '../api/services/authService';
import { API_CONFIG } from '../api/config';

export function useApiProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    if (!API_CONFIG.ENABLE_API) {
      setProfile(authService.getCurrentUser()); // Get from localStorage
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await authService.getProfile();
      if (response.success) {
        setProfile(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch profile');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const updateProfile = async (data) => {
    if (!API_CONFIG.ENABLE_API) {
      const updatedUser = { ...authService.getCurrentUser(), ...data };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      setProfile(updatedUser);
      return { success: true, data: updatedUser };
    }
    
    // No setLoading, as it's a form submission
    try {
      const response = await authService.updateProfile(data);
      if (response.success) {
        setProfile(response.data); // Update local state with new data
      }
      return response; // Return full response for the form to handle
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err; // Re-throw for the form to catch
    }
  };


  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
  };
}