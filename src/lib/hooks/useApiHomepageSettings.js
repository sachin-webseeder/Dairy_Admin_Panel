// admin_11/src/lib/hooks/useApiHomepageSettings.js
import { useState, useEffect } from 'react';
import { homepageService } from '../api/services/homepageService';
import { API_CONFIG } from '../api/config';
import { usePersistentHomepageSettings } from '../usePersistentData'; // For fallback

// We need the default structure for the fallback
const defaultHomepageSettings = {
  bannerTitle: "Welcome",
  bannerSubtitle: "Delicious food",
  ctaButtonText: "Order Now",
  ctaLink: "/menu",
  bannerImage: null,
  publishedBanner: { title: "Welcome", subtitle: "Delicious food", ctaText: "Order Now", ctaLink: "/menu", image: null },
  specialOffer: { title: "20% Off", code: "DAIRY20", description: "Get 20% off", visible: true },
  categoryVisibility: "always",
  offerVisibility: "date",
  offerStartDate: "",
  offerEndDate: "",
  topProductsVisibility: "time",
  topProductsStartTime: "09:00",
  topProductsEndTime: "21:00",
  bannerVisibility: "always",
  topProductRules: [],
  specialOfferRules: [],
  sections: [],
};


export function useApiHomepageSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get the mock setter, just in case API is off
  const [, setLocalSettings] = usePersistentHomepageSettings(defaultHomepageSettings);

  const fetchSettings = async () => {
    if (!API_CONFIG.ENABLE_API) {
      setSettings(defaultHomepageSettings); // Use default mock
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await homepageService.getSettings();
      if (response.success) {
        setSettings(response.data); // API returns { data: { ...settings object... } }
      } else {
        throw new Error(response.message || 'Failed to fetch homepage settings');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching homepage settings:', err);
      setSettings(defaultHomepageSettings); // Fallback
    } finally {
      setLoading(false);
    }
  };
  
  const updateSettings = async (settingsData) => {
    if (!API_CONFIG.ENABLE_API) {
      setLocalSettings(settingsData); // Save to local storage
      setSettings(settingsData); // Update local state
      return { success: true, data: settingsData };
    }
    
    // Optimistic UI update
    setSettings(settingsData); 
    
    try {
      const response = await homepageService.updateSettings(settingsData);
      // API returns the saved data, let's re-set it just in case
      if (response.success) {
        setSettings(response.data);
      }
      return response;
    } catch (err) {
      setError(err.message || 'Failed to save settings');
      await fetchSettings(); // Revert by refetching from server
      throw err; // Re-throw for the form to catch
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings,
    updateSettings,
  };
}