import { useState, useEffect } from 'react';
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
import { Badge } from '../components/ui/badge';
import { Search, Edit2, Trash2, Crown, Percent, Truck, Star, RefreshCw, Download, Plus, Shield, Zap, Diamond, Loader2 } from 'lucide-react';
import { AddMembershipModal } from '../components/modals/AddMembershipModal';
import { EditMembershipModal } from '../components/modals/EditMembershipModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { showSuccessToast } from '../lib/toast';
import { toast } from 'sonner';

// ✨ DEFAULT MOCK DATA
const DEFAULT_MEMBERSHIPS = [
  {
    id: '1',
    name: 'Bronze Starter',
    icon: 'Percent', 
    price: 0,
    minOrders: 0,
    minSpend: 0,
    discount: 0,
    benefits: ['Access to standard deals', 'Standard delivery speed']
  },
  {
    id: '2',
    name: 'Silver Elite',
    icon: 'Star',
    price: 499,
    minOrders: 5,
    minSpend: 2000,
    discount: 5,
    benefits: ['5% Discount on all orders', 'Free delivery on orders > ₹200', 'Priority Support']
  },
  {
    id: '3',
    name: 'Gold Pro',
    icon: 'Crown',
    price: 999,
    minOrders: 15,
    minSpend: 10000,
    discount: 10,
    benefits: ['10% Discount on all orders', 'Free delivery on all orders', 'Exclusive Deals Access']
  },
  {
    id: '4',
    name: 'Platinum VIP',
    icon: 'Platinum Crown', 
    price: 1999,
    minOrders: 50,
    minSpend: 50000,
    discount: 15,
    benefits: ['15% Flat Discount', 'Instant Delivery Priority', 'Dedicated Account Manager', 'Birthday Gifts']
  }
];

export function Membership() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('price-asc');
  
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ✅ 1. INITIALIZE STATE FROM LOCAL STORAGE
  const [memberships, setMemberships] = useState(() => {
    const savedData = localStorage.getItem('demo_memberships');
    return savedData ? JSON.parse(savedData) : DEFAULT_MEMBERSHIPS;
  });

  // ✅ 2. HELPER TO SAVE TO LOCAL STORAGE
  const updateLocalStorage = (newData) => {
    setMemberships(newData);
    localStorage.setItem('demo_memberships', JSON.stringify(newData));
  };

  const handleAddPlan = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newPlan = { 
        ...data, 
        id: Math.random().toString(36).substr(2, 9),
        icon: data.icon || 'Truck' 
    };
    
    // Save to State & Storage
    updateLocalStorage([...memberships, newPlan]);
    
    showSuccessToast('Membership tier added successfully!');
    setAddModalOpen(false);
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedData) => {
    const updatedList = memberships.map(item => item.id === selectedPlan.id ? { ...item, ...updatedData } : item);
    
    // Save to State & Storage
    updateLocalStorage(updatedList);
    
    showSuccessToast('Membership tier updated successfully!');
    setEditModalOpen(false);
    setSelectedPlan(null);
  };

  const handleDelete = (plan) => {
    setSelectedPlan(plan);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const filteredList = memberships.filter(item => item.id !== selectedPlan.id);
    
    // Save to State & Storage
    updateLocalStorage(filteredList);
    
    showSuccessToast('Membership tier deleted successfully!');
    setDeleteModalOpen(false);
    setSelectedPlan(null);
  };

  // ✅ 3. COLOR HELPER (Matches your request)
  const getTierColorClass = (iconName) => {
    switch (iconName) {
      case 'Crown': return "text-yellow-500 fill-yellow-100";
      case 'Platinum Crown': return "text-slate-500 fill-slate-200";
      case 'Star': return "text-gray-400 fill-gray-100";
      // ✅ Corrected Bronze Color
      case 'Percent': return "text-orange-700 fill-orange-700/20"; 
      case 'Diamond': return "text-red-600 fill-red-100";
      case 'Shield': return "text-emerald-500";
      case 'Zap': return "text-purple-500";
      case 'Truck': return "text-blue-500";
      default: return "text-gray-500";
    }
  };

  // ✅ 4. ICON HELPER
  const getTierIcon = (iconName, className) => {
    const baseClass = "h-4 w-4 mr-2 " + className;
    switch (iconName) {
      case 'Crown': return <Crown className={baseClass} />;
      case 'Platinum Crown': return <Crown className={baseClass} />;
      case 'Star': return <Star className={baseClass} />;
      case 'Percent': return <Percent className={baseClass} />;
      case 'Diamond': return <Diamond className={baseClass} />;
      case 'Shield': return <Shield className={baseClass} />;
      case 'Zap': return <Zap className={baseClass} />;
      default: return <Truck className={baseClass} />;
    }
  };

  const handleRefresh = async () => {
      setIsRefreshing(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      // In demo mode, we just keep current data (from local storage)
      // If you want to RESET to defaults, uncomment the line below:
      // updateLocalStorage(DEFAULT_MEMBERSHIPS); 
      setIsRefreshing(false);
      toast.success("Membership data refreshed");
  };

  const handleExport = () => {
      toast.info("Exporting membership data...");
  };

  const filteredMemberships = memberships
    .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
        if (sortOrder === 'price-asc') return a.price - b.price;
        if (sortOrder === 'price-desc') return b.price - a.price;
        if (sortOrder === 'name-asc') return a.name.localeCompare(b.name);
        if (sortOrder === 'name-desc') return b.name.localeCompare(a.name);
        return 0;
    });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Membership Tiers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage membership tiers and benefits.</p>
        </div>
        
        {/* Buttons */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="h-9 text-xs border border-gray-300"
          >
            {isRefreshing ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : (
                <RefreshCw className="h-3 w-3 mr-1" />
            )}
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button size="sm" onClick={handleExport} className="h-9 text-xs bg-red-500 hover:bg-red-600 text-white border border-red-500">
            <Download className="h-3 w-3 mr-1" /> Export
          </Button>
          <Button size="sm" onClick={() => setAddModalOpen(true)} className="h-9 text-xs bg-red-500 hover:bg-red-600 text-white border border-red-500">
            <Plus className="h-3 w-3 mr-1" /> Add New Tier
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b space-y-3">
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

        {/* Table */}
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
            {filteredMemberships.map((plan) => {
                const colorClass = getTierColorClass(plan.icon);
                
                return (
                  <TableRow key={plan.id} className="text-xs">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Icon with Color */}
                        {getTierIcon(plan.icon, colorClass)}
                        {/* Text with Color */}
                        <span className={`font-semibold ${colorClass.split(' ')[0]}`}>{plan.name}</span>
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
                      <ul className="list-disc list-inside text-xs text-gray-500">
                        {plan.benefits.map((benefit, i) => (
                          <li key={i} className="truncate max-w-[200px]">{benefit}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleEdit(plan)}>
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-600 hover:text-red-700" onClick={() => handleDelete(plan)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
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
            description={`Are you sure you want to delete the "${selectedPlan.name}" tier?`}
          />
        </>
      )}
    </div>
  );
}