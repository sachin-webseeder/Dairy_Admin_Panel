// admin_11/src/pages/Customers.jsx
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
        {/* ... (Refresh/Export buttons) ... */}
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
          {/* ... (All filter UI remains the same) ... */}
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
                {/* ... (Table Header remains) ... */}
              </TableHeader>
              <TableBody>
                {(filteredCustomers || []).slice(0, parseInt(entriesPerPage)).map((customer) => {
                  const initials = customer.name.split(' ').map(n => n[0]).join('').substring(0, 2);
                  const getMembershipTier = () => {
                    if (customer.membership) return customer.membership;
                    if (customer.totalSpent > 10000) return 'Gold';
                    if (customer.totalSpent > 5000) return 'Silver';
                    return 'Bronze';
                  };
                  const membershipTier = getMembershipTier();
                  
                  return (
                    <TableRow key={customer.id} className="hover:bg-gray-50 transition-colors duration-200 text-xs">
                      {/* ... (All TableCells remain) ... */}
                      <TableCell>
                        <Switch 
                          checked={customer.status === 'active'}
                          onCheckedChange={() => handleToggleStatus(customer.id)} // ✨ WIRED
                          className="h-5 w-9 data-[state=checked]:bg-blue-500"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          {/* ... (Action buttons remain) ... */}
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
              {/* ... (Pagination buttons) ... */}
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