import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Check, Shield, Power } from 'lucide-react'; // ✨ Added Power import
import { toast } from 'sonner';

// ✨ Internal CustomToggle Component to avoid import errors
function CustomToggle({ label, checked, onChange, activeColor = "bg-green-500" }) {
  // Extract color name (e.g., 'green' from 'bg-green-500') for dynamic classes
  const colorName = activeColor.split('-')[1]; 
  
  return (
    <div 
      onClick={() => onChange(!checked)}
      className={`
        flex items-center justify-between w-full p-3 rounded-lg border cursor-pointer transition-all duration-200
        ${checked ? `border-${colorName}-200 bg-${colorName}-50` : 'border-gray-200 bg-white hover:bg-gray-50'}
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`
          h-10 w-10 rounded-full flex items-center justify-center transition-colors
          ${checked ? `bg-white text-${colorName}-600 shadow-sm` : 'bg-gray-100 text-gray-400'}
        `}>
          {checked ? <Check className="h-5 w-5" /> : <Power className="h-5 w-5" />}
        </div>
        <span className={`text-sm font-medium ${checked ? 'text-gray-900' : 'text-gray-500'}`}>
          {label}
        </span>
      </div>
      
      <div className={`
        w-11 h-6 rounded-full transition-colors relative
        ${checked ? activeColor : 'bg-gray-300'}
      `}>
        <div className={`
          absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow transition-transform duration-200
          ${checked ? 'translate-x-5' : 'translate-x-0'}
        `} />
      </div>
    </div>
  );
}

// Permissions list
const PANEL_PERMISSIONS = [
  "dashboard", "inventory", "orders", "delivery", "customers", "reports", 
  "products", "settings", "userManagement", "profile", "membership", 
  "analytics", "auditLogs", "billing", "content", "wallet", 
  "helpSupport", "apiAccess"
];

export function EditUserModal({ open, onOpenChange, onSave, user }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    permissions: [],
    isEnabled: true
  });

  // Load user data when modal opens
  useEffect(() => {
    if (open && user) {
      setFormData({
        id: user.id || user._id,
        firstName: user.firstName || user.name?.split(' ')[0] || '',
        lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        permissions: user.permissions || [],
        isEnabled: user.isEnabled ?? true
      });
    }
  }, [open, user]);

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
    
    // The backend updateUser controller only accepts 'permissions' and 'isEnabled'
    const payload = {
      id: formData.id,
      permissions: formData.permissions,
      isEnabled: formData.isEnabled
    };

    onSave(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-hidden flex flex-col p-0 gap-0 bg-white rounded-xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b bg-gray-50 flex-shrink-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Edit User: {user?.name}</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Update permissions and account status.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="edit-user-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Read-Only Info */}
            <div className="space-y-4 opacity-70 cursor-not-allowed">
              <h3 className="text-sm font-semibold text-gray-900">User Information (Read-Only)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={formData.firstName} disabled className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={formData.lastName} disabled className="bg-gray-50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={formData.email} disabled className="bg-gray-50" />
                </div>
                 <div className="space-y-2">
                  <Label>Role</Label>
                  <Input value={user?.role || ''} disabled className="bg-gray-50" />
                </div>
              </div>
            </div>

             <div className="h-px bg-gray-100 my-2" />

            {/* Account Status */}
             <div className="space-y-2">
               <h3 className="text-sm font-semibold text-gray-900 mb-3">Account Status</h3>
                <CustomToggle
                  label={formData.isEnabled ? "User Account enabled" : "User Account disabled"}
                  checked={formData.isEnabled}
                  onChange={(checked) => setFormData(prev => ({ ...prev, isEnabled: checked }))}
                  activeColor="bg-green-500"
                />
             </div>

            <div className="h-px bg-gray-100 my-2" />

            {/* Permissions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-600" />
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
          <Button type="submit" form="edit-user-form" className="bg-red-500 hover:bg-red-600 text-white px-6">
            Save Changes
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}