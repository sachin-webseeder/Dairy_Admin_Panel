// admin_11/src/lib/hooks/useApiNotifications.js
import { useState, useEffect } from 'react';
import { notificationService } from '../api/services/notificationService';
import { API_CONFIG } from '../api/config';
import { notifications as mockNotifications } from '../mockData'; // Fallback

export function useApiNotifications(filters) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchNotifications = async () => {
    if (!API_CONFIG.ENABLE_API) {
      setNotifications(mockNotifications); // Using mockData from lib
      setTotal(mockNotifications.length);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.getNotifications(filters);
      // Assuming API returns { data: { notifications: [...], total: ... } }
      setNotifications(response.data.notifications || []); 
      setTotal(response.data.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
      setNotifications(mockNotifications); // Fallback
      setTotal(mockNotifications.length);
    } finally {
      setLoading(false);
    }
  };

  const createNotification = async (notificationData) => {
    if (!API_CONFIG.ENABLE_API) {
      const newNotification = { ...notificationData, id: Date.now().toString(), read: false, createdAt: new Date().toISOString() };
      setNotifications([newNotification, ...notifications]);
      return { success: true, data: newNotification };
    }
    
    // Don't set loading, let it happen in background
    try {
      const response = await notificationService.createNotification(notificationData);
      await fetchNotifications(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to send notification');
      throw err;
    }
  };

  const updateNotification = async (id, notificationData) => {
    if (!API_CONFIG.ENABLE_API) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, ...notificationData } : n));
      return { success: true, data: notificationData };
    }
    
    try {
      const response = await notificationService.updateNotification(id, notificationData);
      await fetchNotifications(); // Refresh list
      return response;
    } catch (err) {
      setError(err.message || 'Failed to update notification');
      throw err;
    }
  };


  const markAsRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (!API_CONFIG.ENABLE_API) return;
    try {
      await notificationService.markAsRead(id);
    } catch (err) {
      console.error('Failed to mark as read:', err);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false } : n));
    }
  };

  const markAllAsRead = async () => {
    // This endpoint isn't in your user's code, but we'll leave it
    console.log("Marking all as read...");
  };

  const deleteNotification = async (id) => {
    const originalNotifications = notifications;
    setNotifications(prev => prev.filter(n => n.id !== id));
    
    if (!API_CONFIG.ENABLE_API) return;

    try {
      await notificationService.deleteNotification(id);
    } catch (err) {
      console.error('Failed to delete notification:', err);
      setNotifications(originalNotifications); // Revert on failure
      throw err; // Re-throw to be caught by the page
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [JSON.stringify(filters)]);

  return {
    notifications,
    loading,
    error,
    total,
    refetch: fetchNotifications,
    createNotification,
    updateNotification, // ✨ ADDED
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
}