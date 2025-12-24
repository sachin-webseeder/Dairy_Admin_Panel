import { useState } from 'react';
import { Search, Trash2, Filter, ChevronDown, Eye, Package, CheckCircle, Clock, XCircle, RefreshCw, Download, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { useApiOrders } from '../lib/hooks/useApiOrders';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { OrderDetailsModal } from '../components/modals/OrderDetailsModal';
// import { EditOrderModal } from '../components/modals/EditOrderModal'; // Commented out
import { showSuccessToast } from '../lib/toast';
import { toast } from 'sonner';

export function Orders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  // const [editModalOpen, setEditModalOpen] = useState(false); // Commented out

  // ✅ Integrate API Hook
  const {
    orders,
    stats,
    loading,
    error,
    refetch,
    deleteOrder,
  } = useApiOrders({
    status: statusFilter,
  });

  // --- Filtering Logic (Client Side for Search) ---
  const filteredOrders = orders.filter(order => {
    const query = searchQuery.toLowerCase();
    const customerName = order.customer?.firstName?.toLowerCase() || '';
    const orderNum = order.orderNumber?.toLowerCase() || '';
    const matchesSearch = customerName.includes(query) || orderNum.includes(query);
    const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteOrder = async () => {
    if (selectedOrder) {
      try {
        await deleteOrder(selectedOrder._id);
        showSuccessToast('Order deleted successfully!');
      } catch (err) {
        toast.error(err.message || "Failed to delete order");
      }
      setSelectedOrder(null);
      setDeleteModalOpen(false);
    }
  };

  const handleRefresh = () => {
      refetch();
      toast.success("Orders refreshed");
  };

  const handleExport = () => {
    toast.info("Exporting orders data...");
  };

  // Helper for Status Colors
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
        case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
        case 'placed': return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Helper for Payment Status Colors
  const getPaymentStatusColor = (status) => {
      return status?.toLowerCase() === 'paid' 
        ? 'text-green-600 bg-green-50 border-green-200' 
        : 'text-orange-600 bg-orange-50 border-orange-200';
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-primary text-red-500">Orders</span>
          <span>/</span>
          <span>Management</span>
        </div>
        
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" onClick={handleRefresh} className="h-9 text-xs border border-gray-300">
            <RefreshCw className="h-3 w-3 mr-1" /> Refresh
          </Button>
          <Button size="sm" onClick={handleExport} className="h-9 text-xs bg-red-500 hover:bg-red-600 text-white border border-red-500">
            <Download className="h-3 w-3 mr-1" /> Export
          </Button>
        </div>
      </div>

      {/* ✅ Updated Statistics Cards from API Response */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card className="p-4 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div><p className="text-sm text-gray-500 font-bold">Total Orders</p><h3 className="text-xl font-bold mt-1">{stats?.total || 0}</h3></div>
            <div className="h-8 w-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"><Package className="h-4 w-4"/></div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div><p className="text-sm text-gray-500 font-bold">Today's Orders</p><h3 className="text-xl font-bold mt-1">{stats?.today || 0}</h3></div>
            <div className="h-8 w-8 bg-purple-50 rounded-full flex items-center justify-center text-purple-600"><Clock className="h-4 w-4"/></div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div><p className="text-sm text-gray-500 font-bold">Pending</p><h3 className="text-xl font-bold mt-1">{stats?.pending || 0}</h3></div>
            <div className="h-8 w-8 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-600"><Clock className="h-4 w-4"/></div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-md transition-all">
          <div className="flex justify-between items-start">
            <div><p className="text-sm text-gray-500 font-bold">Delivered</p><h3 className="text-xl font-bold mt-1">{stats?.delivered || 0}</h3></div>
            <div className="h-8 w-8 bg-green-50 rounded-full flex items-center justify-center text-green-600"><CheckCircle className="h-4 w-4"/></div>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Filters */}
        <div className="p-4 border-b space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input placeholder="Search Order ID, Customer..." className="pl-9 text-xs h-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 h-9 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Placed">Placed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>

        <div className="px-4 py-2 border-b bg-gray-50/50 flex justify-between items-center text-xs text-muted-foreground">
            <span>Showing {Math.min(filteredOrders.length, entriesPerPage)} of {filteredOrders.length} results</span>
            <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))} className="border rounded px-2 py-1">
              <option value={10}>10</option><option value={20}>20</option><option value={50}>50</option>
            </select>
        </div>

        {loading && <div className="p-8 text-center text-sm text-gray-500">Loading orders...</div>}
        {error && <div className="p-8 text-center text-sm text-red-500">Error: {error}</div>}

        {!loading && !error && (
          <Table>
            <TableHeader>
              <TableRow className="text-xs hover:bg-gray-50">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.slice(0, entriesPerPage).map((order) => {
                const initials = order.customer?.firstName ? order.customer.firstName.charAt(0) : 'U';
                const addressStr = order.address ? `${order.address.area}, ${order.address.city}` : 'N/A';

                return (
                  <TableRow key={order._id} className="text-xs hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium text-blue-600">{order.orderNumber || order._id.slice(-6)}</TableCell>
                    
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px] bg-gray-900 text-white">{initials}</AvatarFallback></Avatar>
                            <span className="font-medium">{order.customer?.firstName || "Unknown"}</span>
                        </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground max-w-[150px] truncate" title={addressStr}>
                        <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {addressStr}
                        </div>
                    </TableCell>

                    <TableCell>{order.items?.length || 0} Items</TableCell>
                    
                    <TableCell className="font-semibold">₹{order.finalAmount}</TableCell>
                    
                    <TableCell>
                        <div className="flex flex-col gap-1">
                            <span className="font-medium text-[10px]">{order.paymentMethod}</span>
                            <Badge variant="outline" className={`text-[9px] w-fit px-1 py-0 ${getPaymentStatusColor(order.paymentStatus)}`}>
                                {order.paymentStatus}
                            </Badge>
                        </div>
                    </TableCell>

                    <TableCell className="text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('en-IN')}</TableCell>
                    
                    <TableCell>
                        <Badge variant="secondary" className={`text-[10px] px-2 py-0.5 border ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                        </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-blue-50 text-blue-600" onClick={() => { setSelectedOrder(order); setDetailsModalOpen(true); }}>
                            <Eye className="h-3 w-3" />
                        </Button>
                        
                        {/* // COMMENTED OUT AS REQUESTED
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-blue-50 text-blue-600" onClick={() => { setSelectedOrder(order); setEditModalOpen(true); }}>
                            <Edit2 className="h-3 w-3" />
                        </Button> 
                        */}

                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-50 text-red-600" onClick={() => { setSelectedOrder(order); setDeleteModalOpen(true); }}>
                            <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredOrders.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No orders found.</TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Modals */}
      {selectedOrder && (
        <>
          {/* <EditOrderModal ... /> Commented Out */}
          <DeleteConfirmationModal 
            open={deleteModalOpen} 
            onOpenChange={setDeleteModalOpen} 
            onConfirm={handleDeleteOrder} 
            title="Delete Order" 
            description={`Are you sure you want to delete order ${selectedOrder.orderNumber}?`} 
          />
          <OrderDetailsModal 
            open={detailsModalOpen} 
            onOpenChange={setDetailsModalOpen} 
            order={selectedOrder} 
          />
        </>
      )}
    </div>
  );
}