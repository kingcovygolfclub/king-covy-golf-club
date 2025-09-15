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
  itemType: 'all' | 'product' | 'marketing_expense';
}

// Helper function to get default new item
function getDefaultNewItem(): Partial<InventoryItem> {
  return {
    itemId: '',
    brand: '',
    model: '',
    clubType: 'drivers',
    condition: 'new',
    purchaseCost: 0,
    customizationCost: 0,
    totalCost: 0,
    status: 'inventory',
    itemType: 'product',
    images: [],
    primaryImage: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export default function AdminInventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<InventoryFilters>({
    status: 'all',
    clubType: 'all',
    condition: 'all',
    itemType: 'all'
  });
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>(getDefaultNewItem());
  const [processing, setProcessing] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  useEffect(() => {
    loadInventoryItems();
  }, []);

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImages = [...uploadedImages, ...files];
    setUploadedImages(newImages);
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
    
    // Update primary image if it was removed
    if (newItem.primaryImage === imagePreviewUrls[index]) {
      setNewItem({ ...newItem, primaryImage: newPreviewUrls[0] || '' });
    }
  };

  // Set primary image
  const setPrimaryImage = (imageUrl: string) => {
    setNewItem({ ...newItem, primaryImage: imageUrl });
  };

  // Delete inventory item
  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      setProcessing(true);
      const response = await apiService.deleteInventoryItem(itemId);
      
      if (response.success) {
        // Remove item from frontend state immediately
        setInventoryItems(prev => prev.filter(item => item.itemId !== itemId));
        alert('Item deleted successfully!');
      } else {
        alert('Error deleting item: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const loadInventoryItems = async () => {
    try {
      setLoading(true);
      const response = await apiService.getInventoryItems({ limit: 1000 });
      if (response.success && response.data) {
        // Normalize the data structure to ensure all items have consistent properties
        const normalizedItems: InventoryItem[] = response.data.map((item: any) => ({
          itemId: item.itemId || item.productId || item.id || '',
          brand: item.brand || '',
          model: item.model || '',
          clubType: item.clubType || item.category || 'accessories',
          condition: item.condition || 'new',
          purchaseCost: item.purchaseCost || 0,
          customizationCost: item.customizationCost || 0,
          totalCost: item.totalCost || item.purchaseCost || 0,
          status: item.status || 'inventory',
          itemType: item.itemType || 'product',
            images: item.images || ['/placeholder-golf-club.svg'],
            primaryImage: item.primaryImage || item.images?.[0] || '/placeholder-golf-club.svg',
          marketingExpenseType: item.marketingExpenseType,
          marketingCampaign: item.marketingCampaign,
          marketingPlatform: item.marketingPlatform,
          marketingSpend: item.marketingSpend,
          binLocation: item.binLocation,
          notes: item.notes,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || new Date().toISOString()
        }));
        setInventoryItems(normalizedItems);
      } else {
        // Fallback to products for now
        const productsResponse = await apiService.getProducts({ limit: 1000 });
        if (productsResponse.success && productsResponse.data) {
          // Transform products to inventory items
          const transformedItems: InventoryItem[] = productsResponse.data.map((product: any) => ({
            itemId: product.id || '',
            brand: product.brand || '',
            model: product.specifications?.model || product.name || '',
            clubType: product.category || 'accessories',
            condition: product.condition || 'new',
            purchaseCost: (product.price || 0) * 0.7, // Estimate purchase cost
            totalCost: (product.price || 0) * 0.7,
            status: 'inventory' as const,
            itemType: 'product' as const,
            images: product.images || ['/placeholder-golf-club.svg'],
            primaryImage: product.images?.[0] || '/placeholder-golf-club.svg',
            createdAt: product.createdAt || new Date().toISOString(),
            updatedAt: product.updatedAt || new Date().toISOString()
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

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setProcessing(true);
      
      // Calculate total cost
      const totalCost = (newItem.purchaseCost || 0) + (newItem.customizationCost || 0);
      
      // For now, we'll store image URLs as base64 or placeholder URLs
      // In a real implementation, you'd upload to S3 or another service
      const imageUrls = imagePreviewUrls.length > 0 
        ? imagePreviewUrls 
        : ['/placeholder-golf-club.svg']; // Default placeholder
      
      // Prepare item data
      const itemData: Partial<InventoryItem> = {
        ...newItem,
        totalCost,
        images: imageUrls,
        primaryImage: newItem.primaryImage || imageUrls[0] || '/placeholder-golf-club.svg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // For marketing expenses, set appropriate defaults
      if (newItem.itemType === 'marketing_expense') {
        itemData.clubType = 'accessories'; // Default category for marketing expenses
        itemData.condition = 'new'; // Default condition
      }

      // Create inventory item
      const response = await apiService.createInventoryItem(itemData);
      
      // Also create product if it's a product type (not marketing expense)
      if (response.success && newItem.itemType === 'product') {
        try {
          const productData = {
            id: itemData.itemId,
            name: `${itemData.brand} ${itemData.model}`,
            description: `High-quality ${itemData.brand} ${itemData.model} ${itemData.clubType}`,
            price: (itemData.totalCost || 0) * 1.4, // Mark up by 40% for retail price
            originalPrice: (itemData.totalCost || 0) * 1.6, // Higher original price
            images: itemData.images || ['/placeholder-golf-club.svg'],
            category: itemData.clubType,
            brand: itemData.brand,
            condition: itemData.condition,
            specifications: {
              model: itemData.model,
              year: new Date().getFullYear(),
              weight: 'Standard',
              finish: 'Premium',
              length: 'Standard',
              material: 'High Quality'
            },
            stock: 1, // Start with 1 in stock
            isCustomizable: true,
            customizationOptions: {
              engraving: {
                available: true,
                maxLength: 20,
                locations: ['toe', 'heel', 'face']
              },
              grip: {
                available: true,
                options: [
                  { id: 'standard', name: 'Standard Grip', price: 0, colors: ['black', 'white'] },
                  { id: 'premium', name: 'Premium Grip', price: 15, colors: ['black', 'white', 'blue'] }
                ]
              },
              shaft: {
                available: false,
                options: []
              }
            },
            createdAt: itemData.createdAt,
            updatedAt: itemData.updatedAt,
            featured: false,
            tags: [itemData.brand?.toLowerCase(), itemData.clubType, 'new'],
            status: 'active'
          };

          // Create product in products table
          await apiService.createProduct(productData);
        } catch (productError) {
          console.warn('Failed to create product, but inventory item was created:', productError);
        }
      }
      
      if (response.success) {
        // Immediately update the frontend with the new item
        const newInventoryItem: InventoryItem = {
          ...itemData,
          itemId: itemData.itemId || '',
          brand: itemData.brand || '',
          model: itemData.model || '',
          clubType: itemData.clubType || 'accessories',
          condition: itemData.condition || 'new',
          purchaseCost: itemData.purchaseCost || 0,
          totalCost: itemData.totalCost || 0,
          status: itemData.status || 'inventory',
          itemType: itemData.itemType || 'product',
          createdAt: itemData.createdAt || new Date().toISOString(),
          updatedAt: itemData.updatedAt || new Date().toISOString()
        } as InventoryItem;
        
        // Add to the frontend state immediately
        setInventoryItems(prev => [newInventoryItem, ...prev]);
        
        // Close modal and reset form
        setShowAddModal(false);
        setNewItem(getDefaultNewItem());
        setUploadedImages([]);
        setImagePreviewUrls([]);
        
        // Show success message
        alert('Item added successfully!');
        
        // Optionally refresh from server to ensure consistency
        setTimeout(() => {
          loadInventoryItems();
        }, 1000);
      } else {
        alert('Error adding item: ' + (response.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Error adding item. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = 
      (item.itemId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.model || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || item.status === filters.status;
    const matchesClubType = filters.clubType === 'all' || item.clubType === filters.clubType;
    const matchesCondition = filters.condition === 'all' || item.condition === filters.condition;
    const matchesItemType = filters.itemType === 'all' || item.itemType === filters.itemType;
    
    return matchesSearch && matchesStatus && matchesClubType && matchesCondition && matchesItemType;
  });

  const stats = {
    totalItems: inventoryItems.length,
    itemsInInventory: inventoryItems.filter(item => item.status === 'inventory').length,
    itemsSold: inventoryItems.filter(item => item.status === 'sold').length,
    marketingExpenses: inventoryItems.filter(item => item.itemType === 'marketing_expense').length,
    inventoryCostValue: inventoryItems
      .filter(item => item.status === 'inventory')
      .reduce((sum, item) => sum + item.totalCost, 0),
    totalRevenue: inventoryItems
      .filter(item => item.status === 'sold')
      .reduce((sum, item) => sum + (item.soldPrice || 0), 0),
    totalNetProfit: inventoryItems
      .filter(item => item.status === 'sold')
      .reduce((sum, item) => sum + (item.netRevenue || 0), 0),
    totalMarketingSpend: inventoryItems
      .filter(item => item.itemType === 'marketing_expense')
      .reduce((sum, item) => sum + (item.marketingSpend || 0), 0)
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Marketing Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.marketingExpenses}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm text-gray-600">Marketing Spend</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.totalMarketingSpend)}</p>
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
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-700">Marketing Expenses</span>
              <span className="font-semibold text-blue-900">{stats.marketingExpenses}</span>
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
            {stats.totalMarketingSpend > 0 && (
              <p className="text-sm text-green-700">
                • Track ROI on ${stats.totalMarketingSpend.toFixed(0)} marketing spend
              </p>
            )}
            <p className="text-sm text-green-700">
              • Analyze marketing expense effectiveness by platform
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
            <button className="w-full text-left text-sm text-purple-700 hover:text-purple-900">
              • Track marketing campaign performance
            </button>
            <button className="w-full text-left text-sm text-purple-700 hover:text-purple-900">
              • Analyze marketing ROI by platform
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
            value={filters.itemType}
            onChange={(e) => setFilters({...filters, itemType: e.target.value as any})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Types</option>
            <option value="product">Products</option>
            <option value="marketing_expense">Marketing Expenses</option>
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
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand / Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost / Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marketing
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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.itemType === 'marketing_expense' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.itemType === 'marketing_expense' ? 'Marketing' : 'Product'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.primaryImage || item.images?.[0] || '/placeholder-golf-club.svg'}
                          alt={`${item.brand} ${item.model}`}
                          className="w-12 h-12 object-cover rounded-lg border"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-golf-club.svg';
                          }}
                        />
                      </div>
                      {/* Brand/Model Info */}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.brand}</div>
                        <div className="text-sm text-gray-500">{item.model}</div>
                        {item.images && item.images.length > 1 && (
                          <div className="text-xs text-gray-400">
                            +{item.images.length - 1} more
                          </div>
                        )}
                      </div>
                    </div>
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
                    {item.itemType === 'marketing_expense' && item.marketingSpend ? (
                      <div className="text-sm">
                        <div className="text-purple-600 font-medium">
                          {formatCurrency(item.marketingSpend)}
                        </div>
                        {item.marketingPlatform && (
                          <div className="text-xs text-gray-500">
                            {item.marketingPlatform}
                          </div>
                        )}
                        {item.marketingExpenseType && (
                          <div className="text-xs text-gray-500">
                            {item.marketingExpenseType.replace('_', ' ')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-400">-</div>
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
                        onClick={() => handleDeleteItem(item.itemId)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Item"
                        disabled={processing}
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

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Inventory Item</h3>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Item Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Type *
                    </label>
                    <select
                      value={newItem.itemType}
                      onChange={(e) => setNewItem({ ...newItem, itemType: e.target.value as 'product' | 'marketing_expense' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="product">Product</option>
                      <option value="marketing_expense">Marketing Expense</option>
                    </select>
                  </div>

                  {/* Item ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item ID *
                    </label>
                    <input
                      type="text"
                      value={newItem.itemId}
                      onChange={(e) => setNewItem({ ...newItem, itemId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., KC001"
                      required
                    />
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand *
                    </label>
                    <input
                      type="text"
                      value={newItem.brand}
                      onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Titleist"
                      required
                    />
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Model *
                    </label>
                    <input
                      type="text"
                      value={newItem.model}
                      onChange={(e) => setNewItem({ ...newItem, model: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., TSR3"
                      required
                    />
                  </div>

                  {/* Club Type - only show for products */}
                  {newItem.itemType === 'product' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Club Type *
                      </label>
                      <select
                        value={newItem.clubType}
                        onChange={(e) => setNewItem({ ...newItem, clubType: e.target.value as ProductCategory })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
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
                    </div>
                  )}

                  {/* Marketing Expense Type - only show for marketing expenses */}
                  {newItem.itemType === 'marketing_expense' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marketing Expense Type *
                      </label>
                      <select
                        value={newItem.marketingExpenseType || ''}
                        onChange={(e) => setNewItem({ ...newItem, marketingExpenseType: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="online_ad">Online Advertisement</option>
                        <option value="social_media">Social Media Campaign</option>
                        <option value="email_campaign">Email Campaign</option>
                        <option value="content_creation">Content Creation</option>
                        <option value="photography">Photography</option>
                        <option value="video_production">Video Production</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  )}

                  {/* Condition - only show for products */}
                  {newItem.itemType === 'product' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Condition *
                      </label>
                      <select
                        value={newItem.condition}
                        onChange={(e) => setNewItem({ ...newItem, condition: e.target.value as ProductCondition })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="new">New</option>
                        <option value="like-new">Like New</option>
                        <option value="excellent">Excellent</option>
                        <option value="very-good">Very Good</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                      </select>
                    </div>
                  )}

                  {/* Purchase Cost */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purchase Cost *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newItem.purchaseCost}
                      onChange={(e) => setNewItem({ ...newItem, purchaseCost: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  {/* Marketing Spend - only show for marketing expenses */}
                  {newItem.itemType === 'marketing_expense' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marketing Spend *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={newItem.marketingSpend || ''}
                        onChange={(e) => setNewItem({ ...newItem, marketingSpend: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  )}

                  {/* Marketing Platform - only show for marketing expenses */}
                  {newItem.itemType === 'marketing_expense' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Marketing Platform
                      </label>
                      <input
                        type="text"
                        value={newItem.marketingPlatform || ''}
                        onChange={(e) => setNewItem({ ...newItem, marketingPlatform: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Facebook, Google Ads"
                      />
                    </div>
                  )}

                  {/* Marketing Campaign - only show for marketing expenses */}
                  {newItem.itemType === 'marketing_expense' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Campaign Name
                      </label>
                      <input
                        type="text"
                        value={newItem.marketingCampaign || ''}
                        onChange={(e) => setNewItem({ ...newItem, marketingCampaign: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Summer Sale Campaign"
                      />
                    </div>
                  )}

                  {/* Customization Cost */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customization Cost
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newItem.customizationCost || ''}
                      onChange={(e) => setNewItem({ ...newItem, customizationCost: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>

                  {/* Bin Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bin Location
                    </label>
                    <input
                      type="text"
                      value={newItem.binLocation || ''}
                      onChange={(e) => setNewItem({ ...newItem, binLocation: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., A1-15"
                    />
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        Click to upload images or drag and drop
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        PNG, JPG, GIF up to 10MB each
                      </span>
                    </label>
                  </div>
                  
                  {/* Image Previews */}
                  {imagePreviewUrls.length > 0 && (
                    <div className="mt-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all duration-200 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => setPrimaryImage(url)}
                                  className={`px-2 py-1 text-xs rounded ${
                                    newItem.primaryImage === url
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-white text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  {newItem.primaryImage === url ? 'Primary' : 'Set Primary'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                            {newItem.primaryImage === url && (
                              <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1 rounded">
                                Primary
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={newItem.notes || ''}
                    onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setNewItem(getDefaultNewItem());
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Add Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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