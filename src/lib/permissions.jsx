import { createContext, useContext, useState, useEffect } from 'react';
// import { UserPermissions } from '../types'; // Removed type import
import { getCurrentUser } from './auth'; // Removed 'AuthUser' type import

// 'PermissionContextType' interface removed

const PermissionContext = createContext(undefined); // Removed type annotation

// Default admin permissions (all access)
const ADMIN_PERMISSIONS = { // Removed 'UserPermissions' type
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

// Default new user permissions (limited access)
const DEFAULT_USER_PERMISSIONS = { // Removed 'UserPermissions' type
  // Core
  dashboard: true,
  settings: false,
  userManagement: false,
  homepage: false,
  reports: false,
  products: true,
  orders: true,
  customers: true,
  deliveryStaff: false,
  subscriptions: false,
  profile: true,
  
  // Analytics & Reports
  analytics: false,
  auditLogs: false,
  
  // Operations
  billing: false,
  notifications: false,
  contentManagement: false,
  
  // Development
  integrations: false,
  apiAccess: false,
  security: false,
};

export function PermissionProvider({ children }) { // Removed prop types
  const [user, setUser] = useState(getCurrentUser()); // Removed 'AuthUser | null' type

  useEffect(() => {
    // Update user state when it changes
    const interval = setInterval(() => {
      setUser(getCurrentUser());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getPermissions = () => { // Removed 'UserPermissions' return type
    if (!user) return DEFAULT_USER_PERMISSIONS;
    
    // Default admin always gets full permissions
    if (user.email === 'admin@123') {
      return ADMIN_PERMISSIONS;
    }
    
    // Super Admins always get full permissions
    if (user.role === 'Super Admin') {
      return ADMIN_PERMISSIONS;
    }
    
    // Return user's specific permissions if they exist, otherwise return default
    return user.permissions || DEFAULT_USER_PERMISSIONS;
  };

  const hasPermission = (permission) => { // Removed 'keyof UserPermissions' and 'boolean' types
    const permissions = getPermissions();
    return permissions[permission] === true;
  };

  return (
    <PermissionContext.Provider value={{ hasPermission, permissions: getPermissions() }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
}

export { DEFAULT_USER_PERMISSIONS, ADMIN_PERMISSIONS };