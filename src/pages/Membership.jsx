// admin_11/src/pages/Membership.jsx
import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
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
import { Search, Edit2, Trash2, Crown, Percent, Truck, Star } from 'lucide-react';
import { AddMembershipModal } from '../components/modals/AddMembershipModal';
import { EditMembershipModal } from '../components/modals/EditMembershipModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { showSuccessToast } from '../lib/toast';
import { toast } from 'sonner@2.0.3';
import { useApiMemberships } from '../lib/hooks/useApiMemberships'; // ✨ CHANGED
// import { usePersistentMembership } from '../lib/usePersistentData'; // ✨ REMOVED

export function Membership() {
  // const [membershipPlans, setMembershipPlans] = usePersistentMembership(); // ✨ REMOVED
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('price-asc');
  
  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // ✨ --- API Hook Integration --- ✨
  const {
    memberships,
    loading,
    error,
    total,
    createMembership,
    updateMembership,
    deleteMembership,
  } = useApiMemberships({
    search: searchQuery,
    sort: sortOrder,
  });

  // const filteredPlans = membershipPlans.filter(...) // ✨ REMOVED

  const handleAddPlan = async (data) => {
    try {
      await createMembership(data);
      showSuccessToast('Membership tier added successfully!');
      setAddModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to add tier');
    }
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedData) => {
    if (selectedPlan) {
      try {
        await updateMembership(selectedPlan.id, updatedData);
        showSuccessToast('Membership tier updated successfully!');
        setEditModalOpen(false);
        setSelectedPlan(null);
      } catch (err) {
        toast.error(err.message || 'Failed to update tier');
      }
    }
  };

  const handleDelete = (plan) => {
    setSelectedPlan(plan);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedPlan) {
      try {
        await deleteMembership(selectedPlan.id);
        showSuccessToast('Membership tier deleted successfully!');
        setDeleteModalOpen(false);
        setSelectedPlan(null);
      } catch (err) {
        toast.error(err.message || 'Failed to delete tier');
      }
    }
  };

  const getTierIcon = (name) => {
    if (name.toLowerCase().includes('gold')) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (name.toLowerCase().includes('silver')) return <Star className="h-4 w-4 text-gray-400" />;
    if (name.toLowerCase().includes('bronze')) return <Percent className="h-4 w-4 text-orange-400" />;
    return <Truck className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Membership Tiers</h3>
            <Button
              size="sm"
              className="h-9 text-xs bg-red-500 hover:bg-red-600"
              onClick={() => setAddModalOpen(true)}
            >
              + Add New Tier
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder="Search by tier name..."
                className="pl-9 text-xs h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="h-9 text-xs w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ✨ --- LOADING & ERROR HANDLING --- ✨ */}
        {loading && <div className="p-4 text-center">Loading membership plans...</div>}
        {error && <div className="p-4 text-center text-red-500">Error: {error}</div>}
        {!loading && !error && (
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead>TIER NAME</TableHead>
                <TableHead>PRICE</TableHead>
                <TableHead>MIN. ORDERS</TableHead>
                <TableHead>MIN. SPEND</TableHead>
                <TableHead>DISCOUNT</TableHead>
                <TableHead>BENEFITS</TableHead>
                <TableHead className="text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberships.map((plan) => (
                <TableRow key={plan.id} className="text-xs">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTierIcon(plan.name)}
                      <span className="font-medium">{plan.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">₹{plan.price.toLocaleString()}</TableCell>
                  <TableCell>{plan.minOrders} orders</TableCell>
                  <TableCell>₹{plan.minSpend.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {plan.discount}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <ul className="list-disc list-inside text-xs">
                      {plan.benefits.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() => handleEdit(plan)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(plan)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <AddMembershipModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSave={handleAddPlan}
      />
      {selectedPlan && (
        <>
          <EditMembershipModal
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            onSave={handleSaveEdit}
            plan={selectedPlan}
          />
          <DeleteConfirmationModal
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            onConfirm={handleConfirmDelete}
            title="Delete Membership Tier"
            description={`Are you sure you want to delete the "${selectedPlan.name}" tier? This action cannot be undone.`}
          />
        </>
      )}
    </div>
  );
}