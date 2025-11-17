import { useState, useEffect } from 'react';
import { 
  products as defaultProducts, 
  orders as defaultOrders, 
  customers as defaultCustomers,
  branches as defaultBranches,
  deliveryBoys as defaultDeliveryBoys,
  users as defaultUsers,
  notifications as defaultNotifications,
  walletData as defaultWallet,
  mockMemberships as defaultMemberships // ✨ ADDED THIS
} from './mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'dynasty_products',
  ORDERS: 'dynasty_orders',
  CUSTOMERS: 'dynasty_customers',
  BRANCHES: 'dynasty_branches',
  DELIVERY_BOYS: 'dynasty_delivery_boys',
  USERS: 'dynasty_users',
  NOTIFICATIONS: 'dynasty_notifications',
  WALLET: 'dynasty_wallet',
  MEMBERSHIP: 'dynasty_membership', // ✨ ADDED THIS
  HOMEPAGE_SETTINGS: 'dynasty_homepage_settings',
};

// Helper to load from localStorage
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
function saveToStorage(key, value) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
}

// Custom hook for persistent data
export function usePersistentData(key, defaultValue) {
  const [data, setData] = useState(() => loadFromStorage(key, defaultValue));

  useEffect(() => {
    saveToStorage(key, data);
  }, [key, data]);

  return [data, setData];
}

// Specific hooks for each data type
export function usePersistentProducts() {
  const [products, setProducts] = useState(() => {
    const storedProducts = loadFromStorage(STORAGE_KEYS.PRODUCTS, null);
    return storedProducts && storedProducts.length > 0 ? storedProducts : defaultProducts;
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
  }, [products]);

  return [products, setProducts];
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

export function usePersistentWallet() {
  return usePersistentData(STORAGE_KEYS.WALLET, defaultWallet);
}

// ✨ ADDED THIS FUNCTION ✨
export function usePersistentMembership() {
  return usePersistentData(STORAGE_KEYS.MEMBERSHIP, defaultMemberships);
}

export function usePersistentHomepageSettings(defaultValue) {
  return usePersistentData(STORAGE_KEYS.HOMEPAGE_SETTINGS, defaultValue);
}

// Push notifications (different from notification bell)
export function usePersistentPushNotifications(defaultValue) {
  return usePersistentData('dynasty_push_notifications', defaultValue);
}

// Export storage keys for direct access if needed
export { STORAGE_KEYS };