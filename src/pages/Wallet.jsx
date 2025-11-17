// admin_11/src/pages/Wallet.jsx
import { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui/tabs';
import {
  Search,
  Eye,
  Edit2,
  Trash2,
  CreditCard,
  Percent,
  CheckCircle,
  Gift,
  Clock,
  CircleArrowUp,
  CircleArrowDown,
  Users,
} from 'lucide-react';
import { AddDiscountBonusModal } from '../components/modals/AddDiscountBonusModal';
import { EditDiscountBonusModal } from '../components/modals/EditDiscountBonusModal';
import { DeleteConfirmationModal } from '../components/modals/DeleteConfirmationModal';
import { AddWalletTransactionModal } from '../components/modals/AddWalletTransactionModal';
import { usePersistentWallet, usePersistentCustomers } from '../lib/usePersistentData';
import { showSuccessToast } from '../lib/toast';
import { toast } from 'sonner@2.0.3';
import { useApiDiscounts } from '../lib/hooks/useApiDiscounts'; // ✨ ADDED
import { useApiWalletStats } from '../lib/hooks/useApiWalletStats'; // ✨ ADDED

export function Wallet() {
  // ✨ We STILL need usePersistentWallet for the "Transactions" tab mock data
  const [walletData, setWalletData] = usePersistentWallet();
  const [customers] = usePersistentCustomers();
  
  // State for modals and selected items
  const [addDiscountModalOpen, setAddDiscountModalOpen] = useState(false);
  const [editDiscountModalOpen, setEditDiscountModalOpen] = useState(false);
  const [deleteDiscountModalOpen, setDeleteDiscountModalOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  
  const [addTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
  const [deleteTransactionModalOpen, setDeleteTransactionModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Filter states
  const [discountSearch, setDiscountSearch] = useState('');
  const [discountStatus, setDiscountStatus] = useState('all');
  const [discountType, setDiscountType] = useState('all');
  const [transactionSearch, setTransactionSearch] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('all');
  const [transactionType, setTransactionType] = useState('all');

  // ✨ --- API Hook for Stats --- ✨
  const { 
    stats, 
    loading: statsLoading 
  } = useApiWalletStats();

  // ✨ --- API Hook for Discounts List --- ✨
  const {
    discounts,
    loading: discountsLoading,
    error: discountsError,
    total: totalDiscountsApi,
    createDiscount,
    updateDiscount,
    deleteDiscount,
  } = useApiDiscounts({
    search: discountSearch,
    status: discountStatus,
    type: discountType,
  });

  // const filteredDiscounts = walletData.discounts.filter(...) // ✨ REMOVED (API handles this)

  // ✨ --- CRUD Functions for Discounts --- ✨
  const handleAddDiscount = async (data) => {
    try {
      await createDiscount(data);
      showSuccessToast('Discount added successfully!');
      setAddDiscountModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Failed to add discount');
    }
  };

  const handleEditDiscount = (discount) => {
    setSelectedDiscount(discount);
    setEditDiscountModalOpen(true);
  };

  const handleSaveEditDiscount = async (updatedData) => {
    if (selectedDiscount) {
      try {
        await updateDiscount(selectedDiscount.id, updatedData);
        showSuccessToast('Discount updated successfully!');
        setEditDiscountModalOpen(false);
        setSelectedDiscount(null);
      } catch (err) {
        toast.error(err.message || 'Failed to update discount');
      }
    }
  };

  const handleDeleteDiscount = (discount) => {
    setSelectedDiscount(discount);
    setDeleteDiscountModalOpen(true);
  };

  const handleConfirmDeleteDiscount = async () => {
    if (selectedDiscount) {
      try {
        await deleteDiscount(selectedDiscount.id);
        showSuccessToast('Discount deleted successfully!');
        setDeleteDiscountModalOpen(false);
        setSelectedDiscount(null);
      } catch (err) {
        toast.error(err.message || 'Failed to delete discount');
      }
    }
  };


  // --- Transaction Functions (Untouched) ---
  // These still use mock data from usePersistentWallet
  const filteredTransactions = walletData.transactions.filter((t) => {
    const customer = customers.find((c) => c.id === t.userId);
    const matchesSearch =
      t.id.toLowerCase().includes(transactionSearch.toLowerCase()) ||
      customer?.name.toLowerCase().includes(transactionSearch.toLowerCase());
    const matchesStatus =
      transactionStatus === 'all' || t.status === transactionStatus;
    const matchesType =
      transactionType === 'all' || t.type === transactionType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAddTransaction = (transaction) => {
    setWalletData((prev) => ({
      ...prev,
      transactions: [transaction, ...prev.transactions],
    }));
    showSuccessToast('Transaction added successfully!');
  };

  const handleDeleteTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setDeleteTransactionModalOpen(true);
  };

  const handleConfirmDeleteTransaction = () => {
    if (selectedTransaction) {
      setWalletData((prev) => ({
        ...prev,
        transactions: prev.transactions.filter(
          (t) => t.id !== selectedTransaction.id,
        ),
      }));
      setDeleteTransactionModalOpen(false);
      setSelectedTransaction(null);
      showSuccessToast('Transaction deleted successfully!');
    }
  };
  // --- End of Transaction Functions ---

  return (
    <div className="p-4">
      <Tabs defaultValue="discounts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="discounts">Discounts / Bonus</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* ====================================================================== */}
        {/* =================== DISCOUNTS / BONUS TAB (Integrated) ================= */}
        {/* ====================================================================== */}
        <TabsContent value="discounts">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1 font-bold">Total Discounts</p>
              <h3 className="text-lg">{statsLoading ? '...' : stats.totalDiscounts}</h3>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1 font-bold">Active Discounts</p>
              <h3 className="text-lg">{statsLoading ? '...' : stats.activeDiscounts}</h3>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1 font-bold">Total Redeemed</p>
              <h3 className="text-lg">{statsLoading ? '...' : stats.totalRedeemed}</h3>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1 font-bold">Total Value Redeemed</p>
              <h3 className="text-lg">₹{statsLoading ? '...' : stats.totalValue.toLocaleString()}</h3>
            </Card>
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    placeholder="Search by code or title..."
                    className="pl-9 text-xs h-9"
                    value={discountSearch}
                    onChange={(e) => setDiscountSearch(e.target.value)}
                  />
                </div>
                <Select value={discountStatus} onValueChange={setDiscountStatus}>
                  <SelectTrigger className="h-9 text-xs w-[140px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={discountType} onValueChange={setDiscountType}>
                  <SelectTrigger className="h-9 text-xs w-[140px]">
                    <SelectValue placeholder="All Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Type</SelectItem>
                    <SelectItem value="Percentage">Percentage</SelectItem>
                    <SelectItem value="Fixed">Fixed</SelectItem>
                    <SelectItem value="Bonus">Bonus</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  className="h-9 text-xs bg-red-500 hover:bg-red-600"
                  onClick={() => setAddDiscountModalOpen(true)}
                >
                  + Add New
                </Button>
              </div>
            </div>

            {/* ✨ --- LOADING & ERROR HANDLING --- ✨ */}
            {discountsLoading && <div className="p-4 text-center">Loading discounts...</div>}
            {discountsError && <div className="p-4 text-center text-red-500">Error: {discountsError}</div>}
            {!discountsLoading && !discountsError && (
              <Table>
                <TableHeader>
                  <TableRow className="text-xs">
                    <TableHead>CODE</TableHead>
                    <TableHead>TYPE</TableHead>
                    <TableHead>VALUE</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead>REDEEMED</TableHead>
                    <TableHead>VALID FROM</TableHead>
                    <TableHead>VALID UNTIL</TableHead>
                    <TableHead className="text-right">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discounts.map((discount) => (
                    <TableRow key={discount.id} className="text-xs">
                      <TableCell>
                        <p className="font-medium">{discount.code}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">{discount.title}</p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={discount.type === 'Bonus' ? 'secondary' : 'outline'}
                          className={discount.type === 'Bonus' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {discount.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {discount.type === 'Percentage' ? `${discount.value}%` : `₹${discount.value}`}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] ${
                          discount.status === 'active' ? 'bg-green-100 text-green-800' :
                          discount.status === 'expired' ? 'bg-gray-100 text-gray-700' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            discount.status === 'active' ? 'bg-green-600' :
                            discount.status === 'expired' ? 'bg-gray-500' :
                            'bg-blue-600'
                          }`} />
                          {discount.status}
                        </span>
                      </TableCell>
                      <TableCell>{discount.redeemedCount} / {discount.usageLimit}</TableCell>
                      <TableCell>{discount.validFrom}</TableCell>
                      <TableCell>{discount.validUntil}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleEditDiscount(discount)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteDiscount(discount)}
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
        </TabsContent>

        {/* ====================================================================== */}
        {/* ================== TRANSACTIONS TAB (NOT Integrated) ================= */}
        {/* ====================================================================== */}
        <TabsContent value="transactions">
          {/* Stat Cards (using mock stats for now) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1 font-bold">Total Wallet Balance</p>
              <h3 className="text-lg">₹{statsLoading ? '...' : stats.totalWalletBalance.toLocaleString()}</h3>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1 font-bold">Total Credit (Top-up)</p>
              <h3 className="text-lg">₹{statsLoading ? '...' : stats.totalCredit.toLocaleString()}</h3>
            </Card>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-1 font-bold">Total Debit (Spent)</p>
              <h3 className="text-lg">₹{statsLoading ? '...' : stats.totalDebit.toLocaleString()}</h3>
            </Card>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    placeholder="Search by user or transaction ID..."
                    className="pl-9 text-xs h-9"
                    value={transactionSearch}
                    onChange={(e) => setTransactionSearch(e.target.value)}
                  />
                </div>
                <Select value={transactionStatus} onValueChange={setTransactionStatus}>
                  <SelectTrigger className="h-9 text-xs w-[140px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger className="h-9 text-xs w-[140px]">
                    <SelectValue placeholder="All Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Type</SelectItem>
                    <SelectItem value="credit">Credit (Top-up)</SelectItem>
                    <SelectItem value="debit">Debit (Purchase)</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  className="h-9 text-xs bg-red-500 hover:bg-red-600"
                  onClick={() => setAddTransactionModalOpen(true)}
                >
                  + Add Transaction
                </Button>
              </div>
            </div>

            {/* This table still uses mock data */}
            <Table>
              <TableHeader>
                <TableRow className="text-xs">
                  <TableHead>TRANSACTION ID</TableHead>
                  <TableHead>USER</TableHead>
                  <TableHead>TYPE</TableHead>
                  <TableHead>AMOUNT</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead>DATE</TableHead>
                  <TableHead className="text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((t) => {
                  const customer = customers.find(c => c.id === t.userId);
                  return (
                    <TableRow key={t.id} className="text-xs">
                      <TableCell className="font-medium">#{t.id.split('-')[0]}</TableCell>
                      <TableCell>{customer?.name || 'Unknown User'}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 ${
                          t.type === 'credit' ? 'text-green-700' : 
                          t.type === 'debit' ? 'text-red-700' : 'text-gray-700'
                        }`}>
                          {t.type === 'credit' && <CircleArrowUp className="h-3 w-3" />}
                          {t.type === 'debit' && <CircleArrowDown className="h-3 w-3" />}
                          {t.type === 'refund' && <RefreshCw className="h-3 w-3" />}
                          {t.type}
                        </span>
                      </TableCell>
                      <TableCell className={`font-medium ${
                        t.type === 'credit' ? 'text-green-700' : 
                        t.type === 'debit' ? 'text-red-700' : 'text-gray-700'
                      }`}>
                        {t.type === 'debit' ? '-' : '+'}₹{t.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={t.status === 'completed' ? 'default' : 'secondary'}>
                          {t.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{t.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteTransaction(t)}
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
          </div>
        </TabsContent>
      </Tabs>

      {/* Discount Modals */}
      <AddDiscountBonusModal
        open={addDiscountModalOpen}
        onOpenChange={setAddDiscountModalOpen}
        onSave={handleAddDiscount}
      />
      {selectedDiscount && (
        <>
          <EditDiscountBonusModal
            open={editDiscountModalOpen}
            onOpenChange={setEditDiscountModalOpen}
            onSave={handleSaveEditDiscount}
            discount={selectedDiscount}
          />
          <DeleteConfirmationModal
            open={deleteDiscountModalOpen}
            onOpenChange={setDeleteDiscountModalOpen}
            onConfirm={handleConfirmDeleteDiscount}
            title="Delete Discount"
            description={`Are you sure you want to delete the discount "${selectedDiscount.code}"?`}
          />
        </>
      )}

      {/* Transaction Modals (Still using mock data) */}
      <AddWalletTransactionModal
        open={addTransactionModalOpen}
        onOpenChange={setAddTransactionModalOpen}
        onSave={handleAddTransaction}
        customers={customers}
      />
      {selectedTransaction && (
        <DeleteConfirmationModal
          open={deleteTransactionModalOpen}
          onOpenChange={setDeleteTransactionModalOpen}
          onConfirm={handleConfirmDeleteTransaction}
          title="Delete Transaction"
          description={`Are you sure you want to delete transaction #${selectedTransaction.id.split('-')[0]}?`}
        />
      )}
    </div>
  );
}