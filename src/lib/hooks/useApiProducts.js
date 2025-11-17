// admin_11/src/lib/hooks/useApiProducts.js
import { useState, useEffect } from 'react';
import { productService } from '../api/services/productService';
import { API_CONFIG } from '../api/config';
import { usePersistentProducts } from '../usePersistentData';

/**
 * Hook for managing products with API integration
 * Falls back to localStorage when API is disabled
 */
export function useApiProducts(filters) {
  const [localProducts, setLocalProducts] = usePersistentProducts();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  // Fetch products from API
  const fetchProducts = async () => {
    if (!API_CONFIG.ENABLE_API) {
      // Use local data when API is disabled
      setProducts(localProducts);
      setTotal(localProducts.length);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await productService.getProducts(filters);
      setProducts(response.data.products || []); // Ensure it's an array
      setTotal(response.data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
      // Fallback to local data on error
      setProducts(localProducts);
      setTotal(localProducts.length);
    } finally {
      setLoading(false);
    }
  };

  // Create product
  const createProduct = async (product) => {
    if (!API_CONFIG.ENABLE_API) {
      const newProduct = { ...product, id: Date.now().toString() };
      setLocalProducts([...localProducts, newProduct]);
      setProducts([...products, newProduct]);
      return { success: true, data: newProduct };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await productService.createProduct(product);
      await fetchProducts(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const updateProduct = async (id, product) => {
    if (!API_CONFIG.ENABLE_API) {
      const updated = localProducts.map(p => p.id === id ? { ...p, ...product } : p);
      setLocalProducts(updated);
      setProducts(updated);
      return { success: true, data: product };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await productService.updateProduct(id, product);
      await fetchProducts(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    if (!API_CONFIG.ENABLE_API) {
      const filtered = localProducts.filter(p => p.id !== id);
      setLocalProducts(filtered);
      setProducts(filtered);
      return { success: true };
    }

    setLoading(true);
    setError(null);

    try {
      const response = await productService.deleteProduct(id);
      await fetchProducts(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(filters)]);

  return {
    products,
    loading,
    error,
    total,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}