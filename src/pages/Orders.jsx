import { useState } from 'react';
import { Search, Edit2, Trash2, Filter, ChevronDown, X, Eye, Package, CheckCircle, Clock, XCircle, RefreshCw, Download } from 'lucide-react';
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
import { useDashboardStats } from '../lib/hooks/useDashboardStats';
import { EditOrderModal } from '../components/modals/EditOrderModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { OrderDetailsModal } from '../components/modals/OrderDetailsModal';
import { showSuccessToast } from '../lib/toast';
import { toast } from 'sonner';

export function Orders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [membershipFilter, setMembershipFilter] = useState('all');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [membershipDropdownOpen, setMembershipDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const {
    orders: filteredOrders,
    loading: ordersLoading,
    error: ordersError,
    total: totalOrdersApi,
    updateOrder,
    deleteOrder,
  } = useApiOrders({
    search: searchQuery,
    status: statusFilter,
    membership: membershipFilter,
    payment: paymentFilter,
    time: timeFilter,
    sortBy: sortBy,
    sortOrder: sortOrder,
    page: 1,
    limit: entriesPerPage
  });

  const { stats, loading: statsLoading } = useDashboardStats();

  const handleDeleteOrder = async () => {
    if (selectedOrder) {
      try {
        await deleteOrder(selectedOrder.id);
        showSuccessToast('Order deleted successfully!');
      } catch (err) {
        toast.error(err.message || "Failed to delete order");
      }
      setSelectedOrder(null);
    }
  };

  const handleExport = () => {
    console.log('Exporting orders data...');
    toast.info("Exporting orders...");
  };

  const handleRefresh = () => {
      console.log("Refreshing orders...");
      toast.success("Orders refreshed");
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setMembershipFilter('all');
    setSearchQuery('');
    setPaymentFilter('all');
    setTimeFilter('all');
    setSortBy('date');
    setSortOrder('desc');
  };

  const totalOrders = statsLoading ? '...' : (stats?.totalOrders ?? totalOrdersApi ?? 0);
  const completedOrders = statsLoading ? '...' : (stats?.deliveredOrders ?? 'N/A');
  const pendingOrders = statsLoading ? '...' : (stats?.pendingOrders ?? 'N/A');
  const cancelledOrders = statsLoading ? '...' : (stats?.cancelledOrders ?? 'N/A');

  return (
    <div className="p-4 space-y-4">
      {/* Header with Actions - ALIGNED TO RIGHT */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-primary text-red-500">Orders</span>
          <span>/</span>
          <span>Management</span>
        </div>
        
        {/* Buttons Aligned Right & Compact */}
        <div className="flex items-center gap-2">
           <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="h-9 text-xs border border-gray-300"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
          <Button 
            size="sm" 
            onClick={handleExport}
            className="h-9 text-xs bg-red-500 hover:bg-red-600 text-white border border-red-500"
          >
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div><p className="text-sm text-muted-foreground mb-1 font-bold">Total Orders</p><h3 className="text-lg">{totalOrders}</h3></div>
            <div className="h-9 w-9 bg-blue-50 rounded-full flex items-center justify-center"><Package className="h-4 w-4 text-blue-500" /></div>
          </div>
        </Card>
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div><p className="text-sm text-muted-foreground mb-1 font-bold">Completed</p><h3 className="text-lg">{completedOrders}</h3></div>
            <div className="h-9 w-9 bg-green-50 rounded-full flex items-center justify-center"><CheckCircle className="h-4 w-4 text-green-500" /></div>
          </div>
        </Card>
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div><p className="text-sm text-muted-foreground mb-1 font-bold">Pending</p><h3 className="text-lg">{pendingOrders}</h3></div>
            <div className="h-9 w-9 bg-yellow-50 rounded-full flex items-center justify-center"><Clock className="h-4 w-4 text-yellow-500" /></div>
          </div>
        </Card>
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div><p className="text-sm text-muted-foreground mb-1 font-bold">Cancelled</p><h3 className="text-lg">{cancelledOrders}</h3></div>
            <div className="h-9 w-9 bg-red-50 rounded-full flex items-center justify-center"><XCircle className="h-4 w-4 text-red-500" /></div>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input placeholder="Search orders, customers..." className="pl-9 text-xs h-9 transition-all duration-200 border border-gray-300" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            
            {/* All Status Dropdown */}
            <div className="relative">
              <Button variant="outline" size="sm" onClick={() => setStatusDropdownOpen(!statusDropdownOpen)} className="transition-all duration-200 text-xs h-9 border border-gray-300">
                All Status <ChevronDown className="h-3 w-3 ml-2" />
              </Button>
              {statusDropdownOpen && (<><div className="fixed inset-0 z-40" onClick={() => setStatusDropdownOpen(false)} /><div className="absolute top-full mt-2 left-0 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2">{['all', 'pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'].map((status) => (<button key={status} onClick={() => { setStatusFilter(status); setStatusDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors duration-200 text-xs capitalize">{status === 'all' ? 'All Status' : status}</button>))}</div></>)}
            </div>

            {/* Membership Dropdown */}
            <div className="relative">
              <Button variant="outline" size="sm" onClick={() => setMembershipDropdownOpen(!membershipDropdownOpen)} className="transition-all duration-200 text-xs h-9 border border-gray-300">
                {membershipFilter === 'all' ? 'All Membership' : membershipFilter} <ChevronDown className="h-3 w-3 ml-2" />
              </Button>
              {membershipDropdownOpen && (<><div className="fixed inset-0 z-40" onClick={() => setMembershipDropdownOpen(false)} /><div className="absolute top-full mt-2 left-0 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-2">{['all', 'Gold', 'Silver', 'Bronze'].map((tier) => (<button key={tier} onClick={() => { setMembershipFilter(tier); setMembershipDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors duration-200 text-xs">{tier === 'all' ? 'All Membership' : tier}</button>))}</div></>)}
            </div>

            <div className="relative">
              <Button variant="outline" size="sm" onClick={() => setMoreDropdownOpen(!moreDropdownOpen)} className="transition-all duration-200 text-xs h-9 border border-gray-300">
                <Filter className="h-3 w-3 mr-2" /> More <ChevronDown className="h-3 w-3 ml-2" />
              </Button>
            </div>
          </div>
          
          {moreDropdownOpen && (
            <div className="flex items-center gap-2 flex-wrap p-3 bg-gray-50">
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-48 h-9 text-xs border border-gray-300"><SelectValue placeholder="All Payment Methods" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Payment Methods</SelectItem><SelectItem value="cash">Cash</SelectItem><SelectItem value="card">Card</SelectItem><SelectItem value="upi">UPI</SelectItem><SelectItem value="wallet">Wallet</SelectItem></SelectContent>
              </Select>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-32 h-9 text-xs border border-gray-300"><SelectValue placeholder="All Time" /></SelectTrigger>
                <SelectContent><SelectItem value="all">All Time</SelectItem><SelectItem value="today">Today</SelectItem><SelectItem value="yesterday">Yesterday</SelectItem><SelectItem value="week">This Week</SelectItem><SelectItem value="month">This Month</SelectItem></SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36 h-9 text-xs border border-gray-300"><SelectValue placeholder="Sort by Date" /></SelectTrigger>
                <SelectContent><SelectItem value="date">Sort by Date</SelectItem><SelectItem value="amount">Sort by Amount</SelectItem><SelectItem value="customer">Sort by Customer</SelectItem></SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="h-9 text-xs border border-gray-300">{sortOrder === 'asc' ? '↑ ASC' : '↓ DESC'}</Button>
              <Button variant="outline" size="sm" onClick={handleClearFilters} className="gap-1 h-9 text-xs border border-gray-300"><X className="h-3 w-3" /> Clear All</Button>
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-b flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Show:</span>
            <select value={entriesPerPage} onChange={(e) => setEntriesPerPage(Number(e.target.value))} className="border rounded px-2 py-1 text-xs">
              <option value={10}>10</option><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>
          <p className="text-xs text-muted-foreground">Showing {filteredOrders.length} of {totalOrders} orders</p>
        </div>

        {ordersLoading && <div className="p-4 text-center">Loading orders...</div>}
        {ordersError && <div className="p-4 text-center text-red-500">Error: {ordersError}</div>}
        {!ordersLoading && !ordersError && (
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="w-12"><input type="checkbox" className="rounded" /></TableHead>
                <TableHead>Order ID</TableHead><TableHead>Customer</TableHead><TableHead>Membership</TableHead><TableHead>Items</TableHead><TableHead>Total</TableHead><TableHead>Payment</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.slice(0, entriesPerPage).map((order) => {
                const initials = order.customerName.split(' ').map(n => n[0]).join('');
                return (
                  <TableRow key={order.id} className="hover:bg-gray-50 transition-colors duration-200 text-xs">
                    <TableCell><input type="checkbox" className="rounded" /></TableCell>
                    <TableCell><span className="text-blue-600 font-medium">#{order.id}</span></TableCell>
                    <TableCell><div className="flex items-center gap-2"><Avatar className="h-7 w-7"><AvatarFallback className="bg-gray-900 text-white text-xs">{initials}</AvatarFallback></Avatar><span className="font-medium">{order.customerName}</span></div></TableCell>
                    <TableCell><Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50 text-[10px] h-5">{order.membership || 'Bronze'}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{order.items?.length || 0}</TableCell>
                    <TableCell className="font-medium">₹{order.total}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{order.paymentMethod || 'N/A'}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{new Date(order.deliveryDate || order.createdAt).toLocaleDateString('en-IN')}</TableCell>
                    <TableCell><Badge variant="secondary" className={order.status === 'delivered' ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-gray-100 text-gray-600'}>{order.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-blue-50 text-blue-600" onClick={() => { setSelectedOrder(order); setDetailsModalOpen(true); }}><Eye className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-blue-50 text-blue-600" onClick={() => { setSelectedOrder(order); setEditModalOpen(true); }}><Edit2 className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-red-50 text-red-600" onClick={() => { setSelectedOrder(order); setDeleteModalOpen(true); }}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {selectedOrder && (
        <>
          <EditOrderModal open={editModalOpen} onClose={() => setEditModalOpen(false)} onSave={updateOrder} order={selectedOrder} />
          <DeleteConfirmationModal open={deleteModalOpen} onOpenChange={setDeleteModalOpen} onConfirm={handleDeleteOrder} title="Are you sure you want to delete?" description="This order will be permanently removed." />
          <OrderDetailsModal open={detailsModalOpen} onOpenChange={setDetailsModalOpen} order={selectedOrder} />
        </>
      )}
    </div>
  );
}