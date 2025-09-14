'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, Filter, Grid, List } from 'lucide-react';

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'Scotty Cameron Newport 2',
    description: 'Classic blade putter with milled face for consistent roll',
    price: 399.99,
    originalPrice: 449.99,
    images: ['/placeholder-golf-club.jpg'],
    category: 'putters',
    brand: 'Scotty Cameron',
    condition: 'excellent',
    stock: 3,
    isCustomizable: true,
  },
  {
    id: '2',
    name: 'Titleist TSR3 Driver',
    description: 'Advanced driver with adjustable CG for maximum distance',
    price: 599.99,
    images: ['/placeholder-golf-club.jpg'],
    category: 'drivers',
    brand: 'Titleist',
    condition: 'new',
    stock: 5,
    isCustomizable: true,
  },
  {
    id: '3',
    name: 'Mizuno MP-20 Irons',
    description: 'Forged muscle back irons for skilled players',
    price: 1299.99,
    images: ['/placeholder-golf-club.jpg'],
    category: 'irons',
    brand: 'Mizuno',
    condition: 'like-new',
    stock: 2,
    isCustomizable: true,
  }
];

export default function ShopPage() {
  const [products] = useState(mockProducts);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const ProductCard: React.FC<{ product: any }> = ({ product }) => (
    <div className="card group">
      <div className="relative aspect-square overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-lg font-bold">G</span>
            </div>
            <p className="text-gray-600 text-sm">Golf Club</p>
          </div>
        </div>
        {product.originalPrice && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
            Sale
          </div>
        )}
        {product.isCustomizable && (
          <div className="absolute bottom-4 left-4 bg-primary-600 text-white px-2 py-1 rounded text-xs font-semibold">
            Customizable
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{product.brand}</span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">4.9</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500 capitalize">
            {product.condition}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 text-center btn-secondary text-sm"
          >
            View Details
          </Link>
          <button className="flex-1 btn-primary text-sm flex items-center justify-center">
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </button>
        </div>
      </div>
    </div>
  );

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
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}