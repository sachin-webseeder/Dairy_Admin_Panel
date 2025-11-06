import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { UserPlus, X, Check } from 'lucide-react';
import { addUserToSystem } from '../../lib/auth';

// Removed: interface AddUserModalProps { ... }

export function AddUserModal({ open, onOpenChange, onSave }) { // Removed prop types
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'User',
  });

  const [permissions, setPermissions] = useState({
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
  });

  const handlePermissionChange = useCallback((key) => { // Removed :string type
    setPermissions(prev => {
      const currentValue = prev[key]; // Removed as any
      const newPermissions = { ...prev, [key]: !currentValue };
      console.log('Toggling', key, 'from', currentValue, 'to', !currentValue);
      return newPermissions;
    });
  }, []);

  const handleSubmit = (e) => { // Removed : React.FormEvent
    e.preventDefault();
    // Add user to auth system
    addUserToSystem({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      role: formData.role,
      profilePhoto: '',
      permissions
    });
    onSave({ ...formData, permissions });
    onOpenChange(false);
    // Reset form
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'User',
    });
    setPermissions({
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
    });
  };

  const PermissionCheckbox = ({ 
    permissionKey, 
    title, 
    description 
  }) => { // Removed type object
    const isChecked = permissions[permissionKey] === true; // Removed as any
    
    const handleClick = useCallback((e) => { // Removed : React.MouseEvent
      e.preventDefault();
      e.stopPropagation();
      handlePermissionChange(permissionKey);
    }, [permissionKey]);
    
    return (
      <div className="flex items-start gap-2">
        <Checkbox
          id={`add-permission-${permissionKey}`}
          checked={isChecked}
          onCheckedChange={() => handlePermissionChange(permissionKey)}
          className="border-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 mt-0.5"
        />
        <label 
          htmlFor={`add-permission-${permissionKey}`} 
          className="cursor-pointer flex-1 select-none"
          onClick={handleClick}
        >
          <div className="text-xs font-medium">{title}</div>
          <div className="text-[10px] text-muted-foreground">{description}</div>
        </label>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col [&>button]:hidden sm:max-w-3xl">
        <DialogTitle className="sr-only">Create New User</DialogTitle>
        <DialogDescription className="sr-only">Add a new user to your organization</DialogDescription>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <UserPlus className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Create New User</h3>
              <p className="text-xs text-muted-foreground">Add a new user to your organization</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          <form onSubmit={handleSubmit} id="add-user-form">
            {/* Basic Information */}
            <div className="mb-4">
              <h4 className="text-xs font-medium mb-3 text-red-600">* Basic Information</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="name" className="text-xs">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name"
                    required
                    className="text-xs h-9 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                    required
                    className="text-xs h-9 mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <Label htmlFor="password" className="text-xs">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                    required
                    className="text-xs h-9 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-xs">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                    className="text-xs h-9 mt-1"
                  />
                </div>
              </div>
              <div className="mt-3">
                <Label htmlFor="role" className="text-xs">Role</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full text-xs h-9 mt-1 border border-gray-300 rounded-md px-3"
                >
                  <option value="User">User</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>
            </div>

            {/* Permissions & Access */}
            <div className="mb-4">
              <h4 className="text-xs font-medium mb-3 text-red-600">* Permissions & Access</h4>
              
              {/* Core Section */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-3 w-3 text-blue-500" />
                  <span className="text-xs font-medium">Core</span>
                </div>
                <div className="grid grid-cols-2 gap-3 ml-5">
                  <PermissionCheckbox 
                    permissionKey="dashboard"
                    title="Dashboard"
                    description="Main overview and metrics"
                  />
                  <PermissionCheckbox 
                    permissionKey="settings"
                    title="Settings"
                    description="System configuration"
                  />
                  <PermissionCheckbox 
                    permissionKey="userManagement"
                    title="User Management"
                    description="Manage users and permissions"
                  />
                  <PermissionCheckbox 
                    permissionKey="homepage"
                    title="Homepage"
                    description="Homepage management"
                  />
                  <PermissionCheckbox 
                    permissionKey="reports"
                    title="Reports"
                    description="View and generate reports"
                  />
                  <PermissionCheckbox 
                    permissionKey="products"
                    title="Products"
                    description="Product management"
                  />
                  <PermissionCheckbox 
                    permissionKey="orders"
                    title="Orders"
                    description="Order management"
                  />
                  <PermissionCheckbox 
                    permissionKey="customers"
                    title="Customers"
                    description="Customer management"
                  />
                  <PermissionCheckbox 
                    permissionKey="deliveryStaff"
                    title="Delivery Staff"
                    description="Staff management"
                  />
                  <PermissionCheckbox 
                    permissionKey="branches"
                    title="Branches"
                    description="Branch management"
                  />
                  <PermissionCheckbox 
                    permissionKey="profile"
                    title="Profile"
                    description="User profile access"
                  />
                </div>
              </div>

              {/* Analytics & Reports Section */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-3 w-3 text-blue-500" />
                  <span className="text-xs font-medium">Analytics & Reports</span>
                </div>
                <div className="grid grid-cols-2 gap-3 ml-5">
                  <PermissionCheckbox 
                    permissionKey="analytics"
                    title="Analytics"
                    description="Advanced analytics dashboard"
                  />
                  <PermissionCheckbox 
                    permissionKey="auditLogs"
                    title="Audit Logs"
                    description="System audit trails"
                  />
                </div>
              </div>

              {/* Operations Section */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-3 w-3 text-blue-500" />
                  <span className="text-xs font-medium">Operations</span>
                </div>
                <div className="grid grid-cols-2 gap-3 ml-5">
                  <PermissionCheckbox 
                    permissionKey="billing"
                    title="Billing"
                    description="Payment and subscription management"
                  />
                  <PermissionCheckbox 
                    permissionKey="notifications"
                    title="Notifications"
                    description="Email and push notifications"
                  />
                  <PermissionCheckbox 
                    permissionKey="contentManagement"
                    title="Content Management"
                    description="Content creation and editing"
                  />
                </div>
              </div>

              {/* Development Section */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-3 w-3 text-blue-500" />
                  <span className="text-xs font-medium">Development</span>
                </div>
                <div className="grid grid-cols-2 gap-3 ml-5">
                  <PermissionCheckbox 
                    permissionKey="integrations"
                    title="Integrations"
                    description="Third party integrations"
                  />
                  <PermissionCheckbox 
                    permissionKey="apiAccess"
                    title="Api Access"
                    description="API keys and documentation"
                  />
                  <PermissionCheckbox 
                    permissionKey="security"
                    title="Security"
                    description="Security settings and logs"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs h-9"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="add-user-form"
            className="bg-blue-500 hover:bg-blue-600 text-xs h-9"
          >
            Create User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}