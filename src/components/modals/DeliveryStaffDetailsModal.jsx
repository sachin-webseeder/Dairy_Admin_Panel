import { X, Mail, BarChart3 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
// Removed TypeScript type import: import { DeliveryBoy } from '../../types';

// Removed TypeScript interface: DeliveryStaffDetailsModalProps

export function DeliveryStaffDetailsModal({ open, onOpenChange, staff }) {
  const initials = staff.name.split(' ').map(n => n[0]).join('').substring(0, 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Delivery Staff Details</DialogTitle>
          <DialogDescription>
            Staff ID: {staff.id}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">

          <div className="grid grid-cols-2 gap-6">
            {/* Left Column - Staff Profile */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                Staff Profile
              </h3>
              
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl font-medium">{initials}</span>
                </div>
                <div>
                  <p className="font-medium">{staff.name}</p>
                  <Badge className="text-xs mt-1" style={{ 
                    backgroundColor: staff.status === 'active' ? '#e8f5e9' : '#fee',
                    color: staff.status === 'active' ? '#2e7d32' : '#c00'
                  }}>
                    {staff.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{staff.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{staff.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Joined:</span>
                  <span>{staff.joinedDate || 'N/A'}</span>
                </div>
              </div>

              {staff.vehicle && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-blue-800">Vehicle: {staff.vehicle}</p>
                </div>
              )}
            </div>

            {/* Right Column - Performance Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                Performance Details
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <p className="text-xs text-muted-foreground mb-1">Rating</p>
                  <p className="text-lg font-semibold text-green-900">
                    {staff.rating} / 5.0
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Completed Orders</p>
                  <p className="font-medium text-sm">{staff.completedOrders || 0}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Avg Delivery Time</p>
                  <p className="font-medium text-sm">{staff.avgDeliveryTime || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Current Statistics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded text-center">
                  <p className="text-2xl font-semibold">{staff.currentOrders || 0}</p>
                  <p className="text-xs text-muted-foreground">Active Orders</p>
                </div>
                <div className="bg-gray-50 p-3 rounded text-center">
                  <p className="text-2xl font-semibold">{staff.weekOrders || 0}</p>
                  <p className="text-xs text-muted-foreground">This Week</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded text-center">
                  <p className="text-lg font-semibold">{staff.completedOrders || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                </div>
                <div className="bg-gray-50 p-3 rounded text-center">
                  <p className="text-lg font-semibold">{staff.rating || 0}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </div>

            {/* Recent Deliveries */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium flex items-center gap-2">
                Recent Deliveries
              </h3>
              <div className="space-y-1.5">
                <div className="p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">ORD-2025-156</span>
                    <Badge className="text-[10px] h-4" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
                      Delivered
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">Today, 02:30 PM</span>
                    <span className="text-xs font-semibold">25 min</span>
                  </div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">ORD-2025-142</span>
                    <Badge className="text-[10px] h-4" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
                      Delivered
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">Today, 11:15 AM</span>
                    <span className="text-xs font-semibold">18 min</span>
                  </div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">ORD-2025-138</span>
                    <Badge className="text-[10px] h-4" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
                      Delivered
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">Yesterday, 06:45 PM</span>
                    <span className="text-xs font-semibold">22 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Status:</span> {staff.status === 'active' ? 'Currently Active' : 'Inactive'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="font-medium">Last Delivery:</span> Today, 02:30 PM
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