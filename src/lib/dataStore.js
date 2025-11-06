// Data Store for persisting data across sessions using localStorage

const STORAGE_KEYS = {
  PRODUCTS: 'dynasty_products',
  ORDERS: 'dynasty_orders',
  CUSTOMERS: 'dynasty_customers',
  BRANCHES: 'dynasty_branches',
  DELIVERY_BOYS: 'dynasty_delivery_boys',
  USERS: 'dynasty_users',
  NOTIFICATIONS: 'dynasty_notifications',
  HOMEPAGE_SETTINGS: 'dynasty_homepage_settings',
  SUPPORT_QUERIES: 'dynasty_support_queries',
};

// Generic save function
export function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
}

// Generic load function
export function loadFromLocalStorage(key, defaultValue) {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error);
  }
  return defaultValue;
}

// Specific data type functions
export const dataStore = {
  // Products
  saveProducts: (products) => saveToLocalStorage(STORAGE_KEYS.PRODUCTS, products),
  loadProducts: (defaultProducts) => loadFromLocalStorage(STORAGE_KEYS.PRODUCTS, defaultProducts),

  // Orders
  saveOrders: (orders) => saveToLocalStorage(STORAGE_KEYS.ORDERS, orders),
  loadOrders: (defaultOrders) => loadFromLocalStorage(STORAGE_KEYS.ORDERS, defaultOrders),

  // Customers
  saveCustomers: (customers) => saveToLocalStorage(STORAGE_KEYS.CUSTOMERS, customers),
  loadCustomers: (defaultCustomers) => loadFromLocalStorage(STORAGE_KEYS.CUSTOMERS, defaultCustomers),

  // Branches
  saveBranches: (branches) => saveToLocalStorage(STORAGE_KEYS.BRANCHES, branches),
  loadBranches: (defaultBranches) => loadFromLocalStorage(STORAGE_KEYS.BRANCHES, defaultBranches),

  // Delivery Boys
  saveDeliveryBoys: (deliveryBoys) => saveToLocalStorage(STORAGE_KEYS.DELIVERY_BOYS, deliveryBoys),
  loadDeliveryBoys: (defaultDeliveryBoys) => loadFromLocalStorage(STORAGE_KEYS.DELIVERY_BOYS, defaultDeliveryBoys),

  // Users
  saveUsers: (users) => saveToLocalStorage(STORAGE_KEYS.USERS, users),
  loadUsers: (defaultUsers) => loadFromLocalStorage(STORAGE_KEYS.USERS, defaultUsers),

  // Notifications
  saveNotifications: (notifications) => saveToLocalStorage(STORAGE_KEYS.NOTIFICATIONS, notifications),
  loadNotifications: (defaultNotifications) => loadFromLocalStorage(STORAGE_KEYS.NOTIFICATIONS, defaultNotifications),

  // Homepage Settings
  saveHomepageSettings: (settings) => saveToLocalStorage(STORAGE_KEYS.HOMEPAGE_SETTINGS, settings),
  loadHomepageSettings: (defaultSettings) => loadFromLocalStorage(STORAGE_KEYS.HOMEPAGE_SETTINGS, defaultSettings),

  // Support Queries
  saveSupportQueries: (queries) => saveToLocalStorage(STORAGE_KEYS.SUPPORT_QUERIES, queries),
  loadSupportQueries: (defaultQueries) => loadFromLocalStorage(STORAGE_KEYS.SUPPORT_QUERIES, defaultQueries),
};