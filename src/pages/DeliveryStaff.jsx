// admin_11/src/pages/DeliveryStaff.jsx
import { useState } from 'react';
import { Search, Plus, Filter, ChevronDown, X, User, UserCheck, Bike, UserX } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { AddDeliveryStaffModal } from '../components/modals/AddDeliveryStaffModal';
import { EditDeliveryStaffModal } from '../components/modals/EditDeliveryStaffModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { DeliveryStaffDetailsModal } from '../components/modals/DeliveryStaffDetailsModal';
import { showSuccessToast } from '../lib/toast';
import { toast } from 'sonner@2.0.3';
import { useApiDeliveryStaff } from '../lib/hooks/useApiDeliveryStaff'; // ✨ CHANGED
import { useDashboardStats } from '../lib/hooks/useDashboardStats'; // ✨ ADDED for stats
// import { usePersistentDeliveryStaff } from '../lib/usePersistentData'; // ✨ REMOVED

export function DeliveryStaff() {
  // const [staffList, setStaffList] = usePersistentDeliveryStaff(); // ✨ REMOVED

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState('10');

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  
  // ✨ --- API Hook for Staff List --- ✨
  const {
    staff: staffList,
    loading,
    error,
    total,
    createStaffMember,
    updateStaffMember,
    deleteStaffMember,
    toggleStaffMemberStatus,
  } = useApiDeliveryStaff({
    search: searchQuery,
    status: statusFilter,
    branch: branchFilter,
    page: 1,
    limit: parseInt(entriesPerPage),
  });

  // ✨ --- API Hook for Stat Cards --- ✨
  const { 
    stats, 
    loading: statsLoading 
  } = useDashboardStats();

  // const filteredStaff = staffList.filter(...) // ✨ REMOVED (API handles this)

  // ✨ REMOVED (using createStaffMember from hook)
  // const handleAddStaff = (newStaff) => { ... };

  // ✨ REMOVED (using updateStaffMember from hook)
  // const handleEditStaff = (updatedData) => { ... };

  // ✨ UPDATED to be async
  const handleDeleteStaff = async () => {
    if (selectedStaff) {
      try {
        await deleteStaffMember(selectedStaff.id);
        showSuccessToast('Staff member deleted successfully!');
      } catch (err) {
        toast.error(err.message || "Failed to delete staff member");
      }
      setSelectedStaff(null);
    }
  };
  
  // ✨ REMOVED (using toggleStaffMemberStatus from hook)
  // const handleToggleStatus = (staffId) => { ... };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setBranchFilter('all');
  };

  // Stat card values from API
  const totalStaff = statsLoading ? '...' : (stats?.totalDeliveryStaff ?? total ?? 0);
  const activeStaff = statsLoading ? '...' : (stats?.activeDeliveryStaff ?? 'N/A');
  const onDelivery = statsLoading ? '...' : (stats?.onDeliveryStaff ?? 'N/A');
  const offlineStaff = statsLoading ? '...' : (stats?.offlineDeliveryStaff ?? 'N/A');


  return (
    <div className="p-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Total Staff</p>
              <h3 className="text-lg">{totalStaff}</h3>
            </div>
            <div className="h-9 w-9 bg-blue-50 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-blue-500" />
            </div>
          </div>
        </Card>
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Active</p>
              <h3 className="text-lg">{activeStaff}</h3>
            </div>
            <div className="h-9 w-9 bg-green-50 rounded-full flex items-center justify-center">
              <UserCheck className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </Card>
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">On Delivery</p>
              <h3 className="text-lg">{onDelivery}</h3>
            </div>
            <div className="h-9 w-9 bg-yellow-50 rounded-full flex items-center justify-center">
              <Bike className="h-4 w-4 text-yellow-500" />
            </div>
          </div>
        </Card>
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Offline</p>
              <h3 className="text-lg">{offlineStaff}</h3>
            </div>
            <div className="h-9 w-9 bg-red-50 rounded-full flex items-center justify-center">
              <UserX className="h-4 w-4 text-red-500" />
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        {/* Search and Filters */}
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
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs w-[140px] border border-gray-300">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Status</SelectItem>
                <SelectItem value="Active" className="text-xs">Active</SelectItem>
                <SelectItem value="Inactive" className="text-xs">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={branchFilter} onValueChange={setBranchFilter}>
              <SelectTrigger className="h-9 text-xs w-[140px] border border-gray-300">
                <SelectValue placeholder="All Branches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All Branches</SelectItem>
                <SelectItem value="Branch A" className="text-xs">Branch A</SelectItem>
                <SelectItem value="Branch B" className="text-xs">Branch B</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 text-xs gap-1 border border-gray-300"
              onClick={handleClearFilters}
            >
              <X className="h-3 w-3" />
              Clear All
            </Button>
            
            <Button 
              size="sm"
              className="transition-all duration-200 h-9 text-xs bg-red-500 text-white hover:bg-red-600 border border-red-500"
              onClick={() => setAddModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Staff
            </Button>
          </div>
        </div>
        
        {/* ✨ --- LOADING & ERROR HANDLING for List --- ✨ */}
        {loading && <div className="p-4 text-center">Loading staff...</div>}
        {error && <div className="p-4 text-center text-red-500">Error: {error}</div>}
        {!loading && !error && (
          <>
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead className="w-12">
                    <input type="checkbox" className="rounded" />
                  </TableHead>
                  <TableHead>Staff Info</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Orders Delivered</TableHead>
                  <TableHead>Total Earned</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enable</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staffList.map((staff) => (
                  <TableRow key={staff.id} className="hover:bg-gray-50 transition-colors duration-200 text-xs">
                    <TableCell>
                      <input type="checkbox" className="rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{staff.name}</div>
                      <div className="text-[10px] text-muted-foreground">{staff.id}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-muted-foreground">{staff.phone}</p>
                        <p className="text-[10px] text-muted-foreground">{staff.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{staff.branch}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{staff.ordersDelivered}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-green-600">₹{staff.totalEarned.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={staff.status === 'Active' ? 'default' : 'secondary'}
                        className={`text-[10px] h-5 ${
                          staff.status === 'Active' 
                            ? 'bg-[#e8f5e9] text-[#2e7d32] border-[#2e7d32]/20 hover:bg-[#e8f5e9]' 
                            : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        {staff.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={staff.status === 'Active'}
                        onCheckedChange={() => toggleStaffMemberStatus(staff.id)} // ✨ WIRED
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
                            setSelectedStaff(staff);
                            setDetailsModalOpen(true);
                          }}
                        >
                          <User className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => {
                            setSelectedStaff(staff);
                            setEditModalOpen(true);
                          }}
                        >
                          <UserCheck className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-red-50 hover:text-red-600"
                          onClick={() => {
                            setSelectedStaff(staff);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <UserX className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            <div className="p-4 border-t flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Showing {staffList.length} of {total} entries
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="h-8 text-xs border border-gray-300" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs bg-red-500 text-white border border-red-500">
                  1
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs border border-gray-300">
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <AddDeliveryStaffModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSave={createStaffMember} // ✨ WIRED
      />

      {selectedStaff && (
        <>
          <EditDeliveryStaffModal
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            onSave={updateStaffMember} // ✨ WIRED
            staff={selectedStaff}
          />
          
          <DeleteConfirmationModal
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            onConfirm={handleDeleteStaff} // ✨ WIRED
            title="Delete Staff Member"
            description={`Are you sure you want to delete ${selectedStaff.name}? This action cannot be undone.`}
          />

          <DeliveryStaffDetailsModal
            open={detailsModalOpen}
            onOpenChange={setDetailsModalOpen}
            staff={selectedStaff}
          />
        </>
      )}
    </div>
  );
}