import { createContext, useContext, useState, useEffect } from 'react';
// Removed UserPermissions, ReactNode type imports
import { getCurrentUser } from './auth'; // Removed AuthUser type import

// Removed PermissionContextType interface

// Removed <PermissionContextType | undefined> generic
const PermissionContext = createContext(undefined);

// Default admin permissions (all access)
// Removed : UserPermissions type
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
  branches: true,
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
  
  // Legacy
  supply: true,
  smsList: true,
};

// Default new user permissions (limited access)
// Removed : UserPermissions type
const DEFAULT_USER_PERMISSIONS = {
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
  branches: false,
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
  
  // Legacy
  supply: false,
  smsList: false,
};

// Removed : { children: ReactNode } type
export function PermissionProvider({ children }) {
  // Removed <AuthUser | null> generic
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    // Update user state when it changes
    const interval = setInterval(() => {
      setUser(getCurrentUser());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Removed : UserPermissions return type
  const getPermissions = () => {
    if (!user) return DEFAULT_USER_PERMISSIONS;
    
    // Admin has all permissions
    if (user.email === 'admin@123' || user.role === 'Admin' || user.role === 'Super Admin') {
      return ADMIN_PERMISSIONS;
    }
    
    // Return user's specific permissions or default
    return user.permissions || DEFAULT_USER_PERMISSIONS;
  };

  // Removed parameter and return types
  const hasPermission = (permission) => {
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