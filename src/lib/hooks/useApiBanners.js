// admin_11/src/lib/hooks/useApiBanners.js
import { useState, useEffect } from 'react';
import { homepageService } from '../api/services/homepageService';
import { API_CONFIG } from '../api/config';
import { usePersistentBanners } from '../usePersistentData'; // For mock data fallback

export function useApiBanners(filters) {
  const [localBanners, setLocalBanners] = usePersistentBanners();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBanners = async () => {
    if (!API_CONFIG.ENABLE_API) {
      setBanners(localBanners);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await homepageService.getBanners(filters);
      // Assuming API returns { data: { banners: [...] } }
      setBanners(response.data.banners || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch banners');
      setBanners(localBanners); // Fallback
    } finally {
      setLoading(false);
    }
  };

  const createBanner = async (bannerData) => {
    if (!API_CONFIG.ENABLE_API) {
      const newBanner = { ...bannerData, id: Date.now().toString() };
      setLocalBanners([...localBanners, newBanner]);
      return { success: true, data: newBanner };
    }

    try {
      const response = await homepageService.createBanner(bannerData);
      await fetchBanners(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to create banner');
      throw err;
    }
  };

  const updateBanner = async (id, bannerData) => {
    if (!API_CONFIG.ENABLE_API) {
      setLocalBanners(prev => prev.map(b => b.id === id ? { ...b, ...bannerData } : b));
      return { success: true, data: bannerData };
    }

    try {
      const response = await homepageService.updateBanner(id, bannerData);
      await fetchBanners(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update banner');
      throw err;
    }
  };

  const deleteBanner = async (id) => {
    if (!API_CONFIG.ENABLE_API) {
      setLocalBanners(prev => prev.filter(b => b.id !== id));
      return { success: true };
    }

    try {
      const response = await homepageService.deleteBanner(id);
      await fetchBanners(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to delete banner');
      throw err;
    }
  };
  
  const reorderBanners = async (bannerIds) => {
    // Optimistic update
    const oldBanners = banners;
    const reorderedBanners = bannerIds.map(id => oldBanners.find(b => b.id === id));
    setBanners(reorderedBanners);

    if (!API_CONFIG.ENABLE_API) {
      setLocalBanners(reorderedBanners);
      return;
    }
    
    try {
      await homepageService.reorderBanners({ bannerIds });
      // Success, no need to refetch
    } catch (err) {
      setError(err.message || 'Failed to reorder banners');
      setBanners(oldBanners); // Revert on failure
    }
  };


  useEffect(() => {
    fetchBanners();
  }, [JSON.stringify(filters)]);

  return {
    banners,
    setBanners, // Expose setter for optimistic drag-n-drop
    loading,
    error,
    refetch: fetchBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    reorderBanners,
  };
}