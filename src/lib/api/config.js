// admin_11/src/lib/api/config.js

// Use Vite's syntax for environment variables
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_CONFIG = {
  // BASE_URL should be "https://dynasty-premium-backend.onrender.com"
  // The "/api" is now part of each endpoint path.
  BASE_URL: VITE_API_BASE_URL || 'http://localhost:8000',

  TIMEOUT: 30000,
  ENABLE_API: true, // Keep this true
};

// These paths are based on your Postman collection
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/admin/login',
    REGISTER: '/api/admin/register',
    LOGOUT: '/api/admin/logout',
    PROFILE: '/api/admin/profile',
    UPDATE_PROFILE: '/api/admin/profile/update',
    REFRESH: '/api/auth/refresh', // This one might be different
  },

  // Dashboard
  DASHBOARD: {
    STATS: '/api/admin/dashboard/stats',
    RECENT_ORDERS: '/api/admin/dashboard/recent-orders',
    REVENUE_CHART: '/api/admin/dashboard/revenue-chart',
  },

  // Customers
  CUSTOMERS: {
    LIST: '/api/customer', // Assuming GET /api/customer
    GET: '/api/customer/:id',
    CREATE: '/api/customer/create', // Assuming POST /api/customer/create
    UPDATE: '/api/customer/update/:id', // Matches Postman
    DELETE: '/api/customer/delete/:id', // Assuming DELETE
    TOGGLE_STATUS: '/api/customer/toggle-status/:id', // Assuming PATCH
  },

  // Orders
  ORDERS: {
    LIST: '/api/order',
    GET: '/api/order/:id',
    CREATE: '/api/order/create',
    UPDATE: '/api/order/update/:id',
    DELETE: '/api/order/delete/:id',
    UPDATE_STATUS: '/api/order/status/:id',
  },

  // Products
  PRODUCTS: {
    LIST: '/api/product',
    GET: '/api/product/:id',
    CREATE: '/api/product/create',
    UPDATE: '/api/product/update/:id',
    DELETE: '/api/product/delete/:id',
    TOGGLE_STATUS: '/api/product/toggle-status/:id',
  },

  // Delivery Staff
  DELIVERY_STAFF: {
    LIST: '/api/delivery',
    GET: '/api/delivery/:id',
    CREATE: '/api/delivery/create',
    UPDATE: '/api/delivery/update/:id',
    DELETE: '/api/delivery/delete/:id',
    TOGGLE_STATUS: '/api/delivery/toggle-status/:id',
  },

  // Branches
  BRANCHES: {
    LIST: '/api/branch',
    GET: '/api/branch/:id',
    CREATE: '/api/branch/create',
    UPDATE: '/api/branch/update/:id',
    DELETE: '/api/branch/delete/:id',
  },

  // Notifications
  NOTIFICATIONS: {
    LIST: '/api/notification',
    CREATE: '/api/notification/create',
    UPDATE: '/api/notification/update/:id',
    DELETE: '/api/notification/delete/:id',
    GET_STATS: '/api/notification/stats',
    MARK_READ: '/api/notification/read/:id',
    MARK_ALL_READ: '/api/notification/read-all',
  },

  // Wallet
  WALLET: {
    DISCOUNTS: '/api/wallet/discounts',
    CREATE_DISCOUNT: '/api/wallet/discounts',
    UPDATE_DISCOUNT: '/api/wallet/discounts/:id',
    DELETE_DISCOUNT: '/api/wallet/discounts/:id',
    GET_STATS: '/api/wallet/stats',
  },

  // Membership
  MEMBERSHIP: {
    LIST: '/api/membership',
    CREATE: '/api/membership',
    UPDATE: '/api/membership/:id',
    DELETE: '/api/membership/:id',
  },

  // Reports
  REPORTS: {
    SALES: '/api/reports/sales',
    CUSTOMERS: '/api/reports/customers',
    PRODUCTS: '/api/reports/products',
    REVENUE: '/api/reports/revenue',
  },

  // Homepage Management
  HOMEPAGE: {
    GET_SETTINGS: '/api/homepage/settings',
    UPDATE_SETTINGS: '/api/homepage/settings',
    BANNERS: '/api/homepage/banners',
    CREATE_BANNER: '/api/homepage/banners',
    UPDATE_BANNER: '/api/homepage/banners/:id',
    DELETE_BANNER: '/api/homepage/banners/:id',
    REORDER_BANNERS: '/api/homepage/banners/reorder',
  },
};

// Helper function to replace URL parameters
export const buildUrl = (endpoint, params) => {
  let url = endpoint;
  if (params) {
    Object.keys(params).forEach(key => {
      url = url.replace(`:${key}`, String(params[key]));
    });
  }
  return url;
};