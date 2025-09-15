'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  Plus, 
  Minus,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Upload,
  Download,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  MapPin,
  BarChart3,
  Target,
  RefreshCw,
  Eye,
  Star,
  TrendingUp as TrendingUpIcon,
  Zap
} from 'lucide-react';
import { apiService } from '@/services/api';
import { InventoryItem, ProductCategory, ProductCondition } from '@/types';

interface InventoryFilters {
  status: 'all' | 'inventory' | 'sold' | 'pending';
  clubType: 'all' | ProductCategory;
  condition: 'all' | ProductCondition;
}

export default function AdminInventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<InventoryFilters>({
    status: 'all',
    clubType: 'all',
    condition: 'all'
  });
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  useEffect(() => {
    loadInventoryItems();
  }, []);

  const loadInventoryItems = async () => {
    try {
      setLoading(true);
      const response = await apiService.getInventoryItems({ limit: 1000 });
      if (response.success && response.data) {
        setInventoryItems(response.data);
      } else {
        // Fallback to products for now
        const productsResponse = await apiService.getProducts({ limit: 1000 });
        if (productsResponse.success && productsResponse.data) {
          // Transform products to inventory items
          const transformedItems: InventoryItem[] = productsResponse.data.map((product: any) => ({
            itemId: product.id,
            brand: product.brand,
            model: product.specifications?.model || product.name,
            clubType: product.category,
            condition: product.condition,
            purchaseCost: product.price * 0.7, // Estimate purchase cost
            totalCost: product.price * 0.7,
            status: 'inventory' as const,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
          }));
          setInventoryItems(transformedItems);
        }
      }
    } catch (error) {
      console.error('Error loading inventory items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = 
      item.itemId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || item.status === filters.status;
    const matchesClubType = filters.clubType === 'all' || item.clubType === filters.clubType;
    const matchesCondition = filters.condition === 'all' || item.condition === filters.condition;
    
    return matchesSearch && matchesStatus && matchesClubType && matchesCondition;
  });

  const stats = {
    totalItems: inventoryItems.length,
    itemsInInventory: inventoryItems.filter(item => item.status === 'inventory').length,
    itemsSold: inventoryItems.filter(item => item.status === 'sold').length,
    inventoryCostValue: inventoryItems
      .filter(item => item.status === 'inventory')
      .reduce((sum, item) => sum + item.totalCost, 0),
    totalRevenue: inventoryItems
      .filter(item => item.status === 'sold')
      .reduce((sum, item) => sum + (item.soldPrice || 0), 0),
    totalNetProfit: inventoryItems
      .filter(item => item.status === 'sold')
      .reduce((sum, item) => sum + (item.netRevenue || 0), 0)
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sold':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  // Advanced inventory analytics
  const getInventoryInsights = () => {
    const totalValue = filteredItems.reduce((sum, item) => sum + item.totalCost, 0);
    const avgProfitMargin = filteredItems
      .filter(item => item.status === 'sold' && item.profitMargin)
      .reduce((sum, item, _, arr) => sum + (item.profitMargin || 0) / arr.length, 0);
    
    const slowMovingItems = filteredItems
      .filter(item => {
        const daysInInventory = Math.floor((Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60 * 24));
        return daysInInventory > 90 && item.status === 'inventory';
      });

    const fastMovingItems = filteredItems
      .filter(item => item.status === 'sold')
      .sort((a, b) => new Date(a.saleDate || '').getTime() - new Date(b.saleDate || '').getTime())
      .slice(0, 5);

    return {
      totalValue,
      avgProfitMargin,
      slowMovingItems,
      fastMovingItems,
      turnoverRate: filteredItems.filter(item => item.status === 'sold').length / Math.max(filteredItems.length, 1)
    };
  };

  const insights = getInventoryInsights();

  // Sort and filter functions
  const sortedAndFilteredItems = filteredItems.sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'totalCost':
        aValue = a.totalCost;
        bValue = b.totalCost;
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'profitMargin':
        aValue = a.profitMargin || 0;
        bValue = b.profitMargin || 0;
        break;
      default:
        aValue = a.itemId;
        bValue = b.itemId;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track your golf club inventory with Excel-based metrics and advanced analytics</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAnalyticsModal(true)}
            className="btn-secondary flex items-center"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="btn-secondary flex items-center"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Items Sold</p>
              <p className="text-2xl font-bold text-gray-900">{stats.itemsSold}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">In Inventory</p>
              <p className="text-2xl font-bold text-gray-900">{stats.itemsInInventory}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Inventory Value</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.inventoryCostValue)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-emerald-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Net Profit</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.totalNetProfit)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Best Practices - Inventory Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-900">Inventory Insights</h3>
            <Target className="h-6 w-6 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700">Turnover Rate</span>
              <span className="font-semibold text-blue-900">{(insights.turnoverRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700">Avg Profit Margin</span>
              <span className="font-semibold text-blue-900">{insights.avgProfitMargin.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700">Slow Moving Items</span>
              <span className="font-semibold text-blue-900">{insights.slowMovingItems.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-900">Recommendations</h3>
            <Zap className="h-6 w-6 text-green-600" />
          </div>
          <div className="space-y-2">
            {insights.slowMovingItems.length > 0 && (
              <p className="text-sm text-green-700">
                • Consider promoting {insights.slowMovingItems.length} slow-moving items
              </p>
            )}
            <p className="text-sm text-green-700">
              • Focus on high-margin categories for better profitability
            </p>
            <p className="text-sm text-green-700">
              • Optimize pricing strategy based on market trends
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-purple-900">Quick Actions</h3>
            <TrendingUpIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div className="space-y-2">
            <button className="w-full text-left text-sm text-purple-700 hover:text-purple-900">
              • Generate inventory report
            </button>
            <button className="w-full text-left text-sm text-purple-700 hover:text-purple-900">
              • Export to Excel
            </button>
            <button className="w-full text-left text-sm text-purple-700 hover:text-purple-900">
              • Set up low stock alerts
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Filters and Controls */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value as any})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="inventory">In Inventory</option>
            <option value="sold">Sold</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={filters.clubType}
            onChange={(e) => setFilters({...filters, clubType: e.target.value as any})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Club Types</option>
            <option value="drivers">Drivers</option>
            <option value="irons">Irons</option>
            <option value="wedges">Wedges</option>
            <option value="putters">Putters</option>
            <option value="fairway-woods">Fairway Woods</option>
            <option value="hybrids">Hybrids</option>
            <option value="accessories">Accessories</option>
            <option value="apparel">Apparel</option>
            <option value="collectibles">Collectibles</option>
          </select>
          <select
            value={filters.condition}
            onChange={(e) => setFilters({...filters, condition: e.target.value as any})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Conditions</option>
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="excellent">Excellent</option>
            <option value="very-good">Very Good</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="totalCost">Sort by Cost</option>
            <option value="profitMargin">Sort by Profit</option>
            <option value="itemId">Sort by ID</option>
          </select>
          <div className="flex space-x-2">
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {viewMode === 'table' ? '⊞' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand / Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Club Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost / Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAndFilteredItems.map((item) => (
                <tr key={item.itemId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.itemId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.brand}</div>
                    <div className="text-sm text-gray-500">{item.model}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.clubType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {item.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      Cost: {formatCurrency(item.totalCost)}
                    </div>
                    {item.soldPrice && (
                      <div className="text-sm text-green-600">
                        Sold: {formatCurrency(item.soldPrice)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowEditModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Item"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this item?')) {
                            // Handle delete
                            console.log('Delete item:', item.itemId);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Import Inventory from CSV</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload a CSV file with your inventory data. The file should include columns for Item ID, Brand, Model, Club Type, Condition, Purchase Cost, etc.
              </p>
              <input
                type="file"
                accept=".csv"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Handle import
                    setShowImportModal(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}