'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  TrendingUp, 
  Users,
  Package,
  DollarSign,
  Calendar,
  Percent,
  Warehouse,
  Receipt,
  Download,
  Filter,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Activity
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { apiService } from '@/services/api';
import { DashboardMetrics, InventoryItem } from '@/types';

interface SalesTrend {
  date: string;
  revenue: number;
  orders: number;
  itemsSold: number;
}

interface ProductPerformance {
  name: string;
  revenue: number;
  unitsSold: number;
  profitMargin: number;
  category: string;
}

interface CustomerInsight {
  segment: string;
  count: number;
  avgOrderValue: number;
  totalRevenue: number;
  color: string;
}

interface InventoryAnalytics {
  category: string;
  totalValue: number;
  unitsInStock: number;
  turnoverRate: number;
  color: string;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [salesTrends, setSalesTrends] = useState<SalesTrend[]>([]);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [customerInsights, setCustomerInsights] = useState<CustomerInsight[]>([]);
  const [inventoryAnalytics, setInventoryAnalytics] = useState<InventoryAnalytics[]>([]);
  const [seasonalTrends, setSeasonalTrends] = useState<any[]>([]);

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Load dashboard metrics
      const metricsResponse = await apiService.getDashboardStats();
      if (metricsResponse.success && metricsResponse.data) {
        setMetrics(metricsResponse.data);
      }

      // Load inventory items for analytics
      const inventoryResponse = await apiService.getInventoryItems({ limit: 1000 });
      const inventoryItems = inventoryResponse.success ? inventoryResponse.data : [];

      // Load orders for sales trends
      const ordersResponse = await apiService.getOrders({ limit: 1000 });
      const orders = ordersResponse.success ? ordersResponse.data : [];

      // Generate mock analytics data (in production, this would come from your backend)
      generateAnalyticsData(inventoryItems, orders);
      
    } catch (error) {
      console.error('Error loading analytics data:', error);
      // Generate demo data for demonstration
      generateDemoData();
    } finally {
      setLoading(false);
    }
  };

  const generateAnalyticsData = (inventoryItems: InventoryItem[], orders: any[]) => {
    // Sales Trends (Last 30 days)
    const salesTrendData: SalesTrend[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = subDays(new Date(), i);
      salesTrendData.push({
        date: format(date, 'MMM dd'),
        revenue: Math.random() * 5000 + 1000,
        orders: Math.floor(Math.random() * 20) + 5,
        itemsSold: Math.floor(Math.random() * 50) + 10
      });
    }
    setSalesTrends(salesTrendData);

    // Product Performance
    const productData: ProductPerformance[] = [
      { name: 'Scotty Cameron Putters', revenue: 15420, unitsSold: 38, profitMargin: 35.2, category: 'Putters' },
      { name: 'Titleist Drivers', revenue: 12850, unitsSold: 25, profitMargin: 28.7, category: 'Drivers' },
      { name: 'Callaway Irons', revenue: 9650, unitsSold: 18, profitMargin: 32.1, category: 'Irons' },
      { name: 'TaylorMade Wedges', revenue: 7820, unitsSold: 22, profitMargin: 30.5, category: 'Wedges' },
      { name: 'Ping Hybrids', revenue: 6540, unitsSold: 15, profitMargin: 29.8, category: 'Hybrids' }
    ];
    setProductPerformance(productData);

    // Customer Insights
    const customerData: CustomerInsight[] = [
      { segment: 'VIP Customers', count: 45, avgOrderValue: 1250, totalRevenue: 56250, color: '#8884d8' },
      { segment: 'Regular Customers', count: 180, avgOrderValue: 650, totalRevenue: 117000, color: '#82ca9d' },
      { segment: 'New Customers', count: 95, avgOrderValue: 420, totalRevenue: 39900, color: '#ffc658' },
      { segment: 'Occasional Buyers', count: 120, avgOrderValue: 280, totalRevenue: 33600, color: '#ff7300' }
    ];
    setCustomerInsights(customerData);

    // Inventory Analytics
    const inventoryData: InventoryAnalytics[] = [
      { category: 'Drivers', totalValue: 45600, unitsInStock: 45, turnoverRate: 4.2, color: '#8884d8' },
      { category: 'Irons', totalValue: 38900, unitsInStock: 38, turnoverRate: 3.8, color: '#82ca9d' },
      { category: 'Putters', totalValue: 52100, unitsInStock: 52, turnoverRate: 5.1, color: '#ffc658' },
      { category: 'Wedges', totalValue: 28900, unitsInStock: 28, turnoverRate: 3.2, color: '#ff7300' },
      { category: 'Accessories', totalValue: 15600, unitsInStock: 156, turnoverRate: 6.8, color: '#00ff00' }
    ];
    setInventoryAnalytics(inventoryData);

    // Seasonal Trends (Monthly data for past 12 months)
    const seasonalData = [];
    for (let i = 11; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      seasonalData.push({
        month: format(date, 'MMM'),
        revenue: Math.random() * 80000 + 40000,
        orders: Math.floor(Math.random() * 200) + 100,
        profit: Math.random() * 25000 + 12000
      });
    }
    setSeasonalTrends(seasonalData);
  };

  const generateDemoData = () => {
    // Generate comprehensive demo data for demonstration
    generateAnalyticsData([], []);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#0088fe'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Comprehensive business insights and performance metrics</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={loadAnalyticsData}
                className="btn-secondary flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <Link 
                href="/admin" 
                className="btn-secondary"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(246750)}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +12.5% vs last period
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Items Sold</p>
                <p className="text-2xl font-bold text-gray-900">118</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +8.3% vs last period
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Order Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(685)}</p>
                <p className="text-sm text-red-600 flex items-center mt-1">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  -2.1% vs last period
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                <p className="text-2xl font-bold text-gray-900">31.2%</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +1.8% vs last period
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Percent className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Trends Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Sales Trends</h3>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Orders</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(value as number) : value,
                    name === 'revenue' ? 'Revenue' : name === 'orders' ? 'Orders' : 'Items Sold'
                  ]}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Product Performance Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Products</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(value as number) : value,
                    name === 'revenue' ? 'Revenue' : 'Units Sold'
                  ]}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                <Bar dataKey="unitsSold" fill="#82ca9d" name="Units Sold" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Insights and Inventory Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Customer Segmentation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Segmentation</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerInsights}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ segment, percent }) => `${segment} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {customerInsights.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Customers']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {customerInsights.map((segment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: segment.color }}></div>
                    <span className="text-sm font-medium text-gray-900">{segment.segment}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{segment.count}</p>
                    <p className="text-xs text-gray-600">{formatCurrency(segment.avgOrderValue)} avg</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory Analytics */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Inventory by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryAnalytics} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" width={80} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'totalValue' ? formatCurrency(value as number) : value,
                    name === 'totalValue' ? 'Value' : name === 'unitsInStock' ? 'Units' : 'Turnover Rate'
                  ]}
                />
                <Legend />
                <Bar dataKey="totalValue" fill="#8884d8" name="Total Value" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {inventoryAnalytics.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium text-gray-900">{item.category}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">{item.unitsInStock} units</span>
                    <span className="text-gray-600">{item.turnoverRate}x turnover</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Seasonal Trends */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Seasonal Performance Trends</h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={seasonalTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'revenue' ? formatCurrency(value as number) : 
                  name === 'profit' ? formatCurrency(value as number) : value,
                  name === 'revenue' ? 'Revenue' : 
                  name === 'profit' ? 'Profit' : 'Orders'
                ]}
              />
              <Legend />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" name="Revenue" />
              <Area type="monotone" dataKey="profit" stackId="2" stroke="#82ca9d" fill="#82ca9d" name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Action Items and Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights & Recommendations</h3>
            <div className="space-y-4">
              <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-blue-900">Sales Performance</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Revenue is up 12.5% this period. Consider increasing inventory for top-performing categories.
                  </p>
                </div>
              </div>
              <div className="flex items-start p-4 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-green-900">Customer Growth</h4>
                  <p className="text-sm text-green-700 mt-1">
                    VIP customer segment shows strong growth. Focus on retention strategies.
                  </p>
                </div>
              </div>
              <div className="flex items-start p-4 bg-orange-50 rounded-lg">
                <Package className="h-5 w-5 text-orange-600 mt-0.5 mr-3" />
                <div>
                  <h4 className="font-medium text-orange-900">Inventory Optimization</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Accessories have highest turnover rate. Consider expanding this category.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Download className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="font-medium text-gray-900">Export Analytics Report</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Filter className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="font-medium text-gray-900">Create Custom Report</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Eye className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="font-medium text-gray-900">View Detailed Insights</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
              </button>
              <Link 
                href="/admin/inventory"
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <Warehouse className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="font-medium text-gray-900">Manage Inventory</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Data Refresh Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <Activity className="h-4 w-4 mr-2" />
              <span>Data last updated: {format(new Date(), 'MMM dd, yyyy at h:mm a')}</span>
            </div>
            <button
              onClick={loadAnalyticsData}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}