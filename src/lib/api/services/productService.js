// admin_11/src/lib/api/services/productService.js
import { apiClient } from '../client';
import { API_ENDPOINTS, buildUrl } from '../config';

export const productService = {
  /**
   * Get list of products with filters
   */
  async getProducts(filters) {
    // 'filters' will be { search, category, status, page, limit }
    return apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, filters);
  },

  /**
   * Create a new product
   */
  async createProduct(productData) {
    return apiClient.post(API_ENDPOINTS.PRODUCTS.CREATE, productData);
  },

  /**
   * Update an existing product
   */
  async updateProduct(id, productData) {
    const endpoint = buildUrl(API_ENDPOINTS.PRODUCTS.UPDATE, { id });
    return apiClient.put(endpoint, productData);
  },

  /**
   * Delete a product
   */
  async deleteProduct(id) {
    const endpoint = buildUrl(API_ENDPOINTS.PRODUCTS.DELETE, { id });
    return apiClient.delete(endpoint);
  },
  
  /**
   * Toggle product status
   */
  async toggleProductStatus(id) {
    const endpoint = buildUrl(API_ENDPOINTS.PRODUCTS.TOGGLE_STATUS, { id });
    return apiClient.patch(endpoint);
  },
};