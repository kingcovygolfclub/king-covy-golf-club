'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  ShoppingCart, 
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Eye,
  BarChart3,
  Percent,
  Warehouse,
  Receipt
} from 'lucide-react';
import { apiService } from '@/services/api';
import { DashboardMetrics } from '@/types';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalItemsLogged: 0,
    itemsSold: 0,
    itemsInInventory: 0,
    inventoryCostValue: 0,
    inventoryListedValue: 0,
    totalRevenue: 0,
    totalCOGS: 0,
    totalShipping: 0,
    totalNetProfit: 0,
    averageProfitMargin: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalCustomers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardMetrics();
  }, []);

  const loadDashboardMetrics = async () => {
    try {
      setLoading(true);
      
      // Try to get real dashboard metrics
      const metricsResponse = await apiService.getDashboardStats();
      
      if (metricsResponse.success && metricsResponse.data) {
        // Transform existing data to new format if needed
        const transformedMetrics: DashboardMetrics = {
          totalItemsLogged: metricsResponse.data.totalProducts || 0,
          itemsSold: 0, // Will be calculated from sold items
          itemsInInventory: metricsResponse.data.totalProducts || 0,
          inventoryCostValue: 0, // Will be calculated from inventory items
          inventoryListedValue: 0, // Will be calculated from inventory items
          totalRevenue: metricsResponse.data.totalRevenue || 0,
          totalCOGS: 0, // Will be calculated from sold items
          totalShipping: 0, // Will be calculated from orders
          totalNetProfit: 0, // Will be calculated
          averageProfitMargin: 0, // Will be calculated
          totalOrders: metricsResponse.data.totalOrders || 0,
          pendingOrders: metricsResponse.data.pendingOrders || 0,
          totalCustomers: metricsResponse.data.totalCustomers || 0
        };
        setMetrics(transformedMetrics);
      } else {
        // Fallback to individual API calls if dashboard endpoint fails
        console.warn('Dashboard metrics endpoint failed, using fallback:', metricsResponse.error);
        
        const productsResponse = await apiService.getProducts({ limit: 1000 });

        const fallbackMetrics: DashboardMetrics = {
          totalItemsLogged: productsResponse.data?.length || 0,
          itemsSold: 0,
          itemsInInventory: productsResponse.data?.length || 0,
          inventoryCostValue: 0,
          inventoryListedValue: 0,
          totalRevenue: 0,
          totalCOGS: 0,
          totalShipping: 0,
          totalNetProfit: 0,
          averageProfitMargin: 0,
          totalOrders: 0,
          pendingOrders: 0,
          totalCustomers: 0
        };

        setMetrics(fallbackMetrics);
      }
    } catch (error) {
      console.error('Error loading dashboard metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const statCards = [
    {
      name: 'Items Sold',
      value: metrics.itemsSold,
      icon: Receipt,
      color: 'bg-green-500',
      href: '/admin/analytics'
    },
    {
      name: 'Total Customers',
      value: metrics.totalCustomers || 0,
      icon: Users,
      color: 'bg-purple-500',
      href: '/admin/customers'
    },
    {
      name: 'Total Net Profit',
      value: formatCurrency(metrics.totalNetProfit),
      icon: DollarSign,
      color: 'bg-emerald-500',
      href: '/admin/analytics'
    },
    {
      name: 'Average Profit Margin',
      value: `${metrics.averageProfitMargin.toFixed(1)}%`,
      icon: Percent,
      color: 'bg-indigo-500',
      href: '/admin/analytics'
    }
  ];

  const alertCards = [
    {
      name: 'Total Orders',
      value: metrics.totalOrders,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      href: '/admin/orders'
    },
    {
      name: 'Pending Orders',
      value: metrics.pendingOrders,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      href: '/admin/orders?status=pending'
    },
    {
      name: 'Inventory Value',
      value: formatCurrency(metrics.inventoryCostValue),
      icon: Warehouse,
      color: 'bg-teal-500',
      href: '/admin/inventory'
    },
    {
      name: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      icon: TrendingUp,
      color: 'bg-green-600',
      href: '/admin/analytics'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">King Covy Inventory Dashboard</h2>
        <p className="text-gray-600">
          Track your golf club inventory, sales performance, and profitability with real-time metrics and analytics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link key={stat.name} href={stat.href} className="group">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alertCards.map((alert) => (
          <Link key={alert.name} href={alert.href} className="group">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${alert.color}`}>
                    <alert.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{alert.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{alert.value}</p>
                  </div>
                </div>
                <Eye className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/inventory"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Package className="h-5 w-5 text-gray-400 mr-3" />
            <span className="font-medium text-gray-900">Manage Inventory</span>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ShoppingCart className="h-5 w-5 text-gray-400 mr-3" />
            <span className="font-medium text-gray-900">View Orders</span>
          </Link>
          <Link
            href="/admin/customers"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="h-5 w-5 text-gray-400 mr-3" />
            <span className="font-medium text-gray-900">Manage Customers</span>
          </Link>
          <Link
            href="/admin/analytics"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BarChart3 className="h-5 w-5 text-gray-400 mr-3" />
            <span className="font-medium text-gray-900">View Analytics</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
            <span>Inventory dashboard initialized - Ready for tracking</span>
            <span className="ml-auto text-xs text-gray-500">Just now</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
            <span>Excel inventory tracker integration complete</span>
            <span className="ml-auto text-xs text-gray-500">1 hour ago</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
            <span>Profit margin analytics enabled</span>
            <span className="ml-auto text-xs text-gray-500">2 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
