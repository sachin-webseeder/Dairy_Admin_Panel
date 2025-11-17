// admin_11/src/lib/hooks/useTopProducts.js
import { useState, useEffect } from 'react';
import { reportService } from '../api/services/reportService';
import { API_CONFIG } from '../api/config';
import { products as mockProducts } from '../mockData'; // Fallback

export function useTopProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      if (!API_CONFIG.ENABLE_API) {
        setProducts(mockProducts.slice(0, 5)); // Use mock data
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await reportService.getTopProducts();
        if (response.success) {
          // Assuming API returns { data: { products: [...] } }
          setProducts(response.data.products || []);
        } else {
          throw new Error(response.message || 'Failed to fetch top products');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching top products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []); // Fetch only once on mount

  return { products, loading, error };
}