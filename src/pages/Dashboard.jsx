import { ShoppingCart, DollarSign, Users, TrendingUp, Download, Calendar, ChevronDown } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DeliveryBoysCard } from '../components/DeliveryBoysCard';
import { useState } from 'react';
import { toast } from 'sonner';

// Import API Hooks
import { useApiOrders } from '../lib/hooks/useApiOrders';
import { useApiProducts } from '../lib/hooks/useApiProducts';
import { useApiCustomers } from '../lib/hooks/useApiCustomers';
import { Skeleton } from '../components/ui/skeleton';

export function Dashboard() {
  const [dateFilter, setDateFilter] = useState('last30');

  // 1. Fetch All Data (Safely handle undefined returns)
  const { 
    orders = [], // ✅ Default to empty array
    stats: orderStats,
    loading: ordersLoading 
  } = useApiOrders({ limit: 1000 }) || {}; 

  const { 
    products = [], // ✅ Default to empty array
    loading: productsLoading 
  } = useApiProducts({ limit: 100 }) || {};

  const { 
    customers = [], // ✅ Default to empty array
    loading: customersLoading 
  } = useApiCustomers({ limit: 1000 }) || {};

  // 2. Calculate Stats Locally (Robust fallback)
  const calculateStats = () => {
    // ✅ Safety: Ensure 'orders' is an array
    const safeOrders = Array.isArray(orders) ? orders : [];
    
    const totalOrders = safeOrders.length;
    
    const totalRevenue = safeOrders
      .filter(o => o?.orderStatus === 'Delivered')
      .reduce((sum, o) => sum + (Number(o.finalAmount) || 0), 0);
    
    const totalCustomers = customers?.length || 0;
    
    const completedOrdersCount = safeOrders.filter(o => o?.orderStatus === 'Delivered').length;
    const avgOrderValue = completedOrdersCount > 0 ? Math.round(totalRevenue / completedOrdersCount) : 0;

    return {
      totalOrders: orderStats?.total || totalOrders, 
      totalRevenue,
      totalCustomers,
      avgOrderValue
    };
  };

  const stats = calculateStats();
  const isLoading = ordersLoading || productsLoading || customersLoading;

  // 3. Prepare Chart Data (Mock vs Real)
  const revenueData = [
    { month: 'Jan', income: stats.totalRevenue * 0.1, expenses: stats.totalRevenue * 0.05 },
    { month: 'Feb', income: stats.totalRevenue * 0.12, expenses: stats.totalRevenue * 0.06 },
    { month: 'Mar', income: stats.totalRevenue * 0.15, expenses: stats.totalRevenue * 0.08 },
    { month: 'Apr', income: stats.totalRevenue * 0.11, expenses: stats.totalRevenue * 0.05 },
    { month: 'May', income: stats.totalRevenue * 0.18, expenses: stats.totalRevenue * 0.09 },
    { month: 'Jun', income: stats.totalRevenue * 0.14, expenses: stats.totalRevenue * 0.07 },
    { month: 'Jul', income: stats.totalRevenue * 0.2, expenses: stats.totalRevenue * 0.1 },
  ];

  // ✅ Safety: Use safe array for filtering
  const safeOrdersList = Array.isArray(orders) ? orders : [];
  
  const orderSummaryData = [
    { 
      date: 'Today', 
      completed: safeOrdersList.filter(o => o.orderStatus === 'Delivered').length, 
      pending: safeOrdersList.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Placed').length 
    },
    { date: 'Yesterday', completed: 12, pending: 4 },
    { date: 'Mon', completed: 15, pending: 2 },
    { date: 'Sun', completed: 8, pending: 1 },
    { date: 'Sat', completed: 20, pending: 5 },
  ];

  // ✅ Safety: Check products array
  const topProducts = Array.isArray(products) ? products.slice(0, 5) : [];

  const getDateFilterLabel = () => {
    switch (dateFilter) {
      case 'today': return 'Today';
      case 'last7': return 'Last 7 Days';
      case 'last30': return 'Last 30 Days';
      default: return 'Last 30 Days';
    }
  };

  const handleExport = () => {
    toast.info("Exporting dashboard data...");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                <Calendar className="h-4 w-4" />
                {getDateFilterLabel()}
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => setDateFilter('today')}>Today</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter('last7')}>Last 7 Days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDateFilter('last30')}>Last 30 Days</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            className="bg-red-500 hover:bg-red-600 transition-all duration-200"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Orders"
          value={isLoading ? '...' : stats.totalOrders.toLocaleString()}
          icon={ShoppingCart}
        />
        <StatCard
          title="Revenue"
          value={isLoading ? '...' : `₹${stats.totalRevenue.toLocaleString('en-IN')}`}
          icon={DollarSign}
        />
        <StatCard
          title="Customers"
          value={isLoading ? '...' : stats.totalCustomers.toLocaleString()}
          icon={Users}
        />
        <StatCard
          title="Avg Order Value"
          value={isLoading ? '...' : `₹${stats.avgOrderValue.toLocaleString('en-IN')}`}
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3>Revenue</h3>
              <p className="text-sm text-muted-foreground">Income vs Expenses analysis</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            {isLoading ? <Skeleton className="h-full w-full" /> : (
              <LineChart data={revenueData}> 
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip contentStyle={{ fontSize: '11px' }} labelStyle={{ fontSize: '11px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} iconSize={8} />
                <Line type="monotone" dataKey="expenses" stroke="#9ca3af" strokeWidth={2} name="Expenses" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="income" stroke="#ef4444" strokeWidth={2} name="Income" dot={{ r: 3 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </Card>

        {/* Order Summary Chart */}
        <Card className="p-6 transition-all duration-200 hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
             <div>
              <h3>Order Summary</h3>
              <p className="text-sm text-muted-foreground">Completed vs Pending orders</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            {isLoading ? <Skeleton className="h-full w-full" /> : (
              <BarChart data={orderSummaryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip contentStyle={{ fontSize: '11px' }} labelStyle={{ fontSize: '11px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} iconSize={8} />
                <Bar dataKey="completed" fill="#ef4444" name="Completed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#9ca3af" name="Pending" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Orders Table */}
        <Card className="p-6 transition-all duration-200 hover:shadow-md">
          <h3 className="mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr><td colSpan="5" className="text-center p-4"><Skeleton className="h-8 w-full" /></td></tr>
                )}
                {!isLoading && safeOrdersList.slice(0, 5).map((order) => {
                  
                  // ✅ FIX: DATA MAPPING FOR NEW API
                  const customerName = order.customer?.firstName || "Unknown";
                  const initials = customerName.charAt(0);
                  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A';
                  const orderId = order.orderNumber || order._id?.slice(-6) || '...';
                  const amount = order.finalAmount || order.totalAmount || 0;
                  const status = order.orderStatus || 'Pending';

                  return (
                    <tr key={order._id || order.id} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200">
                      <td className="py-3 px-4">
                        <span className="text-red-500">#{orderId}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gray-900 text-white text-xs">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span>{customerName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">₹{amount}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {orderDate}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className={status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}>
                            {status}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Top Products Table */}
        <Card className="p-6">
          <h3 className="mb-4">Top Products</h3>
          <div className="space-y-4">
            {isLoading && (
              <>
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </>
            )}
            {topProducts.map((product, index) => (
              <div key={product.id || index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded bg-red-50 text-red-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm">{product.name || product.dishName}</p>
                    <p className="text-xs text-muted-foreground">₹{product.price}</p>
                  </div>
                </div>
                <span className="text-sm text-green-600">In Stock: {product.stock}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeliveryBoysCard />
      </div>
    </div>
  );
}