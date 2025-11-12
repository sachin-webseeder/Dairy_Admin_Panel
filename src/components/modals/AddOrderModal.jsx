import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { usePersistentCustomers, usePersistentProducts } from '../../lib/usePersistentData';
// We assume 'Order' and 'OrderProduct' types are no longer imported or needed for plain JS
// import { Order, OrderProduct } from '../../types'; 
import { Search, X, Plus, Minus } from 'lucide-react';
import { Card } from '../ui/card';

// interface AddOrderModalProps {
//  open: boolean;
//  onClose: () => void;
//  onAdd: (order: Order) => void;
// }

export function AddOrderModal({ open, onClose, onAdd }) { // Removed ': AddOrderModalProps'
  const [customers] = usePersistentCustomers();
  const [products] = usePersistentProducts();
  
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(''); // Removed <string>
  const [selectedCustomerMembership, setSelectedCustomerMembership] = useState('Bronze'); // Removed <string>
  const [productSearch, setProductSearch] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]); // Removed <OrderProduct[]>
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [orderStatus, setOrderStatus] = useState('pending');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [discount, setDiscount] = useState('0');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [packagingCharges, setPackagingCharges] = useState('0');
  const [insuranceCharges, setInsuranceCharges] = useState('0');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.includes(customerSearch)
  );

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) &&
    !selectedProducts.some(sp => sp.productId === p.id)
  );

  const handleAddProduct = (productId) => { // Removed ': string'
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProducts([...selectedProducts, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        price: product.price,
      }]);
      setProductSearch('');
    }
  };

  const handleUpdateQuantity = (productId, change) => { // Removed ': string' and ': number'
    setSelectedProducts(selectedProducts.map(p => {
      if (p.productId === productId) {
        const newQuantity = Math.max(1, p.quantity + change);
        return { ...p, quantity: newQuantity };
      }
      return p;
    }));
  };

  const handleRemoveProduct = (productId) => { // Removed ': string'
    setSelectedProducts(selectedProducts.filter(p => p.productId !== productId));
  };

  const calculateSubtotal = () => {
    return selectedProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = (subtotal * parseFloat(discount)) / 100;
    const packaging = parseFloat(packagingCharges) || 0;
    const insurance = parseFloat(insuranceCharges) || 0;
    return subtotal - discountAmount + packaging + insurance;
  };

  const handleCreateOrder = () => {
    if (!selectedCustomer) {
      alert('Please select a customer');
      return;
    }
    if (selectedProducts.length === 0) {
      alert('Please add at least one product');
      return;
    }

    const customer = customers.find(c => c.id === selectedCustomer);
    
    // Generate sequential order ID
    const generateOrderId = () => {
      // Get all existing orders from localStorage
      const existingOrders = JSON.parse(localStorage.getItem('dynasty_orders') || '[]');
      
      // Extract numeric parts from order IDs and find the maximum
      const maxOrderNum = existingOrders.reduce((max, order) => { // Removed ': number' and ': Order'
        const match = order.id.match(/ORD-(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          return num > max ? num : max;
        }
        return max;
      }, 1233); // Start from 1233 so next order is 1234
      
      return `ORD-${maxOrderNum + 1}`;
    };
    
    const newOrder = { // Removed ': Order'
      id: generateOrderId(),
      customerName: customer?.name || 'Unknown',
      items: selectedProducts.length,
      total: calculateTotal(),
      status: orderStatus, // Removed 'as 'pending' | 'completed' | 'cancelled''
      date: orderDate,
      payment: paymentStatus,
      products: selectedProducts,
      branch: customer?.branch,
    };

    onAdd(newOrder);
    handleClose();
  };

  const handleClose = () => {
    setCustomerSearch('');
    setSelectedCustomer('');
    setProductSearch('');
    setSelectedProducts([]);
    setShippingMethod('standard');
    setOrderStatus('pending');
    setPaymentStatus('pending');
    setDiscount('0');
    setDeliveryInstructions('');
    setPackagingCharges('0');
    setInsuranceCharges('0');
    setOrderDate(new Date().toISOString().split('T')[0]);
    setSelectedCustomerMembership('Bronze');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Order</DialogTitle>
          <DialogDescription className="sr-only">Create a new order for a customer</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer Details */}
          <div>
            <h3 className="font-medium mb-3">CUSTOMER DETAILS</h3>
            <div className="space-y-2">
              <Label className="text-xs">Search and select customer</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email or phone..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              {customerSearch && filteredCustomers.length > 0 && (
                <Card className="p-2 max-h-48 overflow-y-auto">
                  {filteredCustomers.map(customer => (
                    <div
                      key={customer.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer rounded text-xs"
                      onClick={() => {
                        setSelectedCustomer(customer.id);
                        setCustomerSearch(customer.name);
                        setSelectedCustomerMembership(customer.membership || 'Bronze');
                      }}
                    >
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-muted-foreground">{customer.email} • {customer.phone}</div>
                      <div className="text-muted-foreground mt-1">Membership: {customer.membership || 'Bronze'}</div>
                    </div>
                  ))}
                </Card>
              )}
            </div>
          </div>

          {/* Product Selection */}
          <div>
            <h3 className="font-medium mb-3">PRODUCT SELECTION</h3>
            <div className="space-y-2">
              <Label className="text-xs">Search Product</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Type to select products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              {productSearch && filteredProducts.length > 0 && (
                <Card className="p-2 max-h-48 overflow-y-auto">
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className="p-2 hover:bg-gray-100 cursor-pointer rounded text-xs flex justify-between items-center"
                      onClick={() => handleAddProduct(product.id)}
                    >
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-muted-foreground">₹{product.price} • Stock: {product.stock}</div>
                      </div>
                      <Plus className="h-4 w-4 text-blue-500" />
                    </div>
                  ))}
                </Card>
              )}
            </div>

            {/* Selected Products */}
            {selectedProducts.length > 0 && (
              <div className="mt-4 space-y-2">
                <Label className="text-xs">Selected Products</Label>
                {selectedProducts.map(product => (
                  <Card key={product.productId} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-xs">{product.productName}</div>
                        <div className="text-xs text-muted-foreground">₹{product.price} each</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(product.productId, -1)}
                            className="h-7 w-7 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-xs w-8 text-center">{product.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(product.productId, 1)}
                            className="h-7 w-7 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="w-20 text-right text-xs font-medium">
                          ₹{(product.price * product.quantity).toFixed(2)}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveProduct(product.productId)}
                          className="h-7 w-7 p-0 text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Shipping & Payment */}
          <div>
            <h3 className="font-medium mb-3">SHIPPING & PAYMENT</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Shipping Method</Label>
                <Select value={shippingMethod} onValueChange={setShippingMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="overnight">Overnight</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Membership Tier</Label>
                <Select 
                  value={selectedCustomerMembership} 
                  onValueChange={(value) => {
                    setSelectedCustomerMembership(value);
                  }}
                  disabled={!selectedCustomer}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gold">Gold</SelectItem>
                    <SelectItem value="Silver">Silver</SelectItem>
                    <SelectItem value="Bronze">Bronze</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Order Status</Label>
                <Select value={orderStatus} onValueChange={setOrderStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Payment</Label>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="wallet">Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Date</Label>
                <Input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Discount (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <Label className="text-xs">Delivery Instructions</Label>
                <Input
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder="Please leave delivery instructions here..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Packaging Charges (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  value={packagingCharges}
                  onChange={(e) => setPackagingCharges(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Insurance Charges (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  value={insuranceCharges}
                  onChange={(e) => setInsuranceCharges(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          {selectedProducts.length > 0 && (
            <Card className="p-4 bg-gray-50">
              <h3 className="font-medium mb-3 text-xs">Order Summary</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                {parseFloat(discount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%)</span>
                    <span>-₹{((calculateSubtotal() * parseFloat(discount)) / 100).toFixed(2)}</span>
                  </div>
                )}
                {parseFloat(packagingCharges) > 0 && (
                  <div className="flex justify-between">
                    <span>Packaging Charges</span>
                    <span>₹{parseFloat(packagingCharges).toFixed(2)}</span>
                  </div>
                )}
                {parseFloat(insuranceCharges) > 0 && (
                  <div className="flex justify-between">
                    <span>Insurance Charges</span>
                    <span>₹{parseFloat(insuranceCharges).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Total</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateOrder}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}