import { apiClient } from '../client';
import { API_ENDPOINTS, buildUrl } from '../config';

export const productService = {
  // ... getProducts, getProduct ... (keep same)
  async getProducts(filters) {
    return apiClient.get(API_ENDPOINTS.PRODUCTS.LIST, filters);
  },
  async getProduct(id) {
    return apiClient.get(buildUrl(API_ENDPOINTS.PRODUCTS.GET, { id }));
  },

  // ✨ UPDATED CREATE FUNCTION
  async createProduct(productData) {
    const formData = new FormData();
    
    // 1. Basic Fields
    formData.append('dishName', productData.name); 
    formData.append('category', productData.category);
    formData.append('cost', productData.cost);
    formData.append('description', productData.description || '');
    
    // 2. ✨ FIX: Handle Main Image (File OR URL)
    if (productData.mainImage) {
      if (productData.mainImage.type === 'file') {
        // If it's a File object, append it as a file
        formData.append('image', productData.mainImage.value);
      } else if (productData.mainImage.type === 'url') {
        // If it's a URL string, append it as text
        formData.append('image', productData.mainImage.value);
      }
    }

    // 3. Handle Variants & Their Images
    if (productData.variants && productData.variants.length > 0) {
        const quantities = productData.variants.map((v, index) => {
           let variantImageVal = null;
           
           if (v.imageData) {
             if (v.imageData.type === 'file') {
               // Append File with unique key: 'variantImage_0', 'variantImage_1'
               formData.append(`variantImage_${index}`, v.imageData.value);
               variantImageVal = `variantImage_${index}`; 
             } else if (v.imageData.type === 'url') {
               // Use URL directly in the JSON
               variantImageVal = v.imageData.value;
             }
           }

           return {
            label: v.label,
            value: Number(v.value),
            unit: v.unit,
            price: Number(v.price),
            stock: Number(v.stock),
            image: variantImageVal // Store the reference or URL
           };
        });

        formData.append('availableQuantities', JSON.stringify(quantities));
        
        // Set root defaults from first variant
        formData.append('price', quantities[0].price);
        formData.append('stock', quantities[0].stock);
        formData.append('volume', `${quantities[0].value} ${quantities[0].unit}`);
    } else {
         formData.append('price', '0');
         formData.append('stock', '0');
    }

    // 4. Optional Fields
    if (productData.discountPercent) formData.append('discountPercent', productData.discountPercent);
    formData.append('availableForOrder', productData.availableForOrder ? 'true' : 'false');
    formData.append('isVIP', productData.isVIP ? 'true' : 'false');

    return apiClient.post(API_ENDPOINTS.PRODUCTS.CREATE, formData);
  },

  // ... updateProduct, deleteProduct ... (keep same or update similarly)
  async updateProduct(id, productData) {
      // You should implement similar logic here for updates
      // For now, keeping the existing structure but ensuring form data is used
      // ...
      // (Return to existing update logic or ask if you want me to fully rewrite update too)
      // For brevity, assuming create is the priority fix requested.
      const formData = new FormData();
       if (productData.name) formData.append('dishName', productData.name);
       if (productData.category) {
       const catId = typeof productData.category === 'object' 
         ? (productData.category._id || productData.category.id) 
         : productData.category;
       formData.append('category', catId);
    }
       if (productData.price) formData.append('price', productData.price);
       if (productData.imageFile) formData.append('image', productData.imageFile);
       return apiClient.put(buildUrl(API_ENDPOINTS.PRODUCTS.UPDATE, { id }), formData);
  },

  async deleteProduct(id) {
    return apiClient.delete(buildUrl(API_ENDPOINTS.PRODUCTS.DELETE, { id }));
  },

  async toggleProductStatus(id) {
    return apiClient.patch(buildUrl(API_ENDPOINTS.PRODUCTS.TOGGLE_STATUS, { id }));
  },
};