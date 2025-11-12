import { X, ShoppingBag, User, CreditCard, Package, MapPin, Calendar, Crown } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
// Removed type import: import { Order } from '../../types';
import { customers } from '../../lib/mockData';

// Removed TypeScript interface: OrderDetailsModalProps

export function OrderDetailsModal({ open, onOpenChange, order }) {
  // Get customer membership from customers data
  const customer = customers.find(c => c.name === order.customerName);
  const membershipTierName = customer?.membershipTier === 1 ? 'Gold' : customer?.membershipTier === 2 ? 'Silver' : 'Bronze';
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return { backgroundColor: '#e8f5e9', color: '#2e7d32' };
      case 'pending':
        return { backgroundColor: '#fff3e0', color: '#e65100' };
      case 'cancelled':
        return { backgroundColor: '#f5f5f5', color: '#616161' };
      default:
        return { backgroundColor: '#e3f2fd', color: '#1565c0' };
    }
  };

  const getMembershipColor = (membership) => {
    switch (membership) {
      case 'Gold':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Silver':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Bronze':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Order ID: #{order.id.split('-')[1]}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">

          <div className="grid grid-cols-2 gap-6">
            {/* Left Column - Order Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" /> Order Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">Order ID</p>
                    <p className="font-medium text-sm">#{order.id.split('-')[1]}</p>
                  </div>
                  <Badge style={getStatusColor(order.status)} className="text-xs">
                    {order.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Order Date:</span>
                  <span className="font-medium">
                    {new Date(order.date).toLocaleDateString('en-GB', { 
                      day: '2-digit', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Payment:</span>
                  <span className="font-medium capitalize">{order.payment || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Total Items:</span>
                  <span className="font-medium">{order.items}</span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-xs font-medium text-blue-800 mb-1">Total Amount</p>
                <p className="text-2xl font-semibold text-blue-900">₹{order.total.toLocaleString()}</p>
              </div>
            </div>

            {/* Right Column - Customer Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4" /> Customer Information
              </h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Customer Name</p>
                  <p className="font-medium">{order.customerName}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Crown className="h-3 w-3 text-muted-foreground" />
                    <Badge 
                      variant="secondary"
                      className={`${getMembershipColor(membershipTierName)} text-xs`}
                    >
                      {membershipTierName}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          {order.products && order.products.length > 0 && (
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" /> Order Items
              </h3>
              <div className="space-y-2">
                {order.products.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.productName}</p>
                      <p className="text-xs text-muted-foreground">₹{product.price} × {product.quantity}</p>
                    </div>
                    <p className="font-medium text-sm">₹{(product.price * product.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>
                <span className="font-medium">{order.items}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge style={getStatusColor(order.status)} className="text-xs">
                  {order.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium capitalize">{order.payment || 'N/A'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-semibold">
                <span>Total</span>
                <span className="text-blue-600">₹{order.total.toLocaleString()}</span>
              </div>
            </div>
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