import { useState } from 'react';
import { 
  Search, Edit2, Trash2, Users, UserCheck, Repeat, TrendingUp, Phone, Calendar, Filter, ChevronDown, Eye, RefreshCw, Download,
  // ✅ Import Tier Icons
  Crown, Star, Percent, Diamond, Truck, Shield, Zap 
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useApiCustomers } from '../lib/hooks/useApiCustomers'; 
import { useDashboardStats } from '../lib/hooks/useDashboardStats'; 
import { EditCustomerModal } from '../components/modals/EditCustomerModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { CustomerDetailsModal } from '../components/modals/CustomerDetailsModal';
import { showSuccessToast } from '../lib/toast';
import { toast } from 'sonner'; 
import { useNavigate } from 'react-router-dom';

export function Customers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [membershipFilter, setMembershipFilter] = useState('all');
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  
  const [timeFilter, setTimeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const {
    customers: filteredCustomers = [],
    loading,
    error,
    total: totalCustomersApi = 0, 
    updateCustomer,
    deleteCustomer,
    toggleCustomerStatus, 
    refetch, 
  } = useApiCustomers({
    search: searchQuery,
    status: statusFilter,
    membership: membershipFilter,
    time: timeFilter,
    sortBy: sortBy,
    sortOrder: sortOrder,
    page: 1, 
    limit: parseInt(entriesPerPage)
  });

  // ✅ HELPER: Exact match to Membership Page visual logic
  const getTierElement = (tierName) => {
    const name = tierName?.toLowerCase() || '';
    const baseClass = "h-4 w-4 mr-2"; // Icon size

    let Icon = Truck;
    let colorClass = "text-blue-500"; 
    let fillClass = "";

    if (name.includes('platinum')) {
      Icon = Crown;
      colorClass = "text-slate-500";
      fillClass = "fill-slate-200";
    } else if (name.includes('gold')) {
      Icon = Crown;
      colorClass = "text-yellow-500";
      fillClass = "fill-yellow-100";
    } else if (name.includes('silver')) {
      Icon = Star;
      colorClass = "text-gray-400";
      fillClass = "fill-gray-100";
    } else if (name.includes('bronze')) {
      Icon = Percent;
      colorClass = "text-orange-700"; // ✅ Specified Color
      fillClass = "fill-orange-700/20"; // ✅ Specified Fill
    } else if (name.includes('diamond')) {
      Icon = Diamond;
      colorClass = "text-red-600";
      fillClass = "fill-red-100";
    }

    return (
      <div className="flex items-center">
        <Icon className={`${baseClass} ${colorClass} ${fillClass}`} />
        <span className={`font-semibold ${colorClass}`}>
          {tierName || 'Standard'}
        </span>
      </div>
    );
  };

  const handleEditCustomer = async (updatedData) => {
    try {
      await updateCustomer(updatedData.id, updatedData);
      showSuccessToast('Customer updated successfully!');
    } catch (err) {
      toast.error(err.message || "Failed to update customer");
    }
  };

  const handleDeleteCustomer = async () => {
    if (selectedCustomer) {
      try {
        await deleteCustomer(selectedCustomer.id);
        setSelectedCustomer(null);
        showSuccessToast('Customer deleted successfully!');
      } catch (err) {
        toast.error(err.message || "Failed to delete customer");
      }
    }
  };

  const handleToggleStatus = async (customerId) => {
    try {
      await toggleCustomerStatus(customerId);
      showSuccessToast('Customer status updated!');
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  const handleSelectCustomer = (customerId, checked) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, customerId]);
    } else {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId));
    }
  };

  const totalCustomersCount = filteredCustomers.length;
  const activeCustomersCount = filteredCustomers.filter(c => (c.status || '').toLowerCase() === 'active').length;
  const returningCustomersCount = filteredCustomers.filter(c => (c.customerType || '').toLowerCase() === 'returning').length;
  const highValueCustomersCount = filteredCustomers.filter(c => (c.customerType || '').toLowerCase() === 'high-value').length;

  const handleExport = () => {
      toast.info("Exporting customer data...");
  }

  const handleRefresh = () => {
    if (refetch) refetch();
    toast.success("Customer data refreshed");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage customer data and view their order history.</p>
        </div>
        
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div><p className="text-sm text-muted-foreground mb-1 font-bold">Total Customers</p><h3 className="text-lg">{loading ? '...' : totalCustomersCount}</h3></div>
            <div className="h-9 w-9 bg-blue-50 rounded-full flex items-center justify-center"><Users className="h-4 w-4 text-blue-500" /></div>
          </div>
        </Card>
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div><p className="text-sm text-muted-foreground mb-1 font-bold">Active Customers</p><h3 className="text-lg">{loading ? '...' : activeCustomersCount}</h3></div>
            <div className="h-9 w-9 bg-green-50 rounded-full flex items-center justify-center"><UserCheck className="h-4 w-4 text-green-500" /></div>
          </div>
        </Card>
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div><p className="text-sm text-muted-foreground mb-1 font-bold">Returning</p><h3 className="text-lg">{loading ? '...' : returningCustomersCount}</h3></div>
            <div className="h-9 w-9 bg-purple-50 rounded-full flex items-center justify-center"><Repeat className="h-4 w-4 text-purple-500" /></div>
          </div>
        </Card>
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div><p className="text-sm text-muted-foreground mb-1 font-bold">High-Value</p><h3 className="text-lg">{loading ? '...' : highValueCustomersCount}</h3></div>
            <div className="h-9 w-9 bg-orange-50 rounded-full flex items-center justify-center"><TrendingUp className="h-4 w-4 text-orange-500" /></div>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or phone..."
                className="pl-9 text-xs h-9 transition-all duration-200 border border-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Filters ... (Keep your existing filters here) */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs w-[140px] border border-gray-300"><SelectValue placeholder="All Status" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9 text-xs gap-1 border border-gray-300" onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}><Filter className="h-3 w-3" />More<ChevronDown className="h-3 w-3" /></Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Showing {filteredCustomers.length} of {totalCustomersApi} customers
          </div>
        </div>

        {loading && <div className="p-4 text-center">Loading customers...</div>}
        {error && <div className="p-4 text-center text-red-500">Error: {error}</div>}
        
        {!loading && !error && (
          <>
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="w-12"><Checkbox checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0} onCheckedChange={handleSelectAll}/></TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead><div className="flex items-center gap-1"><Phone className="h-3 w-3" /> Contact</div></TableHead>
                  <TableHead><div className="flex items-center gap-1"><Crown className="h-3 w-3" /> Membership</div></TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spend</TableHead>
                  <TableHead><div className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Last Order</div></TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead> 
                  <TableHead className="text-right">Manage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(filteredCustomers || []).slice(0, parseInt(entriesPerPage)).map((customer) => {
                  const customerName = customer.name || "Unknown";
                  const initials = customerName.split(' ').map(n => n[0]).join('').substring(0, 2);
                  const membershipTier = customer.membership || 'Bronze';
                  const isActive = (customer.status || '').toLowerCase() === 'active';

                  return (
                    <TableRow key={customer.id} className="hover:bg-gray-50 transition-colors duration-200 text-xs">
                      <TableCell><Checkbox checked={selectedCustomers.includes(customer.id)} onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked)}/></TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[10px] font-medium">{initials}</span>
                          </div>
                          <div>
                            <p className="font-medium">{customerName}</p>
                            {customer.customerType && <Badge variant="secondary" className="text-[10px] h-4 px-1">{customer.customerType}</Badge>}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div><p className="text-muted-foreground">{customer.phone}</p><p className="text-[10px] text-muted-foreground">{customer.email}</p></div>
                      </TableCell>

                      {/* ✅ UPDATED MEMBERSHIP COLUMN: Shows Icon + Colored Text */}
                      <TableCell>
                        {getTierElement(membershipTier)}
                      </TableCell>

                      <TableCell><span className="font-medium">{customer.totalOrders}</span></TableCell>
                      <TableCell><span className="font-medium text-green-600">₹{(customer.totalSpent || 0).toLocaleString()}</span></TableCell>
                      <TableCell><span className="text-muted-foreground">{customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-'}</span></TableCell>
                      
                      <TableCell>
                        <Badge variant={isActive ? 'default' : 'secondary'} className={`text-[10px] h-5 ${isActive ? 'bg-[#e8f5e9] text-[#2e7d32] border-[#2e7d32]/20' : 'bg-gray-100 text-gray-600 border-gray-300'}`}>
                          {isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <button onClick={(e) => { e.stopPropagation(); handleToggleStatus(customer.id); }} className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-semibold transition-colors ${isActive ? 'bg-white border-green-500 text-green-600' : 'bg-white border-red-500 text-red-600'}`}>
                          {isActive ? <><span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span> Enabled</> : <><span className="h-2 w-2 rounded-full bg-red-500"></span> Disabled</>}
                        </button>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => navigate(`/customers/${customer.id}`)}><Eye className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setSelectedCustomer(customer); setEditModalOpen(true); }}><Edit2 className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => { setSelectedCustomer(customer); setDeleteModalOpen(true); }}><Trash2 className="h-3 w-3 text-red-600" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {/* Pagination... */}
          </>
        )}
      </div>

      <EditCustomerModal open={editModalOpen} onOpenChange={setEditModalOpen} onSave={handleEditCustomer} customer={selectedCustomer} />
      <DeleteConfirmationModal open={deleteModalOpen} onOpenChange={setDeleteModalOpen} onConfirm={handleDeleteCustomer} title="Delete Customer" description="Are you sure?" />
      {selectedCustomer && <CustomerDetailsModal open={detailsModalOpen} onOpenChange={setDetailsModalOpen} customer={selectedCustomer} />}
    </div>
  );
}