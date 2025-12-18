import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Check, X, Shield } from 'lucide-react';
import { toast } from 'sonner';

// Permissions list from your controller
const PANEL_PERMISSIONS = [
  "dashboard", "inventory", "orders", "delivery", "customers", "reports", 
  "products", "settings", "userManagement", "profile", "membership", 
  "analytics", "auditLogs", "billing", "content", "wallet", 
  "helpSupport", "apiAccess"
];

export function AddUserModal({ open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    permissions: ['dashboard', 'orders'] // Default as per controller
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePermission = (permission) => {
    setFormData(prev => {
      const current = prev.permissions;
      if (current.includes(permission)) {
        return { ...prev, permissions: current.filter(p => p !== permission) };
      } else {
        return { ...prev, permissions: [...current, permission] };
      }
    });
  };

  const toggleAllPermissions = () => {
    if (formData.permissions.length === PANEL_PERMISSIONS.length) {
      setFormData(prev => ({ ...prev, permissions: [] }));
    } else {
      setFormData(prev => ({ ...prev, permissions: [...PANEL_PERMISSIONS] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.firstName || !formData.email || !formData.phone || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Pass data to parent handler
    onSave(formData);
    
    // Reset form (optional, depending on UX preference)
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      permissions: ['dashboard', 'orders']
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 bg-white rounded-xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b bg-gray-50 flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Add New Panel User</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Create a new staff account with specific permissions.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="add-user-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs">1</span>
                Personal Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                  <Input id="firstName" name="firstName" placeholder="e.g. John" value={formData.firstName} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" placeholder="e.g. Doe" value={formData.lastName} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                  <Input id="email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                  <Input id="phone" name="phone" placeholder="+91 9876543210" value={formData.phone} onChange={handleChange} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
              </div>
            </div>

            <div className="h-px bg-gray-100 my-2" />

            {/* Permissions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-xs">2</span>
                  Access Permissions
                </h3>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={toggleAllPermissions}
                  className="text-xs h-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  {formData.permissions.length === PANEL_PERMISSIONS.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PANEL_PERMISSIONS.map((perm) => {
                  const isSelected = formData.permissions.includes(perm);
                  // Format permission name (camelCase to Title Case)
                  const label = perm.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  
                  return (
                    <div 
                      key={perm}
                      onClick={() => togglePermission(perm)}
                      className={`
                        flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-all duration-200 select-none
                        ${isSelected 
                          ? 'bg-blue-50 border-blue-200 shadow-sm' 
                          : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'}
                      `}
                    >
                      <div className={`
                        h-5 w-5 rounded border flex items-center justify-center transition-colors
                        ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white border-gray-300'}
                      `}>
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </div>
                      <span className={`text-xs font-medium ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3 flex-shrink-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="add-user-form" className="bg-red-500 hover:bg-red-600 text-white px-6">
            Create User
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}