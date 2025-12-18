import { apiClient } from '../client';
// Removed API_ENDPOINTS import as we are using hardcoded paths for the new backend structure

export const userService = {
  // GET all panel users
  // The backend returns: { success: true, users: [...], stats: {...} }
  getUsers: async () => {
    // ✨ FIX: Removed .data because apiClient interceptor likely handles it
    return apiClient.get('/users/panel-users'); 
  },

  // CREATE a new panel user
  // Payload expects: { firstName, lastName, email, phone, password, permissions }
  createUser: async (userData) => {
    // ✨ FIX: Removed .data
    return apiClient.post('/users/panel-users', userData);
  },

  // UPDATE panel user
  updateUser: async (id, userData) => {
    // ✨ FIX: Removed .data
    return apiClient.put(`/users/panel-users/${id}`, userData);
  },

  // DELETE panel user
  deleteUser: async (id) => {
    // ✨ FIX: Removed .data
    return apiClient.delete(`/users/panel-users/${id}`);
  }
};