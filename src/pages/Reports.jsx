// admin_11/src/pages/Reports.jsx
import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  ShoppingCart,
  DollarSign,
  Users,
  Building2,
  Download,
  BarChart3,
  TrendingUp,
  Package,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useApiReportData } from "../lib/hooks/useApiReportData"; // ✨ CHANGED
import { Skeleton } from "../components/ui/skeleton"; // ✨ ADDED

// --- All mock data and persistent hooks are removed ---

export const Reports = () => {
  // --- Filter States ---
  const [membership, setMembership] = useState("all");
  const [dateRange, setDateRange] = useState("year");
  const [activeTab, setActiveTab] = useState("overview");
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [fromDate, setFromDate] = useState("2025-01-01");
  const [toDate, setToDate] = useState("2025-12-31");
  
  // Create filters object to pass to the hook
  const [filters, setFilters] = useState({
    membership: "all",
    dateRange: "year",
    fromDate: "2025-01-01",
    toDate: "2025-12-31"
  });

  // ✨ --- API Hook Integration --- ✨
  // This hook will fetch data whenever activeTab or filters change
  const { data, loading, error, refetch } = useApiReportData(activeTab, filters);

  // --- All local calculation functions (getRevenueData, etc.) are REMOVED ---
  
  // Handle date range change
  useEffect(() => {
    setShowCustomRange(dateRange === "custom");
  }, [dateRange]);

  // Handle applying filters
  const handleApplyFilters = () => {
    setFilters({
      membership,
      dateRange,
      fromDate,
      toDate
    });
    // The hook will automatically refetch
  };
  
  const handleRefresh = () => {
    refetch(); // Call the refetch function from the hook
  };
  
  const handleExport = () => {
    console.log("Exporting report data...");
    // This would ideally call a new API endpoint like
    // reportService.exportReport(activeTab, filters)
  };
  
  // --- Helper variables to safely access API data ---
  const stats = data?.stats || { totalOrders: 0, totalRevenue: 0, totalCustomers: 0, activeBranches: 0 };
  const revenueData = data?.revenueData || [];
  const topSellingProducts = data?.topSellingProducts || [];
  const branchPerformance = data?.branchPerformance || [];
  const ordersByStatus = data?.ordersByStatus || [];
  const salesTrendData = data?.salesTrendData || [];
  const popularItems = data?.popularItems || [];
  const newVsReturningData = data?.newVsReturningData || [];
  const highValueCustomers = data?.highValueCustomers || [];
  const peakHoursData = data?.peakHoursData || [];
  
  const pieColors = ["#EF5350", "#26C6DA", "#42A5F5", "#FFA726", "#AB47BC"];
  
  // Loading skeleton component
  const renderLoading = () => (
    <div className="p-6 space-y-4">
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header Controls */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Select
              value={membership}
              onValueChange={setMembership}
            >
              <SelectTrigger
                className="w-40 h-9 text-xs border border-gray-300"
              >
                <SelectValue placeholder="All Membership" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">
                  All Membership
                </SelectItem>
                <SelectItem value="Gold" className="text-xs">
                  Gold
                </SelectItem>
                <SelectItem value="Silver" className="text-xs">
                  Silver
                </SelectItem>
                <SelectItem value="Bronze" className="text-xs">
                  Bronze
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={dateRange}
              onValueChange={setDateRange}
            >
              <SelectTrigger
                className="w-36 h-9 text-xs border border-gray-300"
              >
                <SelectValue placeholder="This Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today" className="text-xs">
                  Today
                </SelectItem>
                <SelectItem value="week" className="text-xs">
                  This Week
                </SelectItem>
                <SelectItem value="month" className="text-xs">
                  This Month
                </SelectItem>
                <SelectItem value="quarter" className="text-xs">
                  This Quarter
                </SelectItem>
                <SelectItem value="year" className="text-xs">
                  This Year
                </SelectItem>
                <SelectItem value="custom" className="text-xs">
                  Custom Range
                </SelectItem>
              </SelectContent>
            </Select>

            {showCustomRange && (
              <>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-36 h-9 text-xs"
                  placeholder="From"
                />
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-36 h-9 text-xs"
                  placeholder="To"
                />
              </>
            )}

            <Button
              onClick={handleApplyFilters}
              className="h-9 text-xs bg-blue-500 hover:bg-blue-600"
            >
              Apply Filters
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="h-9 text-xs border border-gray-300"
            >
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="h-9 text-xs bg-red-500 text-white hover:bg-red-600 border border-red-500"
            >
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1 font-bold">
                Total Orders
              </p>
              <h3 className="text-lg font-semibold">
                {loading && activeTab === 'overview' ? '...' : stats.totalOrders.toLocaleString()}
              </h3>
            </div>
            <div className="h-9 w-9 bg-blue-50 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1 font-bold">
                Total Revenue
              </p>
              <h3 className="text-lg font-semibold">
                ₹{loading && activeTab === 'overview' ? '...' : stats.totalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="h-9 w-9 bg-red-50 rounded-full flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-red-500" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1 font-bold">
                Total Customers
              </p>
              <h3 className="text-lg font-semibold">
                {loading && activeTab === 'overview' ? '...' : stats.totalCustomers.toLocaleString()}
              </h3>
            </div>
            <div className="h-9 w-9 bg-green-50 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="p-4 transition-all duration-200 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1 font-bold">
                Total Products Sold
              </p>
              <h3 className="text-lg font-semibold">
                {/* Calculate total products sold from orders */}
                {loading && activeTab === 'overview' ? '...' : (
                   // Sum up the 'items' count from all filtered orders
                   (data?.orders || []).reduce((sum, order) => sum + (order.items?.length || 0), 0).toLocaleString()
                )}
              </h3>
            </div>
            <div className="h-9 w-9 bg-purple-50 rounded-full flex items-center justify-center">
              <Package className="h-4 w-4 text-purple-500" /> {/* Changed icon to Package */}
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="bg-white border border-gray-200 rounded-md p-1">
          <TabsTrigger
            value="overview"
            className="text-xs data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-md"
          >
            <BarChart3 className="h-4 w-4 mr-1" /> Overview
          </TabsTrigger>
          <TabsTrigger
            value="sales"
            className="text-xs data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-md"
          >
            <TrendingUp className="h-4 w-4 mr-1" /> Sales
            Reports
          </TabsTrigger>
          <TabsTrigger
            value="customers"
            className="text-xs data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-md"
          >
            <Users className="h-4 w-4 mr-1" /> Customer Reports
          </TabsTrigger>
          <TabsTrigger
            value="orders"
            className="text-xs data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-md"
          >
            <Package className="h-4 w-4 mr-1" /> Order Reports
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {loading ? renderLoading() : error ? <div className="text-red-500 p-4">Error: {error}</div> : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Revenue */}
              <Card className="p-6">
                <h3 className="font-medium mb-4">Revenue</h3>
                {revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f0f0f0"
                      />
                      <XAxis
                        dataKey="name" // API should return 'name'
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar
                        dataKey="revenue" // API should return 'revenue'
                        fill="#3B82F6"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500 text-xs">
                    No data available for selected filters
                  </div>
                )}
              </Card>

              {/* Top Selling Products */}
              <Card className="p-6">
                <h3 className="font-medium mb-4">
                  Top Selling Products
                </h3>
                {topSellingProducts.length > 0 ? (
                  <div className="flex items-center justify-between">
                    <ResponsiveContainer width="50%" height={300}>
                      <PieChart>
                        <Pie
                          data={topSellingProducts}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value" // API should return 'value'
                        >
                          {topSellingProducts.map(
                            (entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={pieColors[index % pieColors.length]}
                              />
                            ),
                          )}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 w-1/2 pr-4">
                      {topSellingProducts.map(
                        (product, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: pieColors[index % pieColors.length],
                                }}
                              />
                              <span className="text-xs truncate">
                                {product.name}
                              </span>
                            </div>
                            <span className="text-xs font-medium">
                              {product.value} units
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500 text-xs">
                    No data available for selected filters
                  </div>
                )}
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Sales Reports Tab */}
        <TabsContent value="sales" className="space-y-4">
          {loading ? renderLoading() : error ? <div className="text-red-500 p-4">Error: {error}</div> : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Membership Performance */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">
                    Membership Performance
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={handleExport}
                  >
                    Export CSV
                  </Button>
                </div>
                <div className="space-y-3">
                  {branchPerformance.length > 0 ? (
                    branchPerformance.map((branch, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-1">
                              {branch.name}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {branch.orders} orders
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ₹
                              {branch.revenue.toLocaleString(
                                "en-IN",
                                { minimumFractionDigits: 2 },
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-xs">
                      No data available for selected filters
                    </div>
                  )}
                </div>
              </Card>

              {/* Average Order Value */}
              <Card className="p-6">
                <h3 className="font-medium mb-4">
                  Average Order Value
                </h3>
                <div className="text-center py-6">
                  <h2 className="text-4xl font-bold text-blue-600 mb-2">
                    ₹{stats.avgOrderValue ? stats.avgOrderValue.toFixed(2) : "0.00"}
                  </h2>
                  <p className="text-xs text-green-600 mb-6 flex items-center justify-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Based on
                    filtered data
                  </p>
                  <div className="space-y-2 text-left mt-8">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        Total Orders:
                      </span>
                      <span className="font-medium">
                        {stats.totalOrders}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        Total Revenue:
                      </span>
                      <span className="font-medium">
                        ₹{stats.totalRevenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Customer Reports Tab */}
        <TabsContent value="customers" className="space-y-4">
          {loading ? renderLoading() : error ? <div className="text-red-500 p-4">Error: {error}</div> : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* New vs Returning Customers */}
              <Card className="p-6">
                <h3 className="font-medium mb-4">
                  New vs Returning Customers
                </h3>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={newVsReturningData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={130}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {newVsReturningData.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                            />
                          ),
                        )}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* High-Value Customers */}
              <Card className="p-6">
                <h3 className="font-medium mb-4">
                  High-Value Customers
                </h3>
                <div className="space-y-3">
                  {highValueCustomers.map((customer, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-blue-600">
                            {customer.initials}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {customer.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {customer.orders} orders
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">
                            ₹
                            {customer.revenue.toLocaleString(
                              "en-IN",
                              { minimumFractionDigits: 2 },
                            )}
                          </p>
                          {customer.vip && (
                            <span className="inline-flex items-center gap-1 text-xs text-yellow-600">
                              ⭐ VIP
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Order Reports Tab */}
        <TabsContent value="orders" className="space-y-4">
           {loading ? renderLoading() : error ? <div className="text-red-500 p-4">Error: {error}</div> : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Orders by Status */}
              <Card className="p-6">
                <h3 className="font-medium mb-6">
                  Orders by Status
                </h3>
                <div className="space-y-4">
                  {ordersByStatus.map((status, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: status.color,
                          }}
                        />
                        <span className="text-sm">
                          {status.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">
                          {status.count.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500 w-12 text-right">
                          {status.percentage}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Peak Hours */}
              <Card className="p-6">
                <h3 className="font-medium mb-4">Peak Hours</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={peakHoursData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f0f0f0"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="hour"
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar
                      dataKey="orders"
                      fill="#F59E0B"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
           )}
        </TabsContent>
      </Tabs>
    </div>
  );
};