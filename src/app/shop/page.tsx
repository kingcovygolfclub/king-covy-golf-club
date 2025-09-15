'use client';

import React, { useState, useEffect } from 'react';
import { Grid, List, Search, Filter, Star } from 'lucide-react';
import { Product } from '@/types';
import { apiService } from '@/services/api';
import ProductGrid from '@/components/products/ProductGrid';
import { AnimatedSection, AnimatedText, AnimatedButton } from '@/components/ui/AnimatedSection';

// Mock products data
const mockProducts = [
  {
    id: 'scotty-cameron-newport-2',
    name: 'Scotty Cameron Newport 2',
    description: 'Classic blade putter with milled face for consistent roll',
    price: 399.99,
    originalPrice: 449.99,
    images: ['https://king-covy-assets.s3.amazonaws.com/products/putters/scotty-cameron-newport-2.jpg'],
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
    id: 'titleist-tsr3-driver',
    name: 'Titleist TSR3 Driver',
    description: 'Advanced driver with adjustable CG for maximum distance',
    price: 599.99,
    images: ['https://king-covy-assets.s3.amazonaws.com/products/drivers/titleist-tsr3-driver.jpg'],
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
    id: 'mizuno-mp20-irons',
    name: 'Mizuno MP-20 Irons',
    description: 'Forged muscle back irons for skilled players',
    price: 1299.99,
    images: ['https://king-covy-assets.s3.amazonaws.com/products/irons/mizuno-mp20-irons.jpg'],
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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

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

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return a.featured ? -1 : 1;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <AnimatedSection className="bg-gradient-to-r from-emerald-600 via-teal-700 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AnimatedText 
              text="Premium Golf Equipment"
              className="text-4xl lg:text-6xl font-bold text-white mb-6"
            />
            <AnimatedSection variant="fadeInUp" delay={0.2}>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Discover boutique and collector's golf clubs, putters, and accessories. 
                Each piece is carefully selected for quality and authenticity.
              </p>
            </AnimatedSection>
            
            {/* Search Bar */}
            <AnimatedSection variant="fadeInUp" delay={0.4} className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-0 shadow-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </AnimatedSection>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Bar */}
        <AnimatedSection variant="fadeInUp" className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{sortedProducts.length}</div>
              <div className="text-sm text-gray-600">Products Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">
                {sortedProducts.filter(p => p.featured).length}
              </div>
              <div className="text-sm text-gray-600">Featured Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {sortedProducts.filter(p => p.condition === 'new').length}
              </div>
              <div className="text-sm text-gray-600">New Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {sortedProducts.filter(p => p.isCustomizable).length}
              </div>
              <div className="text-sm text-gray-600">Customizable</div>
            </div>
          </div>
        </AnimatedSection>

        {/* Loading State */}
        {loading && (
          <AnimatedSection variant="fadeInUp" className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <span className="ml-3 text-gray-600">Loading premium golf equipment...</span>
          </AnimatedSection>
        )}

        {/* Error State */}
        {error && (
          <AnimatedSection variant="fadeInUp" className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-800">Error loading products</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Toolbar */}
        <AnimatedSection variant="fadeInUp" delay={0.2} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-emerald-600">
                <Star className="h-5 w-5 mr-2" />
                <span className="font-semibold">
                  {sortedProducts.length} premium products available
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="newest">Newest First</option>
              </select>
              
              <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => handleViewModeChange('grid')}
                  className={`p-3 transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                  title="Grid View"
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleViewModeChange('list')}
                  className={`p-3 transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg' 
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                  title="List View"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Products Display */}
        <AnimatedSection variant="staggerContainer">
          <ProductGrid products={sortedProducts} viewMode={viewMode} />
        </AnimatedSection>

        {/* No Results */}
        {!loading && sortedProducts.length === 0 && (
          <AnimatedSection variant="fadeInUp" className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or browse our featured products
              </p>
              <AnimatedButton
                onClick={() => {
                  setSearchQuery('');
                  setSortBy('featured');
                }}
                variant="primary"
              >
                Clear Filters
              </AnimatedButton>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  );
}