// admin_11/src/lib/hooks/useApiReportData.js
import { useState, useEffect } from 'react';
import { reportService } from '../api/services/reportService';
import { dashboardService } from '../api/services/dashboardService'; // For overview stats
import { API_CONFIG } from '../api/config';
import { 
  orders as mockOrders, 
  products as mockProducts, 
  customers as mockCustomers,
  revenueDataMonthly 
} from '../mockData'; // Fallback

// Mock data map for disabled API
const mockDataMap = {
  overview: { 
    stats: { totalOrders: mockOrders.length, totalRevenue: 15000, totalCustomers: mockCustomers.length, activeBranches: 3 },
    revenueData: revenueDataMonthly, // Use this for the chart
    topSellingProducts: mockProducts.slice(0, 5).map(p => ({ ...p, value: 50 })), // Use raw products
  },
  sales: {
    summary: { totalRevenue: 15000, totalSales: mockOrders.length, avgOrderValue: 300 },
    chartData: revenueDataMonthly,
    branchPerformance: [ { name: 'Main Branch', orders: 10, revenue: 5000 }],
    avgOrderValue: 300
  },
  customers: {
    summary: { totalCustomers: mockCustomers.length, newCustomers: 10, returningCustomers: 5 },
    topCustomers: mockCustomers.slice(0, 3).map(c => ({...c, totalOrders: 5, totalSpend: 1000})),
    newVsReturningData: [ { name: "New", value: 10 }, { name: "Returning", value: 5 }]
  },
  products: {
    topProducts: mockProducts.slice(0, 5).map(p => ({...p, unitsSold: 20, totalRevenue: p.price * 20})),
  },
  revenue: {
    summary: { totalRevenue: 15000, totalProfit: 4500, profitMargin: 30 },
    chartData: revenueDataMonthly.map(d => ({...d, profit: d.income * 0.3, revenue: d.income}))
  },
  orders: { // Mock for 'orders' tab
     ordersByStatus: [ { status: 'Completed', count: 10, percentage: '50%', color: '#10B981'} ],
     peakHoursData: [ { hour: '12 PM', orders: 20 } ]
  }
};

export function useApiReportData(activeTab, filters) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    if (!activeTab) return;

    if (!API_CONFIG.ENABLE_API) {
      setData(mockDataMap[activeTab]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      let response;
      if (activeTab === 'overview') {
        // For overview, we fetch dashboard stats and maybe revenue report
        const statsRes = await dashboardService.getStats();
        const revenueRes = await reportService.getRevenueReport(filters);
        const productRes = await reportService.getProductReport(filters);
        
        if (!statsRes.success || !revenueRes.success || !productRes.success) {
          throw new Error('Failed to fetch overview data');
        }
        response = {
          success: true,
          data: {
            stats: statsRes.data,
            revenueData: revenueRes.data.chartData,
            topSellingProducts: productRes.data.topProducts,
          }
        };
      } else if (activeTab === 'sales') {
        response = await reportService.getSalesReport(filters);
      } else if (activeTab === 'customers') {
        response = await reportService.getCustomerReport(filters);
      } else if (activeTab === 'orders') {
        // No specific 'orders' report, we'll re-use 'sales' report
        response = await reportService.getSalesReport(filters);
      } else {
        throw new Error(`Invalid report type: ${activeTab}`);
      }

      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.message || `Failed to fetch ${activeTab} report`);
      }
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching ${activeTab} report:`, err);
      setData(mockDataMap[activeTab]); // Fallback
    } finally {
      setLoading(false);
    }
  };

  // Refetch when tab or filters change
  useEffect(() => {
    fetchReport();
  }, [activeTab, JSON.stringify(filters)]);

  return { data, loading, error, refetch: fetchReport };
}