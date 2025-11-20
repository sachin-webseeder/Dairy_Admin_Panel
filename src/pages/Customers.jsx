import { useState } from 'react';
import { Search, Edit2, Trash2, MoreVertical, Users, UserCheck, Repeat, TrendingUp, Mail, Phone, MapPin, Calendar, Filter, ChevronDown, X, Eye, Crown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Checkbox } from '../components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { useApiCustomers } from '../lib/hooks/useApiCustomers'; // API hook for list
import { useDashboardStats } from '../lib/hooks/useDashboardStats'; // ✨ ADDED for stats
import { EditCustomerModal } from '../components/modals/EditCustomerModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { CustomerDetailsModal } from '../components/modals/CustomerDetailsModal';
import { showSuccessToast } from '../lib/toast';
import { toast } from 'sonner@2.0.3'; // ✨ ADDED for errors

export function Customers() {
  // ✨ --- ALL useState hooks MUST be declared before any other hooks --- ✨
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('all'); // Not used by hook yet
  const [statusFilter, setStatusFilter] = useState('all');
  const [membershipFilter, setMembershipFilter] = useState('all');
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  
  // More filter states
  const [timeFilter, setTimeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // ✨ --- API Hook for List (called AFTER state declarations) --- ✨
  const {
    customers: filteredCustomers = [],
    loading,
    error,
    total: totalCustomersApi = 0, // Total from API
    updateCustomer,
    deleteCustomer,
    toggleCustomerStatus,
  } = useApiCustomers({
    search: searchQuery,
    status: statusFilter,
    membership: membershipFilter,
    time: timeFilter,
    sortBy: sortBy,
    sortOrder: sortOrder,
    page: 1, // You'll need to add pagination state here later
    limit: parseInt(entriesPerPage)
  });

  // ✨ --- API Hook for Stat Cards --- ✨
  const { 
    stats, 
    loading: statsLoading 
  } = useDashboardStats();

  // ✨ REMOVED all local filtering logic

  // ✨ NEW CRUD functions
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

  // ✨ --- Stat card values now from API hooks --- ✨
  const totalCustomers = statsLoading ? '...' : (stats?.totalCustomers ?? totalCustomersApi ?? 0);
  const activeCustomers = statsLoading ? '...' : (stats?.activeCustomers ?? 'N/A');
  const returningCustomers = statsLoading ? '...' : (stats?.returningCustomers ?? 'N/A'); // Assuming stats hook provides this
  const highValueCustomers = statsLoading ? '...' : (stats?.highValueCustomers ?? 'N/A'); // Assuming stats hook provides this


  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-end">
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            className="transition-all duration-200 h-9 text-xs border border-gray-300"
          >
            🔄 Refresh
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className="transition-all duration-200 h-9 text-xs bg-red-500 text-white hover:bg-red-600 border border-red-500"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Total Customers</p>
              <h3 className="text-lg">{totalCustomers}</h3>
            </div>
            <div className="h-9 w-9 bg-blue-50 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </div>
        </Card>
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Active Customers</p>
              {/* ✨ FIXED: Uses 'activeCustomers' variable */}
              <h3 className="text-lg">{activeCustomers}</h3>
            </div>
            <div className="h-9 w-9 bg-green-50 rounded-full flex items-center justify-center">
              <UserCheck className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </Card>
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Returning</p>
              {/* ✨ FIXED: Uses 'returningCustomers' variable */}
              <h3 className="text-lg">{returningCustomers}</h3>
            </div>
            <div className="h-9 w-9 bg-purple-50 rounded-full flex items-center justify-center">
              <Repeat className="h-4 w-4 text-purple-500" />
            </div>
          </div>
        </Card>
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">High-Value</p>
              {/* ✨ FIXED: Uses 'highValueCustomers' variable */}
              <h3 className="text-lg">{highValueCustomers}</h3>
            </div>
            <div className="h-9 w-9 bg-orange-50 rounded-full flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b space-y-3">
          {/* Single Row with Search and Filters */}
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

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs w-[140px] border border-gray-300">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Status</SelectItem>
                <SelectItem value="active" className="text-xs">Active</SelectItem>
                <SelectItem value="inactive" className="text-xs">Inactive</SelectItem>
                <SelectItem value="frequent" className="text-xs">Frequent (20+ orders)</SelectItem>
                <SelectItem value="occasional" className="text-xs">Occasional (&lt;10 orders)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={membershipFilter} onValueChange={setMembershipFilter}>
              <SelectTrigger className="h-9 text-xs w-[140px] border border-gray-300">
                <SelectValue placeholder="All Memberships" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Memberships</SelectItem>
                <SelectItem value="Gold" className="text-xs">Gold</SelectItem>
                <SelectItem value="Silver" className="text-xs">Silver</SelectItem>
                <SelectItem value="Bronze" className="text-xs">Bronze</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 text-xs gap-1 border border-gray-300"
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
            >
              <Filter className="h-3 w-3" />
              More
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
          
          {/* More Filters Row (shown when More is clicked) */}
          {moreDropdownOpen && (
            <div className="flex items-center gap-2 flex-wrap p-3 bg-gray-50 rounded-lg">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-32 h-9 text-xs border border-gray-300">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Active Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36 h-9 text-xs border border-gray-300">
                  <SelectValue placeholder="Sort by Name" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="spend">Sort by Spend</SelectItem>
                  <SelectItem value="orders">Sort by Orders</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="h-9 text-xs border border-gray-300"
              >
                {sortOrder === 'asc' ? '↑ ASC' : '↓ DESC'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTimeFilter('all');
                  setSortBy('name');
                  setSortOrder('asc');
                }}
                className="gap-1 h-9 text-xs border border-gray-300"
              >
                <X className="h-3 w-3" />
                Clear All
              </Button>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Showing {filteredCustomers.length} of {totalCustomersApi} customers
          </div>
        </div>

        {/* ✨ --- LOADING & ERROR HANDLING --- ✨ */}
        {loading && <div className="p-4 text-center">Loading customers...</div>}
        {error && <div className="p-4 text-center text-red-500">Error: {error}</div>}
        {!loading && !error && (
          <>
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      Contact
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Crown className="h-3 w-3" />
                      Membership
                    </div>
                  </TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spend</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Last Order
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enable</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(filteredCustomers || []).slice(0, parseInt(entriesPerPage)).map((customer) => {
                  // ✨ FIX: Safely handle missing name to prevent .split() crash
                  const customerName = customer.name || "Unknown Customer";
                  const initials = customerName.split(' ').map(n => n[0]).join('').substring(0, 2);

                  // Get membership tier
                  const getMembershipTier = () => {
                    if (customer.membership) return customer.membership;
                    if (customer.totalSpent > 10000) return 'Gold';
                    if (customer.totalSpent > 5000) return 'Silver';
                    return 'Bronze';
                  };
                  const membershipTier = getMembershipTier();
                  
                  return (
                    <TableRow key={customer.id} className="hover:bg-gray-50 transition-colors duration-200 text-xs">
                      <TableCell>
                        <Checkbox 
                          checked={selectedCustomers.includes(customer.id)}
                          onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[10px] font-medium">{initials}</span>
                          </div>
                          <div>
                            {/* ✨ FIX: Display safe name */}
                            <p className="font-medium">{customerName}</p>
                            {customer.customerType && (
                              <Badge 
                                variant="secondary" 
                                className={`text-[10px] h-4 px-1 ${
                                  customer.customerType === 'high-value' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                  customer.customerType === 'returning' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  'bg-green-50 text-green-700 border-green-200'
                                }`}
                              >
                                {customer.customerType}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-muted-foreground">{customer.phone}</p>
                          <p className="text-[10px] text-muted-foreground">{customer.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            membershipTier === 'Gold'
                              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                              : membershipTier === 'Silver'
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                              : 'bg-orange-100 text-orange-700 hover:bg-orange-100'
                          }
                        >
                          {membershipTier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{customer.totalOrders}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600">₹{(customer.totalSpent || 0).toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">
                          {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={customer.status === 'active' ? 'default' : 'secondary'}
                          className={`text-[10px] h-5 ${
                            customer.status === 'active' 
                              ? 'bg-[#e8f5e9] text-[#2e7d32] border-[#2e7d32]/20 hover:bg-[#e8f5e9]' 
                              : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={customer.status === 'active'}
                          onCheckedChange={() => handleToggleStatus(customer.id)} // ✨ WIRED
                          className="h-5 w-9 data-[state=checked]:bg-blue-500"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-green-50 hover:text-green-600"
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setDetailsModalOpen(true);
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600"
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setEditModalOpen(true);
                            }}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                            onClick={() => {
                              setSelectedCustomer(customer);
                              setDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="p-4 border-t flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Showing {Math.min(filteredCustomers.length, parseInt(entriesPerPage))} of {totalCustomersApi} entries
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="h-8 text-xs border border-gray-300" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs bg-red-500 text-white border border-red-500">
                  1
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs border border-gray-300">
                  2
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs border border-gray-300">
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit Customer Modal */}
      <EditCustomerModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSave={handleEditCustomer} // ✨ WIRED
        customer={selectedCustomer}
      />

      {/* Delete Modal */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteCustomer} // ✨ WIRED
        title="Delete Customer"
        description={`Are you sure you want to delete ${selectedCustomer?.name}? This action cannot be undone.`}
      />

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <CustomerDetailsModal
          open={detailsModalOpen}
          onOpenChange={setDetailsModalOpen}
          customer={selectedCustomer}
        />
      )}
    </div>
  );
}