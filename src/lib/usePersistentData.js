import { useState, useEffect } from 'react';
import { 
  products as defaultProducts, 
  orders as defaultOrders, 
  customers as defaultCustomers,
  branches as defaultBranches,
  deliveryBoys as defaultDeliveryBoys,
  users as defaultUsers,
  notifications as defaultNotifications
} from './mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'dynasty_products',
  ORDERS: 'dynasty_orders',
  CUSTOMERS: 'dynasty_customers',
  BRANCHES: 'dynasty_branches',
  DELIVERY_BOYS: 'dynasty_delivery_boys',
  USERS: 'dynasty_users',
  NOTIFICATIONS: 'dynasty_notifications',
  HOMEPAGE_SETTINGS: 'dynasty_homepage_settings',
};

// Helper to load from localStorage
// Removed: <T>, : string, : T, : T
function loadFromStorage(key, defaultValue) {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
  }
  return defaultValue;
}

// Helper to save to localStorage
// Removed: <T>, : string, : T, : void
function saveToStorage(key, value) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
}

// Custom hook for persistent data
// Removed: <T>, : string, : T
export function usePersistentData(key, defaultValue) {
  // Removed: <T>
  const [data, setData] = useState(() => loadFromStorage(key, defaultValue));

  useEffect(() => {
    saveToStorage(key, data);
  }, [key, data]);

  // Removed: as const
  return [data, setData];
}

// Specific hooks for each data type
export function usePersistentProducts() {
  return usePersistentData(STORAGE_KEYS.PRODUCTS, defaultProducts);
}

export function usePersistentOrders() {
  return usePersistentData(STORAGE_KEYS.ORDERS, defaultOrders);
}

export function usePersistentCustomers() {
  return usePersistentData(STORAGE_KEYS.CUSTOMERS, defaultCustomers);
}

export function usePersistentBranches() {
  return usePersistentData(STORAGE_KEYS.BRANCHES, defaultBranches);
}

export function usePersistentDeliveryBoys() {
  return usePersistentData(STORAGE_KEYS.DELIVERY_BOYS, defaultDeliveryBoys);
}

export function usePersistentUsers() {
  return usePersistentData(STORAGE_KEYS.USERS, defaultUsers);
}

export function usePersistentNotifications() {
  return usePersistentData(STORAGE_KEYS.NOTIFICATIONS, defaultNotifications);
}

// Removed: : any
export function usePersistentHomepageSettings(defaultValue) {
  return usePersistentData(STORAGE_KEYS.HOMEPAGE_SETTINGS, defaultValue);
}

// Push notifications (different from notification bell)
// Removed: : any
export function usePersistentPushNotifications(defaultValue) {
  return usePersistentData('dynasty_push_notifications', defaultValue);
}

// Export storage keys for direct access if needed
export { STORAGE_KEYS };