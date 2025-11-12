import { useState } from 'react';
import { Wallet as WalletIcon, Plus, Download, TrendingUp, TrendingDown, CreditCard, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Badge } from '../components/ui/badge';

const mockTransactions = [
  {
    id: '1',
    type: 'credit',
    amount: 500,
    description: 'Wallet recharge',
    date: '2025-11-10',
    status: 'completed'
  },
  {
    id: '2',
    type: 'debit',
    amount: 150,
    description: 'Order payment',
    date: '2025-11-09',
    status: 'completed'
  },
  {
    id: '3',
    type: 'credit',
    amount: 1000,
    description: 'Refund credited',
    date: '2025-11-08',
    status: 'completed'
  },
  {
    id: '4',
    type: 'debit',
    amount: 200,
    description: 'Subscription payment',
    date: '2025-11-07',
    status: 'completed'
  }
];

export function Wallet() {
  const [transactions] = useState(mockTransactions);

  const totalBalance = transactions.reduce((acc, transaction) => {
    if (transaction.status === 'completed') {
      return transaction.type === 'credit' ? acc + transaction.amount : acc - transaction.amount;
    }
    return acc;
  }, 5000);

  const totalCredits = transactions
    .filter(t => t.type === 'credit' && t.status === 'completed')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalDebits = transactions
    .filter(t => t.type === 'debit' && t.status === 'completed')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-end">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="transition-all duration-200 h-9 text-xs border border-gray-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            size="sm"
            className="bg-red-500 hover:bg-red-600 transition-all duration-200 h-9 text-xs border border-red-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Total Balance</p>
              <h3 className="text-lg">₹{totalBalance.toLocaleString()}</h3>
            </div>
            <div className="h-9 w-9 bg-blue-50 rounded-full flex items-center justify-center">
              <WalletIcon className="h-4 w-4 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Total Credits</p>
              <h3 className="text-lg text-green-600">₹{totalCredits.toLocaleString()}</h3>
            </div>
            <div className="h-9 w-9 bg-green-50 rounded-full flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1 font-bold">Total Debits</p>
              <h3 className="text-lg text-red-600">₹{totalDebits.toLocaleString()}</h3>
            </div>
            <div className="h-9 w-9 bg-red-50 rounded-full flex items-center justify-center">
              <TrendingDown className="h-4 w-4 text-red-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h3 className="text-sm font-semibold">Recent Transactions</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Transaction ID</TableHead>
              <TableHead className="text-xs">Type</TableHead>
              <TableHead className="text-xs">Amount</TableHead>
              <TableHead className="text-xs">Description</TableHead>
              <TableHead className="text-xs">Date</TableHead>
              <TableHead className="text-xs">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="text-xs">#{transaction.id}</TableCell>
                <TableCell className="text-xs">
                  <div className="flex items-center gap-2">
                    {transaction.type === 'credit' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-xs">
                  <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount}
                  </span>
                </TableCell>
                <TableCell className="text-xs">{transaction.description}</TableCell>
                <TableCell className="text-xs">{new Date(transaction.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-xs">
                  <Badge
                    className={
                      transaction.status === 'completed'
                        ? 'bg-green-100 text-green-700 hover:bg-green-100'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                        : 'bg-red-100 text-red-700 hover:bg-red-100'
                    }
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}