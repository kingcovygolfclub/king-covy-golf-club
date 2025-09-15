'use client';

import React, { useState, useEffect } from 'react';
import { Grid, List } from 'lucide-react';
import { Product } from '@/types';
import { apiService } from '@/services/api';
import ProductGrid from '@/components/products/ProductGrid';

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'Scotty Cameron Newport 2',
    description: 'Classic blade putter with milled face for consistent roll',
    price: 399.99,
    originalPrice: 449.99,
    images: ['/placeholder-golf-club.svg'],
    category: 'putters' as const,
    brand: 'Scotty Cameron',
    condition: 'excellent' as const,
    stock: 3,
    isCustomizable: true,
    specifications: {
      model: 'Newport 2',
      year: 2023,
      weight: '350g',
      finish: 'Stainless Steel',
      length: '34 inches',
      loft: 3,
      lie: 70,
      grip: 'Scotty Cameron Matador',
      material: 'Stainless Steel'
    },
    customizationOptions: {
      engraving: {
        available: true,
        maxLength: 20,
        locations: ['toe', 'heel', 'bumper']
      },
      grip: {
        available: true,
        options: [
          { id: 'standard', name: 'Standard Matador', price: 0, colors: ['black', 'red'] },
          { id: 'premium', name: 'Premium Leather', price: 25, colors: ['brown', 'black'] }
        ]
      },
      shaft: {
        available: false,
        options: []
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    featured: true,
    tags: ['putter', 'scotty-cameron', 'blade', 'milled', 'premium']
  },
  {
    id: '2',
    name: 'Titleist TSR3 Driver',
    description: 'Advanced driver with adjustable CG for maximum distance',
    price: 599.99,
    images: ['/placeholder-golf-club.svg'],
    category: 'drivers' as const,
    brand: 'Titleist',
    condition: 'new' as const,
    stock: 5,
    isCustomizable: true,
    specifications: {
      model: 'TSR3',
      year: 2023,
      weight: '308g',
      finish: 'Pearl',
      length: '45.5 inches',
      loft: 9.5,
      lie: 58,
      grip: 'Golf Pride Tour Velvet',
      material: 'Titanium'
    },
    customizationOptions: {
      engraving: {
        available: true,
        maxLength: 15,
        locations: ['crown', 'sole']
      },
      grip: {
        available: true,
        options: [
          { id: 'standard', name: 'Tour Velvet', price: 0, colors: ['black', 'blue'] },
          { id: 'premium', name: 'Winn Dri-Tac', price: 20, colors: ['white', 'gray'] }
        ]
      },
      shaft: {
        available: true,
        options: [
          { id: 'standard', name: 'HZRDUS Smoke', price: 0, flex: 'stiff', weight: '60g' },
          { id: 'premium', name: 'Aldila Rogue', price: 100, flex: 'x-stiff', weight: '65g' }
        ]
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    featured: true,
    tags: ['driver', 'titleist', 'tsr3', 'adjustable', 'distance']
  },
  {
    id: '3',
    name: 'Mizuno MP-20 Irons',
    description: 'Forged muscle back irons for skilled players',
    price: 1299.99,
    images: ['/placeholder-golf-club.svg'],
    category: 'irons' as const,
    brand: 'Mizuno',
    condition: 'like-new' as const,
    stock: 2,
    isCustomizable: true,
    specifications: {
      model: 'MP-20',
      year: 2020,
      weight: '425g (6-iron)',
      finish: 'Chrome',
      length: '37.5 inches (6-iron)',
      loft: 30,
      lie: 62,
      grip: 'Golf Pride Tour Velvet',
      material: 'Forged Carbon Steel'
    },
    customizationOptions: {
      engraving: {
        available: true,
        maxLength: 10,
        locations: ['hosel', 'back']
      },
      grip: {
        available: true,
        options: [
          { id: 'standard', name: 'Tour Velvet', price: 0, colors: ['black', 'white'] },
          { id: 'premium', name: 'Golf Pride MCC', price: 15, colors: ['black', 'gray'] }
        ]
      },
      shaft: {
        available: true,
        options: [
          { id: 'standard', name: 'KBS Tour', price: 0, flex: 'stiff', weight: '120g' },
          { id: 'premium', name: 'True Temper Dynamic Gold', price: 80, flex: 'x-stiff', weight: '130g' }
        ]
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    featured: true,
    tags: ['irons', 'mizuno', 'mp-20', 'forged', 'muscle-back']
  }
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load view mode preference from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedViewMode = localStorage.getItem('shopViewMode') as 'grid' | 'list' | null;
      if (savedViewMode) {
        setViewMode(savedViewMode);
      }
    }
  }, []);

  // Save view mode preference to localStorage
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    console.log('Changing view mode to:', mode);
    setViewMode(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shopViewMode', mode);
    }
  };

  // Load products from API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getProducts({ limit: 20 });
        
        if (response.success && response.data) {
          setProducts(response.data);
        } else {
          // Fallback to mock data if API fails
          console.warn('API failed, using mock data:', response.error);
          setProducts(mockProducts);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
        setError('Failed to load products');
        // Fallback to mock data
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);



  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop Golf Equipment</h1>
          <p className="text-gray-600">
            Discover premium boutique and collector's golf clubs, putters, and accessories
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600">Loading products...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading products</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {products.length} products found
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <select className="input-field w-auto">
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
              <option value="newest">Newest First</option>
            </select>
            
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`p-2 rounded-l-lg transition-colors ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                title="Grid View"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleViewModeChange('list')}
                className={`p-2 rounded-r-lg transition-colors ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Display */}
        <ProductGrid products={products} viewMode={viewMode} />
      </div>
    </div>
  );
}