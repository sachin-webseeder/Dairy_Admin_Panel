// admin_11/src/lib/hooks/useApiReport.js
import { useState, useEffect } from 'react';
import { reportService } from '../api/services/reportService';
import { API_CONFIG } from '../api/config';
import { salesReportData, customerReportData, productReportData, revenueReportData } from '../mockData'; // Fallback

const mockDataMap = {
  sales: salesReportData,
  customers: customerReportData,
  products: productReportData,
  revenue: revenueReportData,
};

const serviceMap = {
  sales: reportService.getSalesReport,
  customers: reportService.getCustomerReport,
  products: reportService.getProductReport,
  revenue: reportService.getRevenueReport,
};

export function useApiReport(reportType, filters) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    if (!reportType) return;

    if (!API_CONFIG.ENABLE_API) {
      setData(mockDataMap[reportType]);
      return;
    }

    const fetchFunction = serviceMap[reportType];
    if (!fetchFunction) {
      setError(`Invalid report type: ${reportType}`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetchFunction(filters);
      if (response.success) {
        setData(response.data); // API returns { data: { ...report data... } }
      } else {
        throw new Error(response.message || `Failed to fetch ${reportType} report`);
      }
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching ${reportType} report:`, err);
      setData(mockDataMap[reportType]); // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType, JSON.stringify(filters)]); // Refetch when type or filters change

  return { data, loading, error, refetch: fetchReport };
}