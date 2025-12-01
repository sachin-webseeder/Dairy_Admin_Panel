import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { X } from "lucide-react";
// ✨ REMOVED: import { addUserToSystem } from "../../lib/auth";

export function AddUserModal({ open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "User",
  });

  const [permissions, setPermissions] = useState({
    dashboard: true,
    products: true,
    orders: true,
    customers: true,
    deliveryStaff: false,
    membership: false,
    profile: true,
    // ... set defaults for others as false
  });

  const handlePermissionChange = useCallback((key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // ✨ FIX: Split "Full Name" into "firstName" and "lastName" for the API
    const nameParts = formData.name.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || '';

    // ✨ FIX: Convert permissions object to array of strings
    const permissionsArray = Object.keys(permissions).filter(key => permissions[key]);

    const newUser = {
      firstName,
      lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role, // Note: Backend might ignore this if not in schema, but we send it
      permissions: permissionsArray,
      // isActive will be handled by backend default
    };

    // ✨ Send data to parent (UserManagement.jsx) to handle the API call
    onSave(newUser);
    
    onOpenChange(false);

    // Reset form
    setFormData({ name: "", email: "", password: "", phone: "", role: "User" });
  };

  const PermissionCheckbox = ({ permissionKey, title, description }) => (
    <div className="flex items-start gap-2">
      <Checkbox
        id={permissionKey}
        checked={permissions[permissionKey] || false}
        onCheckedChange={() => handlePermissionChange(permissionKey)}
        className="mt-0.5 h-4 w-4 data-[state=checked]:bg-blue-600"
      />
      <div className="flex-1">
        <Label htmlFor={permissionKey} className="cursor-pointer text-xs font-normal">{title}</Label>
        {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 bg-white gap-0 overflow-hidden">
        <DialogHeader className="px-5 py-4 border-b">
          <DialogTitle className="text-base font-medium">Add New User</DialogTitle>
          <DialogDescription className="sr-only">Add a new user to the system</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <form id="add-user-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <Label className="text-xs">Full Name</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Enter full name" required className="text-xs h-9 mt-1" />
              </div>
              <div>
                <Label className="text-xs">Email Address</Label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Enter email" required className="text-xs h-9 mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <Label className="text-xs">Password</Label>
                <Input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Enter password" required className="text-xs h-9 mt-1" />
              </div>
              <div>
                <Label className="text-xs">Phone Number</Label>
                <Input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Enter phone" className="text-xs h-9 mt-1" />
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-xs font-medium mb-3 text-red-600">* Permissions & Access</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                  <PermissionCheckbox permissionKey="dashboard" title="Dashboard" />
                  <PermissionCheckbox permissionKey="products" title="Products" />
                  <PermissionCheckbox permissionKey="orders" title="Orders" />
                  <PermissionCheckbox permissionKey="customers" title="Customers" />
                  <PermissionCheckbox permissionKey="users" title="User Management" />
                  {/* Add other permissions as needed */}
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t bg-gray-50">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="h-9 text-xs">Cancel</Button>
          <Button type="submit" form="add-user-form" className="bg-blue-600 hover:bg-blue-700 h-9 text-xs">Add User</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}