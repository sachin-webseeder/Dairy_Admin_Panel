// src/lib/auth.js

import { createClient } from '@supabase/supabase-js';
// Make sure your info file exports supabaseUrl, not projectId
import { supabaseUrl, publicAnonKey } from '../utils/supabase/info.jsx';

export const supabase = createClient(supabaseUrl, publicAnonKey);

// Simple authentication storage
// Simple authentication storage
// Type imports for UserPermissions removed

// Interface AuthUser removed

const USERS_STORAGE_KEY = 'dynasty_premium_users';
const CURRENT_USER_KEY = 'dynasty_premium_current_user';

// Default admin permissions (all access)
const ADMIN_PERMISSIONS = {
  // Core
  dashboard: true,
  settings: true,
  userManagement: true,
  homepage: true,
  reports: true,
  products: true,
  orders: true,
  customers: true,
  deliveryStaff: true,
  subscriptions: true,
  profile: true,
  
  // Analytics & Reports
  analytics: true,
  auditLogs: true,
  
  // Operations
  billing: true,
  notifications: true,
  contentManagement: true,
  
  // Development
  integrations: true,
  apiAccess: true,
  security: true,
};

// Initialize with default admin user
const initializeUsers = () => {
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Default admin user with credentials: admin@123 / admin123
  const defaultUsers = [
    {
      id: '1',
      email: 'admin@123',
      password: 'admin123',
      name: 'Admin User',
      phone: '+91 98765 43210',
      role: 'Super Admin',
      profilePhoto: '',
      permissions: ADMIN_PERMISSIONS
    }
  ];
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
};

export const getAllUsers = () => {
  return initializeUsers();
};

export const registerUser = (email, password, name, phone, role = 'User') => {
  const users = getAllUsers();
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return null;
  }
  
  const newUser = {
    id: Date.now().toString(),
    email,
    password,
    name,
    phone,
    role,
    profilePhoto: ''
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  return newUser;
};

export const loginUser = (email, password) => {
  const users = getAllUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Ensure default admin and Super Admins always have full permissions
    if (user.email === 'admin@123' || user.role === 'Super Admin') {
      user.permissions = ADMIN_PERMISSIONS;
    }
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }
  
  return null;
};

export const getCurrentUser = () => {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  if (!stored) return null;
  
  const user = JSON.parse(stored);
  
  // Ensure default admin and Super Admins always have full permissions
  if (user.email === 'admin@123' || user.role === 'Super Admin') {
    user.permissions = ADMIN_PERMISSIONS;
  }
  
  return user;
};

export const updateCurrentUser = (updates) => {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  
  const updatedUser = { ...currentUser, ...updates };
  
  // Ensure default admin and Super Admins always have full permissions
  if (updatedUser.email === 'admin@123' || updatedUser.role === 'Super Admin') {
    updatedUser.permissions = ADMIN_PERMISSIONS;
  }
  
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
  
  // Also update in users list
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === currentUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const addUserToSystem = (user) => {
  const users = getAllUsers();
  const newUser = {
    ...user,
    id: Date.now().toString()
  };
  
  // Ensure Super Admins always have full permissions
  if (newUser.role === 'Super Admin') {
    newUser.permissions = ADMIN_PERMISSIONS;
  }
  
  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  return newUser;
};

export const updateUserInSystem = (id, updates) => {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    
    // Ensure default admin and Super Admins always have full permissions
    if (users[index].email === 'admin@123' || users[index].role === 'Super Admin') {
      users[index].permissions = ADMIN_PERMISSIONS;
    }
    
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    
    // If updating current user, update current user storage too
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === id) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[index]));
    }
  }
};

export const deleteUserFromSystem = (id) => {
  const users = getAllUsers();
  const filtered = users.filter(u => u.id !== id);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));
};

export const isEmailRegistered = (email) => {
  const users = getAllUsers();
  return users.some(u => u.email === email);
};

export const resetUserPassword = (email, newPassword) => {
  const users = getAllUsers();
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) {
    return false;
  }
  
  users[userIndex].password = newPassword;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  
  // If this is the current user, update current user storage
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.email === email) {
    currentUser.password = newPassword;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
  }
  
  return true;
};