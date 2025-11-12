import { useState } from 'react';
import { X } from 'lucide-react';
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

// interface AddCustomerModalProps { ... } // Interface removed

// Prop types are removed from the function definition
export function AddCustomerModal({ open, onOpenChange, onSave }) {
  // Generic type <Partial<Customer>> removed from useState
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

  // Type annotation : React.FormEvent removed
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Type annotation : Partial<Customer> removed
    const newCustomer = {
      ...formData,
      id: `CUST-${Date.now()}`,
      joinDate: new Date().toISOString().split('T')[0],
      lastOrderDate: new Date().toISOString().split('T')[0],
    };

    onSave(newCustomer);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      membershipTier: 3,
      status: 'active',
      customerType: 'new',
      totalOrders: 0,
      totalSpent: 0,
    });
  };

  // Type annotations : keyof Customer and : any removed
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            Add New Customer
          </DialogTitle>
          <DialogDescription>
            Fill in the customer details below to add them to your database.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium border-b pb-2">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs">Customer Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter customer name"
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="customer@email.com"
                  className="text-xs h-9"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone || ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="text-xs h-9"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="membershipTier" className="text-xs">Membership Tier</Label>
                <Select 
                  value={formData.membershipTier?.toString() || '3'} 
                  onValueChange={(value) => handleChange('membershipTier', parseInt(value))}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1" className="text-xs">Gold</SelectItem>
                    <SelectItem value="2" className="text-xs">Silver</SelectItem>
                    <SelectItem value="3" className="text-xs">Bronze</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Customer Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium border-b pb-2">Customer Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerType" className="text-xs">Customer Type</Label>
                <Select 
                  value={formData.customerType || 'new'} 
                  // Type cast as 'new' | ... removed
                  onValueChange={(value) => handleChange('customerType', value)}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new" className="text-xs">New</SelectItem>
                    <SelectItem value="returning" className="text-xs">Returning</SelectItem>
                    <SelectItem value="high-value" className="text-xs">High-Value</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-xs">Status</Label>
                <Select 
                  value={formData.status || 'active'} 
                  // Type cast as 'active' | ... removed
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active" className="text-xs">Active</SelectItem>
                    <SelectItem value="inactive" className="text-xs">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalOrders" className="text-xs">Total Orders</Label>
                <Input
                  id="totalOrders"
                  type="number"
                  value={formData.totalOrders || 0}
                  onChange={(e) => handleChange('totalOrders', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="text-xs h-9"
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalSpent" className="text-xs">Total Spent (₹)</Label>
                <Input
                  id="totalSpent"
                  type="number"
                  value={formData.totalSpent || 0}
                  onChange={(e) => handleChange('totalSpent', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="text-xs h-9"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-500 hover:bg-red-600 h-9 text-xs"
            >
              Add Customer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}