import { X, Mail, BarChart3 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function CustomerDetailsModal({ open, onOpenChange, customer }) {
  // ✨ FIX 1: Safety check - if no customer is passed, don't render
  if (!customer) return null;

  // ✨ FIX 2: Safely handle missing name
  const safeName = customer.name || "Unknown Customer";
  const initials = safeName.split(' ').map(n => n[0]).join('').substring(0, 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
          <DialogDescription>
            Customer ID: {customer.id}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">

          <div className="grid grid-cols-2 gap-6">
            {/* Left Column - Customer Profile */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                Customer Profile
              </h3>
              
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl font-medium">{initials}</span>
                </div>
                <div>
                  {/* ✨ FIX: Use safeName */}
                  <p className="font-medium">{safeName}</p>
                  <Badge className="text-xs mt-1" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
                    {customer.status || 'Active'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{customer.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Joined:</span>
                  <span>
                    {customer.joinDate 
                      ? new Date(customer.joinDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                      : 'Unknown'}
                  </span>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-xs font-medium text-yellow-800">Notes: Frequent business traveler</p>
              </div>
            </div>

            {/* Right Column - Membership Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                Membership Details
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                  <p className="text-xs text-muted-foreground mb-1">Current Tier</p>
                  <p className="text-lg font-semibold text-amber-900">
                    {customer.membership || 'Bronze'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Customer Type</p>
                  <p className="font-medium capitalize text-sm">{customer.customerType || 'Regular'}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <p className="font-medium capitalize text-sm">{customer.status || 'Active'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Order Summary
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded text-center">
                  <p className="text-2xl font-semibold">{customer.totalOrders || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
                <div className="bg-gray-50 p-3 rounded text-center">
                  <p className="text-2xl font-semibold">₹{(customer.totalSpent || 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Spend</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded text-center">
                  <p className="text-lg font-semibold">
                    ₹{customer.totalOrders ? Math.round((customer.totalSpent || 0) / customer.totalOrders) : 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Avg Order</p>
                </div>
                <div className="bg-gray-50 p-3 rounded text-center">
                  <p className="text-lg font-semibold">{(customer.totalOrders || 0) * 10}</p>
                  <p className="text-xs text-muted-foreground">Loyalty Points</p>
                </div>
              </div>
            </div>

            {/* Recent Orders - Static for now as API doesn't return nested orders yet */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                Recent Activity
              </h3>
              <div className="space-y-1.5">
                <div className="p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">Last Login</span>
                    <Badge className="text-[10px] h-4" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                       {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Preferred Payment:</span> Credit Card
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-medium">Last Order:</span> {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Never'}
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button
              onClick={() => onOpenChange(false)}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300 h-9 text-xs"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}