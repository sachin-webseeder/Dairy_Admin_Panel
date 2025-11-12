import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, ShoppingBag, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
// import { Customer } from '../../types'; // Type import removed

// interface EditCustomerModalProps { ... } // Interface removed

export function EditCustomerModal({ open, onOpenChange, onSave, customer }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membershipTier: 3,
    status: 'active',
    customerType: 'new',
    totalOrders: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        membershipTier: customer.membershipTier || 3,
        status: customer.status,
        customerType: customer.customerType,
        totalOrders: customer.totalOrders,
        totalSpent: customer.totalSpent,
      });
    }
  }, [customer, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (customer) {
      const updatedCustomer = {
        ...customer,
        ...formData,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        membershipTier: formData.membershipTier,
        status: formData.status,
        customerType: formData.customerType,
        totalOrders: formData.totalOrders,
        totalSpent: formData.totalSpent,
      };

      onSave(updatedCustomer);
      onOpenChange(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getMembershipTierName = (tier) => {
    switch (tier) {
      case 1: return 'Gold';
      case 2: return 'Silver';
      case 3: return 'Bronze';
      default: return 'Bronze';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col [&>button]:hidden sm:max-w-3xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogDescription>Edit customer information and details</DialogDescription>
        </DialogHeader>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <User className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Edit Customer</h3>
              <p className="text-xs text-muted-foreground">Update customer information and details</p>
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
          <form onSubmit={handleSubmit} id="edit-customer-form">
            {/* Contact Information */}
            <div className="mb-4">
              <h4 className="text-xs font-medium mb-3 text-red-600 flex items-center gap-2">
                <Mail className="h-3 w-3" />
                Contact Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="name" className="text-xs">Customer Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter customer name"
                    required
                    className="text-xs h-9 mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="customer@email.com"
                    required
                    className="text-xs h-9 mt-1"
                  />
                </div>
              </div>
              <div className="mt-3">
                <Label htmlFor="phone" className="text-xs">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  className="text-xs h-9 mt-1"
                />
              </div>
            </div>

            {/* Customer Details */}
            <div className="mb-4">
              <h4 className="text-xs font-medium mb-3 text-red-600 flex items-center gap-2">
                <User className="h-3 w-3" />
                Customer Details
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="membershipTier" className="text-xs">Membership Tier</Label>
                  <Select 
                    value={formData.membershipTier?.toString() || '3'} 
                    onValueChange={(value) => handleChange('membershipTier', parseInt(value))}
                  >
                    <SelectTrigger className="text-xs h-9 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1" className="text-xs">Gold</SelectItem>
                      <SelectItem value="2" className="text-xs">Silver</SelectItem>
                      <SelectItem value="3" className="text-xs">Bronze</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="customerType" className="text-xs">Customer Type</Label>
                  <Select 
                    value={formData.customerType || 'new'} 
                    onValueChange={(value) => handleChange('customerType', value)}
                  >
                    <SelectTrigger className="text-xs h-9 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new" className="text-xs">New</SelectItem>
                      <SelectItem value="returning" className="text-xs">Returning</SelectItem>
                      <SelectItem value="high-value" className="text-xs">High-Value</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status" className="text-xs">Status</Label>
                  <Select 
                    value={formData.status || 'active'} 
                    onValueChange={(value) => handleChange('status', value)}
                  >
                    <SelectTrigger className="text-xs h-9 mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active" className="text-xs">Active</SelectItem>
                      <SelectItem value="inactive" className="text-xs">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Orders & Spending */}
            <div className="mb-4">
              <h4 className="text-xs font-medium mb-3 text-red-600 flex items-center gap-2">
                <ShoppingBag className="h-3 w-3" />
                Orders & Spending
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="totalOrders" className="text-xs">Total Orders</Label>
                  <Input
                    id="totalOrders"
                    type="number"
                    value={formData.totalOrders || 0}
                    onChange={(e) => handleChange('totalOrders', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="text-xs h-9 mt-1"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="totalSpent" className="text-xs">Total Spent (₹)</Label>
                  <Input
                    id="totalSpent"
                    type="number"
                    value={formData.totalSpent || 0}
                    onChange={(e) => handleChange('totalSpent', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="text-xs h-9 mt-1"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <h4 className="text-xs font-medium mb-2">Customer Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Membership:</span>
                  <span className="font-medium">{getMembershipTierName(formData.membershipTier || 3)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-medium capitalize">{formData.customerType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Orders:</span>
                  <span className="font-medium">{formData.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Spent:</span>
                  <span className="font-medium">₹{formData.totalSpent?.toFixed(2)}</span>
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
            form="edit-customer-form"
            className="bg-red-500 hover:bg-red-600 text-xs h-9"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}