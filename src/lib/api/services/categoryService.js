import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';

export const categoryService = {
  async getCategories() {
    return apiClient.get(API_ENDPOINTS.CATEGORIES.LIST);
  },

  // ✨ UPDATE: Handle FormData for image upload
  async createCategory(categoryData) {
    const formData = new FormData();
    formData.append('name', categoryData.name);
    formData.append('displayName', categoryData.displayName);
    formData.append('description', categoryData.description || '');
    
    // Handle Image
    if (categoryData.imageFile) {
      formData.append('image', categoryData.imageFile);
    }
    
    // Handle Icon (optional)
    if (categoryData.icon) {
      formData.append('icon', categoryData.icon); // Assuming icon is a string/emoji or url
    }

    // If backend supports updating order/active status
    if (categoryData.sortOrder) formData.append('sortOrder', categoryData.sortOrder);
    formData.append('isActive', categoryData.isActive ? 'true' : 'false');

    return apiClient.post(API_ENDPOINTS.CATEGORIES.CREATE, formData);
  }
};