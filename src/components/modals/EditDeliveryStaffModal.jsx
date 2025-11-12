import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Star, TrendingUp } from 'lucide-react';
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
// We remove the 'DeliveryBoy' type import

// We remove the 'EditDeliveryStaffModalProps' interface

export function EditDeliveryStaffModal({ open, onOpenChange, onSave, staff }) { // Removed : EditDeliveryStaffModalProps
  const [formData, setFormData] = useState({ // Removed <Partial<DeliveryBoy>>
    name: '',
    email: '',
    phone: '',
    status: 'active',
    rating: 0,
    completedOrders: 0,
    currentOrders: 0,
    weekOrders: 0,
    avgDeliveryTime: '',
    joinedDate: '',
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name,
        email: staff.email,
        phone: staff.phone,
        status: staff.status,
        rating: staff.rating,
        completedOrders: staff.completedOrders,
        currentOrders: staff.currentOrders,
        weekOrders: staff.weekOrders,
        avgDeliveryTime: staff.avgDeliveryTime,
        joinedDate: staff.joinedDate,
      });
    }
  }, [staff, open]);

  const handleSubmit = (e) => { // Removed : React.FormEvent
    e.preventDefault();

    if (staff) {
      const updatedStaff = { // Removed : DeliveryBoy
        ...staff,
        ...formData,
        name: formData.name, // Removed !
        email: formData.email, // Removed !
        phone: formData.phone, // Removed !
        status: formData.status, // Removed !
        rating: formData.rating, // Removed !
        completedOrders: formData.completedOrders, // Removed !
        currentOrders: formData.currentOrders, // Removed !
        weekOrders: formData.weekOrders, // Removed !
        avgDeliveryTime: formData.avgDeliveryTime, // Removed !
        joinedDate: formData.joinedDate, // Removed !
      };

      onSave(updatedStaff);
      onOpenChange(false);
    }
  };

  const handleChange = (field, value) => { // Removed : keyof DeliveryBoy, value: any
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col [&>button]:hidden sm:max-w-3xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Edit Delivery Staff</DialogTitle>
          <DialogDescription>Edit delivery staff information and performance details</DialogDescription>
        </DialogHeader>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <User className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Edit Delivery Staff</h3>
              <p className="text-xs text-muted-foreground">Update staff information and performance details</p>
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
          <form onSubmit={handleSubmit} id="edit-delivery-staff-form">
            {/* Contact Information */}
            <div className="mb-4">
              <h4 className="text-xs font-medium mb-3 text-red-600 flex items-center gap-2">
                <Mail className="h-3 w-3" />
                Contact Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="name" className="text-xs">Staff Name *</Label>
                  <Input
                    id="name"
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter staff name"
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
                    placeholder="staff@email.com"
                    required
                    className="text-xs h-9 mt-1"
                  />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
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
                <div>
                  <Label htmlFor="joinedDate" className="text-xs">Joined Date</Label>
                  <Input
                    id="joinedDate"
                    value={formData.joinedDate || ''}
                    onChange={(e) => handleChange('joinedDate', e.target.value)}
                    placeholder="e.g., Jan 2024"
                    className="text-xs h-9 mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="mb-4">
              <h4 className="text-xs font-medium mb-3 text-red-600 flex items-center gap-2">
                <User className="h-3 w-3" />
                Staff Status
              </h4>
              <div>
                <Label htmlFor="status" className="text-xs">Status</Label>
                <Select
                  value={formData.status || 'active'}
                  onValueChange={(value) => handleChange('status', value)} // Removed 'as 'active' | 'inactive''
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

            {/* Performance Metrics */}
            <div className="mb-4">
              <h4 className="text-xs font-medium mb-3 text-red-600 flex items-center gap-2">
                <Star className="h-3 w-3" />
                Performance Metrics
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="rating" className="text-xs">Rating</Label>
                  <Input
                    id="rating"
                    type="number"
                    value={formData.rating || 0}
                    onChange={(e) => handleChange('rating', parseFloat(e.target.value) || 0)}
                    placeholder="4.5"
                    className="text-xs h-9 mt-1"
                    min="0"
                    max="5"
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor="completedOrders" className="text-xs">Completed Orders</Label>
                  <Input
                    id="completedOrders"
                    type="number"
                    value={formData.completedOrders || 0}
                    onChange={(e) => handleChange('completedOrders', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="text-xs h-9 mt-1"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="avgDeliveryTime" className="text-xs">Avg Delivery Time</Label>
                  <Input
                    id="avgDeliveryTime"
                    value={formData.avgDeliveryTime || ''}
                    onChange={(e) => handleChange('avgDeliveryTime', e.target.value)}
                    placeholder="25m"
                    className="text-xs h-9 mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Order Statistics */}
            <div className="mb-4">
              <h4 className="text-xs font-medium mb-3 text-red-600 flex items-center gap-2">
                <TrendingUp className="h-3 w-3" />
                Order Statistics
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="currentOrders" className="text-xs">Current Active Orders</Label>
                  <Input
                    id="currentOrders"
                    type="number"
                    value={formData.currentOrders || 0}
                    onChange={(e) => handleChange('currentOrders', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="text-xs h-9 mt-1"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="weekOrders" className="text-xs">Orders This Week</Label>
                  <Input
                    id="weekOrders"
                    type="number"
                    value={formData.weekOrders || 0}
                    onChange={(e) => handleChange('weekOrders', parseInt(e.garet.value) || 0)}
                    placeholder="0"
                    className="text-xs h-9 mt-1"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <h4 className="text-xs font-medium mb-2">Staff Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium capitalize">{formData.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating:</span>
                  <span className="font-medium">{formData.rating || 0} ⭐</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed Orders:</span>
                  <span className="font-medium">{formData.completedOrders || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Orders:</span>
                  <span className="font-medium">{formData.currentOrders || 0}</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        

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
            form="edit-delivery-staff-form"
            className="bg-red-500 hover:bg-red-600 text-xs h-9"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}