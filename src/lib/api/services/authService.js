import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';

export const authService = {
  /**
   * Login user
   */
  async login(credentials) {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    if (response.success && response.data.token) {
      // Store token and user data
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  },

  /**
   * Get current user profile
   */
  async getProfile() {
    return apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
  },

  /**
   * Update user profile
   */
  async updateProfile(data) {
    const response = await apiClient.put(
      API_ENDPOINTS.AUTH.UPDATE_PROFILE,
      data
    );
    
    if (response.success) {
      // Update stored user data
      const currentUser = JSON.parse(localStorage.getItem('auth_user') || '{}');
      const updatedUser = { ...currentUser, ...response.data };
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
    
    return response;
  },

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.REFRESH
    );
    
    if (response.success && response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  /**
   * Get current user from storage
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  },
};