import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator'; 
import { MapPin, Phone, User, CreditCard, Package } from 'lucide-react'; // Removed X import

export function OrderDetailsModal({ open, onOpenChange, order }) {
  if (!order) return null;

  const customerName = order.customer?.firstName || order.customerName || 'Unknown Customer';
  const customerPhone = order.customer?.phone || 'N/A';
  
  const initials = customerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const address = order.address 
    ? `${order.address.flat || ''}, ${order.address.area || ''}, ${order.address.city || ''} - ${order.address.pincode || ''}`
    : 'No address provided';

  const orderDate = order.createdAt 
    ? new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
    : 'N/A';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0 gap-0 bg-white rounded-lg shadow-xl">
        
        {/* Header */}
        <div className="px-6 py-4 border-b sticky top-0 bg-white z-10">
          <div>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              Order #{order.orderNumber || order._id?.slice(-6)}
              <Badge variant="outline" className={`ml-2 capitalize ${
                order.orderStatus === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                order.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                {order.orderStatus || 'Pending'}
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Placed on {orderDate}
            </DialogDescription>
          </div>
          {/* ❌ Removed the manual Close Button here because DialogContent adds one automatically */}
        </div>

        <div className="p-6 space-y-6">
          
          {/* 1. Customer & Address Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" /> Customer Details
              </h4>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{customerName}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <Phone className="h-3 w-3" /> {customerPhone}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" /> Delivery Address
              </h4>
              <div className="bg-gray-50 p-3 rounded-lg border h-full">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {address}
                </p>
                {order.address?.type && (
                  <Badge variant="secondary" className="mt-2 text-[10px] h-5 bg-white border">
                    {order.address.type}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator className="bg-gray-100" />

          {/* 2. Order Items */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-500" /> Order Items
            </h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 border-b">
                  <tr>
                    <th className="px-4 py-2 font-medium">Item</th>
                    <th className="px-4 py-2 font-medium text-right">Price</th>
                    <th className="px-4 py-2 font-medium text-right">Qty</th>
                    <th className="px-4 py-2 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items?.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{item.name || item.product?.dishName || 'Unknown Item'}</p>
                        {item.variant && <p className="text-xs text-gray-500">{item.variant}</p>}
                      </td>
                      <td className="px-4 py-3 text-right">₹{item.price}</td>
                      <td className="px-4 py-3 text-right">x{item.quantity}</td>
                      <td className="px-4 py-3 text-right font-medium">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Payment Summary */}
          <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{order.totalAmount || order.finalAmount}</span>
            </div>
            {order.discountApplied > 0 && (
              <div className="flex justify-between items-center text-sm text-green-600">
                <span>Discount</span>
                <span>- ₹{order.discountApplied}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium">Free</span>
            </div>
            <Separator className="bg-blue-200 my-2" />
            <div className="flex justify-between items-center text-base font-bold text-gray-900">
              <span>Grand Total</span>
              <span>₹{order.finalAmount}</span>
            </div>
            
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-blue-100 text-xs text-gray-500">
              <CreditCard className="h-3 w-3" />
              <span>Payment via <span className="font-semibold text-gray-700">{order.paymentMethod}</span></span>
              <Badge className={order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700 ml-auto' : 'bg-yellow-100 text-yellow-700 ml-auto'}>
                {order.paymentStatus}
              </Badge>
            </div>
          </div>

          {/* Notes if available */}
          {order.notes && (
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border border-dashed">
              <span className="font-semibold">Note:</span> {order.notes}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Download Invoice</Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}